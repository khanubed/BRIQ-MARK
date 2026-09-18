"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { LenisContext } from "../../hooks/useLenis";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReduced) {
      // Respect user's motion preference: standard browser scroll
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      setLenisInstance(null);
      gsap.ticker.remove(raf);
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.refresh(true);

    // Fallback refresh for React 18 / NextJS suspense boundaries
    const timeoutIds = [
      setTimeout(() => ScrollTrigger.refresh(true), 150),
      setTimeout(() => ScrollTrigger.refresh(true), 500),
    ];
    return () => timeoutIds.forEach(clearTimeout);
  }, [pathname, lenisInstance]);

  // Robust Global Height Observer for GSAP Layout Shifts
  useEffect(() => {
    if (typeof document === "undefined") return;

    let debounceTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 150);
    });

    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    return () => {
      clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}

"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WorkAnimationWrapper({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // 1. Hero Stagger
    const heroWords = mainRef.current?.querySelectorAll(".hero-title .reveal-word");
    if (heroWords && heroWords.length > 0) {
      gsap.to(heroWords, {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.1,
      });
    }

    // 2. Reveal Rows (Dividers, Text Blocks)
    const revealRows = mainRef.current?.querySelectorAll(".reveal-row");
    if (revealRows && revealRows.length > 0) {
      revealRows.forEach((row) => {
        gsap.to(row, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }

    // 3. Floating Media Parallax
    const mediaElements = mainRef.current?.querySelectorAll(".parallax-media");
    if (mediaElements && mediaElements.length > 0) {
      mediaElements.forEach((el) => {
        gsap.to(el, {
          yPercent: 35, // Move down slightly as you scroll down
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="flex-1 w-full bg-[#08080a] min-h-screen overflow-hidden">
      {children}
    </main>
  );
}

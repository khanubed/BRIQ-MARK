"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Lazy-load the 3D Cinder Block client component with an ambient pre-mesh placeholder
const CinderBlock3D = dynamic(() => import("../three/CinderBlock3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center opacity-30">
      <div className="w-64 h-48 rounded-xl bg-cyan-500/10 border border-cyan-400/20 blur-xl animate-pulse" />
    </div>
  ),
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const prefersReduced = useReducedMotion();

  // Award-Winning GSAP Text Reveal Animation (Awwwards / Site of the Day Caliber)
  useGSAP(
    () => {
      let split1: SplitType | null = null;
      let split2: SplitType | null = null;
      let tl: gsap.core.Timeline | null = null;

      // Custom physical deceleration ease with subtle organic overshoot (no toy bounce)
      const physicalOvershootEase = "cubic-bezier(0.16, 1.05, 0.28, 1)";
      const cinematicSmoothEase = "cubic-bezier(0.19, 1, 0.22, 1)";

      const runSequence = () => {
        // Reduced motion fallback: Immediate graceful reveal
        if (prefersReduced) {
          gsap.set(
            [
              visualRef.current,
              line1Ref.current,
              line2Ref.current,
              labelRef.current,
              statementRef.current,
              scrollCueRef.current,
              ctaRef.current,
            ].filter(Boolean),
            { opacity: 1, y: 0, scale: 1, filter: "none", rotateX: 0 },
          );
          setIsAnimationComplete(true);
          return;
        }

        // 1. Text Splitting via SplitType
        try {
          if (line1Ref.current) {
            split1 = new SplitType(line1Ref.current, {
              types: "lines,words,chars",
              tagName: "span",
            });
          }
          if (line2Ref.current) {
            split2 = new SplitType(line2Ref.current, {
              types: "lines,words,chars",
              tagName: "span",
            });
          }
        } catch (err) {
          console.warn("SplitType initialization fallback:", err);
        }

        const chars1 = split1?.chars || [];
        const chars2 = split2?.chars || [];

        // Apply GPU transform styles to split character spans
        const prepareChars = (chars: HTMLElement[]) => {
          chars.forEach((c) => {
            c.style.display = "inline-block";
            c.style.willChange = "transform, opacity, filter";
            c.style.transformStyle = "preserve-3d";
            c.style.backfaceVisibility = "hidden";
            c.style.perspective = "1200px";
          });
        };

        if (chars1.length) prepareChars(chars1 as unknown as HTMLElement[]);
        if (chars2.length) prepareChars(chars2 as unknown as HTMLElement[]);

        // 2. Initial State Setup (Zero flash, masked below container)
        if (visualRef.current) {
          gsap.set(visualRef.current, {
            opacity: 0,
            scale: 1.04,
            y: 0,
            filter: "blur(12px)",
            willChange: "transform, opacity, filter",
          });
        }

        if (labelRef.current) {
          gsap.set(labelRef.current, {
            opacity: 0,
            y: 18,
            filter: "blur(6px)",
            willChange: "transform, opacity, filter",
          });
        }

        if (chars1.length > 0) {
          gsap.set(chars1, {
            yPercent: 120,
            rotateX: -48,
            opacity: 0,
            filter: "blur(14px)",
            scale: 0.94,
            transformPerspective: 1000,
            transformOrigin: "50% 100% -25px",
          });
        }

        if (chars2.length > 0) {
          gsap.set(chars2, {
            yPercent: 120,
            rotateX: -48,
            opacity: 0,
            filter: "blur(14px)",
            scale: 0.94,
            transformPerspective: 1000,
            transformOrigin: "50% 100% -25px",
          });
        }

        if (statementRef.current) {
          gsap.set(statementRef.current, {
            opacity: 0,
            y: 26,
            filter: "blur(8px)",
            willChange: "transform, opacity, filter",
          });
        }

        if (scrollCueRef.current) {
          gsap.set(scrollCueRef.current, {
            opacity: 0,
            y: 16,
            filter: "blur(4px)",
          });
        }

        if (ctaRef.current) {
          gsap.set(ctaRef.current, {
            opacity: 0,
            y: 22,
            scale: 0.94,
            filter: "blur(5px)",
            willChange: "transform, opacity, filter",
          });
        }

        // Unhide headline containers once chars are off-screen
        if (line1Ref.current) gsap.set(line1Ref.current, { opacity: 1 });
        if (line2Ref.current) gsap.set(line2Ref.current, { opacity: 1 });

        // 3. Orchestrated GSAP Timeline
        tl = gsap.timeline({
          defaults: {
            ease: physicalOvershootEase,
          },
          onComplete: () => {
            setIsAnimationComplete(true);
            if (containerRef.current) {
              containerRef.current.setAttribute("data-revealed", "true");
            }
          },
        });

        // Step 1: Small Label appears first (Timing: ~0.2s duration)
        if (labelRef.current) {
          tl.to(
            labelRef.current,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.45,
              ease: cinematicSmoothEase,
            },
            0.1,
          );
        }

        // Step 6 (reacting in background): 3D visual wakes up smoothly in parallel
        if (visualRef.current) {
          tl.to(
            visualRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.6,
              ease: cinematicSmoothEase,
            },
            0.15,
          );
        }

        // Step 2: First headline line reveals ("BRIQ®", Timing: 0.8s)
        if (chars1.length > 0) {
          tl.to(
            chars1,
            {
              yPercent: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.8,
              stagger: {
                amount: 0.22,
                from: "start",
                ease: "power2.out",
              },
              ease: physicalOvershootEase,
            },
            0.25,
          );
        }

        // Step 3: Second headline line reveals ("MARKETING", Timing: 0.8s)
        if (chars2.length > 0) {
          tl.to(
            chars2,
            {
              yPercent: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.8,
              stagger: {
                amount: 0.28,
                from: "start",
                ease: "power2.out",
              },
              ease: physicalOvershootEase,
            },
            0.55,
          );
        }

        // Step 4: Statement / Subheading fades and slides upward (Timing: 0.6s)
        if (statementRef.current) {
          tl.to(
            statementRef.current,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.6,
              ease: cinematicSmoothEase,
            },
            "-=0.4",
          );
        }

        // Step 5: CTA button appears with scale normalization (Timing: 0.5s)
        if (ctaRef.current) {
          tl.to(
            ctaRef.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.5,
              ease: physicalOvershootEase,
            },
            "-=0.35",
          );
        }

        // Step 7: Scroll Cue settles
        if (scrollCueRef.current) {
          tl.to(
            scrollCueRef.current,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.5,
              ease: cinematicSmoothEase,
            },
            "-=0.3",
          );
        }
      };

      // Ensure custom fonts are ready before computing character bounds
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(runSequence);
      } else {
        runSequence();
      }

      // Cleanup logic on unmount / re-render
      return () => {
        if (tl) tl.kill();
        try {
          split1?.revert();
          split2?.revert();
        } catch {
          // ignore
        }
      };
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={containerRef}
      aria-label="Hero Section"
      className="relative min-h-[95vh] w-full flex flex-col justify-between pt-28 pb-8 px-6 sm:px-12 lg:px-16 overflow-hidden bg-transparent select-none"
    >
      {/* Full-Covering Ambient Video Background */}
      <div
        ref={visualRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-0"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        >
          <source src="/assets/hero/hero.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette & Dark Overlay for Premium Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/60 via-black/35 to-[#08080a] mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08080a]/30 to-[#08080a]/80 pointer-events-none" />

        {/* Ambient Electric Cyan Glow Accent */}
        <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Main Center-Left Typography Block */}
      <div className="relative z-20 my-auto  max-w-7xl w-full">
        <div className="flex flex-col">
          {/* Performance-driven accent kicker label in Electric Cyan */}

          {/* Top Line: BRIQ® and Electric Cyan Tagline */}
          <div className="flex flex-col justify-center sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-12">
            {/* Line 1 Mask Container */}
            <div className="hero-line-mask overflow-hidden py-1 block">
              <h1
                ref={line1Ref}
                className="font-archivo  font-extrabold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[10.5vw] text-white tracking-tight leading-[0.88] opacity-0 mix-blend-difference"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                BIQ MARK{" "}
                <span className="text-3xl sm:text-5xl lg:text-7xl align-top pr-3 font-sans text-neutral-300 ml-1">
                  ®
                </span>
              </h1>
            </div>
          </div>

          {/* Bottom Line: MARKETING in Overflow-Hidden Line Mask */}
          {/* <div className="hero-line-mask overflow-hidden py-1 block">
            <h2
              ref={line2Ref}
              className="font-anton uppercase text-5xl sm:text-6xl md:text-7xl lg:text-[10.5vw] text-white tracking-tight leading-[0.85] drop-shadow-2xl opacity-0"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
             
            </h2>
          </div> */}
        </div>
      </div>

      {/* Hero Bottom Bar: 3-Column Layout matching reference image */}
      <div className="relative z-20 w-full pt-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        {/* Bottom Left: Growth Engine Statement */}
        <div
          ref={statementRef}
          className="font-spacegrotesk uppercase text-md sm:text-lg font-extralight tracking-widest text-neutral-400/90 leading-relaxed max-w-xs opacity-0 "
        >
          <p className="mix-blend-difference">we help your</p>
          <p className="mix-blend-difference">brand burst onto</p>
          <p className="text-neutral-200 font-extrabold mix-blend-difference">
            the digital stage
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;

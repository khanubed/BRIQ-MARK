"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GuitarString } from "../ui/GuitarString";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// ⚙️ BACKGROUND SVG CONFIGURATION
// 👉 Adjust 'scale' below to easily make the background SVG smaller or larger!
// Examples: 0.35 (extra small), 0.45 (small), 0.6 (medium), 1.0 (original full)
// ============================================================================
export const ABOUT_SVG_CONFIG = {
  scale: 0.09, // 👈 Scale multiplier (0.05 = micro, 0.09 = ultra-compact, 0.15 = small)
  centerX: 290, // 👈 Mirrored to left side (1440 - 1150 = 290)
  centerY: 240,
  radii: [50, 85, 125, 170, 220],
};

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const gradientShapeRef = useRef<HTMLDivElement | null>(null);
  const orbitalLinesRef = useRef<SVGSVGElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const statusDotRef = useRef<HTMLDivElement | null>(null);
  const stringDividerRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      let split: SplitType | null = null;

      const initAnimation = () => {
        if (prefersReduced) {
          gsap.set(
            [
              headlineRef.current,
              gradientShapeRef.current,
              orbitalLinesRef.current,
              introRef.current,
              paragraphRef.current,
              ctaRef.current,
              statusDotRef.current,
              stringDividerRef.current,
            ].filter(Boolean),
            { opacity: 1, y: 0, scale: 1, filter: "none" },
          );
          return;
        }

        // 1. Split Headline into Lines & Characters
        if (headlineRef.current) {
          try {
            split = new SplitType(headlineRef.current, {
              types: "lines,words,chars",
              tagName: "span",
            });
          } catch (err) {
            console.warn("AboutSection SplitType fallback:", err);
          }
        }

        const chars = split?.chars || [];

        // Apply hardware-accelerated 3D transforms to characters
        chars.forEach((char) => {
          char.style.display = "inline-block";
          char.style.willChange = "transform, opacity, filter";
          char.style.transformStyle = "preserve-3d";
          char.style.backfaceVisibility = "hidden";
        });

        // Initial States
        if (chars.length > 0) {
          gsap.set(chars, {
            yPercent: 115,
            rotateX: -35,
            opacity: 0,
            filter: "blur(12px)",
            transformPerspective: 1000,
            transformOrigin: "50% 100% -20px",
          });
        }

        if (gradientShapeRef.current) {
          gsap.set(gradientShapeRef.current, {
            scale: 0.88,
            opacity: 0,
            filter: "blur(20px)",
          });
        }

        if (orbitalLinesRef.current) {
          gsap.set(orbitalLinesRef.current, {
            opacity: 0,
            scale: 0.95,
          });
        }

        if (introRef.current) {
          gsap.set(introRef.current, {
            y: 35,
            opacity: 0,
            filter: "blur(6px)",
          });
        }

        if (paragraphRef.current) {
          gsap.set(paragraphRef.current, {
            y: 40,
            opacity: 0,
            filter: "blur(8px)",
          });
        }

        if (ctaRef.current) {
          gsap.set(ctaRef.current, {
            y: 20,
            opacity: 0,
          });
        }

        if (statusDotRef.current) {
          gsap.set(statusDotRef.current, {
            scale: 0,
            opacity: 0,
          });
        }

        if (stringDividerRef.current) {
          gsap.set(stringDividerRef.current, {
            scaleX: 0.94,
            opacity: 0,
          });
        }

        // 2. Cinematic ScrollTrigger Entrance Sequence
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom bottom",
            toggleActions: "play none none none",
          },
          defaults: {
            ease: "power4.out",
          },
        });

        // Step 1: Gradient shape emerges and breathes
        if (gradientShapeRef.current) {
          tl.to(
            gradientShapeRef.current,
            {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.8,
              ease: "expo.out",
            },
            0,
          );
        }

        // Step 2: Architectural orbital guide lines fade into view
        if (orbitalLinesRef.current) {
          tl.to(
            orbitalLinesRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 1.6,
              ease: "power3.out",
            },
            0.1,
          );
        }

        // Step 3: Massive headline lines reveal upward with character blur-to-sharp
        if (chars.length > 0) {
          tl.to(
            chars,
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.0,
              stagger: {
                amount: 0.38,
                from: "start",
                ease: "power2.out",
              },
              ease: "power4.out",
            },
            0.2,
          );
        }

        // Step 3.5: Interactive Guitar String Ripple Divider reveals with scaleX and fade
        if (stringDividerRef.current) {
          tl.to(
            stringDividerRef.current,
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            },
            "-=0.4",
          );
        }

        // Step 4: Lower Area agency intro & status indicator fade in
        if (introRef.current) {
          tl.to(
            introRef.current,
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "expo.out",
            },
            "-=0.5",
          );
        }

        if (statusDotRef.current) {
          tl.to(
            statusDotRef.current,
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(2)",
            },
            "-=0.6",
          );
        }

        // Step 5: Right column editorial paragraph slides and unblurs
        if (paragraphRef.current) {
          tl.to(
            paragraphRef.current,
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "expo.out",
            },
            "-=0.65",
          );
        }

        // Step 6: Animated About link settles into position
        if (ctaRef.current) {
          tl.to(
            ctaRef.current,
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.4",
          );
        }

        // Continuous subtle organic floating animation for the gradient blob
        if (gradientShapeRef.current) {
          gsap.to(gradientShapeRef.current, {
            y: 18,
            rotation: -3,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      };

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(initAnimation);
      } else {
        initAnimation();
      }

      return () => {
        try {
          split?.revert();
        } catch {
          // ignore
        }
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === sectionRef.current) st.kill();
        });
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="About Agency Section"
      className="relative min-h-screen w-full bg-transparent text-white pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28 lg:pb-36 px-6 sm:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* 2. DECORATIVE ELEMENT: Concentric Architectural & Orbital Blueprint Lines Mirrored to Left */}
      <figure
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden m-0"
      >
        <svg
          ref={orbitalLinesRef}
          className="w-full h-full opacity-0"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Scaled group centered at left-side coordinates */}
          <g
            transform={`translate(${ABOUT_SVG_CONFIG.centerX}, ${ABOUT_SVG_CONFIG.centerY}) scale(${ABOUT_SVG_CONFIG.scale}) translate(-${ABOUT_SVG_CONFIG.centerX}, -${ABOUT_SVG_CONFIG.centerY})`}
          >
            {/* Concentric Orbital Curves */}
            {ABOUT_SVG_CONFIG.radii.map((radius, index) => (
              <circle
                key={index}
                cx={ABOUT_SVG_CONFIG.centerX}
                cy={ABOUT_SVG_CONFIG.centerY}
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                strokeDasharray={index % 2 === 1 ? "4 6" : undefined}
              />
            ))}

            {/* Delicate Technical Crosshairs tightly grouped around the left core */}
            <path
              d={`M ${ABOUT_SVG_CONFIG.centerX} ${ABOUT_SVG_CONFIG.centerY - 130} L ${ABOUT_SVG_CONFIG.centerX} ${ABOUT_SVG_CONFIG.centerY - 110} M ${ABOUT_SVG_CONFIG.centerX - 10} ${ABOUT_SVG_CONFIG.centerY - 120} L ${ABOUT_SVG_CONFIG.centerX + 10} ${ABOUT_SVG_CONFIG.centerY - 120}`}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M ${ABOUT_SVG_CONFIG.centerX - 130} ${ABOUT_SVG_CONFIG.centerY} L ${ABOUT_SVG_CONFIG.centerX - 110} ${ABOUT_SVG_CONFIG.centerY} M ${ABOUT_SVG_CONFIG.centerX - 120} ${ABOUT_SVG_CONFIG.centerY - 10} L ${ABOUT_SVG_CONFIG.centerX - 120} ${ABOUT_SVG_CONFIG.centerY + 10}`}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M ${ABOUT_SVG_CONFIG.centerX - 130} ${ABOUT_SVG_CONFIG.centerY + 110} L ${ABOUT_SVG_CONFIG.centerX - 110} ${ABOUT_SVG_CONFIG.centerY + 110} M ${ABOUT_SVG_CONFIG.centerX - 120} ${ABOUT_SVG_CONFIG.centerY + 100} L ${ABOUT_SVG_CONFIG.centerX - 120} ${ABOUT_SVG_CONFIG.centerY + 120}`}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </figure>

      {/* 3. CONTENT CONTAINER */}
      <div className="relative z-20 max-w-[1400px] mx-auto flex flex-col justify-between min-h-[75vh] lg:min-h-[82vh]">
        {/* TOP AREA: Very Large Editorial Typography (Mirrored to the Right) */}
        <header className="w-full pt-4 lg:pt-8 flex flex-col items-end text-right">
          <h2
            ref={headlineRef}
            className="font-archivo font-light sm:font-normal uppercase tracking-tighter text-neutral-200 text-[11vw] sm:text-[9.5vw] md:text-[6.2vw] lg:text-[5.4vw] xl:text-[4.8vw] leading-[0.91] max-w-full text-right"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <span className="block">WITH STRATEGY,</span>
            <span className="block">
              CREATIVITY &{" "}
              <span className="text-white   transition-colors duration-500">
                DATA,
              </span>
            </span>
            <span className="block">
              WE ENGINEER THE{" "}
              <span className="text-white transition-colors duration-500">
                FUTURE
              </span>
            </span>
            <span className="block">OF DIGITAL GROWTH.</span>
          </h2>
        </header>

        {/* LOWER AREA: Mirrored to the right side */}
        <section
          aria-label="Agency Overview"
          className="w-full relative pt-6 sm:pt-8 lg:pt-10 flex flex-col md:flex-row items-start justify-end gap-10 md:gap-14 lg:gap-20 max-w-4xl ml-auto"
        >
          {/* REUSABLE GUITAR STRING RIPPLE DIVIDER */}
          <div
            ref={stringDividerRef}
            role="separator"
            aria-orientation="horizontal"
            className="w-full -top-10 z-40 absolute -right-6 opacity-0"
          >
            <GuitarString activeColor="#ffffff" />
          </div>

          {/* Box 2: Editorial Paragraph (Positioned on the inner left side of the right cluster) */}
          <article className="max-w-md lg:max-w-lg text-right md:text-left">
            <p
              ref={paragraphRef}
              className="font-archivo text-xs sm:text-sm tracking-widest text-neutral-300/90 font-light leading-relaxed opacity-0"
            >
              Growth is no longer driven by visibility alone. It is earned
              through exceptional experiences, clear positioning, and meaningful
              customer connections. With a synthesis of rigorous unit economics,
              rapid iteration, and cinematic creative excellence, we empower
              forward-looking brands across North America and the GCC to reshape
              their market narrative.
            </p>
          </article>

          {/* Box 1: Agency Introduction + Animated About Link (Positioned on outer right edge) */}
          <aside
            aria-label="Agency Mission"
            className="flex flex-col justify-between space-y-6 sm:space-y-8 max-w-xs shrink-0 text-right md:items-end"
          >
            {/* Small Uppercase Intro */}
            <div
              ref={introRef}
              className="font-archivo uppercase text-xs sm:text-sm tracking-widest text-neutral-400 leading-relaxed opacity-0 text-right"
            >
              <p>FOUNDER-LED GLOBAL</p>
              <p>DIGITAL GROWTH, BRANDING</p>
              <p>& EXPERIENCE AGENCY</p>
              <p>POWERED BY</p>
              <a
                href="https://navigotechinnovation.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-neutral-300 transition-colors"
              >
                NAVIGOTECH INNOVATION ↗
              </a>
            </div>

            {/* Bottom Row: Animated Text Link + Reference Status Dot (Mirrored order) */}
            <nav
              aria-label="About Agency Link"
              className="flex items-center justify-end gap-5 pt-1"
            >
              {/* Animated Text Link: ABOUT US → */}
              <Link
                ref={ctaRef}
                href="/about"
                className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-widest text-white/90 hover:text-white transition-all opacity-0 relative py-1"
              >
                <span className="relative">
                  ABOUT US
                  {/* Expanding underline hover effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300 ease-out" />
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-2 transition-transform duration-300 ease-out" />
              </Link>

              {/* Reference-Style Status Dot */}
              <div
                ref={statusDotRef}
                className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#00f0ff] animate-pulse opacity-0"
                aria-hidden="true"
              />
            </nav>
          </aside>
        </section>
      </div>
    </section>
  );
}

export default AboutSection;

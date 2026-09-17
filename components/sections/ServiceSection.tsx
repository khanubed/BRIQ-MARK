"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GuitarString } from "../ui/GuitarString";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import servicesData from "../../content/services.json";

// ============================================================================
// ⚙️ BACKGROUND SVG CONFIGURATION
// ============================================================================
export const ABOUT_SVG_CONFIG = {
  scale: 0.09,
  centerX: 290,
  centerY: 240,
  radii: [50, 85, 125, 170, 220],
};

// ============================================================================
// 📋 SERVICES DATA
// ============================================================================
export interface Capability {
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: Capability[];
  video: string;
}

const SERVICES = servicesData as ServiceItem[];

export const SUBTITLE_WORDS = [
  "We",
  "build",
  "standout",
  "digital",
  "products",
  "and",
  "experiences",
  "that",
  "move",
  "our",
  "clients'",
  "brands",
  "forward.",
];

export function ServiceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineTriggerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const weRef = useRef<HTMLSpanElement | null>(null);
  const doRef = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const gradientShapeRef = useRef<HTMLDivElement | null>(null);
  const orbitalLinesRef = useRef<SVGSVGElement | null>(null);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExploreHovered, setIsExploreHovered] = useState<boolean>(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 26, stiffness: 280, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleAccordionLeave = () => {
    setHoveredIndex(null);
    setIsExploreHovered(false);
  };

  const isManualClickRef = useRef<boolean>(false);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prefersReduced = useReducedMotion();

  const handleItemClick = (index: number) => {
    if (activeIndex === index) return;
    isManualClickRef.current = true;
    setActiveIndex(index);
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      isManualClickRef.current = false;
      ScrollTrigger.refresh();
    }, 600);
  };

  useGSAP(
    () => {
      const initAnimation = () => {
        if (prefersReduced) {
          gsap.set(
            [
              headlineRef.current,
              weRef.current,
              doRef.current,
              subtitleRef.current,
              gradientShapeRef.current,
              accordionRef.current,
            ].filter(Boolean),
            { opacity: 1, y: 0, scale: 1, filter: "none" },
          );
          gsap.set(
            [
              ".what-char",
              ".subtitle-word",
              ".accordion-num",
              ".accordion-title",
            ],
            { yPercent: 0, opacity: 1, filter: "none" },
          );
          gsap.set(".accordion-divider", { scaleX: 1 });
          gsap.set(".accordion-icon", { scale: 1, rotate: 0, opacity: 1 });
          return;
        }

        // 1. Initial States for Awwwards-Level Typography Entrance
        gsap.set(".what-char", {
          yPercent: 125,
          rotateX: -45,
          opacity: 0,
          filter: "blur(10px)",
          transformPerspective: 800,
        });

        if (weRef.current) {
          gsap.set(weRef.current, {
            yPercent: 125,
            scale: 1.15,
            rotateZ: -3,
            opacity: 0,
          });
        }

        if (doRef.current) {
          gsap.set(doRef.current, {
            yPercent: 125,
            scale: 1.12,
            rotateZ: 2,
            opacity: 0,
          });
        }

        gsap.set(".subtitle-word", {
          yPercent: 115,
          opacity: 0,
          filter: "blur(4px)",
        });

        gsap.set(".accordion-divider", {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set(".accordion-num", {
          yPercent: 110,
          opacity: 0,
        });

        gsap.set(".accordion-title", {
          yPercent: 110,
          opacity: 0,
        });

        gsap.set(".accordion-icon", {
          scale: 0,
          rotate: -90,
          opacity: 0,
        });

        // 2. Cinematic Entrance Sequence for Top Hero
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headlineTriggerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          defaults: {
            ease: "power4.out",
          },
        });

        // 2.5 Scroll-Scrubbed Parallax for the Headline
        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            y: 150,
            opacity: 0.5,
            scrollTrigger: {
              trigger: headlineTriggerRef.current,
              start: "top 30%",
              end: "bottom -20%",
              scrub: 1,
            },
          });
        }

        // Awwwards reveal: "WHAT" staggered character 3D roll-up
        tl.to(
          ".what-char",
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.25,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.1,
        );

        // Awwwards reveal: "WE" bold explosive reveal
        if (weRef.current) {
          tl.to(
            weRef.current,
            {
              yPercent: 0,
              scale: 1,
              rotateZ: 0,
              opacity: 1,
              duration: 1.3,
              ease: "expo.out",
            },
            0.25,
          );
        }

        // Awwwards reveal: "DO" follows right into place
        if (doRef.current) {
          tl.to(
            doRef.current,
            {
              yPercent: 0,
              scale: 1,
              rotateZ: 0,
              opacity: 1,
              duration: 1.3,
              ease: "expo.out",
            },
            0.35,
          );
        }

        // Subtitle word-by-word masked reveal
        tl.to(
          ".subtitle-word",
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.022,
            ease: "power3.out",
          },
          0.5,
        );

        // 3. Accordion Entrance Reveal Timeline
        if (accordionRef.current) {
          const accTl = gsap.timeline({
            scrollTrigger: {
              trigger: accordionRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
            defaults: {
              ease: "power4.out",
            },
          });

          // Draw horizontal divider lines
          accTl.to(
            ".accordion-divider",
            {
              scaleX: 1,
              duration: 1.1,
              stagger: 0.07,
              ease: "power3.inOut",
            },
            0,
          );

          // Reveal numbers
          accTl.to(
            ".accordion-num",
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.07,
              ease: "power4.out",
            },
            0.1,
          );

          // Reveal titles
          accTl.to(
            ".accordion-title",
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.07,
              ease: "power4.out",
            },
            0.15,
          );

          // Reveal icons
          accTl.to(
            ".accordion-icon",
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.07,
              ease: "back.out(1.7)",
            },
            0.2,
          );
        }

        // 4. Scroll-Linked Trigger for Accordion Active States
        itemRefs.current.forEach((el, index) => {
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            onEnter: () => {
              if (!isManualClickRef.current) {
                setActiveIndex(index);
              }
            },
            onLeaveBack: () => {
              if (!isManualClickRef.current && index > 0) {
                setActiveIndex(index - 1);
              }
            },
          });
        });
      };

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(initAnimation);
      } else {
        initAnimation();
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (
            st.trigger === sectionRef.current ||
            st.trigger === accordionRef.current ||
            st.trigger === headlineTriggerRef.current ||
            itemRefs.current.includes(st.trigger as HTMLElement)
          ) {
            st.kill();
          }
        });
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Services Section"
      className="relative min-h-screen w-full bg-transparent text-white pt-28 sm:pt-36 lg:pt-44 pb-24 sm:pb-32 lg:pb-40 px-6 sm:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* 3. CONTENT CONTAINER: Combined Experience (75% Desktop Width) */}
      <div className="relative z-20 max-w-[1500px] w-full lg:w-[75%] lg:mr-auto flex flex-col">
        {/* TOP HALF: "WHAT WE DO" Hero Typography Composition (Aligned to Left) */}
        <header ref={headlineTriggerRef} className="w-full relative flex flex-col items-start pb-12 sm:pb-16 lg:pb-20">
          <div ref={headlineRef} className="w-full flex flex-col items-start">
            {/* The "WHAT WE DO" Composite Typography */}
            <div className="relative select-none flex flex-col items-start">
              {/* Row 1: Wireframe Serif Italic "WHAT" with Overlapping Bold Sans "WE" */}
              <div className="relative inline-flex items-baseline">
                {/* Outlined Wireframe Serif Italic "WHAT" with Staggered 3D Character Reveal */}
                <h2
                  className="font-serif italic font-normal tracking-wide leading-[0.92] select-none text-[15vw] sm:text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[10.5vw] flex items-baseline"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', serif",
                  }}
                >
                  {["W", "H", "A", "T"].map((char, index) => (
                    <span
                      key={index}
                      className="inline-block overflow-hidden px-1 sm:px-2 py-1 -my-1"
                    >
                      <span
                        className="what-char inline-block will-change-transform font-light"
                        style={{
                          WebkitTextStroke: "1.8px rgba(255, 255, 255, 0.95)",
                          color: "transparent",
                          filter:
                            "drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))",
                        }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                </h2>

                {/* Solid Bold Sans-Serif "WE" overlapping "AT" */}
                <span
                  className="absolute left-[54%] sm:left-[52%] md:left-[54%] font-spacegrotesk font-black text-white leading-none tracking-tight text-[15vw] sm:text-[13vw] md:text-[10vw] lg:text-[10.5vw] xl:text-[12vw] z-10 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] overflow-hidden px-1 py-1"
                  style={{ top: "-0.58em" }}
                >
                  <span
                    ref={weRef}
                    className="inline-block will-change-transform text-white"
                  >
                    WE
                  </span>
                </span>
              </div>

              {/* Row 2: Solid Bold Sans-Serif "DO" under "WE" */}
              <div className="w-full flex justify-start  -mt-20 sm:-mt-24">
                <span
                  ref={doRef}
                  className="font-spacegrotesk font-black text-white leading-none tracking-tight text-[15vw] sm:text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[10.5vw] pl-[46%] sm:pl-[48%] md:pl-[80%] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] inline-block will-change-transform"
                >
                  DO
                </span>
              </div>
            </div>

            {/* Subtitle (Word-by-word kinetic reveal) */}
            <div className="w-full max-w-xl pt-8 mb-20 sm:pt-10 text-left">
              <p
                ref={subtitleRef}
                className="font-archivo text-xs sm:text-sm tracking-wide text-white font-light leading-relaxed flex flex-wrap gap-x-[0.32em] gap-y-1"
              >
                {SUBTITLE_WORDS.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden">
                    <span className="subtitle-word inline-block will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </header>

        {/* BOTTOM HALF: Service Accordion in 75% Left Space (Seamless continuation of the section) */}
        <div
          ref={accordionRef}
          role="region"
          aria-label="Services Portfolio"
          className="w-full relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleAccordionLeave}
        >
          {/* Floating Video Preview in Dedicated Right Corridor (Never Occluding Title or Description) */}
          <motion.div
            className="fixed top-0 right-6 xl:right-14 pointer-events-none z-40 hidden lg:block"
            style={{
              y: cursorY,
              translateY: "-50%",
            }}
          >
            <AnimatePresence mode="wait">
              {hoveredIndex !== null &&
                !isExploreHovered &&
                SERVICES[hoveredIndex] && (
                  <motion.div
                    key={SERVICES[hoveredIndex].id}
                    initial={{
                      opacity: 0,
                      scale: 0.72,
                      rotate: -2,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.75,
                      rotate: 2,
                      filter: "blur(6px)",
                    }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[320px] xl:w-[360px] h-[180px] xl:h-[202px] rounded-xl overflow-hidden border border-white/20 bg-[#0c0c10]/95 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,255,255,0.08)] relative"
                  >
                    <video
                      key={SERVICES[hoveredIndex].video}
                      src={SERVICES[hoveredIndex].video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {SERVICES.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => handleItemClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`w-full relative transition-colors duration-500 cursor-pointer group select-none   `}
              >
                {/* Interactive Guitar String Divider (Pure White Only, No Cyan) */}
                <div className="accordion-divider w-full relative z-10 -my-3.5 pointer-events-auto">
                  <GuitarString
                    height={32}
                    strokeColor={
                      isActive
                        ? "rgba(255, 255, 255, 0.38)"
                        : "rgba(255, 255, 255, 0.14)"
                    }
                    activeColor="#F0F0F0"
                    strokeWidth={1.2}
                    maxDeflection={20}
                    showEndpoints={true}
                    showRipple={true}
                    className="w-full"
                  />
                </div>

                <div className="w-full py-6 sm:py-8 lg:py-10 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 lg:gap-8">
                  {/* Left Column: Number (Anton font) with mask reveal */}
                  <div className="shrink-0 w-12 sm:w-14 overflow-hidden">
                    <span
                      className={`accordion-num inline-block font-archivo text-base sm:text-lg tracking-wider transition-colors duration-500 will-change-transform ${
                        isActive
                          ? "text-white"
                          : "text-neutral-500 group-hover:text-neutral-400"
                      }`}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Right Column: Title + Content (Space Grotesk & Archivo - max-w-xl avoids any overlap) */}
                  <div className="flex-1 flex flex-col min-w-0 max-w-xl xl:max-w-2xl">
                    {/* Title Header Row */}
                    <div className="w-full flex items-baseline justify-between gap-4">
                      <div className="overflow-hidden">
                        <h3
                          className={`font-archivo text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.12] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                              ? "text-white -translate-y-0.5"
                              : "text-neutral-400 group-hover:text-neutral-200 translate-y-0"
                          }`}
                        >
                          <span className="accordion-title inline-block will-change-transform">
                            {item.title}
                          </span>
                        </h3>
                      </div>
                    </div>

                    {/* Expandable Accordion Body (CSS Grid Smooth Height Transition) */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-5 sm:pt-6 flex flex-col space-y-5">
                          {/* Description (Archivo font) */}
                          <p
                            className={`font-archivo text-xs sm:text-sm text-neutral-300/90 font-light leading-relaxed transition-all duration-500 ease-out ${
                              isActive
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-0"
                            }`}
                          >
                            {item.description}
                          </p>

                          {/* Capabilities List (Archivo font) */}
                          <div
                            className={`flex flex-wrap gap-2 transition-all duration-500 delay-75 ease-out ${
                              isActive
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-0"
                            }`}
                          >
                            {item.capabilities.map((cap) => (
                              <span
                                key={cap.title}
                                className="font-archivo text-[11px] sm:text-xs tracking-wider uppercase text-neutral-300 bg-white/[0.03] border border-white/8 px-2.5 py-1 rounded-sm"
                              >
                                {cap.title}
                              </span>
                            ))}
                          </div>

                          {/* Explore Button (Space Grotesk font) */}
                          <div
                            className={`pt-1 transition-all duration-500 delay-150 ease-out ${
                              isActive
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-0"
                            }`}
                            onMouseEnter={() => setIsExploreHovered(true)}
                            onMouseLeave={() => setIsExploreHovered(false)}
                          >
                            <Link
                              href={`/services/${item.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="group/btn inline-flex items-center gap-3 font-spacegrotesk text-xs uppercase tracking-widest text-white hover:text-slate-200 transition-colors duration-300"
                            >
                              <span className="relative">
                                Explore Service
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover/btn:w-full transition-all duration-300 ease-out" />
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-white group-hover/btn:translate-x-1.5 transition-transform duration-300 ease-out" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Bottom closing guitar string divider (Pure White Only, No Cyan) */}
          <div className="accordion-divider w-full relative z-10 -my-3.5 pointer-events-auto">
            <GuitarString
              height={32}
              strokeColor="rgba(255, 255, 255, 0.14)"
              activeColor="#ffffff"
              strokeWidth={1.2}
              maxDeflection={20}
              showEndpoints={true}
              showRipple={true}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;

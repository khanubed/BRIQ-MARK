"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { InteractiveOrb } from "../ui/InteractiveOrb";
import AboutSection from "./AboutSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NarrativeSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbMoverRef = useRef<HTMLDivElement | null>(null);
  const orbGraphicRef = useRef<HTMLDivElement | null>(null);
  const serviceWrapperRef = useRef<HTMLDivElement | null>(null);
  const workTransitionTrackRef = useRef<HTMLDivElement | null>(null);
  const workWrapperRef = useRef<HTMLDivElement | null>(null);

  const transitionTrackRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      // 1. Continuous organic floating breathing effect for the orb
      if (orbGraphicRef.current) {
        gsap.to(orbGraphicRef.current, {
          y: 20,
          rotation: -3,
          duration: 6.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 2. Cinematic Ball Journey:
      // - Phase 1: Ball anchored on LEFT during AboutSection
      // - Phase 2: Glides into CENTER, pauses for a moment, then glides to RIGHT for ServiceSection
      if (transitionTrackRef.current && orbMoverRef.current) {
        // Initial state: Anchored on the LEFT edge
        gsap.set(orbMoverRef.current, {
          left: "0%",
          xPercent: -36,
          scale: 1,
          y: 0,
        });

        const journeyTl = gsap.timeline({
          scrollTrigger: {
            trigger: transitionTrackRef.current,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1.2,
          },
        });

        // Stage 1: Smooth, continuous glide from Left to Right without pausing
        journeyTl.to(orbMoverRef.current, {
          left: "100%",
          xPercent: -64,
          ease: "power2.inOut",
          duration: 1,
        });
      }

      // (Removed Service Section Pin to prevent nested pinning conflicts with internal ServiceSection animations)

      // 3. Transition from ServiceSection (Right) -> WorkSection (Left):
      // As requested: Ball transitions from Right side back to Left side,
      // becomes slightly smaller (scale down to 0.78), with subtle easy ease,
      // docking gracefully beneath the monumental Work heading!
      if (workTransitionTrackRef.current && orbMoverRef.current) {
        const workTransitionTl = gsap.timeline({
          scrollTrigger: {
            trigger: workTransitionTrackRef.current,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1.2,
          },
        });

        workTransitionTl.fromTo(
          orbMoverRef.current,
          {
            left: "100%",
            xPercent: -64,
            scale: 1,
            y: 0,
          },
          {
            left: "0%",
            xPercent: -36,
            scale: 0.78,
            y: 60,
            ease: "power2.inOut",
            duration: 1,
            immediateRender: false,
          },
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (
            st.trigger === transitionTrackRef.current ||
            st.trigger === serviceWrapperRef.current ||
            st.trigger === workTransitionTrackRef.current ||
            st.trigger === workWrapperRef.current
          ) {
            st.kill();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#08080a] text-white overflow-visible"
    >
      {/* =========================================================================
          📌 SHARED PERSISTENT ORB (Sticky across About, Service & Work Sections)
          ========================================================================= */}
      <div
        aria-hidden="true"
        className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 overflow-hidden"
      >
        <div
          ref={orbMoverRef}
          className="absolute top-1/2 -translate-y-1/2 pointer-events-auto will-change-transform"
          style={{ left: "0%" }}
        >
          <InteractiveOrb ref={orbGraphicRef} parentRef={containerRef} />
        </div>
      </div>

      {/* =========================================================================
          📖 NARRATIVE CONTENT FLOW (Flows seamlessly over the sticky ball)
          ========================================================================= */}
      <div className="relative z-20 -mt-[100vh]">
        {/* Phase 1: About Section (Ball on Left, Content on Right) */}
        <div>
          <AboutSection />
        </div>

        {/* Transition Zone 1: Ball glides Left -> Center -> Dwells/Pauses -> Right */}
        <div
          ref={transitionTrackRef}
          className="relative w-full h-[75vh] sm:h-[90vh] pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        />

        {/* Phase 2: Service Section (Ball docked on Right, Content on Left) */}
        <div ref={serviceWrapperRef}>
          <ServiceSection />
        </div>

        {/* Transition Zone 2: Ball glides Right -> Left and scales down with subtle easy-ease */}
        <div
          ref={workTransitionTrackRef}
          className="relative w-full h-[65vh] sm:h-[80vh] pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        />

        {/* Phase 3: Work Section (Ball on Left scaled down, Heading above, 2-column parallax on Right) */}
        <div ref={workWrapperRef}>
          <WorkSection />
        </div>
      </div>
    </div>
  );
}

export default NarrativeSection;

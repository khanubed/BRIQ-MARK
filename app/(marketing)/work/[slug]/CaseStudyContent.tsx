"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WaterImage } from "../../../../components/ui/WaterImage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CaseStudyContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      // 1. Hero Image Parallax (scale effect)
      gsap.to(".hero-image", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Vertical Image Parallax
      gsap.to(".parallax-img-fast", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ".brief-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Directional Marquee Scroller (Next Project)
      if (marqueeRef.current && marqueeInnerRef.current) {
        gsap.to(marqueeInnerRef.current, {
          xPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  return (
    <div ref={containerRef} className="w-full bg-[#08080a] text-white selection:bg-amber-400 selection:text-black">
      
      {/* HEADER BAR */}
      <div className="fixed top-24 left-0 w-full px-6 sm:px-12 z-40 pointer-events-none flex justify-between items-center mix-blend-difference">
        <Link
          href="/work"
          className="pointer-events-auto inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Archives
        </Link>
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          Consumer Voice // Case 01
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section relative w-full pt-48 pb-12 px-6 sm:px-12 lg:px-20 min-h-[90vh] flex flex-col justify-end">
        <div className="max-w-7xl mx-auto w-full relative z-10 mb-12">
          {/* Micro Header */}
          <div className="flex gap-8 mb-8 text-xs font-mono uppercase tracking-widest text-neutral-400">
            <span>Client: Consumer Voice</span>
            <span>Role: Identity & Digital</span>
            <span>Year: 2026</span>
          </div>

          {/* Massive Typography */}
          <h1 className="font-spacegrotesk font-black tracking-tighter text-[12vw] leading-[0.85] uppercase text-white mb-6">
            Consumer <br /> <span className="text-amber-400">Voice</span>
          </h1>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[50vh] sm:h-[65vh] relative overflow-hidden rounded-t-[2rem]">
          <div className="hero-image absolute inset-0 w-full h-full scale-[1.01]">
            <WaterImage 
              src="/images/casestudy/main-hero-image-landcape.webp" 
              alt="Consumer Voice Hero" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* THE BRIEF (Two-Column) */}
      <section className="brief-section px-6 sm:px-12 lg:px-20 py-24 sm:py-48 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-spacegrotesk text-3xl sm:text-5xl font-medium tracking-tight">
              The Brief
            </h2>
            <div className="w-full h-px bg-white/10" />
            <p className="font-archivo text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
              Consumer Voice is an independent expert specializing in reliable product feedback. In part this relates to purchasing products on Amazon, where some sellers post fake positive reviews to increase their ratings. 
            </p>
            <p className="font-archivo text-lg sm:text-xl text-neutral-400 font-light leading-relaxed">
              Consumer Voice shows customers only real feedback and helps locate a specific product out of multiple categories with a subsequent purchase on Amazon.
            </p>
            
            <div className="pt-12 grid grid-cols-2 gap-8">
              <div>
                <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">Deliverables</span>
                <ul className="text-sm font-spacegrotesk space-y-2 text-neutral-300">
                  <li>Brand Identity</li>
                  <li>UX/UI Design</li>
                  <li>Platform Architecture</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Images Parallax */}
          <div className="lg:col-span-7 relative h-full min-h-[600px] sm:min-h-[800px] w-full">
             <div className="absolute top-0 right-0 w-2/3 aspect-[3/4] overflow-hidden rounded-2xl">
               <img src="/images/casestudy/tagline-portrait.webp" alt="Tagline" className="w-full h-full object-cover" />
             </div>
             
             <div className="parallax-img-fast absolute bottom-0 left-0 w-1/2 aspect-[4/5] overflow-hidden rounded-2xl z-10 shadow-2xl shadow-black">
               <img src="/images/casestudy/logo-icon-portait.webp" alt="Logo Icon" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE GRID */}
      <section className="px-6 sm:px-12 lg:px-20 py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="w-full aspect-[21/9] overflow-hidden rounded-2xl relative">
            <img src="/images/casestudy/website-ui-landscape.webp" alt="UI Design" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
              <img src="/images/casestudy/logo-on-tshirt-portrait.webp" alt="Merch" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl relative">
              <img src="/images/casestudy/portrait-image.webp" alt="Portrait" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl relative">
            <img src="/images/casestudy/themed-icons-landscape.webp" alt="Icons" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Full Width Video Section */}
          <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl relative">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/images/casestudy/logo-video.mp4" type="video/mp4" />
            </video>
          </div>
          
        </div>
      </section>

      {/* NEXT PROJECT SCROLLER */}
      <section 
        ref={marqueeRef}
        className="relative w-full h-[60vh] sm:h-[80vh] bg-[#050505] flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
      >
        <Link href="/work" className="absolute inset-0 z-20" aria-label="Next Project" />
        
        <div className="text-center mb-8 relative z-10 pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-4">
            Up Next
          </span>
        </div>

        <div className="w-full flex whitespace-nowrap overflow-hidden relative z-10 pointer-events-none">
          <div 
            ref={marqueeInnerRef}
            className="flex items-center gap-12 sm:gap-24 px-12 will-change-transform"
          >
            {[...Array(6)].map((_, i) => (
              <h2 
                key={i} 
                className="font-spacegrotesk font-black text-[15vw] leading-none uppercase tracking-tighter text-white/10 group-hover:text-white transition-colors duration-500"
              >
                Next Project — 
              </h2>
            ))}
          </div>
        </div>
        
        {/* Hover image preview center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 aspect-[3/4] overflow-hidden rounded-2xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 pointer-events-none z-10 shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/10">
           <WaterImage src="/images/casestudy/landscape.webp" alt="Next Project" className="w-full h-full object-cover" />
        </div>

      </section>
      
    </div>
  );
}

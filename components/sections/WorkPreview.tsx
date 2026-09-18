"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaseStudy } from "../../lib/cms";
import { WaterImage } from "../ui/WaterImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkPreviewProps {
  initialCaseStudies: CaseStudy[];
}

export function WorkPreview({ initialCaseStudies }: WorkPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Split into two columns
  const col1Projects = initialCaseStudies.filter((_, i) => i % 2 === 0);
  const col2Projects = initialCaseStudies.filter((_, i) => i % 2 === 1);

  useGSAP(
    () => {
      if (prefersReduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Parallax effect on the second column
        if (col1Ref.current && col2Ref.current) {
          gsap.fromTo(
            col2Ref.current,
            { y: 0 },
            {
              y: -800, // Moves up significantly faster as you scroll down
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [prefersReduced] }
  );

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start
      ">
        
        {/* COLUMN 1: Normal Velocity */}
        <div ref={col1Ref} className="flex flex-col gap-16 lg:gap-24 will-change-transform max-w-md">
          {col1Projects.map((study) => (
            <ProjectCard key={study.slug} study={study} />
          ))}
        </div>

        {/* COLUMN 2: Faster Velocity Parallax */}
        <div ref={col2Ref} className="flex flex-col gap-16 lg:gap-24 lg:pt-32 will-change-transform max-w-md">
          {col2Projects.map((study) => (
            <ProjectCard key={study.slug} study={study} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ study }: { study: CaseStudy }) {
  return (
    <Link href={`/work/${study.slug}`} className="group block w-full reveal-row opacity-0 translate-y-12">
      {/* 3/4 Ratio Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/10 mb-6">
        <WaterImage src={study.coverImage} alt={study.title} className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Floating View Project Badge */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
           <span className="flex items-center gap-2 bg-white text-black font-spacegrotesk text-xs tracking-widest uppercase px-4 py-2 rounded-full">
             View Case <ArrowUpRight className="w-4 h-4" />
           </span>
        </div>
      </div>

      {/* Project Meta - Name, line, description */}
      <div className="flex flex-col">
        {/* Title & Market */}
        <div className="flex items-end justify-between pb-4">
          <h3 className="font-spacegrotesk text-3xl sm:text-4xl font-medium text-white group-hover:text-amber-300 transition-colors tracking-tight leading-none">
            {study.client}
          </h3>
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest leading-none mb-1">
            {study.market}
          </span>
        </div>
        
        {/* Full width line divider */}
        <div className="w-full h-px bg-white/10 mb-4 group-hover:bg-white/30 transition-colors" />
        
        {/* Description & Results */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <p className="font-archivo text-neutral-400 text-sm max-w-sm">
            {study.tagline}
          </p>
          
          <div className="flex gap-6 shrink-0">
            {study.results.slice(0, 1).map((res, idx) => (
              <div key={idx} className="flex flex-col items-start sm:items-end">
                <span className="font-mono text-lg text-white font-bold">{res.value}</span>
                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{res.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

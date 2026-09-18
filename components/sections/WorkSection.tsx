"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { WaterImage } from "../ui/WaterImage";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import caseStudies from "../../content/case-studies.json";

// We'll map the case studies into the WorkProject format expected by WorkSection
const mappedProjects = caseStudies.map((study, idx) => ({
  id: study.slug,
  number: String(idx + 1).padStart(2, '0'),
  title: study.title,
  client: study.client,
  category: study.industry,
  market: study.market,
  image: study.coverImage,
  slug: study.slug,
  metricValue: study.results[0]?.value || "-",
  metricLabel: study.results[0]?.label || "-",
  accentColor: idx % 2 === 0 ? "#F59E0B" : "#38BDF8", // Alternate colors for ambient glow
}));

const COLUMN_1_PROJECTS = mappedProjects.filter((_, i) => i % 2 === 0);
const COLUMN_2_PROJECTS = mappedProjects.filter((_, i) => i % 2 === 1);

export function WorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const col1Ref = useRef<HTMLDivElement | null>(null);
  const col2Ref = useRef<HTMLDivElement | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Dual-Column Parallax Vertical Carousel:
        // Column 1 glides with velocity A
        if (col1Ref.current) {
          gsap.fromTo(
            col1Ref.current,
            { y: 60 },
            {
              y: -140,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }

        // Column 2 glides with velocity B (faster/different speed for dynamic parallax)
        if (col2Ref.current) {
          gsap.fromTo(
            col2Ref.current,
            { y: 160 },
            {
              y: -260,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            },
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected Work Showcase"
      className="relative w-full min-h-screen bg-transparent text-white pt-24 sm:pt-32 lg:pt-40 pb-32 sm:pb-40 lg:pb-48 px-6 sm:px-12 lg:px-16 overflow-visible select-none"
    >
      <div className="max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
        {/* =========================================================================
            LEFT COLUMN (Sticky / Editorial Heading Above the Left Ball)
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-32 z-20 space-y-8">
          {/* Awwwards-Level Monumental Heading */}
          <div ref={stickyHeaderRef} className="space-y-4">
            <h2 className="text-4xl sm:text-6xl xl:text-7xl font-archivo  tracking-tight leading-[0.96] text-white">
              FEATURED WORK
            </h2>
          </div>

          {/* Action CTA */}
          <div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-white font-spacegrotesk text-xs uppercase tracking-widest font-bold hover:text-neutral-300 transition-all hover:translate-x-1 group cursor-pointer bg-transparent shadow-none p-0"
            >
              <span className="relative">
                Explore All Case Archives
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (Dual-Column Parallax Vertical Carousel - 6 Project Cards)
            ========================================================================= */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 xl:gap-10 items-start relative z-20">
          {/* COLUMN 1: 3 Projects (Normal Velocity) */}
          <div
            ref={col1Ref}
            className="flex flex-col gap-8 xl:gap-12 will-change-transform"
          >
            {COLUMN_1_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* COLUMN 2: 3 Projects (Offset + Higher Velocity Parallax) */}
          <div
            ref={col2Ref}
            className="flex flex-col gap-8 xl:gap-12 sm:pt-16 xl:pt-24 will-change-transform"
          >
            {COLUMN_2_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: WorkProject }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block relative w-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm transition-all duration-500 hover:border-neutral-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer select-none"
    >
      {/* 1. Project Image Container (Aspect 4:3 or 16:11) */}
      <div className="relative w-full aspect-[16/11] overflow-hidden bg-neutral-950">
        <WaterImage
          src={project.image}
          alt={`${project.client} - ${project.title}`}
          className="absolute inset-0 w-full h-full"
        />

        {/* Ambient Color Reflection Gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${project.accentColor}, transparent 70%)`,
          }}
        />
      </div>
    </Link>
  );
}

export default WorkSection;

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Sparkles, MoveHorizontal, ArrowUpRight } from "lucide-react";
import type { CylinderGalleryItem } from "../3D-Cylinder-Gallery-Package/types";

// 1. Disable SSR for the 3D Canvas component in Next.js
const CylinderGallery = dynamic(
  () =>
    import("../3D-Cylinder-Gallery-Package/CylinderGallery").then(
      (mod) => mod.CylinderGallery
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[650px] sm:h-[780px] md:h-[900px] bg-[#08080a] flex items-center justify-center text-white/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
            Initializing 3D Cylinder Engine...
          </span>
        </div>
      </div>
    ),
  }
);

import caseStudies from "../../content/case-studies.json";

// 2. Map NAVIGO client case studies & high-res mockups into the 3D items prop
export const SHOWCASE_PROJECTS: CylinderGalleryItem[] = caseStudies.map(study => ({
  id: study.slug,
  title: study.title,
  image: study.coverImage,
  domain: study.client.toLowerCase().replace(/\s+/g, '') + '.com',
  category: study.industry,
  link: `/work/${study.slug}`,
  slug: study.slug,
}));

interface WorkGalleryProps {
  items?: CylinderGalleryItem[];
  className?: string;
}

export function WorkGallery({
  items = SHOWCASE_PROJECTS,
  className = "",
}: WorkGalleryProps) {
  const router = useRouter();

  const handleSelect = (item: CylinderGalleryItem) => {
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <section
      id="3d-showcase"
      aria-label="3D Cylindrical Selected Work Showcase"
      className={`relative w-full bg-[#08080a] text-white overflow-hidden py-16 sm:py-24 select-none ${className}`}
    >
      {/* Background Ambience Gradient */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_60%)] pointer-events-none" /> */}

      {/* Top Editorial Header */}
      {/* <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center space-y-4 mb-6 relative z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-300">
            360° INTERACTIVE CYLINDER SHOWCASE
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-spacegrotesk font-black tracking-tight text-white leading-tight">
          CURATED PROJECT ARCHIVES
        </h2>

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
          <MoveHorizontal className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />
          <span>Drag horizontally to rotate • Click any project to inspect case study</span>
        </div>
      </div> */}

      {/* 3D Cylindrical Interactive Canvas */}
      <div className="relative w-full">
        <CylinderGallery
          items={items}
          onItemSelect={handleSelect}
          radius={8.5}
          panelSize={[3.4, 2.15]}
          rows={3}
          colsPerRow={10}
          rowSpacing={2.65}
          autoRotate={true}
          autoRotateSpeed={0.03}
          dragSensitivity={0.0035}
          friction={0.94}
          backgroundColor="#08080a"
          showCenterOverlay={true}
          centerOverlay={
            <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none select-none max-w-lg px-4">

              <h3 className="font-archivo text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                 SELECTED WORK <br />
                <span className="bg-gradient-to-r from-white via-neutral-200 to-amber-200/80 bg-clip-text text-transparent">
                  THAT REFUSE TO BLEND IN
                </span>
              </h3>
              <p className="font-archivo text-xs sm:text-sm text-neutral-400 font-light max-w-sm drop-shadow-md">
                 From ambitious startups to established businesses, we create digital experiences, growth systems, and marketing campaigns that drive measurable results.
              </p>
            </div>
          }
        />
      </div>

      {/* Bottom Floating Hint */}
      {/* <div className="flex items-center justify-center pt-6 text-center">
        <button
          onClick={() => router.push("/work")}
          className="inline-flex items-center gap-2 text-xs font-spacegrotesk uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <span>View Detailed Case Archive Grid</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div> */}
    </section>
  );
}

export default WorkGallery;
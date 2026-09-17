"use client";

import React from "react";
import Link from "next/link";
import WebGLFluidPaint from "../fluid-effect/WebGLFluidPaint";

// ============================================================================
// 🎨 FLUID PAINT BRUSH CONFIGURATION
// Configure how much paint amount to use and its physics behavior:
// ============================================================================
export const FLUID_CONFIG = {
  brushAmount: 0.36, // Thickness/radius of paint brush stroke (0.05 = subtle, 0.4 = bold, 0.8 = massive)
  splatForce: 6200, // Velocity & momentum impulse on drag and click
  dissipation: 0.88, // Paint persistence (0.2 = stays very long, 2.0 = evaporates quickly)
  clickSplatAmount: 6, // Number of colorful paint splashes that burst on click
  curl: 32, // Swirl and vorticity turbulence
  shading: true, // 3D glossy liquid paint shading
  bloom: true, // Vivid paint glow
  bloomIntensity: 0.75, // Glow intensity
  triggerOnHover: true, // Paint trail follows cursor hover
  transparent: true, // Transparent canvas so the clean white background shows through
};

export function Footer() {
  return (
    <footer className="relative w-full min-h-screen bg-white text-black flex flex-col justify-between p-8 sm:p-14 md:p-18 lg:p-24 overflow-hidden select-none">
      {/* 1. INTERACTIVE WEBGL FLUID PAINT BACKGROUND */}
      <WebGLFluidPaint
        brushAmount={FLUID_CONFIG.brushAmount}
        splatForce={FLUID_CONFIG.splatForce}
        dissipation={FLUID_CONFIG.dissipation}
        clickSplatAmount={FLUID_CONFIG.clickSplatAmount}
        curl={FLUID_CONFIG.curl}
        shading={FLUID_CONFIG.shading}
        bloom={FLUID_CONFIG.bloom}
        bloomIntensity={FLUID_CONFIG.bloomIntensity}
        triggerOnHover={FLUID_CONFIG.triggerOnHover}
        transparent={FLUID_CONFIG.transparent}
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
      />

      {/* 2. TOP-LEFT EDITORIAL HEADING */}
      <div className="relative z-10 pt-6 md:pt-12 pointer-events-none">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal font-[family-name:var(--font-spacegrotesk)] tracking-[-0.03em] leading-[1.05] text-neutral-950 max-w-3xl">
          Let’s make something
          <br />
          great together
        </h2>
      </div>

      {/* 3. MID-RIGHT LARGE INTERACTIVE CONTACT LINK */}
      <div className="relative z-10 flex justify-end items-center my-auto py-12 md:py-20 pointer-events-auto">
        <a
          href="mailto:hello@biqmark.com"
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal font-[family-name:var(--font-spacegrotesk)] tracking-[-0.03em] text-neutral-950 hover:opacity-50 transition-opacity cursor-pointer"
        >
          hello@biqmark.com
        </a>
      </div>

      {/* 4. BOTTOM MINIMAL DIRECTORY */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 text-[11px] sm:text-xs font-mono tracking-widest text-neutral-500 uppercase pointer-events-auto">
        <div>© {new Date().getFullYear()} Technical Partner NAVIGOTECH INNOVATION</div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-12 text-neutral-800">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            X / TWITTER
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            LINKEDIN
          </a>
          <Link href="/privacy" className="hover:text-black transition-colors">
            PRIVACY
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
"use client";

import React, { forwardRef } from "react";
import { BallFluid } from "../fluid-effect/BallFluid";

export interface InteractiveOrbProps {
  parentRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveOrb = forwardRef<HTMLDivElement, InteractiveOrbProps>(
  ({ parentRef, className, style }, ref) => {
    return (
      <div
        ref={ref}
        className={
          className ||
          "relative w-[85vw] h-[85vw] sm:w-[65vw] sm:h-[65vw] md:w-[50vw] md:h-[50vw] lg:w-[42vw] lg:h-[42vw] max-w-[620px] max-h-[620px] aspect-square flex items-center justify-center select-none"
        }
        style={style}
      >
        {/* Ambient Soft Outer Glow Bloom */}
        <div className="absolute inset-0 bg-radial from-[#FF9ECF]/45 via-[#FF7A59]/30 to-transparent blur-[70px] lg:blur-[120px] rounded-full scale-110 pointer-events-none" />

        {/* Master Organic Hybrid Blob: Pink → Orange → Peach Gradient Body */}
        <div
          className="relative w-full h-full rounded-[52%_48%_56%_44%/46%_52%_48%_54%] shadow-[0_0_120px_rgba(255,122,89,0.35)] overflow-hidden pointer-events-auto cursor-pointer"
          style={{
            background:
              "radial-gradient(circle at 32% 30%, #FFB5D6 0%, #FF9ECF 28%, #FF7A59 58%, #FF8F60 76%, #FFD6A5 100%)",
          }}
        >
          {/* Enhanced Liquid Fluid Effect on Hover */}
          <BallFluid parentRef={parentRef} />

          {/* Inner Highlight Depth Reflection */}
          <div className="absolute inset-0 bg-radial from-white/25 via-transparent to-black/30 rounded-[inherit] mix-blend-overlay pointer-events-none" />

          {/* Deep Core Texture Layer */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-radial from-[#FF5722]/35 to-transparent blur-2xl rounded-full pointer-events-none" />
        </div>
      </div>
    );
  },
);

InteractiveOrb.displayName = "InteractiveOrb";

export default InteractiveOrb;

"use client";

import dynamic from "next/dynamic";
import React from "react";

const FluidBackground = dynamic(
  () => import("./FluidBackground"),
  { ssr: false }
);

export interface BallFluidProps {
  className?: string;
  style?: React.CSSProperties;
  parentRef?: React.RefObject<HTMLElement | null>;
}

export function BallFluid({ className, style, parentRef }: BallFluidProps) {
  return (
    <div
      className={
        className ||
        "absolute inset-0 w-full h-full pointer-events-auto rounded-[inherit] overflow-hidden mix-blend-screen opacity-95"
      }
      style={style}
    >
      <FluidBackground
        localPointer={true}
        parentRef={parentRef}
        preset="orangeBall"
        usePalette={false}
        fluidColor="#FF9ECF"
        color1="#FF5722"
        color2="#FF8F60"
        backgroundOpacity={0.0}
        fluidBlend={0.92}
        specularIntensity={0.55}
        ambientWave={0.012}
        radius={0.52}
        frequency={28.0}
        distortion={0.38}
        viscosity={0.032}
        speed={1.25}
        trailIntensity={2.4}
        className="w-full h-full pointer-events-auto cursor-pointer"
      />
    </div>
  );
}

export default BallFluid;

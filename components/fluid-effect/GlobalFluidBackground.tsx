"use client";

import dynamic from "next/dynamic";
import React from "react";

const FluidBackground = dynamic(
  () => import("./FluidBackground"),
  { ssr: false }
);

export default function GlobalFluidBackground() {
  return (
    <FluidBackground
      preset="electricCyan"
      fluidColor="#00f0ff"
      color1="#040608"
      color2="#080c10"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

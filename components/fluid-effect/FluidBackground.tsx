"use client";

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import FluidCanvas, { FluidCanvasProps } from './FluidCanvas';

export interface FluidBackgroundProps extends FluidCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  eventSource?: any;
  camera?: any;
  dpr?: number | [number, number];
  gl?: any;
  canvasProps?: Record<string, any>;
}

/**
 * FluidBackground - Drop-in full-screen or container interactive fluid component
 * 
 * Works out-of-the-box with zero Three.js boilerplate needed in the consuming project.
 */
export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  className = 'fixed top-0 left-0 w-full h-full pointer-events-none',
  style,
  zIndex = 0,
  eventSource,
  camera = { position: [0, 0, 1] },
  dpr = [1, 2],
  gl = { antialias: true, alpha: true, powerPreference: 'high-performance' },
  canvasProps = {},

  localPointer = false,
  parentRef,
  preset = 'goldenLuxury',
  color1,
  color2,
  paletteA,
  paletteB,
  paletteC,
  paletteD,
  usePalette,
  fluidColor,
  fluidBlend,
  backgroundOpacity,
  ambientWave,
  radius,
  frequency,
  distortion,
  viscosity,
  trailIntensity,
  decaySpeed,
  speed,
  wiggleFactor,
  specularIntensity,

  ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolved event source: user provided ref/element, or fallback to containerRef
  const activeEventSource = eventSource || containerRef;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ zIndex, ...style }}
      {...restProps}
    >
      <Canvas
        eventSource={activeEventSource}
        camera={camera}
        dpr={dpr}
        gl={gl}
        {...canvasProps}
      >
        <FluidCanvas
          localPointer={localPointer}
          parentRef={parentRef}
          preset={preset}
          color1={color1}
          color2={color2}
          paletteA={paletteA}
          paletteB={paletteB}
          paletteC={paletteC}
          paletteD={paletteD}
          usePalette={usePalette}
          fluidColor={fluidColor}
          fluidBlend={fluidBlend}
          backgroundOpacity={backgroundOpacity}
          ambientWave={ambientWave}
          radius={radius}
          frequency={frequency}
          distortion={distortion}
          viscosity={viscosity}
          trailIntensity={trailIntensity}
          decaySpeed={decaySpeed}
          speed={speed}
          wiggleFactor={wiggleFactor}
          specularIntensity={specularIntensity}
        />
      </Canvas>
    </div>
  );
};

export default FluidBackground;

"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ViscousFluidMaterial';
import { FLUID_PRESETS, PresetKey } from './presets';

// Helper utilities to parse colors and vectors gracefully
const parseColor = (val: string | THREE.Color | undefined, defaultVal: string): THREE.Color => {
  if (!val) return new THREE.Color(defaultVal);
  if (val instanceof THREE.Color) return val;
  try {
    return new THREE.Color(val);
  } catch {
    return new THREE.Color(defaultVal);
  }
};

const parseVec3 = (
  val: [number, number, number] | THREE.Vector3 | undefined,
  defaultVal: [number, number, number]
): THREE.Vector3 => {
  if (!val) return new THREE.Vector3(...defaultVal);
  if (val instanceof THREE.Vector3) return val;
  if (Array.isArray(val) && val.length === 3) return new THREE.Vector3(val[0], val[1], val[2]);
  return new THREE.Vector3(...defaultVal);
};

export interface FluidCanvasProps {
  // Preset selector
  preset?: PresetKey;

  // Localized pointer vs global fullscreen window pointer
  localPointer?: boolean;

  // Optional parent element reference to bind mouse/touch listeners to
  parentRef?: React.RefObject<HTMLElement | null>;

  // Color props
  color1?: string;
  color2?: string;
  paletteA?: [number, number, number];
  paletteB?: [number, number, number];
  paletteC?: [number, number, number];
  paletteD?: [number, number, number];
  usePalette?: boolean;
  fluidColor?: string;
  fluidBlend?: number;
  backgroundOpacity?: number;
  ambientWave?: number;

  // Sizing & geometry props
  radius?: number;
  frequency?: number;
  distortion?: number;

  // Effect & dynamics props
  viscosity?: number;
  trailIntensity?: number;
  decaySpeed?: number;
  speed?: number;
  wiggleFactor?: number;
  specularIntensity?: number;

  [key: string]: any;
}

export const FluidCanvas: React.FC<FluidCanvasProps> = ({
  preset = 'pastel',
  localPointer = false,
  parentRef,
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
  ...meshProps
}) => {
  const materialRef = useRef<any>(null);

  // Global window pointer tracker fallback when pointer-events is none
  const windowPointerRef = useRef({ x: 0.5, y: 0.5, hasMoved: false });
  // Local element pointer tracker when localPointer = true
  const localTargetRef = useRef(new THREE.Vector2(0.5, 0.5));
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || localPointer) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      windowPointerRef.current = {
        x: Math.max(0, Math.min(1, clientX / window.innerWidth)),
        y: Math.max(0, Math.min(1, 1.0 - clientY / window.innerHeight)),
        hasMoved: true,
      };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [localPointer]);

  // Resolve active preset configuration with user prop overrides
  const config = useMemo(() => {
    const base = FLUID_PRESETS[preset] || FLUID_PRESETS.pastel;
    return {
      color1: color1 ?? base.color1,
      color2: color2 ?? base.color2,
      paletteA: paletteA ?? base.paletteA,
      paletteB: paletteB ?? base.paletteB,
      paletteC: paletteC ?? base.paletteC,
      paletteD: paletteD ?? base.paletteD,
      usePalette: usePalette ?? base.usePalette ?? true,
      fluidColor: fluidColor ?? base.fluidColor,
      fluidBlend: fluidBlend ?? base.fluidBlend ?? 0.85,
      backgroundOpacity: backgroundOpacity ?? base.backgroundOpacity ?? 1.0,
      ambientWave: ambientWave ?? base.ambientWave ?? 0.005,
      radius: radius ?? base.radius ?? 0.25,
      frequency: frequency ?? base.frequency ?? 28.0,
      distortion: distortion ?? base.distortion ?? 0.12,
      viscosity: viscosity ?? base.viscosity ?? 0.04,
      trailIntensity: trailIntensity ?? base.trailIntensity ?? 1.0,
      decaySpeed: decaySpeed ?? base.decaySpeed ?? 0.015,
      speed: speed ?? base.speed ?? 1.0,
      wiggleFactor: wiggleFactor ?? base.wiggleFactor ?? 0.65,
      specularIntensity: specularIntensity ?? base.specularIntensity ?? 0.1,
    };
  }, [
    preset,
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
  ]);

  // Memoize Three.js color & vector instances
  const parsedValues = useMemo(() => {
    return {
      color1: parseColor(config.color1, '#eaf7ff'),
      color2: parseColor(config.color2, '#fff2f5'),
      paletteA: parseVec3(config.paletteA, [0.96, 0.96, 0.98]),
      paletteB: parseVec3(config.paletteB, [0.18, 0.15, 0.18]),
      paletteC: parseVec3(config.paletteC, [0.6, 0.5, 0.6]),
      paletteD: parseVec3(config.paletteD, [0.0, 0.33, 0.67]),
      fluidColor: parseColor(config.fluidColor, '#c7e9fb'),
    };
  }, [
    config.color1,
    config.color2,
    config.paletteA,
    config.paletteB,
    config.paletteC,
    config.paletteD,
    config.fluidColor,
  ]);

  // Persistent simulation state outside of React state
  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const intensity = useRef(0);

  const { viewport, size, gl } = useThree();

  // Listen for pointer events on parent element so overlapping elements don't block interaction
  useEffect(() => {
    if (!localPointer) return;

    // Use parentRef if provided, otherwise fallback to window
    const targetElement = parentRef?.current || (typeof window !== 'undefined' ? window : null);
    if (!targetElement) return;

    const handleParentPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const canvasEl = gl.domElement;
      if (!canvasEl) return;

      const rect = canvasEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const relX = (clientX - rect.left) / rect.width;
      const relY = 1.0 - (clientY - rect.top) / rect.height;

      // Distance from center of the circular ball (0.5, 0.5)
      const dx = relX - 0.5;
      const dy = relY - 0.5;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Trigger if cursor is over the circular shape (with generous margin 0.58)
      if (distFromCenter <= 0.58) {
        isHoveredRef.current = true;
        localTargetRef.current.set(
          Math.max(0, Math.min(1, relX)),
          Math.max(0, Math.min(1, relY))
        );
      } else {
        isHoveredRef.current = false;
      }
    };

    const handleParentPointerLeave = () => {
      isHoveredRef.current = false;
    };

    targetElement.addEventListener('mousemove', handleParentPointerMove as EventListener, { passive: true });
    targetElement.addEventListener('touchmove', handleParentPointerMove as EventListener, { passive: true });
    targetElement.addEventListener('mouseleave', handleParentPointerLeave as EventListener);

    return () => {
      targetElement.removeEventListener('mousemove', handleParentPointerMove as EventListener);
      targetElement.removeEventListener('touchmove', handleParentPointerMove as EventListener);
      targetElement.removeEventListener('mouseleave', handleParentPointerLeave as EventListener);
    };
  }, [localPointer, parentRef, gl]);

  useFrame((state) => {
    if (!materialRef.current) return;

    // 1. Synchronize Animation Time & Viewport Sizing Uniforms
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uResolution.set(size.width, size.height);

    // 2. Translate Coordinates (support localized hover or window fallback)
    let targetX = (state.pointer.x + 1) / 2;
    let targetY = (state.pointer.y + 1) / 2;

    if (localPointer) {
      targetX = localTargetRef.current.x;
      targetY = localTargetRef.current.y;
    } else if (windowPointerRef.current.hasMoved) {
      targetX = windowPointerRef.current.x;
      targetY = windowPointerRef.current.y;
    }

    // 3. Fluid Inertia & Drag (Viscosity)
    const drag = Math.max(0.005, Math.min(config.viscosity, 0.5));
    materialRef.current.uMouse.x += (targetX - materialRef.current.uMouse.x) * drag;
    materialRef.current.uMouse.y += (targetY - materialRef.current.uMouse.y) * drag;

    // 4. Track Velocity Delta for Trail Replenishment
    const distanceMoved = materialRef.current.uMouse.distanceTo(prevMouse.current);

    if (localPointer) {
      if (isHoveredRef.current) {
        const targetIntensity =
          distanceMoved > 0.0001 ? config.trailIntensity : config.trailIntensity * 0.75;
        intensity.current = THREE.MathUtils.lerp(
          intensity.current,
          targetIntensity,
          0.1
        );
      } else {
        intensity.current = THREE.MathUtils.lerp(
          intensity.current,
          0.0,
          config.decaySpeed * 1.5
        );
      }
    } else {
      if (distanceMoved > 0.0001) {
        intensity.current = THREE.MathUtils.lerp(
          intensity.current,
          config.trailIntensity,
          0.08
        );
      } else {
        intensity.current = THREE.MathUtils.lerp(
          intensity.current,
          0.0,
          config.decaySpeed
        );
      }
    }

    materialRef.current.uIntensity = intensity.current;
    prevMouse.current.copy(materialRef.current.uMouse);
  });

  return (
    <mesh
      {...meshProps}
      onPointerEnter={(e) => {
        if (localPointer) {
          isHoveredRef.current = true;
          if (e.uv) localTargetRef.current.set(e.uv.x, e.uv.y);
        }
        meshProps.onPointerEnter?.(e);
      }}
      onPointerMove={(e) => {
        if (localPointer) {
          isHoveredRef.current = true;
          if (e.uv) localTargetRef.current.set(e.uv.x, e.uv.y);
        }
        meshProps.onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        if (localPointer) {
          isHoveredRef.current = false;
        }
        meshProps.onPointerLeave?.(e);
      }}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <viscousFluidMaterial
        ref={materialRef}
        transparent={config.backgroundOpacity < 1.0}
        uColor1={parsedValues.color1}
        uColor2={parsedValues.color2}
        uPaletteA={parsedValues.paletteA}
        uPaletteB={parsedValues.paletteB}
        uPaletteC={parsedValues.paletteC}
        uPaletteD={parsedValues.paletteD}
        uUsePalette={config.usePalette ? 1.0 : 0.0}
        uFluidColor={parsedValues.fluidColor}
        uFluidBlend={config.fluidBlend}
        uBackgroundOpacity={config.backgroundOpacity}
        uAmbientWave={config.ambientWave}
        uRadius={config.radius}
        uFrequency={config.frequency}
        uDistortion={config.distortion}
        uSpeed={config.speed}
        uWiggleFactor={config.wiggleFactor}
        uSpecularIntensity={config.specularIntensity}
      />
    </mesh>
  );
};

export { FluidCanvas as FluidMesh };
export default FluidCanvas;

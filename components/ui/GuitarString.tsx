"use client";

import React, { useRef, useEffect, useState, useCallback, useId } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface GuitarStringProps {
  /** Optional extra classes for container styling and margins */
  className?: string;
  /** Height of the interactive hit area in pixels (default: 60) */
  height?: number;
  /** Color of the string at rest (default: "rgba(255, 255, 255, 0.16)") */
  strokeColor?: string;
  /** Color of the string when pulled / vibrating (default: "#00f0ff") */
  activeColor?: string;
  /** Stroke thickness in pixels (default: 1.5) */
  strokeWidth?: number;
  /** Maximum deflection distance from baseline in pixels (default: 42) */
  maxDeflection?: number;
  /** Whether to render subtle technical anchor crosshairs at both ends (default: true) */
  showEndpoints?: boolean;
  /** Whether to render expanding ripple waves on pluck release (default: true) */
  showRipple?: boolean;
  /** Optional micro-badge or label placed subtly above the string */
  label?: string;
  /** Custom callback on pluck release */
  onPluck?: () => void;
}

interface RipplePoint {
  id: number;
  x: number;
  y: number;
}

export function GuitarString({
  className,
  height = 72,
  strokeColor = "rgba(255, 255, 255, 0.18)",
  activeColor = "#00f0ff",
  strokeWidth = 1.5,
  maxDeflection = 38,
  showEndpoints = true,
  showRipple = true,
  label,
  onPluck,
}: GuitarStringProps) {
  const uniqueId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const rippleGroupRef = useRef<SVGGElement>(null);

  const [width, setWidth] = useState<number>(1000);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);

  const centerY = height / 2;

  // Track current bezier control point & visual excitation state
  const pos = useRef({ x: 500, y: centerY, glow: 0 });
  const isHovered = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Measure container width dynamically and handle resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setWidth(rect.width);
          pos.current.x = rect.width / 2;
        }
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update SVG path strings directly via DOM for 60-120fps performance
  const updateSvgPath = useCallback(() => {
    const { x, y, glow } = pos.current;
    const d = `M 0,${centerY} Q ${x},${y} ${width},${centerY}`;

    if (pathRef.current) {
      pathRef.current.setAttribute("d", d);
      if (glow > 0.02) {
        pathRef.current.style.stroke = activeColor;
      } else {
        pathRef.current.style.stroke = strokeColor;
      }
    }

    if (glowPathRef.current) {
      glowPathRef.current.setAttribute("d", d);
      glowPathRef.current.style.opacity = (glow * 0.85).toString();
    }
  }, [width, centerY, activeColor, strokeColor]);

  // Set initial path whenever width or centerY changes
  useEffect(() => {
    pos.current.y = centerY;
    pos.current.x = width / 2;
    updateSvgPath();
  }, [width, centerY, updateSvgPath]);

  // Trigger ripple wave effect at pluck point
  const triggerRipple = (pluckX: number, pluckY: number) => {
    if (!showRipple) return;
    const newId = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-3), { id: newId, x: pluckX, y: pluckY }]);

    // Animate ripple rings in DOM
    setTimeout(() => {
      if (!rippleGroupRef.current) return;
      const elements = rippleGroupRef.current.querySelectorAll(`[data-ripple="${newId}"]`);
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { attr: { r: 2 }, opacity: 0.9, strokeWidth: 2 },
          {
            attr: { r: 50 },
            opacity: 0,
            strokeWidth: 0.5,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out",
            onComplete: () => {
              setRipples((prev) => prev.filter((r) => r.id !== newId));
            },
          }
        );
      }
    }, 10);
  };

  // Pointer move handler (mouse & touch drag)
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    // Calculate clamped displacement from center baseline
    const dy = relY - centerY;
    const clampedDy = Math.max(-maxDeflection, Math.min(maxDeflection, dy));
    const targetY = centerY + clampedDy;
    const clampedX = Math.max(0, Math.min(width, relX));

    // Cancel ongoing return tween
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Smoothly track pointer
    pos.current.x = clampedX;
    gsap.to(pos.current, {
      y: targetY,
      glow: Math.min(1, Math.abs(clampedDy) / (maxDeflection * 0.55)),
      duration: 0.1,
      ease: "power2.out",
      onUpdate: updateSvgPath,
    });
  };

  // Pointer release handler (the pluck!)
  const handlePointerLeave = () => {
    if (!isHovered.current) return;
    isHovered.current = false;

    const pluckX = pos.current.x;
    const pluckY = pos.current.y;
    const displacement = Math.abs(pluckY - centerY);

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Only fire pluck ripple if there was meaningful deflection
    if (displacement > 3) {
      onPluck?.();
      triggerRipple(pluckX, pluckY);
    }

    // Harmonic vibration settling back to baseline (guitar string physics)
    tweenRef.current = gsap.to(pos.current, {
      y: centerY,
      duration: 1.4,
      ease: "elastic.out(1.3, 0.16)",
      onUpdate: updateSvgPath,
    });

    // Fade excitation glow
    gsap.to(pos.current, {
      glow: 0,
      duration: 1.1,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none cursor-pointer group flex items-center justify-center overflow-visible",
        className
      )}
      style={{ height: `${height}px` }}
      onMouseEnter={() => {
        isHovered.current = true;
      }}
      onMouseMove={(e) => {
        isHovered.current = true;
        handlePointerMove(e.clientX, e.clientY);
      }}
      onMouseLeave={handlePointerLeave}
      onTouchStart={() => {
        isHovered.current = true;
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          isHovered.current = true;
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerLeave}
    >
      {/* Optional Top Subtle Technical Label */}
      {label && (
        <span
          className="absolute -top-3 left-4 font-mono text-[9px] uppercase tracking-widest text-neutral-500 opacity-60 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{ color: activeColor }}
        >
          {label}
        </span>
      )}

      {/* SVG String Canvas */}
      <svg
        className="w-full h-full overflow-visible pointer-events-none"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon / Cyan Pluck Glow Filter */}
          <filter id={`string-glow-${uniqueId}`} x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>



        {/* Ambient Bloom/Glow String (Behind) */}
        <path
          ref={glowPathRef}
          d={`M 0,${centerY} Q ${width / 2},${centerY} ${width},${centerY}`}
          stroke={activeColor}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          filter={`url(#string-glow-${uniqueId})`}
          style={{
            opacity: 0,
            transition: "opacity 0.05s ease-out",
          }}
        />

        {/* Core Crisp String */}
        <path
          ref={pathRef}
          d={`M 0,${centerY} Q ${width / 2},${centerY} ${width},${centerY}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            transition: "stroke 0.15s ease-out",
          }}
        />

        {/* Subtle Anchor Endpoints / Technical Crosshairs */}
        {showEndpoints && (
          <>
            {/* Left Anchor */}
            <g
              className="opacity-40 group-hover:opacity-100 transition-all duration-300"
              style={{ color: activeColor }}
            >
              <circle cx={0} cy={centerY} r={2} fill={activeColor} />
              <line
                x1={0}
                y1={centerY - 4}
                x2={0}
                y2={centerY + 4}
                stroke="currentColor"
                strokeWidth={1}
              />
            </g>

            {/* Right Anchor */}
            <g
              className="opacity-40 group-hover:opacity-100 transition-all duration-300"
              style={{ color: activeColor }}
            >
              <circle cx={width} cy={centerY} r={2} fill={activeColor} />
              <line
                x1={width}
                y1={centerY - 4}
                x2={width}
                y2={centerY + 4}
                stroke="currentColor"
                strokeWidth={1}
              />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}

export default GuitarString;

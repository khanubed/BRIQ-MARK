"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHover;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
varying vec2 vUv;

void main() {
  // Calculate object-fit: cover logic
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
  );
  
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
  
  // Water ripple math
  // Distort the UV coordinates using sin/cos waves driven by uTime
  float frequency = 12.0;
  float amplitude = 0.03;
  
  vec2 distortion = vec2(
    sin(uv.y * frequency + uTime) * amplitude,
    cos(uv.x * frequency + uTime) * amplitude
  );
  
  // Add a slight zoom effect on hover
  uv -= 0.5;
  uv *= 1.0 - (uHover * 0.05);
  uv += 0.5;
  
  // Apply distortion only when hovered
  vec4 color = texture2D(uTexture, uv + (distortion * uHover));
  
  gl_FragColor = color;
}
`;

const WaterMaterial = ({ src }: { src: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const [hovered, setHover] = useState(false);
  const { size } = useThree();
  
  // Enable better texture sampling
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
  }, [texture]);
  
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(texture.image.width || 1, texture.image.height || 1) }
    }),
    [texture]
  );

  // Update resolutions on resize
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      if (texture.image) {
        materialRef.current.uniforms.uImageResolution.value.set(texture.image.width, texture.image.height);
      }
    }
  }, [size, texture]);

  useFrame((state) => {
    if (materialRef.current) {
      // Smoothly animate time
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 2.5;
      
      // Smoothly interpolate hover state
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        hovered ? 1 : 0,
        0.08
      );
    }
  });

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Plane spanning exact bounds in orthographic camera */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface WaterImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function WaterImage({ src, alt, className }: WaterImageProps) {
  return (
    <div className={cn("relative overflow-hidden group cursor-pointer", className)}>
      <Canvas 
        orthographic 
        camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1 }}
        gl={{ antialias: true, alpha: true }}
      >
        <React.Suspense fallback={null}>
          <WaterMaterial src={src} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

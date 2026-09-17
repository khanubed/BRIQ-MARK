import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

/**
 * ViscousFluidMaterial - Custom WebGL Shader Material
 * 
 * Exposes configurable uniforms for colors, effect sizing, distortion,
 * viscosity, and specular lighting.
 */
export const ViscousFluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0,

    // Color Uniforms
    uColor1: new THREE.Color(0.02, 0.03, 0.04),
    uColor2: new THREE.Color(0.04, 0.06, 0.08),
    uPaletteA: new THREE.Vector3(0.15, 0.2, 0.26),
    uPaletteB: new THREE.Vector3(0.2, 0.45, 0.55),
    uPaletteC: new THREE.Vector3(0.6, 0.9, 1.1),
    uPaletteD: new THREE.Vector3(0.0, 0.25, 0.5),
    uUsePalette: 1.0,
    uFluidColor: new THREE.Color(0.0, 0.94, 1.0),
    uFluidBlend: 0.95,
    uBackgroundOpacity: 1.0,
    uAmbientWave: 0.003,

    // Sizing & Geometry Uniforms
    uRadius: 0.28,
    uFrequency: 28.0,
    uDistortion: 0.15,

    // Dynamics Uniforms
    uSpeed: 1.05,
    uWiggleFactor: 0.65,
    uSpecularIntensity: 0.45,
  },

  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  // Fragment Shader
  /* glsl */ `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uIntensity;

    // Color controls
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uPaletteA;
    uniform vec3 uPaletteB;
    uniform vec3 uPaletteC;
    uniform vec3 uPaletteD;
    uniform float uUsePalette;
    uniform vec3 uFluidColor;
    uniform float uFluidBlend;
    uniform float uBackgroundOpacity;
    uniform float uAmbientWave;

    // Sizing & deformation controls
    uniform float uRadius;
    uniform float uFrequency;
    uniform float uDistortion;

    // Dynamics controls
    uniform float uSpeed;
    uniform float uWiggleFactor;
    uniform float uSpecularIntensity;

    varying vec2 vUv;

    // Cosine-based spectrum palette generator
    vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
      return a + b * cos( 6.28318 * (c * t + d) );
    }

    void main() {
      // Prevent division by zero during early ticks
      float resY = max(uResolution.y, 0.001);
      
      // Aspect ratio correction keeps the fluid cursor perfectly circular
      vec2 aspect = vec2(uResolution.x / resY, 1.0);
      vec2 st = vUv * aspect;
      vec2 mouse = uMouse * aspect;

      // Distance from pixel to interactive mouse
      float dist = distance(st, mouse);
      
      // Pull mask driven by configurable radius
      float maxRadius = max(uRadius, 0.001);
      float pull = smoothstep(maxRadius, 0.0, dist); 
      pull *= uIntensity;

      // Serpentine Ribbon mathematics (configurable frequency and speed)
      float wiggle = sin(dist * uFrequency - uTime * 1.5 * uSpeed);
      vec2 snakeWiggle = vec2(cos(wiggle), sin(wiggle));

      // Directional vector away from mouse
      vec2 dir = normalize(st - mouse + vec2(0.0001));
      
      // Blend straight push vector with snake curves
      dir = normalize(mix(dir, snakeWiggle, clamp(uWiggleFactor, 0.0, 1.0))); 
      
      // Apply displacement factor to UV coordinates
      vec2 warpedUV = st - (dir * pull * uDistortion);

      // Multi-Layered Domain Warping
      vec2 q = vec2(0.0);
      q.x = sin(warpedUV.y * 4.0 + uTime * 0.1 * uSpeed);
      q.y = sin(warpedUV.x * 4.0 + uTime * 0.1 * uSpeed);

      vec2 r = vec2(0.0);
      r.x = sin((warpedUV.y + q.y) * 5.0 + uTime * 0.15 * uSpeed);
      r.y = sin((warpedUV.x + q.x) * 5.0 + uTime * 0.15 * uSpeed);

      // Secondary loop distortions
      warpedUV += r * (0.02 + pull * 0.15); 

      // Environment Background Layer
      vec3 baseGradient = mix(uColor1, uColor2, clamp(vUv.x + vUv.y - 0.5, 0.0, 1.0));
      
      // Ambient fluid drifting
      baseGradient += sin(vUv.x * 6.0 + uTime * 0.2 * uSpeed) * uAmbientWave;

      // Satin specular highlights
      vec3 normalVec = normalize(vec3(q.x - r.y, q.y - r.x, 1.0));
      vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
      float spec = pow(max(dot(reflect(-lightDir, normalVec), vec3(0.0, 0.0, 1.0)), 0.0), 16.0);

      // Determine fluid ripple color: strictly steel greyish and electric cyan (no pink, no tennis green)
      vec3 activeFluidColor;
      vec3 steelGrey = vec3(0.50, 0.56, 0.64);
      vec3 electricCyan = uFluidColor; // #00f0ff electric cyan
      
      if (uUsePalette > 0.5) {
        float colorDriver = length(q) * 0.7 + length(r) * 0.4 + warpedUV.x - uTime * 0.04 * uSpeed;
        float blendFactor = clamp(sin(colorDriver * 3.5) * 0.5 + 0.5, 0.0, 1.0);
        activeFluidColor = mix(steelGrey, electricCyan, blendFactor);
      } else {
        float colorDriver = length(q) * 0.5 + length(r) * 0.5;
        activeFluidColor = mix(electricCyan, steelGrey, colorDriver * 0.65);
      }
      
      // Add specular reflections on top of fluid trail
      activeFluidColor += vec3(spec * uSpecularIntensity) * pull;

      // Final blended pixel color
      vec3 finalColor = mix(baseGradient, activeFluidColor, pull * clamp(uFluidBlend, 0.0, 1.0));

      // Calculate opacity for transparent background support
      float alpha = mix(clamp(uBackgroundOpacity, 0.0, 1.0), 1.0, pull);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Register custom shader material component with React Three Fiber
extend({ ViscousFluidMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    viscousFluidMaterial: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      viscousFluidMaterial: any;
    }
  }
}

export default ViscousFluidMaterial;

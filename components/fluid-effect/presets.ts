/**
 * Pre-configured visual presets for the Interactive Fluid Effect.
 */

export interface FluidPreset {
  name: string;
  color1: string;
  color2: string;
  paletteA: [number, number, number];
  paletteB: [number, number, number];
  paletteC: [number, number, number];
  paletteD: [number, number, number];
  usePalette: boolean;
  fluidColor: string;
  fluidBlend: number;
  specularIntensity: number;
  ambientWave: number;
  speed: number;
  radius: number;
  frequency: number;
  distortion: number;
  viscosity: number;
  backgroundOpacity?: number;
  trailIntensity?: number;
  decaySpeed?: number;
  wiggleFactor?: number;
}

export type PresetKey =
  | 'electricCyan'
  | 'pastel'
  | 'darkNeon'
  | 'cyberpunk'
  | 'deepOcean'
  | 'aurora'
  | 'goldenLuxury'
  | 'monochrome'
  | 'sunsetEmber'
  | 'orangeBall';

export const FLUID_PRESETS: Record<PresetKey, FluidPreset> = {
  // Orange Sunset Ball Preset (Tailored for About Section 3D Spherical Blob)
  orangeBall: {
    name: 'Sunset Orange Ball',
    color1: '#FF5722',
    color2: '#FF7A59',
    paletteA: [0.65, 0.25, 0.2],
    paletteB: [0.5, 0.35, 0.2],
    paletteC: [1.0, 0.7, 0.4],
    paletteD: [0.1, 0.25, 0.5],
    usePalette: false,
    fluidColor: '#FFD6A5',
    fluidBlend: 0.95,
    specularIntensity: 0.65,
    ambientWave: 0.004,
    speed: 1.1,
    radius: 0.35,
    frequency: 24.0,
    distortion: 0.18,
    viscosity: 0.045,
    backgroundOpacity: 0.0,
    trailIntensity: 1.3,
  },
  // 0. Primary Electric Cyan & Concrete Grey
  electricCyan: {
    name: 'Electric Cyan & Steel Grey',
    color1: '#040608',
    color2: '#080c10',
    paletteA: [0.15, 0.2, 0.26],
    paletteB: [0.2, 0.45, 0.55],
    paletteC: [0.6, 0.9, 1.1],
    paletteD: [0.0, 0.25, 0.5],
    usePalette: true,
    fluidColor: '#00f0ff',
    fluidBlend: 0.95,
    specularIntensity: 0.45,
    ambientWave: 0.003,
    speed: 1.05,
    radius: 0.3,
    frequency: 28.0,
    distortion: 0.16,
    viscosity: 0.042,
  },

  // 1. Original RealXR Soft Pastel Theme (Light Mode)
  pastel: {
    name: 'Pastel Dream (Original)',
    color1: '#eaf7ff',
    color2: '#fff2f5',
    paletteA: [0.96, 0.96, 0.98],
    paletteB: [0.18, 0.15, 0.18],
    paletteC: [0.6, 0.5, 0.6],
    paletteD: [0.0, 0.33, 0.67],
    usePalette: true,
    fluidColor: '#c7e9fb',
    fluidBlend: 0.85,
    specularIntensity: 0.1,
    ambientWave: 0.005,
    speed: 1.0,
    radius: 0.25,
    frequency: 28.0,
    distortion: 0.12,
    viscosity: 0.04,
  },

  // 2. Ultra-Sleek Dark Neon
  darkNeon: {
    name: 'Dark Neon',
    color1: '#07090e',
    color2: '#0b121e',
    paletteA: [0.15, 0.25, 0.35],
    paletteB: [0.4, 0.6, 0.8],
    paletteC: [0.8, 1.2, 1.0],
    paletteD: [0.2, 0.5, 0.8],
    usePalette: true,
    fluidColor: '#00f0ff',
    fluidBlend: 0.95,
    specularIntensity: 0.35,
    ambientWave: 0.003,
    speed: 1.1,
    radius: 0.28,
    frequency: 32.0,
    distortion: 0.16,
    viscosity: 0.045,
  },

  // 3. Cyberpunk High-Energy Magenta & Cyan
  cyberpunk: {
    name: 'Cyberpunk',
    color1: '#09040e',
    color2: '#160826',
    paletteA: [0.4, 0.1, 0.45],
    paletteB: [0.55, 0.3, 0.6],
    paletteC: [1.2, 0.8, 1.4],
    paletteD: [0.7, 0.1, 0.9],
    usePalette: true,
    fluidColor: '#ff007f',
    fluidBlend: 0.92,
    specularIntensity: 0.4,
    ambientWave: 0.006,
    speed: 1.3,
    radius: 0.3,
    frequency: 30.0,
    distortion: 0.18,
    viscosity: 0.05,
  },

  // 4. Bioluminescent Deep Ocean
  deepOcean: {
    name: 'Deep Ocean',
    color1: '#020b14',
    color2: '#051829',
    paletteA: [0.05, 0.2, 0.3],
    paletteB: [0.2, 0.5, 0.6],
    paletteC: [0.5, 0.8, 1.2],
    paletteD: [0.1, 0.4, 0.7],
    usePalette: true,
    fluidColor: '#00e1d9',
    fluidBlend: 0.9,
    specularIntensity: 0.3,
    ambientWave: 0.004,
    speed: 0.85,
    radius: 0.32,
    frequency: 24.0,
    distortion: 0.14,
    viscosity: 0.035,
  },

  // 5. Northern Aurora
  aurora: {
    name: 'Northern Aurora',
    color1: '#030d0a',
    color2: '#081a18',
    paletteA: [0.1, 0.35, 0.25],
    paletteB: [0.3, 0.6, 0.45],
    paletteC: [0.9, 1.1, 0.8],
    paletteD: [0.3, 0.7, 0.5],
    usePalette: true,
    fluidColor: '#00ffaa',
    fluidBlend: 0.88,
    specularIntensity: 0.25,
    ambientWave: 0.007,
    speed: 0.9,
    radius: 0.35,
    frequency: 22.0,
    distortion: 0.15,
    viscosity: 0.038,
  },

  // 6. Golden Amber Luxury (Tailored for NAVIGO Brand)
  goldenLuxury: {
    name: 'Golden Luxury',
    color1: '#08080a',
    color2: '#12100d',
    paletteA: [0.35, 0.28, 0.12],
    paletteB: [0.5, 0.38, 0.18],
    paletteC: [0.7, 0.6, 0.4],
    paletteD: [0.1, 0.2, 0.3],
    usePalette: true,
    fluidColor: '#f5c064',
    fluidBlend: 0.92,
    specularIntensity: 0.45,
    ambientWave: 0.003,
    speed: 0.95,
    radius: 0.28,
    frequency: 26.0,
    distortion: 0.14,
    viscosity: 0.035,
  },

  // 7. Minimal Monochrome Liquid Metal
  monochrome: {
    name: 'Monochrome Liquid Metal',
    color1: '#08080a',
    color2: '#141417',
    paletteA: [0.35, 0.35, 0.38],
    paletteB: [0.25, 0.25, 0.28],
    paletteC: [0.8, 0.8, 0.8],
    paletteD: [0.0, 0.0, 0.0],
    usePalette: true,
    fluidColor: '#ffffff',
    fluidBlend: 0.8,
    specularIntensity: 0.55,
    ambientWave: 0.002,
    speed: 0.8,
    radius: 0.24,
    frequency: 34.0,
    distortion: 0.11,
    viscosity: 0.032,
  },

  // 8. Sunset Ember
  sunsetEmber: {
    name: 'Sunset Ember',
    color1: '#0d0408',
    color2: '#1c0812',
    paletteA: [0.45, 0.15, 0.2],
    paletteB: [0.6, 0.25, 0.2],
    paletteC: [0.9, 0.5, 0.4],
    paletteD: [0.9, 0.2, 0.4],
    usePalette: true,
    fluidColor: '#ff4d4d',
    fluidBlend: 0.92,
    specularIntensity: 0.3,
    ambientWave: 0.005,
    speed: 1.1,
    radius: 0.28,
    frequency: 28.0,
    distortion: 0.15,
    viscosity: 0.04,
  },
};

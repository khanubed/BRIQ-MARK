# 🌊 Interactive Viscous Fluid Canvas Module

A high-performance, GPU-accelerated interactive WebGL liquid simulation for React and Next.js applications. Features realistic viscous drag, customizable serpentine ribbons, domain warping, satin specular reflections, and responsive viewport sizing.

---

## 📦 Quick Installation in Another Project

### 1. Install Peer Dependencies
In your destination project, run:

```bash
npm install three @react-three/fiber @react-three/drei
```
*(or `yarn add` / `pnpm add` / `bun add`)*

### 2. Copy Module Folder
Simply copy the entire `fluid-effect/` folder into your project (for example into `src/components/fluid-effect/`).

---

## 🚀 Quick Start Examples

### Example 1: Drop-in Fullscreen Background
```jsx
import React from 'react';
import FluidBackground from './components/fluid-effect';

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Interactive 3D Background */}
      <FluidBackground preset="darkNeon" />

      {/* Your Page Content */}
      <main className="relative z-10 p-10">
        <h1 className="text-4xl font-bold">Hello World</h1>
      </main>
    </div>
  );
}
```

### Example 2: Custom Colors & Sizing
```jsx
import React from 'react';
import { FluidBackground } from './components/fluid-effect';

export default function CustomHero() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl">
      <FluidBackground
        className="absolute inset-0 w-full h-full"
        // Colors
        color1="#040914"
        color2="#0a182d"
        fluidColor="#00f2fe"
        usePalette={false}
        // Size & Ripple
        radius={0.35}       // Larger ripple radius
        frequency={36.0}    // Tighter wave ripples
        distortion={0.18}   // Stronger liquid push
        // Dynamics
        viscosity={0.05}    // Tracking drag
        speed={1.2}         // Animation speed
        specularIntensity={0.4}
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <h2 className="text-3xl text-white font-semibold">Interactive Fluid Card</h2>
      </div>
    </div>
  );
}
```

### Example 3: Using Inside an Existing `<Canvas>`
If your project already has a React Three Fiber `<Canvas>`, use `FluidCanvas` (or `FluidMesh`):

```jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FluidCanvas } from './components/fluid-effect';

export default function MyScene() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <FluidCanvas preset="cyberpunk" radius={0.28} />
    </Canvas>
  );
}
```

### Example 4: Next.js (App Router or Pages Router)
Because WebGL requires the browser window, import it dynamically with `ssr: false`:

```jsx
'use client';
import dynamic from 'next/dynamic';

const FluidBackground = dynamic(
  () => import('@/components/fluid-effect'),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <FluidBackground preset="deepOcean" />
      <div className="relative z-10">Next.js Content</div>
    </main>
  );
}
```

---

## 🎨 Built-in Presets

Pass any preset name to the `preset` prop:

| Preset Name | Description | Default Colors |
| :--- | :--- | :--- |
| `pastel` *(Default)* | Soft pearlescent iridescent liquid | Pastel Cyan (`#eaf7ff`) & Pastel Blush (`#fff2f5`) |
| `darkNeon` | High-contrast modern dark mode with electric glow | Obsidian (`#07090e`) & Cyber Blue (`#00f0ff`) |
| `cyberpunk` | Vibrant magenta, deep violet & neon highlights | Deep Purple (`#09040e`) & Hot Pink (`#ff007f`) |
| `deepOcean` | Bioluminescent deep marine glow | Midnight Navy (`#020b14`) & Aquamarine (`#00e1d9`) |
| `aurora` | Emerald & teal northern lights trails | Forest Midnight (`#030d0a`) & Aurora Green (`#00ffaa`) |
| `goldenLuxury` | Warm champagne, amber & 24k gold sheen | Dark Charcoal (`#0d0b08`) & Radiant Gold (`#f5c064`) |
| `monochrome` | Silky chrome, mercury & liquid platinum | Dark Slate (`#0d0d0f`) & Pure White (`#ffffff`) |
| `sunsetEmber` | Burning crimson, twilight coral & violet | Deep Plum (`#120509`) & Flame Coral (`#ff4d4d`) |

```jsx
<FluidBackground preset="goldenLuxury" />
```

---

## ⚙️ Props & Variables Reference

You can override any variable on `<FluidBackground>` or `<FluidCanvas>`:

### 🌈 Color & Appearance Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `preset` | `string` | `'pastel'` | Built-in preset theme. |
| `color1` | `string` | Preset value | Top-left background gradient color (hex/rgb). |
| `color2` | `string` | Preset value | Bottom-right background gradient color (hex/rgb). |
| `fluidColor` | `string` | Preset value | Accent fluid color used for highlights and direct tinting. |
| `usePalette` | `boolean` | `true` | If `true`, generates procedural multi-hue cosine spectrum colors. If `false`, blends smoothly with `fluidColor`. |
| `fluidBlend` | `number` | `0.85` | Opacity/contrast of the fluid trail over the background (0.0 to 1.0). |
| `backgroundOpacity`| `number` | `1.0` | Background canvas opacity. Set `< 1.0` (e.g. `0.0`) to overlay fluid on existing HTML elements. |
| `ambientWave` | `number` | `0.005` | Subtle idle background liquid drifting motion. |
| `paletteA`..`D` | `[r, g, b]` | Preset values | Custom cosine gradient formula vectors: `a + b*cos(2π(c*t + d))`. |

### 📐 Size & Geometry Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `radius` | `number` | `0.25` | Fluid footprint radius. Increase (e.g. `0.4`) for large ripples, decrease (e.g. `0.15`) for sharp trails. |
| `frequency` | `number` | `28.0` | Serpentine ribbon wave density. Lower = soft rolling swells; Higher = tight silk wrinkles. |
| `distortion` | `number` | `0.12` | Liquid UV displacement pull force. Higher values create dramatic swirls and whirlpools. |

### ⚡ Dynamics & Physics Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `viscosity` | `number` | `0.04` | Cursor follow inertia lag. Low (`0.01`) = heavy molasses/oil; High (`0.1`) = fast watery ripple. |
| `trailIntensity` | `number` | `1.0` | Peak brightness multiplier reached when cursor moves. |
| `decaySpeed` | `number` | `0.015` | How quickly the fluid trail flattens out after cursor stops. |
| `speed` | `number` | `1.0` | Global animation time rate. |
| `wiggleFactor` | `number` | `0.65` | Ratio between direct mouse push (0.0) and serpentine snake wiggles (1.0). |
| `specularIntensity` | `number` | `0.1` | Shiny satin matte-glass specular light glint. |

### 🖥️ Container & Canvas Props (`<FluidBackground>` only)
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `'fixed top-0 left-0 w-full h-full pointer-events-none'` | Outer container CSS class names. |
| `style` | `object` | `{}` | Inline styles applied to the outer container. |
| `zIndex` | `number` | `0` | CSS z-index of the container. |
| `eventSource` | `ref \| Element` | `containerRef` | Target DOM element for mouse/pointer tracking. |
| `camera` | `object` | `{ position: [0, 0, 1] }` | Three.js camera options. |
| `dpr` | `number \| [min, max]`| `[1, 2]` | Device Pixel Ratio clamp for high-DPI displays. |
| `gl` | `object` | `{ antialias: true, alpha: true }` | WebGLRenderer configuration options. |

---

## 🛠️ File Structure

```
fluid-effect/
├── index.js                  # Main export entry
├── FluidBackground.jsx       # Complete Canvas + Container drop-in wrapper
├── FluidCanvas.jsx           # R3F Mesh for existing Three.js Canvas
├── ViscousFluidMaterial.jsx  # Configurable Three.js GLSL Shader Material
├── presets.js                # 8 visual color & physics presets
└── README.md                 # Complete documentation & usage guide
```

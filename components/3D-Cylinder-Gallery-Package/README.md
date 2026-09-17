# 🪐 3D Cylinder / Sphere Gallery Effect

A high-performance, interactive 3D cylindrical project showcase inspired by Squarespace and modern portfolio experiences. Built with **React**, **Three.js**, and **React Three Fiber**.

---

## ✨ Features

- **🌀 3D Staggered Brick Cylinder**: Mathematically positioned cards aligned radially in a cylinder dome.
- **📱 Smart Mobile Scroll Passthrough**: Solves the classic 3D canvas trap on mobile. Horizontal gestures spin the gallery, while vertical gestures scroll the webpage naturally.
- **🏎️ Smooth Momentum & Physics**: Inertial damping (friction), drag sensitivity, and passive auto-rotation when idle.
- **🎨 Built-in Procedural Fallbacks**: If an image URL is loading, missing, or fails, a dark macOS-style browser window mockup is generated on-the-fly via HTML5 canvas.
- **⚡ Texture Memory Caching**: Global LRU texture cache prevents re-allocation or memory leaks when repeating cards.
- **🏷️ Interactive Hover Pills**: Floating domain badges with smooth scale lerping.
- **🎛️ 100% Configurable**: Customize radius, card dimensions, row counts, physics, auto-rotate speeds, or replace the center overlay entirely.
- **📦 Single-File or Modular**: Use `CylinderGallery.standalone.tsx` as a single drop-in file or import the modular package.

---

## 📦 1. Peer Dependencies

In your target project, run:

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

*(Optional: Tailwind CSS for classes. If you don't use Tailwind, standard CSS classes or inline styles work as well).*

---

## 🚀 2. Quick Start

### Option A: Single-File Drop-in (Fastest)
Copy `CylinderGallery.standalone.tsx` directly into your project's `components/` directory as `CylinderGallery.tsx`.

```tsx
import React from "react";
import { CylinderGallery } from "@/components/CylinderGallery";

export default function MyPortfolio() {
  return (
    <div className="w-full h-screen bg-black">
      <CylinderGallery />
    </div>
  );
}
```

---

## 🛠️ 3. Usage with Custom Projects

```tsx
import React from "react";
import { CylinderGallery, type CylinderGalleryItem } from "@/components/CylinderGallery";

const myProjects: CylinderGalleryItem[] = [
  {
    id: "1",
    title: "AI Studio",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    domain: "aistudio.io",
    link: "https://aistudio.io",
  },
  {
    id: "2",
    title: "E-Commerce Experience",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    domain: "shopluxury.com",
    link: "https://shopluxury.com",
  },
  {
    id: "3",
    title: "Fintech Platform",
    image: "/images/mockup-fintech.webp", // local asset or public path
    domain: "payflow.finance",
    link: "https://payflow.finance",
  },
];

export default function ShowcaseSection() {
  const handleSelect = (item: CylinderGalleryItem) => {
    console.log("Clicked:", item);
    // e.g. navigate to case study page
  };

  return (
    <section className="relative w-full h-[850px] bg-black">
      <CylinderGallery
        items={myProjects}
        onItemSelect={handleSelect}
        centerHeading="Featured Work"
        centerBrand="Acme Agency"
        radius={9.0}
        panelSize={[3.5, 2.2]}
        autoRotate={true}
        autoRotateSpeed={0.035}
      />
    </section>
  );
}
```

---

## ⚡ 4. Next.js Integration (App Router & Pages Router)

Because Three.js uses the browser `window` and WebGL context, in Next.js you should disable Server-Side Rendering (SSR) for the 3D Canvas component:

```tsx
// app/showcase/page.tsx
'use client';

import dynamic from 'next/dynamic';

const CylinderGallery = dynamic(
  () => import('@/components/CylinderGallery').then((mod) => mod.CylinderGallery),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[750px] bg-black flex items-center justify-center text-white/40">
        Loading 3D Experience...
      </div>
    ),
  }
);

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-black">
      <CylinderGallery />
    </main>
  );
}
```

---

## 📖 5. Props API Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `CylinderGalleryItem[]` | Demo items | Array of project items to display on cards |
| `onItemSelect` | `(item) => void` | `undefined` | Callback fired when a card is clicked |
| `radius` | `number` | `8.5` | Radius of the cylinder (distance from camera to cards) |
| `panelSize` | `[number, number]` | `[3.4, 2.15]` | Size of each card `[width, height]` in 3D units |
| `rows` | `number` | `3` | Number of vertical card rings in the cylinder |
| `colsPerRow` | `number` | `10` | Number of cards in each circular horizontal ring |
| `rowSpacing` | `number` | `2.65` | Vertical distance between rows |
| `autoRotate` | `boolean` | `true` | Enables passive continuous auto-rotation |
| `autoRotateSpeed` | `number` | `0.035` | Rotation velocity (radians/sec) |
| `dragSensitivity`| `number` | `0.0035` | Mouse / Touch pointer drag sensitivity |
| `friction` | `number` | `0.94` | Momentum damping factor per frame (0 to 1) |
| `idleDelay` | `number` | `1.8` | Seconds of inactivity before auto-rotation resumes |
| `hoverScale` | `number` | `1.14` | Scale multiplier when hovering over a card |
| `fov` | `number` | `70` | Perspective camera Field of View |
| `backgroundColor`| `string` | `"#000000"` | Background color for canvas |
| `showCenterOverlay`| `boolean` | `true` | Toggles visibility of center floating text |
| `centerHeading` | `string` | `"Made with"` | Top headline in center overlay |
| `centerBrand` | `string` | `"Showcase"` | Highlighted bottom headline (gradient text) |
| `centerOverlay` | `ReactNode` | `undefined` | Custom React element to replace center text |
| `children` | `ReactNode` | `undefined` | Custom DOM elements layered over the 3D scene |
| `className` | `string` | `""` | Container CSS classes |

---

## 📋 Item Schema (`CylinderGalleryItem`)

```ts
export interface CylinderGalleryItem {
  id?: string | number;
  title: string;              // Card title (also used in fallback canvas)
  image?: string;              // Primary image URL / imported WebP
  imageUrl?: string;           // Fallback alias for image
  coverImage?: string;         // Fallback alias for image
  domain?: string;             // Displayed on hover pill (e.g. "acme.com")
  link?: string;               // URL opened on click
  url?: string;                // URL opened on click
  category?: string;           // Optional category badge
  onClick?: (item) => void;    // Optional click handler
  [key: string]: any;
}
```

---

## 💡 Custom Center Overlay Example

```tsx
<CylinderGallery
  centerOverlay={
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
        Interactive 3D
      </span>
      <h1 className="text-5xl font-extrabold text-white">Client Portfolio</h1>
      <button className="pointer-events-auto mt-4 px-6 py-2 rounded-full bg-white text-black font-semibold text-sm">
        Explore Work
      </button>
    </div>
  }
/>
```

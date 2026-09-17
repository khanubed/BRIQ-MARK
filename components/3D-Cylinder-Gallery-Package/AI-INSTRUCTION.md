# 🤖 AI / IDE Integration Instructions for 3D Cylinder Gallery

> **For the AI Coding Assistant / Developer in this project:**
> This folder contains a production-ready, interactive **3D Cylindrical Gallery Showcase** (built with Three.js and React Three Fiber). Follow the instructions below to integrate it seamlessly into this codebase.

---

## 1. Required Dependencies
Run the following in the target project root:

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

*(If using Lucide icons, `npm install lucide-react` if not already installed).*

---

## 2. Framework-Specific Integration

### If this is a **Next.js** project (App Router or Pages Router):
Three.js uses WebGL and the browser `window` object, so it **must not** run during server-side pre-rendering (SSR).

Use `next/dynamic` with `{ ssr: false }` and `'use client'`:

```tsx
'use client';

import dynamic from 'next/dynamic';
import type { CylinderGalleryItem } from './types'; // or wherever placed

// Disable SSR for the 3D Canvas
const CylinderGallery = dynamic(
  () => import('./CylinderGallery').then((mod) => mod.CylinderGallery),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[700px] bg-black flex items-center justify-center text-white/40">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest">Loading 3D Experience...</span>
        </div>
      </div>
    ),
  }
);
```

### If this is a **Vite / standard React** project:
Import directly:
```tsx
import { CylinderGallery } from './CylinderGallery';
```

---

## 3. How to Map Data to `CylinderGallery`

The component accepts an array of items satisfying `CylinderGalleryItem`:

```ts
export interface CylinderGalleryItem {
  id?: string | number;
  title: string;          // Heading on the card & procedural fallback
  image?: string;          // Main image screenshot / mockup (URL or imported WebP/PNG)
  domain?: string;         // Domain pill shown on hover (e.g. "myclient.com")
  link?: string;           // Optional link opened on click
  category?: string;       // Optional category tag
  onClick?: (item) => void;// Optional click handler
}
```

### Example mapping from JSON / CMS / local data:
```tsx
const galleryItems = caseStudies.map((item) => ({
  id: item.id || item.slug,
  title: item.title,
  image: item.coverImage || item.thumbnail || item.image,
  domain: item.clientUrl || item.domain || `${item.slug}.com`,
  link: `/work/${item.slug}`,
  category: item.category || item.industry,
}));

<CylinderGallery
  items={galleryItems}
  onItemSelect={(selected) => {
    // Navigate or open modal
    router.push(selected.link);
  }}
/>
```

---

## 4. Customizing the Center Floating Headline

You can customize the headline in two ways:

### Option A: Using Props
```tsx
<CylinderGallery
  centerHeading="Featured Work"
  centerBrand="Digital Agency"
/>
```

### Option B: Providing a Custom React Node
```tsx
<CylinderGallery
  centerOverlay={
    <div className="flex flex-col items-center text-center gap-3">
      <span className="px-3 py-1 text-xs font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
        CASE STUDIES
      </span>
      <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
        PROVEN RESULTS
      </h2>
      <p className="text-sm text-neutral-400 max-w-md">
        Drag horizontally to explore client work.
      </p>
    </div>
  }
/>
```

---

## 5. Mobile Touch Behavior (Scroll Passthrough)
This component includes built-in directional gesture recognition:
- **Vertical swipes** will naturally scroll the user down your webpage.
- **Horizontal swipes** will grab and spin the 3D cylinder.
- This prevents mobile users from getting trapped inside the 3D canvas!

---

## 6. Key Configurable Props Reference

| Prop | Default | Purpose |
| :--- | :--- | :--- |
| `radius` | `8.5` | Radius of cylinder. Higher = cards appear further back |
| `panelSize` | `[3.4, 2.15]` | `[width, height]` of cards in 3D scene units |
| `rows` | `3` | Number of vertical card rings |
| `colsPerRow` | `10` | Number of cards per horizontal circle ring |
| `rowSpacing` | `2.65` | Vertical distance between rows |
| `autoRotate` | `true` | Passive rotation when idle |
| `autoRotateSpeed` | `0.035` | Rotation velocity (radians/sec) |
| `backgroundColor` | `"#000000"` | Background canvas color |
| `showCenterOverlay`| `true` | Set `false` to hide the center text |

import { CylinderGallery, type CylinderGalleryItem } from "./index";

// ============================================================================
// Example 1: Minimal Zero-Config (Uses built-in demo items & center title)
// ============================================================================
export const MinimalExample = () => {
  return (
    <div className="w-full h-screen bg-black">
      <CylinderGallery />
    </div>
  );
};

// ============================================================================
// Example 2: Custom Projects with Click Handler & Custom Center Brand
// ============================================================================
const myProjects: CylinderGalleryItem[] = [
  {
    id: "project-1",
    title: "AI Operating System",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    domain: "ai-os.tech",
    link: "https://ai-os.tech",
  },
  {
    id: "project-2",
    title: "Fintech Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    domain: "payflow.finance",
    link: "https://payflow.finance",
  },
  {
    id: "project-3",
    title: "Spatial Architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    domain: "studio-arch.com",
    link: "https://studio-arch.com",
  },
];

export const CustomProjectsExample = () => {
  const handleSelect = (item: CylinderGalleryItem) => {
    console.log("Selected item:", item);
    if (item.link) {
      window.open(item.link, "_blank");
    }
  };

  return (
    <div className="w-full h-[800px] bg-black">
      <CylinderGallery
        items={myProjects}
        onItemSelect={handleSelect}
        centerHeading="Selected Work"
        centerBrand="Portfolio 2026"
        radius={9.0}
        panelSize={[3.5, 2.2]}
        autoRotate={true}
        autoRotateSpeed={0.04}
      />
    </div>
  );
};

// ============================================================================
// Example 3: Custom Center Overlay (Buttons, Badges, Custom Branding)
// ============================================================================
export const CustomCenterOverlayExample = () => {
  return (
    <div className="w-full h-screen bg-black">
      <CylinderGallery
        centerOverlay={
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="px-3 py-1 text-xs font-mono tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 rounded-full">
              INTERACTIVE 3D ARCHIVE
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              EXPLORE THE FUTURE
            </h1>
            <p className="text-sm text-neutral-400 max-w-md">
              Drag horizontally to spin the dome. Click any card to preview.
            </p>
            <button
              onClick={() => alert("Explore clicked!")}
              className="pointer-events-auto mt-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        }
      />
    </div>
  );
};

// ============================================================================
// Example 4: Next.js (App Router / Pages Router) Dynamic Import
// ============================================================================
/*
In Next.js, Three.js / Canvas requires client-side execution without SSR hydration:

'use client';
import dynamic from 'next/dynamic';

const CylinderGallery = dynamic(
  () => import('@/components/CylinderGallery').then((mod) => mod.CylinderGallery),
  { ssr: false, loading: () => <div className="w-full h-[700px] bg-black" /> }
);

export default function MyPage() {
  return <CylinderGallery />;
}
*/

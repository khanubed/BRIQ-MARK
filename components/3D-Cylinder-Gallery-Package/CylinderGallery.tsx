import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";
import { getCylinderTilePoints } from "./cylinderGeometry";
import { useDragRotate } from "./useDragRotate";
import type { CylinderGalleryProps, CylinderGalleryItem } from "./types";

// Global Texture Cache for sharing textures across duplicate tiles without reallocation
const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

/**
 * Creates a modern browser-window style procedural canvas texture
 * when an image URL is missing, loading, or fails to load.
 */
function createProceduralTexture(title: string, subtitle?: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Dark sleek gradient background
    const grad = ctx.createLinearGradient(0, 0, 640, 400);
    grad.addColorStop(0, "#161922");
    grad.addColorStop(0.5, "#0f1117");
    grad.addColorStop(1, "#08090d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 400);

    // Browser top bar
    ctx.fillStyle = "#202430";
    ctx.fillRect(0, 0, 640, 44);

    // Window controls (macOS style dots)
    const dots = [
      { x: 24, color: "#ef4444" },
      { x: 42, color: "#f59e0b" },
      { x: 60, color: "#10b981" },
    ];
    dots.forEach((dot) => {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, 22, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mock search bar
    ctx.fillStyle = "#161922";
    ctx.beginPath();
    ctx.roundRect(100, 10, 440, 24, 6);
    ctx.fill();

    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("https://showcase.preview", 320, 26);

    // Center card content
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title || "Project Showcase", 320, 210);

    if (subtitle) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText(subtitle, 320, 245);
    }

    // Subtle grid pattern
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 640; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 44);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    for (let y = 44; y <= 400; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Built-in default items if none are supplied by the parent project
 */
const DEFAULT_DEMO_ITEMS: CylinderGalleryItem[] = [
  { id: "1", title: "Creative Agency", domain: "agency.design" },
  { id: "2", title: "SaaS Analytics", domain: "metrics.cloud" },
  { id: "3", title: "E-Commerce Experience", domain: "shop.luxury" },
  { id: "4", title: "Fintech Platform", domain: "pay.fintech" },
  { id: "5", title: "Healthcare Systems", domain: "care.health" },
  { id: "6", title: "AI Intelligence Engine", domain: "neural.ai" },
  { id: "7", title: "Architectural Studio", domain: "arch.space" },
  { id: "8", title: "Web3 Protocol", domain: "protocol.eth" },
  { id: "9", title: "Mobile Workspace", domain: "mobile.app" },
  { id: "10", title: "Automotive Hub", domain: "drive.tech" },
];

/**
 * Individual 3D Card Panel on Cylinder Wall
 */
interface PanelProps {
  item: CylinderGalleryItem;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  hoverScale?: number;
  onSelect?: (item: CylinderGalleryItem) => void;
}

const Panel = ({
  item,
  position,
  rotation,
  size,
  hoverScale = 1.14,
  onSelect,
}: PanelProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const [width, height] = size;
  const imgSrc = item.image || item.imageUrl || item.coverImage;
  const itemDomain =
    item.domain ||
    (item.slug
      ? `${item.slug.toLowerCase().replace(/[^a-z0-9]/g, "-")}.com`
      : `${item.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.com`);

  const [texture, setTexture] = useState<THREE.Texture>(() => {
    if (imgSrc && textureCache.has(imgSrc)) {
      return textureCache.get(imgSrc)!;
    }
    return createProceduralTexture(item.title, item.category);
  });

  useEffect(() => {
    let isMounted = true;
    if (!imgSrc) {
      setTexture(createProceduralTexture(item.title, item.category));
      return;
    }

    if (textureCache.has(imgSrc)) {
      setTexture(textureCache.get(imgSrc)!);
      return;
    }

    loader.load(
      imgSrc,
      (loadedTexture) => {
        if (!isMounted) return;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.generateMipmaps = true;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.needsUpdate = true;
        textureCache.set(imgSrc, loadedTexture);
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        if (!isMounted) return;
        setTexture(createProceduralTexture(item.title, item.category));
      }
    );

    return () => {
      isMounted = false;
    };
  }, [imgSrc, item.title, item.category]);

  // Smooth hover scale animation with Three.js lerp
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? hoverScale : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 12);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (item.onClick) {
      item.onClick(item);
    }
    if (onSelect) {
      onSelect(item);
    } else if (item.url || item.link) {
      window.open(item.url || item.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
      onClick={handleClick}
    >
      {/* Subtle Card Glow / Outer Bezel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.9 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Website Screenshot / Texture Plane */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          key={texture.id || texture.uuid}
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Squarespace-style White Hover Pill with Domain & Arrow */}
      {hovered && (
        <Html
          center
          distanceFactor={11}
          position={[width * 0.35, 0, 0.15]}
          className="pointer-events-none select-none"
        >
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-black shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-neutral-200 transition-all duration-300">
            <span className="font-sans text-xs sm:text-sm font-semibold tracking-tight text-black whitespace-nowrap">
              {itemDomain}
            </span>
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * 3D Inner Cylinder Scene
 */
interface CylinderSceneProps {
  items: CylinderGalleryItem[];
  radius: number;
  panelSize: [number, number];
  rows: number;
  colsPerRow: number;
  rowSpacing: number;
  hoverScale: number;
  cylinderGroupRef: React.RefObject<THREE.Group | null>;
  updateRotation: (delta: number) => void;
  onItemSelect?: (item: CylinderGalleryItem) => void;
}

const CylinderScene = ({
  items,
  radius,
  panelSize,
  rows,
  colsPerRow,
  rowSpacing,
  hoverScale,
  cylinderGroupRef,
  updateRotation,
  onItemSelect,
}: CylinderSceneProps) => {
  useFrame((_, delta) => {
    updateRotation(delta);
  });

  const tileSlots = useMemo(() => {
    return getCylinderTilePoints(rows, colsPerRow, radius, rowSpacing);
  }, [rows, colsPerRow, radius, rowSpacing]);

  return (
    <group ref={cylinderGroupRef}>
      {tileSlots.map((slot, index) => {
        const item = items[index % items.length];
        const [x, , z] = slot.position;
        const rotY = Math.atan2(-x, -z);

        return (
          <Panel
            key={`${item.id || index}-${index}`}
            item={item}
            position={slot.position}
            rotation={[0, rotY, 0]}
            size={panelSize}
            hoverScale={hoverScale}
            onSelect={onItemSelect}
          />
        );
      })}
    </group>
  );
};

/**
 * Modern 3D Cylindrical Tile Gallery Component
 *
 * Features:
 * - Staggered brick-pattern 3D cylinder wall
 * - Drag-to-rotate with inertia & passive auto-rotation
 * - Mobile scroll passthrough (horizontal swipes rotate cylinder, vertical swipes scroll the page)
 * - Automatic texture caching & procedural canvas fallbacks
 * - Interactive hover pills with website domain
 * - Fully customizable geometry, physics, and center overlay
 */
export const CylinderGallery = ({
  items = DEFAULT_DEMO_ITEMS,
  onItemSelect,
  radius = 8.5,
  panelSize = [3.4, 2.15],
  rows = 3,
  colsPerRow = 10,
  rowSpacing = 2.65,
  autoRotate = true,
  autoRotateSpeed = 0.035,
  dragSensitivity = 0.0035,
  friction = 0.94,
  idleDelay = 1.8,
  hoverScale = 1.14,
  fov = 70,
  backgroundColor = "#000000",
  showCenterOverlay = true,
  centerHeading = "Made with",
  centerBrand = "Showcase",
  centerOverlay,
  children,
  className = "",
}: CylinderGalleryProps) => {
  const cylinderGroupRef = useRef<THREE.Group>(null);

  // Single-axis Y drag rotation with directional gesture detection for mobile scroll passthrough
  const { isDragging, handlePointerDown, updateRotation } = useDragRotate(
    cylinderGroupRef,
    {
      autoRotate,
      autoRotateSpeed,
      sensitivity: dragSensitivity,
      friction,
      idleDelay,
    }
  );

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`relative w-full h-[580px] sm:h-[720px] md:h-[900px] overflow-hidden select-none touch-pan-y ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{ backgroundColor }}
    >
      {/* 3D Canvas Viewport */}
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 0], fov }}
      >
        <color attach="background" args={[backgroundColor]} />
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={fov} near={0.1} far={100} />

        {/* Ambient Lighting */}
        <ambientLight intensity={2.0} />

        {/* 3D Cylindrical Tile Dome */}
        <CylinderScene
          items={items}
          radius={radius}
          panelSize={panelSize}
          rows={rows}
          colsPerRow={colsPerRow}
          rowSpacing={rowSpacing}
          hoverScale={hoverScale}
          cylinderGroupRef={cylinderGroupRef}
          updateRotation={updateRotation}
          onItemSelect={onItemSelect}
        />
      </Canvas>

      {/* Center Floating Overlay */}
      {showCenterOverlay && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.3)_40%,transparent_70%)] pointer-events-none" />

          {centerOverlay ? (
            <div className="relative z-10">{centerOverlay}</div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center">
              {centerHeading && (
                <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-tight tracking-tight drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">
                  {centerHeading}
                </h2>
              )}
              {centerBrand && (
                <span className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tighter mt-1">
                  <span className="bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {centerBrand}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optional custom children overlay slot */}
      {children}
    </div>
  );
};

export default CylinderGallery;

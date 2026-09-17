import { useRef, useState, useMemo, useEffect, useCallback, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * ============================================================================
 * CYLINDER 3D GALLERY (STANDALONE DROP-IN COMPONENT)
 *
 * Peer Dependencies required in your project:
 *   npm install three @react-three/fiber @react-three/drei
 *   npm install -D @types/three
 *
 * Fully self-contained: math, physics hook, procedural textures, and components.
 * ============================================================================
 */

export interface CylinderGalleryItem {
  id?: string | number;
  title: string;
  image?: string;
  imageUrl?: string;
  coverImage?: string;
  domain?: string;
  slug?: string;
  url?: string;
  link?: string;
  category?: string;
  onClick?: (item: CylinderGalleryItem) => void;
  [key: string]: any;
}

export interface CylinderTilePoint {
  position: [number, number, number];
  vector: THREE.Vector3;
  row: number;
  col: number;
}

export interface DragRotateOptions {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  sensitivity?: number;
  friction?: number;
  idleDelay?: number;
}

export interface CylinderGalleryProps {
  /** Array of items to showcase on the 3D cylinder cards */
  items?: CylinderGalleryItem[];

  /** Callback fired when a card/panel is clicked */
  onItemSelect?: (item: CylinderGalleryItem) => void;

  /** Cylinder radius (distance from center to cards). Default: 8.5 */
  radius?: number;

  /** Dimensions of each card [width, height]. Default: [3.4, 2.15] */
  panelSize?: [number, number];

  /** Number of vertical card rows in cylinder. Default: 3 */
  rows?: number;

  /** Number of cards per horizontal circular ring. Default: 10 */
  colsPerRow?: number;

  /** Vertical spacing between rows. Default: 2.65 */
  rowSpacing?: number;

  /** Enable passive auto-rotation when idle. Default: true */
  autoRotate?: boolean;

  /** Speed of auto-rotation in radians/sec. Default: 0.035 */
  autoRotateSpeed?: number;

  /** Pointer drag sensitivity. Default: 0.0035 */
  dragSensitivity?: number;

  /** Physics momentum friction factor (0.8 - 0.98). Default: 0.94 */
  friction?: number;

  /** Idle delay in seconds before auto-rotation resumes. Default: 1.8 */
  idleDelay?: number;

  /** Scale multiplier on card hover. Default: 1.14 */
  hoverScale?: number;

  /** Camera Field of View in degrees. Default: 70 */
  fov?: number;

  /** Background color of the 3D canvas. Default: "#000000" */
  backgroundColor?: string;

  /** Whether to show the central floating text overlay. Default: true */
  showCenterOverlay?: boolean;

  /** Center overlay primary headline (e.g. "Featured Work"). Default: "Made with" */
  centerHeading?: string;

  /** Center overlay highlighted brand name. Default: "Showcase" */
  centerBrand?: string;

  /** Optional custom React node for center overlay */
  centerOverlay?: ReactNode;

  /** Optional children rendered as HTML overlay inside the container */
  children?: ReactNode;

  /** Container CSS classes */
  className?: string;
}

// Global Texture Cache for sharing textures across duplicate tiles without reallocation
const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

/**
 * Procedural fallback canvas texture (macOS-style browser mockup window)
 */
function createProceduralTexture(title: string, subtitle?: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 640, 400);
    grad.addColorStop(0, "#161922");
    grad.addColorStop(0.5, "#0f1117");
    grad.addColorStop(1, "#08090d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 400);

    // Browser top bar
    ctx.fillStyle = "#202430";
    ctx.fillRect(0, 0, 640, 44);

    // Window controls
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
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Calculates a structured cylindrical brick/tile pattern on the inner surface of a cylinder.
 */
function getCylinderTilePoints(
  rows: number = 3,
  colsPerRow: number = 10,
  radius: number = 8.5,
  rowSpacing: number = 2.65
): CylinderTilePoint[] {
  const points: CylinderTilePoint[] = [];
  const step = (Math.PI * 2) / colsPerRow;
  const startY = ((rows - 1) / 2) * rowSpacing;

  for (let r = 0; r < rows; r++) {
    const y = startY - r * rowSpacing;
    const rowOffset = r % 2 === 1 ? step / 2 : 0;

    for (let c = 0; c < colsPerRow; c++) {
      const angle = c * step + rowOffset;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      points.push({
        position: [x, y, z],
        vector: new THREE.Vector3(x, y, z),
        row: r,
        col: c,
      });
    }
  }

  return points;
}

/**
 * Smart single-axis drag rotate hook with mobile vertical scroll passthrough
 */
function useDragRotate(
  groupRef: React.RefObject<THREE.Group | null>,
  options: DragRotateOptions = {}
) {
  const {
    autoRotate = true,
    autoRotateSpeed = 0.035,
    sensitivity = 0.0035,
    friction = 0.94,
    idleDelay = 1.8,
  } = options;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isPointerDown = useRef<boolean>(false);
  const startPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerX = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const targetRotationY = useRef<number>(0);
  const lastInteractionTime = useRef<number>(Date.now());
  const isHorizontalGesture = useRef<boolean | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = true;
    startPointer.current = { x: e.clientX, y: e.clientY };
    lastPointerX.current = e.clientX;
    velocityY.current = 0;
    isHorizontalGesture.current = null;
    lastInteractionTime.current = Date.now();
  }, []);

  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;

      const deltaX = e.clientX - startPointer.current.x;
      const deltaY = e.clientY - startPointer.current.y;

      if (isHorizontalGesture.current === null) {
        if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
          isHorizontalGesture.current = Math.abs(deltaX) >= Math.abs(deltaY);
          if (isHorizontalGesture.current) {
            setIsDragging(true);
          }
        }
      }

      if (isHorizontalGesture.current === true) {
        const moveDeltaX = e.clientX - lastPointerX.current;
        const dRotY = moveDeltaX * sensitivity;

        targetRotationY.current += dRotY;
        velocityY.current = dRotY;
        lastPointerX.current = e.clientX;
        lastInteractionTime.current = Date.now();
      }
    };

    const handleWindowPointerUp = () => {
      if (isPointerDown.current) {
        isPointerDown.current = false;
        setIsDragging(false);
        isHorizontalGesture.current = null;
        lastInteractionTime.current = Date.now();
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [sensitivity]);

  const updateRotation = useCallback(
    (delta: number) => {
      if (!groupRef.current) return;

      const timeSinceInteraction = (Date.now() - lastInteractionTime.current) / 1000;

      if (!isPointerDown.current || !isHorizontalGesture.current) {
        if (Math.abs(velocityY.current) > 0.00001) {
          targetRotationY.current += velocityY.current;
          velocityY.current *= friction;
        }

        if (autoRotate && timeSinceInteraction > idleDelay) {
          targetRotationY.current += autoRotateSpeed * delta;
        }
      }

      const lerpFactor = Math.min(1, delta * 12);
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY.current,
        lerpFactor
      );
    },
    [autoRotate, autoRotateSpeed, friction, idleDelay, groupRef]
  );

  return {
    isDragging,
    handlePointerDown,
    updateRotation,
  };
}

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
 * Individual 3D Card Panel
 */
const Panel = ({
  item,
  position,
  rotation,
  size,
  hoverScale = 1.14,
  onSelect,
}: {
  item: CylinderGalleryItem;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  hoverScale?: number;
  onSelect?: (item: CylinderGalleryItem) => void;
}) => {
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

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? hoverScale : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 12);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (item.onClick) item.onClick(item);
    if (onSelect) onSelect(item);
    else if (item.url || item.link) {
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
      {/* Outer subtle glow/bezel */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={hovered ? 0.9 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main card plane */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          key={texture.id || texture.uuid}
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Floating domain pill on hover */}
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
}: {
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
}) => {
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
 * Standalone 3D Cylinder Gallery Component
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
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 0], fov }}
      >
        <color attach="background" args={[backgroundColor]} />
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={fov} near={0.1} far={100} />
        <ambientLight intensity={2.0} />

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

      {children}
    </div>
  );
};

export default CylinderGallery;

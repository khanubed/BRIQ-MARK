import type { ReactNode } from "react";
import type * as THREE from "three";

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
  description?: string;
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
  autoRotateSpeed?: number; // radians per second
  sensitivity?: number; // pointer drag sensitivity
  friction?: number; // momentum damping factor per frame (0 to 1)
  idleDelay?: number; // seconds of inactivity before auto-rotate resumes
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

  /** Center overlay primary headline (e.g. "Made with" or "Showcase"). Default: "Made with" */
  centerHeading?: string;

  /** Center overlay highlighted brand name or subtitle. Default: "Showcase" */
  centerBrand?: string;

  /** Optional custom React node for center overlay (replaces default heading/brand) */
  centerOverlay?: ReactNode;

  /** Optional children rendered as HTML overlay inside the container */
  children?: ReactNode;

  /** Container CSS classes */
  className?: string;
}

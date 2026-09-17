import * as THREE from "three";
import type { CylinderTilePoint } from "./types";

/**
 * Calculates a structured cylindrical brick/tile pattern on the inner surface of a cylinder.
 *
 * @param rows Number of vertical tile rows (default: 3)
 * @param colsPerRow Number of cards per horizontal ring (default: 10)
 * @param radius Radius of the cylinder (default: 8.5)
 * @param rowSpacing Vertical spacing between rows (default: 2.65)
 * @returns Array of 3D positions [x, y, z] arranged in a staggered tile pattern
 */
export function getCylinderTilePoints(
  rows: number = 3,
  colsPerRow: number = 10,
  radius: number = 8.5,
  rowSpacing: number = 2.65
): CylinderTilePoint[] {
  const points: CylinderTilePoint[] = [];
  const step = (Math.PI * 2) / colsPerRow;

  // Center the rows vertically around y = 0
  const startY = ((rows - 1) / 2) * rowSpacing;

  for (let r = 0; r < rows; r++) {
    const y = startY - r * rowSpacing;
    // Stagger every other row by half a step for a classic brick/tile pattern
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

export default getCylinderTilePoints;

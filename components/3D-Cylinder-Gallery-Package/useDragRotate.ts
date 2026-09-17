import { useRef, useCallback, useState, useEffect } from "react";
import * as THREE from "three";
import type { DragRotateOptions } from "./types";

/**
 * Smart Single-Axis (Y-Axis) Drag Rotate Hook with Mobile Scroll Passthrough.
 * Allows native vertical page scrolling while capturing horizontal swipes for cylinder rotation.
 */
export function useDragRotate(
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

  // Handle pointer down on DOM container
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = true;
    startPointer.current = { x: e.clientX, y: e.clientY };
    lastPointerX.current = e.clientX;
    velocityY.current = 0;
    isHorizontalGesture.current = null;
    lastInteractionTime.current = Date.now();
  }, []);

  // Global window listeners for gesture handling
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;

      const deltaX = e.clientX - startPointer.current.x;
      const deltaY = e.clientY - startPointer.current.y;

      // Determine gesture direction on initial movement threshold
      if (isHorizontalGesture.current === null) {
        if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
          // If horizontal displacement is greater, it's a cylinder drag
          // Otherwise, it's a vertical page scroll (pass through to browser)
          isHorizontalGesture.current = Math.abs(deltaX) >= Math.abs(deltaY);
          if (isHorizontalGesture.current) {
            setIsDragging(true);
          }
        }
      }

      // Only rotate cylinder if the gesture is determined to be horizontal
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

  // Update per-frame physics loop along Y axis only
  const updateRotation = useCallback(
    (delta: number) => {
      if (!groupRef.current) return;

      const timeSinceInteraction = (Date.now() - lastInteractionTime.current) / 1000;

      if (!isPointerDown.current || !isHorizontalGesture.current) {
        // Apply momentum inertia along Y axis
        if (Math.abs(velocityY.current) > 0.00001) {
          targetRotationY.current += velocityY.current;
          velocityY.current *= friction;
        }

        // Auto-rotation after idle delay
        if (autoRotate && timeSinceInteraction > idleDelay) {
          targetRotationY.current += autoRotateSpeed * delta;
        }
      }

      // Smooth lerp strictly on the Y axis
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

export default useDragRotate;

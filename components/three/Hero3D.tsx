"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useAppDispatch } from "../../store/hooks";
import {
  setWebglSupported,
  setHeroInView,
} from "../../store/slices/performanceSlice";

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const prefersReduced = useReducedMotion();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    // Check WebGL availability
    const canvasTest = document.createElement("canvas");
    const gl =
      canvasTest.getContext("webgl2") ||
      canvasTest.getContext("webgl") ||
      canvasTest.getContext("experimental-webgl");

    if (!gl) {
      setHasWebGL(false);
      dispatch(setWebglSupported(false));
      return;
    }

    const container = containerRef.current;
    let animationFrameId: number;
    let isVisible = true;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Geometry: Abstract Faceted Torus Knot / Luxury Core
    const geometry = new THREE.TorusKnotGeometry(1.4, 0.42, 128, 32, 2, 3);

    // Luxury Material: Wireframe and Refined Metallic Glow
    const wireframeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Champagne gold
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const innerGeometry = new THREE.IcosahedronGeometry(0.9, 2);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });

    const knotMesh = new THREE.Mesh(geometry, wireframeMaterial);
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(knotMesh);
    scene.add(innerMesh);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf59e0b, 3, 20); // Warm Gold
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 2, 20); // Cyan Accent
    pointLight2.position.set(-5, -4, 4);
    scene.add(pointLight2);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.4;
      targetRotationX = y * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Pause render loop when canvas is out of view (Rule 32)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        dispatch(setHeroInView(entry.isIntersecting));
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Clock
    const clock = new THREE.Clock();

    // Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Save GPU when scrolled away

      const delta = clock.getDelta();
      const speed = prefersReduced ? 0.02 : 0.25;

      knotMesh.rotation.x += delta * speed * 0.7;
      knotMesh.rotation.y += delta * speed;
      innerMesh.rotation.x -= delta * speed * 0.5;
      innerMesh.rotation.y += delta * speed * 0.8;

      // Subtle mouse tracking damping
      knotMesh.rotation.y += (targetRotationY - knotMesh.rotation.y) * 0.02;
      knotMesh.rotation.x += (targetRotationX - knotMesh.rotation.x) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Clean up WebGL resources
      geometry.dispose();
      innerGeometry.dispose();
      wireframeMaterial.dispose();
      innerMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [dispatch, prefersReduced]);

  if (!hasWebGL) {
    // Graceful fallback for non-WebGL / low-power devices
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-80 h-80 rounded-full bg-radial from-amber-500/20 via-sky-500/10 to-transparent blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

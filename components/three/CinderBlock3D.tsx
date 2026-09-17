"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Creates a procedural concrete texture with speckled noise and pores
 */
function createConcreteTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Base concrete gray
    ctx.fillStyle = "#686f78";
    ctx.fillRect(0, 0, size, size);

    // Add noise grain & specks
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 65;
      const grain = (Math.random() - 0.5) * 25;
      const val = 110 + noise + grain;
      data[i] = Math.min(255, Math.max(0, val - 10)); // R
      data[i + 1] = Math.min(255, Math.max(0, val));     // G
      data[i + 2] = Math.min(255, Math.max(0, val + 15)); // B
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Add darker pits and crevices
    for (let j = 0; j < 400; j++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? "rgba(35, 40, 48, 0.4)" : "rgba(180, 190, 205, 0.25)";
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  return texture;
}

export function CinderBlock3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Cinder Block Geometry Construction
    // A standard concrete cinder block with 2 rectangular core holes
    const blockWidth = 3.2;
    const blockHeight = 1.6;
    const blockDepth = 1.6;

    const shape = new THREE.Shape();
    const x = -blockWidth / 2;
    const y = -blockHeight / 2;
    const w = blockWidth;
    const h = blockHeight;
    const radius = 0.08;

    // Outer rounded rectangle
    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    // Hole 1 (Left Core)
    const hole1 = new THREE.Path();
    const hW = 1.05;
    const hH = 0.95;
    const h1X = -0.85 - hW / 2;
    const h1Y = -hH / 2;
    const hr = 0.12;

    hole1.moveTo(h1X + hr, h1Y);
    hole1.lineTo(h1X + hW - hr, h1Y);
    hole1.quadraticCurveTo(h1X + hW, h1Y, h1X + hW, h1Y + hr);
    hole1.lineTo(h1X + hW, h1Y + hH - hr);
    hole1.quadraticCurveTo(h1X + hW, h1Y + hH, h1X + hW - hr, h1Y + hH);
    hole1.lineTo(h1X + hr, h1Y + hH);
    hole1.quadraticCurveTo(h1X, h1Y + hH, h1X, h1Y + hH - hr);
    hole1.lineTo(h1X, h1Y + hr);
    hole1.quadraticCurveTo(h1X, h1Y, h1X + hr, h1Y);
    shape.holes.push(hole1);

    // Hole 2 (Right Core)
    const hole2 = new THREE.Path();
    const h2X = 0.85 - hW / 2;
    const h2Y = -hH / 2;

    hole2.moveTo(h2X + hr, h2Y);
    hole2.lineTo(h2X + hW - hr, h2Y);
    hole2.quadraticCurveTo(h2X + hW, h2Y, h2X + hW, h2Y + hr);
    hole2.lineTo(h2X + hW, h2Y + hH - hr);
    hole2.quadraticCurveTo(h2X + hW, h2Y + hH, h2X + hW - hr, h2Y + hH);
    hole2.lineTo(h2X + hr, h2Y + hH);
    hole2.quadraticCurveTo(h2X, h2Y + hH, h2X, h2Y + hH - hr);
    hole2.lineTo(h2X, h2Y + hr);
    hole2.quadraticCurveTo(h2X, h2Y, h2X + hr, h2Y);
    shape.holes.push(hole2);

    const extrudeSettings = {
      steps: 1,
      depth: blockDepth,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // 3. Concrete Material
    const concreteMap = createConcreteTexture();
    const material = new THREE.MeshStandardMaterial({
      color: 0x8a939f,
      map: concreteMap,
      bumpMap: concreteMap,
      bumpScale: 0.06,
      roughness: 0.85,
      metalness: 0.12,
    });

    const blockMesh = new THREE.Mesh(geometry, material);
    scene.add(blockMesh);

    // 4. Subtle Engraved Angular Monogram on side (matching reference)
    const logoGroup = new THREE.Group();
    const barGeo = new THREE.BoxGeometry(0.7, 0.08, 0.04);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x14181f,
      roughness: 0.9,
      metalness: 0.2,
    });
    const bar1 = new THREE.Mesh(barGeo, barMat);
    bar1.rotation.z = -0.55;
    bar1.position.set(-0.1, 0.15, 0);

    const bar2 = new THREE.Mesh(barGeo, barMat);
    bar2.rotation.z = -0.55;
    bar2.position.set(0.1, -0.15, 0);

    logoGroup.add(bar1, bar2);
    logoGroup.position.set(0.7, 0.1, blockDepth / 2 + 0.02);
    blockMesh.add(logoGroup);

    // 5. Lighting Setup (Dramatic key light + intense electric cyan rim glow matching reference)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Top Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Intense Electric Cyan Rim Light from Bottom-Right
    const cyanRimLight1 = new THREE.PointLight(0x00f0ff, 12.0, 12);
    cyanRimLight1.position.set(2.0, -2.4, 2.0);
    scene.add(cyanRimLight1);

    // Secondary Cyan Rim Light wrapping underneath
    const cyanRimLight2 = new THREE.PointLight(0x00f0ff, 8.0, 10);
    cyanRimLight2.position.set(-1.8, -2.0, 1.0);
    scene.add(cyanRimLight2);

    // Cyan Fill from behind
    const cyanBackLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    cyanBackLight.position.set(0, -4, -2);
    scene.add(cyanBackLight);

    // Subtle Fill Light from Left
    const fillLight = new THREE.DirectionalLight(0x8fa0b2, 1.2);
    fillLight.position.set(-6, -1, 4);
    scene.add(fillLight);

    // Initial dramatic rotation matching reference photo (~45deg isometric angle)
    const baseRotX = -0.58;
    const baseRotY = 0.62;
    const baseRotZ = 0.42;
    blockMesh.rotation.set(baseRotX, baseRotY, baseRotZ);

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = nx * 0.35;
      targetMouseY = ny * 0.25;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Render loop with subtle breathing float
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth floating bob
      const floatY = Math.sin(elapsed * 1.2) * 0.08;
      blockMesh.position.y = floatY;

      // Mouse damping
      blockMesh.rotation.y += (baseRotY + targetMouseX - blockMesh.rotation.y) * 0.04;
      blockMesh.rotation.x += (baseRotX - targetMouseY - blockMesh.rotation.x) * 0.04;
      blockMesh.rotation.z = baseRotZ + Math.sin(elapsed * 0.8) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      material.dispose();
      barGeo.dispose();
      barMat.dispose();
      concreteMap.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}

export default CinderBlock3D;

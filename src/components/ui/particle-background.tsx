"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 150;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    containerRef.current.appendChild(renderer.domElement);

    // --- Particles ---
    const particleCount = 150;
    const maxConnectionDistance = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    // Colors based on theme
    const isDark = resolvedTheme === "dark";
    const particleColor = isDark ? 0x8b5cf6 : 0x7c3aed; // Violet colors
    const lineColor = isDark ? 0x6366f1 : 0x4f46e5;     // Indigo colors

    for (let i = 0; i < particleCount; i++) {
      // Random positions inside a bounding box
      positions[i * 3] = (Math.random() - 0.5) * 400; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z

      // Random velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      color: particleColor,
      size: 1.5,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Lines ---
    const linesMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.15 : 0.1,
    });
    
    // Create an empty buffer for lines. We will update it every frame
    // Max possible lines = N * (N-1) / 2
    const linesGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // --- Mouse Interaction ---
    let mouse = new THREE.Vector2(0, 0);
    let targetMouse = new THREE.Vector2(0, 0);
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      targetMouse.x = (event.clientX - windowHalfX) * 0.1;
      targetMouse.y = (event.clientY - windowHalfY) * 0.1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // --- Resize Handling ---
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    // --- Animation Loop ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow (easing)
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Rotate scene slightly based on mouse
      scene.rotation.x += 0.05 * (mouse.y * 0.01 - scene.rotation.x);
      scene.rotation.y += 0.05 * (mouse.x * 0.01 - scene.rotation.y);
      
      // Continual slow rotation
      scene.rotation.y += 0.001;

      // Update particle positions
      const posAttribute = geometry.attributes.position;
      const array = posAttribute.array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3] += velocities[i].x;
        array[i * 3 + 1] += velocities[i].y;
        array[i * 3 + 2] += velocities[i].z;

        // Bounce off bounds
        if (Math.abs(array[i * 3]) > 200) velocities[i].x *= -1;
        if (Math.abs(array[i * 3 + 1]) > 200) velocities[i].y *= -1;
        if (Math.abs(array[i * 3 + 2]) > 100) velocities[i].z *= -1;
      }
      posAttribute.needsUpdate = true;

      // Recalculate lines based on distance
      const linePositions: number[] = [];
      const lineColors: number[] = []; // Optional: for fading lines

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = array[i * 3] - array[j * 3];
          const dy = array[i * 3 + 1] - array[j * 3 + 1];
          const dz = array[i * 3 + 2] - array[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxConnectionDistance * maxConnectionDistance) {
            linePositions.push(
              array[i * 3], array[i * 3 + 1], array[i * 3 + 2],
              array[j * 3], array[j * 3 + 1], array[j * 3 + 2]
            );
          }
        }
      }

      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      
      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose Three.js resources to prevent memory leaks
      geometry.dispose();
      material.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [resolvedTheme]); // Re-run effect when theme changes to update colors

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Fallback gradient behind particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      {/* ThreeJS Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 opacity-60" />
    </div>
  );
}

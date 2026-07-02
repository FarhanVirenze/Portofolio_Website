"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useLoading } from "./loading-provider";
import { useTheme } from "next-themes";

export function SplashScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isLoaded, setIsLoaded } = useLoading();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoaded || !containerRef.current || !textRef.current || !overlayRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Icosahedron (Wireframe) ---
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    const isDark = resolvedTheme === "dark";
    // We want a glowing futuristic color
    const color = isDark ? 0xa855f7 : 0x7c3aed; // Purple/Violet

    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0, // start invisible
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Idle rotation
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // --- Window Resize ---
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // --- The Cinematic Sequence (GSAP) ---
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true); // Signal the app to start
        
        // Final cleanup after slide up is done
        setTimeout(() => {
          if (containerRef.current?.contains(renderer.domElement)) {
            containerRef.current.removeChild(renderer.domElement);
          }
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          window.removeEventListener("resize", onWindowResize);
          cancelAnimationFrame(animationFrameId);
        }, 1000);
      }
    });

    // 1. Fade in the 3D shape
    tl.to(material, {
      opacity: isDark ? 0.8 : 0.6,
      duration: 1,
      ease: "power2.inOut",
    });

    // 2. Animate the text in (stagger letters)
    const textChars = textRef.current.querySelectorAll(".splash-char");
    gsap.set(textChars, { y: 20, opacity: 0 });
    
    tl.to(textChars, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "back.out(1.5)",
    }, "-=0.5"); // Start slightly before shape finishes fading in

    // 3. Hold for reading
    tl.to({}, { duration: 0.8 });

    // 4. Glitch / blink text slightly
    tl.to(textChars, {
      opacity: 0.2,
      duration: 0.1,
      yoyo: true,
      repeat: 3,
    });

    // 5. The Climax: Zoom camera straight through the mesh!
    tl.to(camera.position, {
      z: 0.1, // zoom in very close
      duration: 1.2,
      ease: "power4.in",
    }, "+=0.2");

    // Fade out text while zooming
    tl.to(textRef.current, {
      opacity: 0,
      scale: 1.5,
      duration: 0.8,
      ease: "power2.in",
    }, "<"); // start at the same time as camera zoom

    // 6. Fade out the overlay background to reveal website
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    }, "-=0.2"); // overlap slightly with the end of the zoom

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      // Remove element if it exists
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mounted, isLoaded, resolvedTheme, setIsLoaded]);

  // Once loaded, we can completely remove the DOM element after the animation finishes
  // but the GSAP timeline handles the visual fading out.
  // We keep it in the DOM but translated away until React unmounts it (which we might just leave invisible).

  const text = "SYSTEM READY";
  const letters = text.split("").map((char, i) => (
    <span key={i} className="splash-char inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
      {char}
    </span>
  ));

  return (
    <div 
      ref={overlayRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none ${isLoaded ? 'hidden' : ''}`}
      style={{
        // ensure it covers everything initially
        visibility: isLoaded ? "hidden" : "visible"
      }}
    >
      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Futuristic Overlay Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/80 to-background"></div>

      {/* Text Container */}
      <div 
        ref={textRef} 
        className="relative z-10 flex flex-col items-center justify-center mt-32"
      >
        <h1 className="text-sm md:text-base font-mono font-bold tracking-[0.5em] text-primary/80 uppercase">
          {letters}
        </h1>
        
        {/* Loading progress bar line */}
        <div className="w-48 h-px bg-primary/20 mt-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-primary animate-[shimmer_1.5s_infinite]" style={{ transform: 'translateX(-100%)' }}></div>
        </div>
      </div>
    </div>
  );
}

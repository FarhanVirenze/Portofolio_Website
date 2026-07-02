"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "./loading-provider";

export function HomeHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useLoading();

  // 1. Set initial state immediately to avoid flash
  useEffect(() => {
    if (!containerRef.current) return;
    
    const textElements = containerRef.current.querySelectorAll(".hero-text-stagger");
    const imageElement = containerRef.current.querySelector(".hero-image");
    
    if (textElements.length > 0) {
      gsap.set(textElements, { y: 30, opacity: 0 });
    }
    if (imageElement) {
      gsap.set(imageElement, { scale: 0.8, opacity: 0 });
    }
  }, []);

  // 2. Animate in only after loading is complete
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const textElements = containerRef.current.querySelectorAll(".hero-text-stagger");
    const imageElement = containerRef.current.querySelector(".hero-image");

    if (textElements.length > 0) {
      gsap.to(textElements,
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.2 }
      );
    }
    
    if (imageElement) {
      gsap.to(imageElement,
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 0.5 }
      );
    }
  }, [isLoaded]);

  return <div ref={containerRef} className="w-full">{children}</div>;
}

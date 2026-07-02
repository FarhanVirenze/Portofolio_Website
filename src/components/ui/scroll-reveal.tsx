"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  staggerChildren?: number;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = "",
  staggerChildren = 0,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case "up":
        y = distance;
        break;
      case "down":
        y = -distance;
        break;
      case "left":
        x = distance;
        break;
      case "right":
        x = -distance;
        break;
      case "none":
      default:
        break;
    }

    // Set initial state
    gsap.set(el, {
      opacity: 0,
      x: x,
      y: y,
    });

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Trigger when top of element hits 85% of viewport
        toggleActions: "play none none reverse", // Play on enter, reverse on leave back
      },
    });

    tl.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: duration,
      delay: delay,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, [direction, delay, duration, distance]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

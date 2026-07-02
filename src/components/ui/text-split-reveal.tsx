"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "../loading-provider";

interface TextSplitRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  delay?: number;
}

export function TextSplitReveal({
  text,
  as: Component = "div",
  className = "",
  delay = 0,
}: TextSplitRevealProps) {
  const containerRef = useRef<any>(null);
  const { isLoaded } = useLoading();

  // Set initial state immediately
  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".split-char");
    gsap.set(chars, {
      y: 100,
      opacity: 0,
    });
  }, []);

  // Animate in only after loading is complete
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;
    
    const chars = containerRef.current.querySelectorAll(".split-char");
    
    gsap.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)",
      delay: delay,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
      },
    });
  }, [delay, isLoaded]);

  // Split text into letters, preserving spaces
  const letters = text.split("").map((char, index) => (
    <span
      key={index}
      className="split-char inline-block"
      style={{ whiteSpace: char === " " ? "pre" : "normal" }}
    >
      {char}
    </span>
  ));

  return (
    <Component ref={containerRef} className={className} style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>
      {letters}
    </Component>
  );
}

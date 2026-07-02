"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MagneticButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const h = rect.width / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;
      
      // Move button slightly
      gsap.to(button, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 1,
        ease: "power3.out",
      });
      
      // Move content inside button slightly more to create parallax
      gsap.to(content, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 1,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      // Reset position
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      
      gsap.to(content, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={buttonRef} className={className} style={{ display: "inline-block" }}>
      <div ref={contentRef} style={{ pointerEvents: "none", display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <div style={{ pointerEvents: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

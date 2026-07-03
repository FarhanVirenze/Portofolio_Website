"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const toggleTheme = () => {
    if (isAnimating || !buttonRef.current) return;
    setIsAnimating(true);

    const btn = buttonRef.current;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Calculate the max distance from button center to any corner of the screen
    const maxDist = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    // Create a circular overlay that we'll scale up (GPU-accelerated)
    const overlay = document.createElement("div");
    const size = 20; // small initial circle
    overlay.style.cssText = `
      position: fixed;
      top: ${cy - size / 2}px;
      left: ${cx - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${newTheme === "dark" ? "#09090b" : "#ffffff"};
      z-index: 99999;
      pointer-events: none;
      transform: scale(0);
      will-change: transform;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(overlay);

    // The scale needed to cover the entire screen from the small circle
    const targetScale = (maxDist * 2) / size;

    // Force reflow, then trigger GPU-accelerated scale transition
    overlay.getBoundingClientRect();
    overlay.style.transform = `scale(${targetScale})`;

    // Switch theme partway through the transition
    setTimeout(() => {
      setTheme(newTheme);
    }, 200);

    // Remove overlay after transition completes
    setTimeout(() => {
      overlay.style.transition = "opacity 0.2s ease-out";
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        setIsAnimating(false);
      }, 200);
    }, 500);
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      disabled={isAnimating}
      className="relative inline-flex items-center justify-center rounded-full w-9 h-9 border border-border bg-background hover:bg-muted transition-colors text-foreground overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </button>
  );
}


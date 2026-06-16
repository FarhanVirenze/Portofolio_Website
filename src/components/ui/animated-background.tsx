"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      {/* Dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Animated glowing orb following mouse */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-violet-500/30 dark:bg-violet-400/20"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 2 }}
      />
      
      {/* Static glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 dark:bg-violet-500/6 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 dark:bg-indigo-400/6 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-fuchsia-600/5 dark:bg-fuchsia-400/4 rounded-full blur-[100px] mix-blend-screen" />
    </div>
  );
}

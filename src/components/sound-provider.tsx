"use client";

import { useEffect } from "react";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const playPopSound = () => {
      try {
        const audio = new Audio("/assets/pop.mp3");
        audio.volume = 0.4;
        audio.play().catch(() => {
          // Browser might block autoplay without interaction
        });
      } catch (error) {
        // ignore
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Play sound if clicked element is a link, button, or has role button
      const clickable = target.closest('a, button, [role="button"], [type="submit"], [type="button"]');
      
      if (clickable) {
        playPopSound();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <>{children}</>;
}

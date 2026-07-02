"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GsapProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Scroll to top on route change for better GSAP calculations
    if (!isFirstMount.current) {
      window.scrollTo(0, 0);
    }
    isFirstMount.current = false;

    // Refresh ScrollTrigger on route change to recalculate positions
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return <>{children}</>;
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutSections({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate Profile Card from left
    const profileCard = containerRef.current.querySelector(".about-profile-card");
    if (profileCard) {
      gsap.fromTo(profileCard,
        { x: -100, opacity: 0, rotationY: -15 },
        { 
          x: 0, 
          opacity: 1, 
          rotationY: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: profileCard,
            start: "top 85%",
          }
        }
      );
    }
    
    // Stagger Bio Paragraphs from right
    const bioParagraphs = containerRef.current.querySelectorAll(".about-bio-paragraph");
    if (bioParagraphs.length > 0) {
      gsap.fromTo(bioParagraphs,
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioParagraphs[0],
            start: "top 85%",
          }
        }
      );
    }
    
    // Tech Marquee parallax
    const marqueeContainer = containerRef.current.querySelector(".about-marquee-container");
    if (marqueeContainer) {
      gsap.fromTo(marqueeContainer,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: marqueeContainer,
            start: "top 90%",
          }
        }
      );
    }
  }, []);

  return <div ref={containerRef} className="w-full">{children}</div>;
}

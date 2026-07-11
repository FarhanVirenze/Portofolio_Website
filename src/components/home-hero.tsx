"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "./loading-provider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useLoading();

  // 1. Initial State
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-name-left", { x: -200, opacity: 0 });
      gsap.set(".hero-name-right", { x: 200, opacity: 0 });
      gsap.set(".hero-image", { scale: 0.5, opacity: 0, rotate: -15 });
      gsap.set(".hero-greeting", { y: 20, opacity: 0 });
      gsap.set(".hero-roles-wrapper", { y: 20, opacity: 0 });
      gsap.set(".hero-desc-word", { y: 20, opacity: 0 });
      gsap.set(".hero-buttons", { y: 20, opacity: 0 });
    }, containerRef);

    // Safety fallback: force visible if GSAP doesn't run within 2s
    const fallback = setTimeout(() => {
      if (!containerRef.current) return;
      const els = containerRef.current.querySelectorAll(
        ".hero-greeting, .hero-name-left, .hero-name-right, .hero-roles-wrapper, .hero-desc-word, .hero-buttons, .hero-image"
      );
      els.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.opacity === "0" || htmlEl.style.opacity === "") {
          htmlEl.style.opacity = "1";
          htmlEl.style.transform = "none";
        }
      });
    }, 2000);

    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  // 2. Main Animations (Entrance, Scroll, Floating, Mouse)
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // --- A. ENTRANCE MASTER TIMELINE ---
      const tl = gsap.timeline({ delay: 0.1 });

      // 1. Name Collision
      tl.to(".hero-name-left", { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, 0)
        .to(".hero-name-right", { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, 0);

      // 2. Image Spring Pop
      tl.to(".hero-image", {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
      }, 0.2);

      // 3. Greeting & Roles fade in
      tl.to([".hero-greeting", ".hero-roles-wrapper"], {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, 0.4);

      // 4. Staggered Word Reveal for Description
      tl.to(".hero-desc-word", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "back.out(1.5)"
      }, 0.5);

      // 5. Buttons pop
      tl.to(".hero-buttons", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(2)"
      }, 0.8);

      // --- B. INFINITE FLOATING IMAGE ---
      // Start floating after the entrance animation finishes
      tl.add(() => {
        // Quick check to avoid target not found if unmounted
        if (!document.querySelector(".hero-image")) return;
        gsap.to(".hero-image", {
          y: -15,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }, "-=0.5");

      // --- C. SCROLL PARALLAX ---
      gsap.to(".hero-image-wrapper", {
        y: 150, // Image moves down slowly
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(".hero-greeting, .hero-name-left, .hero-name-right, .hero-roles-wrapper, .hero-desc, .hero-buttons", {
        y: -100, // Text moves up faster
        opacity: 0,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 20%",
          scrub: true,
        }
      });
    }, containerRef);

    // --- D. MOUSE PARALLAX 3D (Defined OUTSIDE context to avoid scoping/cleanup issues) ---
    const handleMouseMove = (e: MouseEvent) => {
      // Quick check to prevent errors if elements unmounted
      if (!document.querySelector(".hero-image-wrapper")) return;
      
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth) * 2 - 1;
      const yPos = (e.clientY / innerHeight) * 2 - 1;

      gsap.to(".hero-image-wrapper", {
        x: xPos * -20,
        y: yPos * -20,
        rotateY: xPos * 5,
        rotateX: yPos * -5,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to(".hero-name-left, .hero-name-right", {
        x: xPos * 10,
        y: yPos * 5,
        duration: 1.5,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, [isLoaded]);

  return <div ref={containerRef} className="w-full relative perspective-[1000px]">{children}</div>;
}

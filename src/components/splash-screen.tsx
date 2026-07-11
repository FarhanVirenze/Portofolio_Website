"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "./loading-provider";

const SPLASH_SESSION_KEY = "farhan_splash_seen";

export function SplashScreen() {
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { isLoaded, setIsLoaded } = useLoading();

  useEffect(() => {
    if (isLoaded || !overlayRef.current || !textRef.current || !progressRef.current) return;

    // Highly polished GSAP typographic animation
    const words = [
      "Hello",
      "Halo",
      "Bonjour",
      "Hola",
      "Ciao",
      "Konnichiwa",
      "Guten Tag",
      "Olá",
      "Namaste",
      "Anyoung",
      "Welcome"
    ];

    const tl = gsap.timeline({
      onComplete: () => {
        window.sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
        setIsLoaded(true); // Signal the app to start
      }
    });

    const textEl = textRef.current;
    
    // Initial setup
    gsap.set(textEl, { opacity: 0, y: 30 });
    
    // Create the super-fast text sequence
    const textTl = gsap.timeline();
    
    words.forEach((word, index) => {
      const isLast = index === words.length - 1;
      
      textTl.to(textEl, {
        y: 0,
        opacity: 1,
        duration: isLast ? 0.5 : 0.08, // Much faster for non-last words
        ease: "power2.out",
        onStart: () => { textEl.innerHTML = word + "<span class='text-primary'>.</span>"; }
      })
      .to(textEl, {
        opacity: isLast ? 1 : 0,
        y: isLast ? 0 : -20,
        duration: isLast ? 0.8 : 0.08,
        ease: "power2.in",
        delay: isLast ? 0.2 : 0
      });
    });
    
    // Add text sequence to main timeline
    tl.add(textTl);

    // Sync the progress bar to fill up over the EXACT duration of the text sequence
    tl.to(progressRef.current, {
      width: "100%",
      duration: textTl.duration(),
      ease: "power1.inOut"
    }, 0); // Start at time 0 of the main timeline

    // The Climax: Zoom in and fade out the overlay to reveal the website
    tl.to(overlayRef.current, {
      opacity: 0,
      scale: 1.5,
      duration: 1,
      ease: "power3.inOut",
    }, "-=0.2"); // Overlap slightly with the end of the "Welcome."

    return () => {
      tl.kill();
    };
  }, [isLoaded, setIsLoaded]);

  return (
    <div 
      ref={overlayRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none ${isLoaded ? 'hidden' : ''}`}
      style={{
        visibility: isLoaded ? "hidden" : "visible"
      }}
    >
      {/* Dynamic Text Container */}
      <div className="relative z-10 flex flex-col items-center justify-center overflow-hidden">
        <h1 
          ref={textRef} 
          className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-foreground"
        >
          {/* Text injected via GSAP */}
        </h1>
      </div>

      {/* Loading Progress Bar at the bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 md:w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full w-0 bg-primary"></div>
      </div>
    </div>
  );
}

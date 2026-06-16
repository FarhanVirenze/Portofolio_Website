"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: { src: string; alt: string }[];
  autoPlayInterval?: number;
  className?: string;
}

export function Carousel({
  images,
  autoPlayInterval = 4000,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, next, autoPlayInterval, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={cn("relative group overflow-hidden rounded-2xl", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-muted/30">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === current
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === current
                  ? "w-8 h-2 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  : "w-2 h-2 bg-foreground/30 hover:bg-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

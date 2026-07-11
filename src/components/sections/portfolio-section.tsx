"use client";

import { useEffect, useRef } from "react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.6c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

export function PortfolioSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getScrollAmount = () => {
          if (!trackRef.current) return 0;
          return Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
        };

        // Simple horizontal scroll — pin the section, scrub the track
        const st = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount() + window.innerHeight}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Container animation for cards popping up as they horizontally scroll in
        const cards = track.querySelectorAll(".portfolio-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: window.innerHeight },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: st,
                start: "left 120%", // Start animating slightly off-screen to eliminate dead-zones between cards!
                end: "left 50%",    // Finish animating early enough for the last card to complete
                scrub: true,        // Zero lag, 100% smooth mapping to scroll wheel
              },
            }
          );
        });

        // Refresh after all images inside the track have loaded
        const images = track.querySelectorAll("img");
        let loaded = 0;
        const total = images.length;

        if (total > 0) {
          const onImgLoad = () => {
            loaded++;
            if (loaded >= total) {
              ScrollTrigger.refresh();
            }
          };

          images.forEach((img) => {
            if (img.complete) {
              loaded++;
            } else {
              img.addEventListener("load", onImgLoad, { once: true });
              img.addEventListener("error", onImgLoad, { once: true });
            }
          });

          if (loaded >= total) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }
        }
      });

      // Mobile vertical scroll animation
      mm.add("(max-width: 767px)", () => {
        const cards = track.querySelectorAll(".portfolio-card");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, section);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <div
      id="portfolio"
      ref={sectionRef}
      className="relative w-full bg-background md:h-screen md:overflow-hidden py-24 md:py-0"
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="w-full md:w-max flex flex-col md:flex-row md:absolute md:top-0 md:left-0 md:h-full items-center gap-12 md:gap-14 px-6 md:px-[5vw]"
      >
        {/* Title */}
        <div className="w-full md:w-[35vw] md:h-full flex-shrink-0 flex flex-col justify-center text-center md:text-left mb-8 md:mb-0 pl-0 md:pl-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.05]">
            Selected work<br className="hidden md:block" /> & explorations
          </h2>
          <div className="mt-12 flex justify-center md:justify-start">
            <a href="#portfolio" className="inline-flex items-center gap-4 text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-border/60 pb-2">
               SCROLL TO EXPLORE MY RECENT PROJECTS. <span>→</span>
            </a>
          </div>
        </div>

        {/* Cards */}
        {projects.map((project, index) => {
          const imageUrl = project.image_url?.startsWith("http")
            ? project.image_url
            : `/img/portfolio-${project.image_url}.png`;

          return (
            <div
              key={project.id || index}
              className="portfolio-card w-full md:w-[65vw] lg:w-[55vw] h-[60vh] md:h-[78vh] flex-shrink-0 group flex flex-col bg-card rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative flex-[3] w-full overflow-hidden bg-muted/20">
                <Image
                  src={imageUrl}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {/* Floating buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 md:opacity-0 md:-translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                  {project.github_url && project.github_url !== "null" && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-background/80 backdrop-blur-sm text-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  )}
                  {project.demo_url && project.demo_url !== "null" && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-5 md:p-8 flex flex-col justify-center gap-3 bg-card">
                <h3 className="font-bold text-xl md:text-2xl text-foreground">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tech_stack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs rounded-full"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="w-full md:w-[50vw] flex items-center justify-center text-muted-foreground text-lg py-20 md:py-0">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Calendar, Award, Building2 } from "lucide-react";
import type { Certification as CertificationType } from "@/lib/types";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function CertificationSection({ certifications }: { certifications: CertificationType[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(".cert-card");
    const header = section.querySelector(".cert-header");

    const ctx = gsap.context(() => {
      // Header fades in
      if (header) {
        gsap.fromTo(header,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards fade in, staggered
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3D tilt effect on hover
      cards.forEach((card) => {
        const handleMouseMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = card.getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left;
          const y = mouseEvent.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5;
          const rotateY = ((x - centerX) / centerX) * 5;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            ease: "elastic.out(1, 0.3)",
            duration: 1,
          });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [certifications.length]);

  return (
    <div
      id="certification"
      ref={sectionRef}
      className="w-full relative z-10 bg-background py-24 overflow-hidden"
    >
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="space-y-12">
          {/* Header — slides from right */}
          <header className="cert-header space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">Certifications</h2>
                <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mt-2">Professional credentials & achievements</p>
              </div>
            </div>
          </header>

          {/* Card Grid — each card slides from right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>

          {certifications.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground">No certifications yet. Add some from the admin dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ cert }: { cert: CertificationType }) {
  const formattedDate = new Date(cert.issued_date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const imageUrl = cert.image_url?.startsWith("http")
    ? cert.image_url
    : `/img/${cert.image_url}`;

  return (
    <article className="cert-card group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 will-change-transform">
      {/* Certificate Image */}
      <a
        href={cert.credential_url || "#"}
        target="_blank"
        rel="noreferrer"
        className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30 block"
      >
        {cert.image_url ? (
          <img
            src={imageUrl}
            alt={cert.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {cert.credential_url && (
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center gap-1.5 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <ExternalLink className="w-3 h-3" />
            View Credential
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary/80 font-medium">
            <Building2 className="w-3 h-3" />
            {cert.issuer}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
          {cert.title}
        </h2>

        {cert.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {cert.description}
          </p>
        )}
      </div>
    </article>
  );
}

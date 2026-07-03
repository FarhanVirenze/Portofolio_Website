"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, User, Briefcase, Award } from "lucide-react";

const navLinks = [
  { name: "Home", path: "#hero", icon: Home },
  { name: "About", path: "#about", icon: User },
  { name: "Portofolio", path: "#portfolio", icon: Briefcase },
  { name: "Certification", path: "#certification", icon: Award },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer to detect active section
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting the most
        let maxRatio = 0;
        let mostVisibleSection = activeSection;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleSection = `#${entry.target.id}`;
          }
        });

        // Special case for portfolio because it pins (starts taking up 100% early)
        // Adjusting thresholds based on what's visible
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
             // If a section takes up at least 20% of screen, consider it active
             setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -40% 0px", // Trigger when element is somewhat in the middle of screen
        threshold: [0, 0.2, 0.5, 0.8, 1.0],
      }
    );

    const sections = document.querySelectorAll("section[id], div[id='portfolio'], div[id='certification'], div[id='about']");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const targetId = path.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(path);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 hidden md:block",
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="w-full px-6 md:px-10 lg:px-16 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleClick(e, "#hero")}
            className="text-2xl font-semibold text-primary hover:text-primary/80 transition-colors font-mono tracking-tight"
          >
            Farhan():
          </a>

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-1 text-sm font-medium bg-muted/50 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-border/50">
              {navLinks.map((link) => {
                const isActive = activeSection === link.path;
                return (
                  <li key={link.path} className="relative">
                    <a
                      href={link.path}
                      onClick={(e) => handleClick(e, link.path)}
                      className={cn(
                        "relative z-10 px-4 py-1.5 rounded-full transition-colors duration-300 block",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </a>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Top Right Theme Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-[60]">
        <ThemeToggle />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-1 left-4 right-4 z-50">
        <div className="bg-background/50 backdrop-blur-xl rounded-full shadow-2xl shadow-primary/10 px-2 flex items-center justify-around relative border border-border/60 h-16">
          {navLinks.map((link) => {
            const isActive = activeSection === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path} className="relative z-10 list-none flex-1 flex justify-center">
                <a
                  href={link.path}
                  onClick={(e) => handleClick(e, link.path)}
                  className="relative flex flex-col items-center justify-center w-full h-full"
                >
                  <div 
                    className={cn(
                      "relative flex items-center justify-center w-12 h-12 transition-all duration-500 z-20",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-bubble"
                        className="absolute inset-0 bg-primary rounded-full border-[6px] border-background shadow-md shadow-primary/30"
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                    <Icon 
                      className={cn(
                        "w-5 h-5 relative z-30 transition-colors duration-300",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )} 
                    />
                  </div>
                  
                </a>
              </li>
            );
          })}
        </div>
      </nav>
    </>
  );
}

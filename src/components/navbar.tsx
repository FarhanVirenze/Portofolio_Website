"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, User, Briefcase, Award } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: User },
  { name: "Portofolio", path: "/portofolio", icon: Briefcase },
  { name: "Certification", path: "/certification", icon: Award },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-semibold text-primary hover:text-primary/80 transition-colors font-mono tracking-tight"
          >
            <span className="text-2xl foreground"></span>
            Farhan():
          </Link>

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-1 text-sm font-medium bg-muted/50 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-border/50">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <li key={link.path} className="relative">
                    <Link
                      href={link.path}
                      className={cn(
                        "relative z-10 px-4 py-1.5 rounded-full transition-colors duration-300 block",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
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
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path} className="relative z-10 list-none flex-1 flex justify-center">
                <Link
                  href={link.path}
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
                  
                </Link>
              </li>
            );
          })}
        </div>
      </nav>
    </>
  );
}

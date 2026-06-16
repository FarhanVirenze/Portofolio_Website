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
  { name: "Portfolio", path: "/portofolio", icon: Briefcase },
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
        <ul className="flex items-center justify-around px-2 py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Award, Briefcase, Headphones, History, Home, LogOut, Settings, ShoppingCart, User, AlertCircle } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { name: "Home", path: "#hero", icon: Home },
  { name: "About", path: "#about", icon: User },
  { name: "Portofolio", path: "#portfolio", icon: Briefcase },
  { name: "Produk", path: "#products", icon: ShoppingCart },
  { name: "Certification", path: "#certification", icon: Award },
  { name: "Support", path: "#support", icon: Headphones },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#hero");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfileIncomplete(false);
      return;
    }

    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        const p = data?.profile;
        if (!p || !p.full_name || !p.phone || !p.address) {
          setProfileIncomplete(true);
        } else {
          setProfileIncomplete(false);
        }
      })
      .catch(() => {
        setProfileIncomplete(true);
      });
  }, [user]);

  useEffect(() => {
    // Intersection Observer to detect active section
    const observer = new IntersectionObserver(
      (entries) => {
        // Special case for portfolio because it pins (starts taking up 100% early)
        // Adjusting thresholds based on what's visible
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

    const sections = document.querySelectorAll("section[id], aside[id='support'], div[id='portfolio'], div[id='certification'], div[id='about']");
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

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
          <Link
            href="/"
            className="text-2xl font-semibold text-primary hover:text-primary/80 transition-colors font-mono tracking-tight"
          >
            Farhan();
          </Link>

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

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu user={user} displayName={displayName} initials={initials} onLogout={handleLogout} profileIncomplete={profileIncomplete} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Right Theme Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <Link
          href="/"
          className="text-xl font-semibold font-mono tracking-tight text-primary transition-colors hover:text-primary/80"
        >
          Farhan();
        </Link>
        <div className="flex items-center gap-2">
          <UserMenu user={user} displayName={displayName} initials={initials} onLogout={handleLogout} profileIncomplete={profileIncomplete} compact />
          <ThemeToggle />
        </div>
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

function UserMenu({
  user,
  displayName,
  initials,
  onLogout,
  profileIncomplete,
  compact = false,
}: {
  user: SupabaseUser | null;
  displayName: string;
  initials: string;
  onLogout: () => Promise<void>;
  profileIncomplete?: boolean;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:bg-muted",
            compact ? "h-9" : "h-9"
          )}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={cn(
            "hidden items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:inline-flex",
            compact ? "h-9" : "h-9"
          )}
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold text-foreground outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Buka menu profile"
        aria-expanded={isOpen}
      >
        {user.user_metadata?.avatar_url ? (
          <span
            aria-label={displayName}
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${user.user_metadata.avatar_url})` }}
          />
        ) : (
          <span>{initials || "U"}</span>
        )}
        {profileIncomplete && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-red-500">
            <AlertCircle className="h-2.5 w-2.5 text-white" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[80] w-64 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl shadow-black/10">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {profileIncomplete && (
              <p className="mt-1 text-xs text-red-500">Profil belum lengkap</p>
            )}
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <History className="h-4 w-4" />
            History Pesanan
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

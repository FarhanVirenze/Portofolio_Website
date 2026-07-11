"use client";

import { Mail } from "lucide-react";
import { supportContact } from "@/lib/store";

// Custom SVGs for brand icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.6 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.5 5.5 0 0 0-.2 3.8A5.5 5.5 0 0 0 3 9.6c0 4.9 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);
import { cn } from "@/lib/utils";

export function Footer() {
  const socialLinks = [
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      url: `mailto:${supportContact.email}`,
      hoverColor: "hover:text-emerald-500 hover:bg-emerald-500/10",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon className="w-5 h-5" />,
      url: "https://www.instagram.com/xffarhans",
      hoverColor: "hover:text-pink-500 hover:bg-pink-500/10",
    },
    {
      name: "TikTok",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      url: "https://www.tiktok.com/@farhans18_",
      hoverColor: "hover:text-red-500 hover:bg-red-500/10",
    },
    {
      name: "LinkedIn",
      icon: <LinkedinIcon className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/muhamadfrhn",
      hoverColor: "hover:text-blue-500 hover:bg-blue-500/10",
    },
    {
      name: "GitHub",
      icon: <GithubIcon className="w-5 h-5" />,
      url: "https://github.com/FarhanVirenze",
      hoverColor: "hover:text-violet-500 hover:bg-violet-500/10",
    },
  ];

  return (
    <footer className="w-full py-10 px-6 mt-auto pb-24 md:pb-10 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          Let&apos;s Connect
        </h2>

        <div className="flex justify-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.name}
              className={cn(
                "w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5",
                link.hoverColor
              )}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
          © {new Date().getFullYear()} Muhamad Farhan
        </p>
      </div>
    </footer>
  );
}

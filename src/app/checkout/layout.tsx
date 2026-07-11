"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3 md:px-6">
        <Link
          href="/"
          className="text-xl font-semibold font-mono tracking-tight text-primary transition-colors hover:text-primary/80 md:text-2xl"
        >
          Farhan();
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

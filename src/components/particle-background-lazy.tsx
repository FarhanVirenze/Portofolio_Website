"use client";

import dynamic from "next/dynamic";

const ParticleBackground = dynamic(
  () => import("@/components/ui/particle-background").then((m) => ({ default: m.ParticleBackground })),
  { ssr: false }
);

export function ParticleBackgroundLazy() {
  return <ParticleBackground />;
}

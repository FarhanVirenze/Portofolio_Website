"use client";

import dynamic from "next/dynamic";

const ThreeJsHero = dynamic(
  () => import("@/components/three-js-hero").then((m) => ({ default: m.ThreeJsHero })),
  { ssr: false }
);

export function ThreeJsHeroLazy() {
  return <ThreeJsHero />;
}

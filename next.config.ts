import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // To completely disable the dev indicator if needed, you might not be able to do it via config anymore in this version.
  // The logo only appears in development mode.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is Next's default. 90 is for the portrait photos on the home page:
    // at 75 their soft gradients (studio backdrop, sunset sky) band visibly.
    qualities: [75, 90],
  },
};

export default nextConfig;

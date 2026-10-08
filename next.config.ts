import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is Next's default. 90 is for the portrait photos on the home page:
    // at 75 their soft gradients (studio backdrop, sunset sky) band visibly.
    qualities: [75, 90],
  },
  // About is now a section of the home page; keep old links working.
  async redirects() {
    return [{ source: "/about", destination: "/#about", permanent: true }];
  },
};

export default nextConfig;

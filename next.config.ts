import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Studio pages are session-personal: the CDN must never cache them. PPR
  // makes the prerendered shell cacheable; this header closes that door.
  async headers() {
    return [
      {
        source: "/:gate/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
          { key: "Vary", value: "Cookie" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  images: {
    // Client logo marks are local, trusted SVG/PNG assets rendered monochrome.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox ''",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

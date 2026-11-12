import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents/PPR deliberately OFF: it prerendered session-checked
  // studio pages into the CDN cache (serving one user's render to others).
  // Studio routes are fully dynamic per request instead.
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

import type { MetadataRoute } from "next";
import { SITE as BASE } from "@/lib/seo";

// Deliberately does NOT mention the studio path: robots.txt is public and
// listing a secret there would leak it. The gate sends noindex headers
// instead. Public invoice links are also kept out via meta robots.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

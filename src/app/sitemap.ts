import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";

const BASE = "https://acevolumes.com.ng";

// The public sitemap. The studio gate is deliberately absent (it 404s for
// strangers and sends noindex headers); public invoice links are excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/work`, priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/services`, priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/mortgage`, priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/about`, priority: 0.7, changeFrequency: "yearly", lastModified: now },
    { url: `${BASE}/founder`, priority: 0.6, changeFrequency: "yearly", lastModified: now },
    { url: `${BASE}/contact`, priority: 0.8, changeFrequency: "yearly", lastModified: now },
  ];
  const cases: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    priority: 0.7,
    changeFrequency: "yearly",
    lastModified: now,
  }));
  return [...statics, ...cases];
}

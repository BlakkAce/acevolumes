import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";
import { POSTS } from "@/lib/blog";
import { SITE as BASE } from "@/lib/seo";

// The public sitemap. The studio gate is deliberately absent (it 404s for
// strangers and sends noindex headers); public invoice links are excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/work`, priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly", lastModified: now },
    ...POSTS.map(
      (p): MetadataRoute.Sitemap[number] => ({
        url: `${BASE}/blog/${p.slug}`,
        priority: 0.7,
        changeFrequency: "monthly",
        lastModified: new Date(`${p.date}T12:00:00Z`),
      }),
    ),
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

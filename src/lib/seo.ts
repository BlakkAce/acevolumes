// Shared JSON-LD builders. Structured data = how search engines stop
// guessing about who we are, what we sell, and what the answers are.

import { CATALOG, PROJECTS } from "@/lib/content";
import { FOUNDER } from "@/lib/founder";

// Canonical site origin for all SEO output. Currently the Vercel URL;
// flip this ONE line to https://acevolumes.com.ng when the custom domain
// is connected — sitemap, robots, canonicals, OG and schema all follow.
export const SITE = "https://acevolumes.vercel.app";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/#organization`,
    name: "AceVolumes",
    url: SITE,
    email: "acevolumesofficial@gmail.com",
    description:
      "Lagos digital studio founded in 2016, serving clients in the US and worldwide. Digital systems that make results easier: websites, e-commerce stores, branding, marketing, AI content and custom software.",
    foundingDate: "2016",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    areaServed: "Worldwide",
    knowsAbout: CATALOG.map((c) => c.title),
    makesOffer: CATALOG.map((c) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: c.title,
        description: c.line,
        url: `${SITE}/services#${c.id}`,
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AceVolumes services",
      itemListElement: CATALOG.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: c.title, url: `${SITE}/services#${c.id}` },
      })),
    },
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.role,
      url: `${SITE}/founder`,
    },
    sameAs: [
      "https://www.linkedin.com/company/acevolumes",
      "https://www.instagram.com/acevolumes/",
      "https://web.facebook.com/acevolumes",
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "AceVolumes",
    publisher: { "@id": `${SITE}/#organization` },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function caseStudyLd(p: {
  slug: string;
  client: string;
  discipline: string;
  summary: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.client} — ${p.discipline}`,
    headline: `${p.client} — ${p.discipline}`,
    description: p.summary,
    genre: p.discipline,
    url: `${SITE}/work/${p.slug}`,
    creator: { "@id": `${SITE}/#organization` },
    about: { "@type": "Organization", name: p.client },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

// Reference keep-alive for PROJECTS if unused by callers in tree-shaking.
export const projectSlugs = PROJECTS.map((p) => p.slug);

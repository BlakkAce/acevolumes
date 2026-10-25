import { SITE } from "@/lib/seo";
import { PROJECTS } from "@/lib/content";

/**
 * llms.txt — the emerging standard (llmstxt.org) for making a site legible to
 * AI assistants and agents. Must be Markdown, start with an H1, and carry
 * links with one-line descriptions. Generated from the same data sources as
 * the sitemap and JSON-LD so it never drifts from the site.
 */
export function GET() {
  const lines: string[] = [];

  lines.push("# AceVolumes");
  lines.push("");
  lines.push(
    `> AceVolumes is a Lagos digital studio founded in 2016 by David Olawuni, building digital systems that make results easier for clients in the US and worldwide. Services: website design and development, e-commerce stores, brand identity and graphic design, digital and email marketing, AI video and content, AI automation, custom software and technical consulting — including mortgage technology such as a custom loan operating system. We pride in delivering the very best.`
  );
  lines.push("");

  lines.push("## Main pages");
  lines.push("");
  lines.push(`- [Home](${SITE}/): AceVolumes — digital systems that make results easier. Lagos studio, clients worldwide since 2016.`);
  lines.push(`- [Services](${SITE}/services): Nine disciplines in one studio — web design, e-commerce, branding, digital marketing, custom development, AI solutions, business systems, content and consulting.`);
  lines.push(`- [Work](${SITE}/work): Selected case studies for clients in the US and worldwide.`);
  lines.push(`- [Mortgage & lending systems](${SITE}/mortgage): Loan-pipeline software, mortgage CRM, digital applications and lender websites.`);
  lines.push(`- [Founder](${SITE}/founder): David Olawuni — Founder, AceVersions`.replace("AceVersions", "AceVolumes"));
  lines.push(`- [About](${SITE}/about): The studio story, from 2016 to a worldwide clientele.`);
  lines.push(`- [Contact](${SITE}/contact): Start a project — enquiry form, or email ${"acevolumesofficial@gmail.com"}. Replies ASAP, Mon–Fri 9am–6pm WAT.`);
  lines.push("");

  lines.push("## Case studies");
  lines.push("");
  for (const p of PROJECTS) {
    const url = `${SITE}/work/${p.slug}`;
    lines.push(`- [${p.client}](${url}): ${p.discipline} — ${p.summary}`);
  }
  lines.push("");

  lines.push("## Machine-readable files");
  lines.push("");
  lines.push(`- [Sitemap](${SITE}/sitemap.xml): All ${14 + 1} public pages.`);
  lines.push(`- [Robots](${SITE}/robots.txt): Crawling policy.`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

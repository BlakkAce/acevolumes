// AceVolumes gap-scan proof of concept — no API keys, pure probing.
// Given business website URLs (or none), detect gaps a freelancer can sell:
// mobile support, SEO basics, TLS, builder fingerprint, speed.
// Opportunity score: 0 = healthy site, 100 = perfect lead ("no site at all").

const TARGETS = [
  { name: "InstaFi Home Loans", url: "https://instafiloans.com" },
  { name: "TeamERM / Excel Realty", url: "https://teamerm.com" },
  { name: "Jason Samuels Smith", url: "https://www.jsamsmith.com" },
  { name: "HCMG", url: "https://hcmgloans.com" },
  { name: "The Tab Team", url: "https://thetabteam.org" },
  { name: "True Terra Oils", url: "https://trueterraoils.com" },
  { name: "Top Trading Discounts", url: "https://toptradingdiscounts.com" },
  { name: "Business with no site", url: null }, // the ClientScout "no website" case
];

const BUILDERS = [
  ["WordPress", /wp-content|wp-includes|\/wp-json/i],
  ["Shopify", /cdn\.shopify\.com|shopify\.theme/i],
  ["Wix", /static\.parastorage|wixstatic/i],
  ["Squarespace", /squarespace|static1\.squarespace/i],
  ["Webflow", /webflow/i],
  ["GoDaddy", /godaddy|starfield/i],
  ["Next.js", /_next\/static/i],
];

async function scan({ name, url }) {
  const gaps = [];
  let score = url ? 15 : 100; // no website at all = perfect lead
  let builder = url ? "unknown" : "—";
  let ms = null;

  if (!url) gaps.push("No website found at all");

  if (url) {
    const t0 = Date.now();
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 8000);
      const res = await fetch(url, { signal: ctl.signal, redirect: "follow" });
      clearTimeout(timer);
      ms = Date.now() - t0;
      if (!res.url.startsWith("https://")) { gaps.push("No TLS / not on https"); score += 30; }
      const html = (await res.text()).slice(0, 300_000);
      if (!/<meta[^>]*viewport/i.test(html)) { gaps.push("Not mobile-friendly (no viewport)"); score += 25; }
      if (!/<meta[^>]*name=["']description["']/i.test(html)) { gaps.push("Missing meta description"); score += 10; }
      const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
      if (title.length < 10) { gaps.push("Weak/missing page title"); score += 10; }
      if (ms > 2000) { gaps.push(`Slow response (${(ms / 1000).toFixed(1)}s)`); score += 10; }
      const hit = BUILDERS.find(([, re]) => re.test(html));
      if (hit) builder = hit[0];
      if (builder === "unknown") { gaps.push("Hand-built or unidentified stack (refresh angle)"); score += 5; }
    } catch (e) {
      gaps.push(`Unreachable or broken site (${e.cause?.code ?? e.name})`);
      score = 90;
    }
  }
  return { name, url: url ?? "—", builder, ms, score: Math.min(100, score), gaps };
}

const results = (await Promise.all(TARGETS.map(scan))).sort((a, b) => b.score - a.score);
console.log(`\nAceVolumes gap-scan PoC — ${new Date().toISOString().slice(0, 10)}\n`);
console.log("SCORE  BUSINESS                  BUILDER      MS     GAPS");
for (const r of results) {
  console.log(
    `${String(r.score).padStart(3)}/100 ${r.name.padEnd(25)} ${r.builder.padEnd(12)} ${String(r.ms ?? "—").padEnd(6)} ${(r.gaps.length ? r.gaps.join("; ") : "healthy — not a lead").slice(0, 90)}`,
  );
}

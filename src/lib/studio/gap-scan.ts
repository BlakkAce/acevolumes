// AceVolumes gap-scan engine (production version of scripts/gap-scan-demo.mjs).
// Probes a business's web presence and returns a 0–100 opportunity score with
// human-readable reasons a freelancer can pitch against. Pure probing — no
// external API, no keys, no cost. 100 = no website at all (perfect lead).

const BUILDERS: [string, RegExp][] = [
  ["WordPress", /wp-content|wp-includes|\/wp-json/i],
  ["Shopify", /cdn\.shopify\.com|shopify\.theme/i],
  ["Wix", /static\.parastorage|wixstatic/i],
  ["Squarespace", /squarespace|static1\.squarespace/i],
  ["Webflow", /webflow/i],
  ["GoDaddy", /godaddy|starfield/i],
  ["Next.js", /_next\/static/i],
];

export const SOCIAL_HOSTS =
  /^(www\.)?(facebook\.com|instagram\.com|linktr\.ee|wa\.me|api\.whatsapp\.com|x\.com|twitter\.com|tiktok\.com|linkedin\.com|youtube\.com)$/i;

export type ScanResult = {
  url: string | null;
  reachable: boolean;
  builder: string;
  responseMs: number | null;
  score: number;
  gaps: string[];
  socialOnly: boolean;
};

export function classifyWebsite(
  websiteUri: string | null | undefined,
): "none" | "social" | "site" {
  if (!websiteUri) return "none";
  let host: string;
  try {
    host = new URL(websiteUri).hostname;
  } catch {
    return "site";
  }
  return SOCIAL_HOSTS.test(host) ? "social" : "site";
}

export async function scanSite(rawUrl: string | null): Promise<ScanResult> {
  const base: ScanResult = {
    url: rawUrl,
    reachable: false,
    builder: "unknown",
    responseMs: null,
    score: 15,
    gaps: [],
    socialOnly: false,
  };
  if (!rawUrl) {
    return { ...base, score: 100, gaps: ["No website found at all"] };
  }

  const kind = classifyWebsite(rawUrl);
  if (kind === "social") {
    return {
      ...base,
      url: rawUrl,
      socialOnly: true,
      score: 74,
      builder: "—",
      gaps: ["Social media page only — no real website"],
    };
  }

  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const t0 = Date.now();
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctl.signal,
      redirect: "follow",
      headers: { "User-Agent": "AceVolumes Scout/1.0 (+site audit)" },
    });
    clearTimeout(timer);
    const ms = Date.now() - t0;
    const html = (await res.text()).slice(0, 300_000);
    const r: ScanResult = { ...base, url, reachable: true, responseMs: ms };
    if (!/^https:/i.test(res.url || url)) {
      r.gaps.push("No TLS / not served over https");
      r.score += 30;
    }
    if (!/<meta[^>]*viewport/i.test(html)) {
      r.gaps.push("Not mobile-friendly (no viewport meta)");
      r.score += 25;
    }
    if (!/<meta[^>]*name=["']description["']/i.test(html)) {
      r.gaps.push("Missing meta description");
      r.score += 10;
    }
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    if (title.length < 10) {
      r.gaps.push("Weak or missing page title");
      r.score += 10;
    }
    if (ms > 2000) {
      r.gaps.push(`Slow response (${(ms / 1000).toFixed(1)}s)`);
      r.score += 10;
    }
    const hit = BUILDERS.find(([, re]) => re.test(html));
    r.builder = hit ? hit[0] : r.builder;
    if (!hit) {
      r.gaps.push("Hand-built or unidentified stack (refresh angle)");
      r.score += 5;
    }
    return r;
  } catch (e) {
    const code =
      (e as { cause?: { code?: string }; name?: string }).cause?.code ??
      (e as { name?: string }).name ??
      "Error";
    return {
      ...base,
      url,
      score: 90,
      gaps: [`Site unreachable or broken (${code})`],
    };
  }
}

/** Scan many sites with bounded concurrency, preserving input order. */
export async function scanMany(
  urls: (string | null)[],
  concurrency = 6,
): Promise<ScanResult[]> {
  const results: ScanResult[] = new Array(urls.length);
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const i = cursor++;
      results[i] = await scanSite(urls[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, urls.length) }, worker),
  );
  return results;
}

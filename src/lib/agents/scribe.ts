import { and, gte, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentRuns, posts } from "@/lib/db/schema";

/**
 * Scribe: drafts one week of social posts per platform into the posts table
 * (status "draft"). Nothing is published here — approval in the Content page
 * is the gate; Buffer is the only delivery layer.
 *
 * Voice: the studio's own — plain, specific, founder-first. Idea bank runs
 * on the offer playbook's hook types with only cashable facts (no invented
 * stats, no fake quotes). When an LLM key lands in env, the same rotation
 * feeds the model; queue + approval flow stay identical.
 */

export const PLATFORMS = ["facebook", "instagram", "x", "linkedin"] as const;
export type Platform = (typeof PLATFORMS)[number];

const SITE = "https://acevolumes.vercel.app";
const BRAND_LINE = "Digital systems that make results easier.";

/** Posting hours (UTC) chosen for a US-first audience. */
const HOUR_UTC: Record<Platform, number> = {
  facebook: 13,
  instagram: 17,
  x: 15,
  linkedin: 14,
};

/** LinkedIn is a weekdays channel; the others post daily. */
const WEEKDAYS_ONLY: Record<Platform, boolean> = {
  facebook: false,
  instagram: false,
  x: false,
  linkedin: true,
};

const BASE_TAGS = ["#AceVolumes", "#WebDesign", "#DigitalStudio"];

type Theme = {
  kind: string; // hook type label, shown in meta
  mediaRef: string | null;
  short: string;
  long: string;
  link: string;
  hashtags: string[];
};

// --------------------------------------------------------------------------
// Verified proof points (each traceable to the site or production facts)
const PROOF = {
  sites: "100+ websites built",
  since: "building since 2016",
  speed: "sub-2-second pages, zero third-party scripts",
  reply: "every reply within one working day, US-first timezones",
  founder: "the founder builds it himself — no handoffs, no account managers",
  effort: "you bring logo files, photos and one hour",
  reach: "clients across the US, Europe and Africa",
};

// Case studies (real, named, live)
const CASES: { slug: string; name: string; what: string; img: string }[] = [
  { slug: "harris-capital-mortgage", name: "Harris Capital Mortgage Group", what: "one site serving buyers, sellers, borrowers and recruiters without losing its voice", img: "/img/work-lender.jpg" },
  { slug: "the-tab-team", name: "The Tab Team", what: "a real-estate team site that turns visitors into booked consultations", img: "/img/work-web.jpg" },
  { slug: "trueterra-oils", name: "TrueTerra Oils", what: "an e-commerce store where the product story does the selling", img: "/img/work-ecommerce.jpg" },
  { slug: "top-trading-discounts", name: "Top Trading Discounts", what: "a deal platform where speed and clarity close the click", img: "/img/work-ecommerce.jpg" },
  { slug: "jason-samuels-smith", name: "Jason Samuels Smith", what: "a brand and site with the polish of a much larger outfit", img: "/img/work-brand.jpg" },
  { slug: "instafi-home-loans", name: "InstaFi Home Loans", what: "a mortgage experience that makes paperwork-heavy products feel simple", img: "/img/mortgage-tech.jpg" },
  { slug: "excel-realty-mortgage", name: "Excel Realty & Mortgage", what: "one system for a team that lives in both real estate and lending", img: "/img/work-realestate.jpg" },
  { slug: "hcmg-command", name: "HCMG Command", what: "internal loan-pipeline software that gives a lender one source of truth", img: "/img/mortgage-tech.jpg" },
];

// Seasonal angles (month-indexed, 0-11) — evergreen-safe, no invented events
const SEASONAL: Record<number, string> = {
  0: "New year, new site? The slow season is when redesigns should happen.",
  1: "Spring-buying season loads in a few months. Lenders: is your site ready for the traffic?",
  2: "Spring market, spring checkup: when did your site last get a conversion review?",
  3: "May is for momentum — publish the case study your prospects keep asking for.",
  4: "Mid-year audit: what is your site actually generating while you work?",
  5: "Summer shoppers browse on phones. Your site has three seconds on mobile.",
  6: "Slow summer, fast site: use the quiet weeks to fix the funnel.",
  7: "Back-to-business season: buyers return with intent. Be findable, be fast.",
  8: "Fall is closing season in real estate and lending. Your site should close too.",
  9: "Q4 planning: budget the website work before the year ends, not after.",
  10: "Small-business season: the shops that look alive online sell more offline.",
  11: "Plan January's launch in December. Ship while competitors hibernate.",
};

type Builder = (i: number) => Theme;

/** Hook-type idea bank (playbook): each builder returns a full theme. */
const BANK: { kind: string; build: Builder }[] = [
  {
    kind: "case-study (mechanism hook)",
    build: (i) => {
      const c = CASES[i % CASES.length];
      const url = `${SITE}/work/${c.slug}`;
      return {
        kind: "case",
        mediaRef: c.img,
        short: `${c.name} needed ${c.what}. The mechanism: one founder, one build, no handoffs. See the work: ${url}`,
        long: `Case study: ${c.name}.\n\nThe brief: ${c.what}.\n\nThe mechanism is the point — ${PROOF.founder}, and everything ships with ${PROOF.speed}.\n\nWalk the full project: ${url}\n\n${BRAND_LINE}`,
        link: url,
        hashtags: [...BASE_TAGS, "#CaseStudy"],
      };
    },
  },
  {
    kind: "proof (outcome hook)",
    build: () => ({
      kind: "proof",
      mediaRef: null,
      short: `${PROOF.sites} since 2016. ${PROOF.speed} on every build. ${PROOF.effort.charAt(0).toUpperCase()}${PROOF.effort.slice(1)}. Start: ${SITE}/contact`,
      long: `Numbers first, because they are checkable:\n\n• ${PROOF.sites} since 2016\n• ${PROOF.speed} — verified, not claimed\n• ${PROOF.reply}\n• ${PROOF.effort}\n\nIf your current site cannot be described in numbers like these, that is the sign.\n\n${SITE}/work\n\n${BRAND_LINE}`,
      link: `${SITE}/work`,
      hashtags: [...BASE_TAGS, "#Proof"],
    }),
  },
  {
    kind: "contrarian",
    build: (i) => {
      const takes = [
        "You do not need more traffic. You need the page to answer the question that brought the visitor. Traffic amplifies a funnel; it never repairs one.",
        "A cheap website is the most expensive thing a small business buys. Not because of the invoice — because of the years of visitors it quietly loses.",
        "Your website is not a brochure. Done right, it is the only salesperson who works every timezone, every weekend, and never forgets a detail.",
      ];
      const t = takes[i % takes.length];
      return {
        kind: "contrarian",
        mediaRef: null,
        short: t,
        long: `${t}\n\nWe audit sites like this every week at AceVolumes. If yours is quietly losing leads, a one-hour review finds exactly where: ${SITE}/contact\n\n${BRAND_LINE}`,
        link: `${SITE}/contact`,
        hashtags: [...BASE_TAGS, "#Contrarian"],
      };
    },
  },
  {
    kind: "pain (callout hook)",
    build: (i) => {
      const pains = [
        "US lenders: a borrower who bounces on your rates page is a borrower who bounces to your competitor. Clarity there beats any ad budget.",
        "Your site loads in six seconds. Your competitor's loads in two. Both of you paid for that visitor. Only one kept them.",
        "The best time to look established online was before your next client searched for you. The second best time is this week.",
      ];
      const t = pains[i % pains.length];
      return {
        kind: "pain",
        mediaRef: null,
        short: t,
        long: `${t}\n\nThe fix is rarely more marketing. It is a page that answers, loads fast and reads like the professional they hoped to find: ${SITE}/services\n\n${BRAND_LINE}`,
        link: `${SITE}/services`,
        hashtags: [...BASE_TAGS, "#Conversion"],
      };
    },
  },
  {
    kind: "founder (mechanism hook)",
    build: (i) => {
      const takes = [
        `I run a deliberately small studio in Lagos. ${PROOF.founder.charAt(0).toUpperCase()}${PROOF.founder.slice(1)}. That is the whole model.`,
        `${PROOF.sites.charAt(0).toUpperCase()}${PROOF.sites.slice(1)} since 2016, and I still build every one myself. Small on purpose: you get senior hands or you get nothing.`,
        `We pride in delivering the very best. Not as a slogan — as the reason ${PROOF.reach}, and the reason clients stay after launch.`,
      ];
      const t = takes[i % takes.length];
      return {
        kind: "founder",
        mediaRef: "/img/founder.jpg",
        short: t,
        long: `${t}\n\nMore about the studio and the work: ${SITE}/founder\n\n${BRAND_LINE}`,
        link: `${SITE}/founder`,
        hashtags: [...BASE_TAGS, "#Founder"],
      };
    },
  },
  {
    kind: "seasonal (time hook)",
    build: () => {
      const t = SEASONAL[new Date().getUTCMonth()];
      return {
        kind: "seasonal",
        mediaRef: "/img/work-social.jpg",
        short: t,
        long: `${t}\n\nA launch takes weeks, and the calendar does not negotiate. Start with one conversation: ${SITE}/contact\n\n${BRAND_LINE}`,
        link: `${SITE}/contact`,
        hashtags: [...BASE_TAGS, "#BuildNow"],
      };
    },
  },
  {
    kind: "effort hook (service)",
    build: (i) => {
      const svcs = [
        { s: "web design", line: "a site that closes, not a site that exists" },
        { s: "e-commerce", line: "a store where the product story does the selling" },
        { s: "branding", line: "a brand that reads like the professional they hoped to find" },
        { s: "custom software", line: "systems that give your team one source of truth" },
        { s: "AI content", line: "content that sounds like you on your best day" },
        { s: "digital marketing", line: "campaigns aimed at the question your buyer already has" },
      ];
      const v = svcs[i % svcs.length];
      return {
        kind: "service",
        mediaRef: "/img/work-social.jpg",
        short: `Need ${v.s}? You get ${v.line} — logo files, photos and one hour of your time is all we need. Tell us the goal: ${SITE}/contact`,
        long: `${v.s.charAt(0).toUpperCase()}${v.s.slice(1)}, done properly.\n\nYou bring the goal and ${PROOF.effort}. You get ${v.line}, shipped with ${PROOF.speed}, backed by ${PROOF.reply}.\n\nOne conversation is enough to know if we fit: ${SITE}/contact\n\n${BRAND_LINE}`,
        link: `${SITE}/contact`,
        hashtags: [...BASE_TAGS, "#BuildSomething"],
      };
    },
  },
];

function themeFor(seed: number): Theme {
  return BANK[seed % BANK.length].build(seed);
}

function altHooks(t: Theme): string[] {
  const name = t.short.match(/^(.*?) needed/)?.[1];
  if (t.kind.startsWith("case") && name) {
    return [
      `The site that wins trust before the first call: ${name}.`,
      `${name} did not need a prettier website. They needed one that closes.`,
    ];
  }
  if (t.kind === "contrarian") return ["Your website has one job. Most sites quietly skip it.", "The most expensive website is the cheap one."];
  if (t.kind === "proof") return ["Checkable numbers, not adjectives:", "We publish our stats because we can back them:"];
  if (t.kind === "pain") return ["Your next client is already searching. What do they find?", "Every bounce has a reason. Most are fixable in a week."];
  if (t.kind === "founder") return ["No account managers. No handoffs. The founder builds it himself.", "Small studio, senior hands. That is the whole model."];
  return ["Digital systems that make results easier. That is the entire job.", "Websites that sell while you sleep: that is the deliverable."];
}

function withHook(body: string, hook: string): string {
  const rest = body.includes("\n\n") ? body.slice(body.indexOf("\n\n") + 2) : "";
  return rest ? `${hook}\n\n${rest}` : hook;
}

function render(p: Platform, t: Theme, hookIndex = -1): string {
  if (p === "linkedin")
    return `${hookIndex >= 0 ? withHook(t.long, altHooks(t)[hookIndex]) : t.long}\n\n${t.hashtags.join(" ")}`;
  if (p === "facebook") {
    const body = t.short.startsWith(BRAND_LINE) ? t.short : `${t.short}\n\n${BRAND_LINE}`;
    const alt = hookIndex >= 0 ? withHook(body, altHooks(t)[hookIndex]) : body;
    return alt.startsWith(BRAND_LINE) || alt.includes(`\n\n${BRAND_LINE}`) ? alt : `${alt}\n\n${BRAND_LINE}`;
  }
  if (p === "instagram") {
    const body = t.short.split(" See it")[0].split(" Tell us")[0].split(" Start:")[0];
    const alt = hookIndex >= 0 ? withHook(body, altHooks(t)[hookIndex]) : body;
    return `${alt}\n.\n${t.hashtags.join(" ")}`;
  }
  const raw = hookIndex >= 0 ? withHook(t.short, altHooks(t)[hookIndex]) : t.short;
  return raw.length <= 280 ? raw : `${raw.slice(0, 277)}...`;
}

function dayStart(base: Date, offsetDays: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export type ScribeResult = { drafted: number; skipped: number };

/** Draft the next 7 days (starting tomorrow) for every platform. */
export async function draftWeek(now = new Date()): Promise<ScribeResult> {
  const db = getDb();
  let drafted = 0;
  let skipped = 0;

  for (let day = 1; day <= 7; day += 1) {
    const start = dayStart(now, day);
    const t = themeFor(start.getUTCDay() * 7 + start.getUTCDate());
    for (const p of PLATFORMS) {
      if (WEEKDAYS_ONLY[p]) {
        const dow = start.getUTCDay();
        if (dow === 0 || dow === 6) {
          skipped += 1;
          continue;
        }
      }
      const scheduledFor = new Date(start);
      scheduledFor.setUTCHours(HOUR_UTC[p], 0, 0, 0);
      const end = new Date(scheduledFor);
      end.setUTCMinutes(1);
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(and(gte(posts.scheduledFor, scheduledFor), lt(posts.scheduledFor, end)))
        .limit(1);
      if (existing.length > 0) {
        skipped += 1;
        continue;
      }
      const content = render(p, t);
      if (p === "x" && content.length > 280) {
        skipped += 1;
        continue;
      }
      const variants = [0, 1]
        .map((i) => render(p, t, i))
        .filter((v) => (p === "x" ? v.length <= 280 : true));
      await db.insert(posts).values({
        platform: p,
        hookVariants: variants.length > 0 ? JSON.stringify(variants) : null,
        content,
        mediaRef: t.mediaRef,
        link: t.link,
        scheduledFor,
        status: "draft",
        createdBy: `scribe:${t.kind}`,
      });
      drafted += 1;
    }
  }

  await db.insert(agentRuns).values({
    agent: "scribe",
    summary: `Drafted ${drafted} post${drafted === 1 ? "" : "s"} for the next 7 days (${skipped} slots already filled or skipped).`,
    status: "ok",
    meta: JSON.stringify({ drafted, skipped }),
  });

  return { drafted, skipped };
}

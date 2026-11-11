import { and, gte, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentRuns, posts } from "@/lib/db/schema";

/**
 * Scribe: drafts one week of social posts per platform into the posts table
 * (status "draft"). Nothing is published from here; the Content page in the
 * studio dashboard is the approval gate, the scheduler does the posting.
 *
 * v1 is template-driven from verified studio facts only (real projects, real
 * services, the brand line). When an LLM key lands in env, the same theme
 * rotation feeds the model instead of the templates; the queue and the
 * approval flow stay identical.
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

type Theme = {
  kind: "case" | "service" | "insight" | "founder" | "brand";
  mediaRef: string | null;
  /** Body used for facebook / instagram / x (kept short enough for x). */
  short: string;
  /** Longer body for linkedin. */
  long: string;
  link: string;
  hashtags: string[];
};

const CASES: { slug: string; name: string; what: string; img: string }[] = [
  {
    slug: "harris-capital-mortgage",
    name: "Harris Capital Mortgage Group",
    what: "a lender site that serves buyers, sellers, borrowers and recruits at once without losing its voice",
    img: "/img/work-lender.jpg",
  },
  {
    slug: "the-tab-team",
    name: "The Tab Team",
    what: "a real estate team site built to turn visitors into booked consultations",
    img: "/img/work-web.jpg",
  },
  {
    slug: "trueterra-oils",
    name: "TrueTerra Oils",
    what: "an e-commerce store that puts the product story first and makes checkout effortless",
    img: "/img/work-ecommerce.jpg",
  },
  {
    slug: "top-trading-discounts",
    name: "Top Trading Discounts",
    what: "a deal platform where speed and clarity do the selling",
    img: "/img/work-ecommerce.jpg",
  },
  {
    slug: "jason-samuels-smith",
    name: "Jason Samuels Smith",
    what: "a brand and site with the polish of a much larger outfit",
    img: "/img/work-brand.jpg",
  },
  {
    slug: "instafi-home-loans",
    name: "InstaFi Home Loans",
    what: "a mortgage experience that makes a paperwork-heavy product feel simple",
    img: "/img/mortgage-tech.jpg",
  },
  {
    slug: "excel-realty-mortgage",
    name: "Excel Realty & Mortgage",
    what: "one system for a team that lives in both real estate and lending",
    img: "/img/work-realestate.jpg",
  },
  {
    slug: "hcmg-command",
    name: "HCMG Command",
    what: "internal loan-pipeline software that gives a lender one source of truth",
    img: "/img/mortgage-tech.jpg",
  },
];

const SERVICES: string[] = [
  "web design",
  "e-commerce",
  "branding",
  "digital marketing",
  "AI content",
  "custom software",
];

const INSIGHTS: string[] = [
  "Most lender websites lose borrowers on the rates page. Clarity there is worth more than any ad budget.",
  "A website that loads in under two seconds keeps more leads than one that loads in five. Speed is a sales feature.",
  "The best time to look established online was before your next client searched for you. The second best time is now.",
  "US lenders do not need more traffic. They need the right page to answer the question that brought the visitor.",
];

const FOUNDER: string[] = [
  "I run a deliberately small studio in Lagos. When you hire AceVolumes, I build the system myself. That is the whole model.",
  "Since 2016 I have been building websites and the machinery behind them for teams in the US and worldwide. We pride in delivering the very best.",
  "Small studio, senior hands, one focus: systems that make results easier for the people who hire us.",
];

const BASE_TAGS = ["#AceVolumes", "#WebDesign", "#DigitalStudio"];

function themeFor(dayIndex: number): Theme {
  const kind = (["case", "service", "insight", "case", "founder", "brand", "case"] as const)[
    dayIndex % 7
  ];
  if (kind === "case") {
    const c = CASES[dayIndex % CASES.length];
    const url = `${SITE}/work/${c.slug}`;
    return {
      kind,
      mediaRef: c.img,
      short: `New work: ${c.name}. We built ${c.what}. See it: ${url}`,
      long: `Case study: ${c.name}.\n\nWe built ${c.what}.\n\nWalk through the whole project here: ${url}\n\n${BRAND_LINE}`,
      link: url,
      hashtags: [...BASE_TAGS, "#CaseStudy"],
    };
  }
  if (kind === "service") {
    const sv = SERVICES[dayIndex % SERVICES.length];
    return {
      kind,
      mediaRef: "/img/work-social.jpg",
      short: `Need ${sv} that actually moves numbers? That is most of what we do. Tell us the goal: ${SITE}/contact`,
      long: `${sv.charAt(0).toUpperCase()}${sv.slice(1)}, done properly.\n\nAceVolumes is a Lagos studio serving teams in the US and worldwide since 2016. One conversation is enough to know whether we are the right fit: ${SITE}/contact\n\n${BRAND_LINE}`,
      link: `${SITE}/contact`,
      hashtags: [...BASE_TAGS, "#BuildSomething"],
    };
  }
  if (kind === "insight") {
    const t = INSIGHTS[dayIndex % INSIGHTS.length];
    return {
      kind,
      mediaRef: null,
      short: t,
      long: `${t}\n\nWe audit sites like this every week at AceVolumes. If yours is quietly losing leads, a one-hour review finds it: ${SITE}/contact\n\n${BRAND_LINE}`,
      link: `${SITE}/contact`,
      hashtags: [...BASE_TAGS, "#Conversion"],
    };
  }
  if (kind === "founder") {
    const t = FOUNDER[dayIndex % FOUNDER.length];
    return {
      kind,
      mediaRef: "/img/founder.jpg",
      short: t,
      long: `${t}\n\nMore about the studio and the work: ${SITE}/founder\n\n${BRAND_LINE}`,
      link: `${SITE}/founder`,
      hashtags: [...BASE_TAGS, "#Founder"],
    };
  }
  return {
    kind: "brand",
    mediaRef: "/img/work-social.jpg",
    short: `${BRAND_LINE} Websites, e-commerce, branding, marketing, AI content and software. ${SITE}`,
    long: `${BRAND_LINE}\n\nAceVolumes builds websites, e-commerce stores, brands, marketing and custom software for teams in the US and worldwide, from Lagos since 2016.\n\nSee the work: ${SITE}/work\n\nWe pride in delivering the very best.`,
    link: `${SITE}/work`,
    hashtags: [...BASE_TAGS, "#DigitalSystems"],
  };
}

/** Alternative first-line hooks per theme kind (playbook types; no invented facts). */
function altHooks(t: Theme): string[] {
  if (t.kind === "case") {
    const name = t.short.match(/New work: ([^.]+)\./)?.[1] ?? "the client";
    return [
      `The site that wins trust before the first call: ${name}.`,
      `${name} needed a site that closes, not a site that exists. Here is what we built.`,
    ];
  }
  if (t.kind === "service") {
    return [
      "One hour of your time. We build the rest.",
      "Your competitors published this week. Did you?",
    ];
  }
  if (t.kind === "insight") {
    return [
      "You do not need more traffic. You need the right page.",
      "Most sites lose the sale in the first two seconds.",
    ];
  }
  if (t.kind === "founder") {
    return [
      "No account managers. No handoffs. The founder builds it himself.",
      "Small studio, senior hands. That is the whole model.",
    ];
  }
  return [
    "Digital systems that make results easier. That is the entire job.",
    "Websites that sell while you sleep: that is the deliverable.",
  ];
}

/** Prepend a different first line, replacing the original first line. */
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
    const body = t.short.split(" See it")[0].split(" Tell us")[0];
    const alt = hookIndex >= 0 ? withHook(body, altHooks(t)[hookIndex]) : body;
    return `${alt}\n.\n${t.hashtags.join(" ")}`;
  }
  // x: hard ceiling 280
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
    const t = themeFor(start.getUTCDay() + day);
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
        createdBy: "scribe",
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

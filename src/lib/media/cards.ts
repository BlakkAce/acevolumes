import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";

/**
 * Branded social cards, generated server-side. Deliberately geometric (no
 * text rendering) so they render identically everywhere without font
 * dependencies: plum field, cream AV mark, gold amplitude bars, constell-
 * ation dots. Stored in media_assets and served from /api/media/<token>,
 * which gives Buffer a stable public image URL.
 */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://acevolumes.vercel.app";

const PLUM = "#3b153a";
const CREAM = "#fbf4e7";
const GOLD = "#cf9d3f";

function mark(x: number, y: number, s: number, stroke: number): string {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${CREAM}" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter">
    <path d="M13.5 41 L23.5 14.5 L33.5 41"/>
    <line x1="17.7" y1="29.5" x2="29.3" y2="29.5"/>
    <path d="M35 14.5 L44.5 41 L54 14.5"/>
  </g>`;
}

function bars(y: number, x: number, h: number, w: number, gap: number): string {
  const heights = [0.35, 0.5, 0.65, 0.8, 0.95, 1, 0.85, 0.7, 0.55, 0.4, 0.9, 1, 0.75, 0.6, 0.45];
  return heights
    .map((hh, i) => `<rect x="${x + i * (w + gap)}" y="${y - h * hh}" width="${w}" height="${h * hh}" fill="${GOLD}"/>`)
    .join("");
}

function dots(seed: number): string {
  let out = "";
  for (let i = 0; i < 42; i += 1) {
    const a = Math.sin(seed + i * 12.9898) * 43758.5453;
    const b = Math.sin(seed + i * 78.233) * 12543.1234;
    const x = 40 + (a - Math.floor(a)) * 1000;
    const y = 40 + (b - Math.floor(b)) * 700;
    const r = 1.5 + (i % 3);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${CREAM}" opacity="0.16"/>`;
  }
  return out;
}

function card(variant: number): string {
  if (variant % 2 === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="${PLUM}"/>
  ${dots(7)}
  ${mark(120, 300, 8.5, 5.2)}
  ${bars(880, 120, 90, 34, 18)}
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="${PLUM}"/>
  ${dots(23)}
  <circle cx="540" cy="470" r="330" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.55"/>
  ${mark(400, 340, 5, 6)}
  ${bars(880, 300, 60, 22, 12)}
</svg>`;
}

/**
 * Optional AI illustration via Google "nano banana" (Gemini image
 * generation). Activates only when GEMINI_API_KEY exists; brand cards
 * remain the always-available fallback. Prompts are brand-styled and
 * abstract: no text rendering (the model mangles words), no people.
 */
async function generateIllustration(postId: number, variant: number): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const id = `ai-${postId}`;
  const db = getDb();
  const existing = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (existing.length > 0) return `${SITE}/api/media/${id}`;
  try {
    const prompts = [
      "Abstract minimalist editorial illustration, deep plum purple background (#3b153a), cream and warm gold geometric shapes suggesting growth and rising bar charts, soft constellation dots, premium fintech aesthetic, flat vector style, no text, no letters, no people, square 1:1",
      "Abstract minimalist editorial illustration, deep plum purple background, elegant gold arc curving like a runway across cream geometric buildings, subtle starfield dots, premium architecture-meets-finance aesthetic, flat vector style, no text, no letters, no people, square 1:1",
    ];
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image"}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompts[variant % prompts.length] }] }],
        }),
      },
    );
    if (!res.ok) return null;
    const out = (await res.json()) as {
      candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
    };
    const part = out.candidates?.[0]?.content?.parts?.find((x) => x.inlineData?.data);
    if (!part?.inlineData?.data) return null;
    const mime = part.inlineData.mimeType ?? "image/png";
    await db
      .insert(mediaAssets)
      .values({ id, mime, data: part.inlineData.data })
      .onConflictDoNothing();
    return `${SITE}/api/media/${id}`;
  } catch {
    return null; // any failure -> brand card fallback
  }
}

/** Returns a public image URL for the post: existing asset, AI illustration (when configured), or brand card. */
export async function ensureMediaUrl(mediaRef: string | null, postId: number): Promise<string | null> {
  if (mediaRef) {
    return mediaRef.startsWith("http") ? mediaRef : `${SITE}${mediaRef}`;
  }
  if (!dbConfigured()) return null;
  const ai = await generateIllustration(postId, postId);
  if (ai) return ai;
  const db = getDb();
  const id = `card-${postId}-${postId % 2}`;
  const existing = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .limit(1)
    .then((rows) => rows.find((r) => r.id === id));
  if (!existing) {
    const svg = card(postId);
    const { default: sharp } = await import("sharp");
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    await db
      .insert(mediaAssets)
      .values({ id, mime: "image/png", data: png.toString("base64") })
      .onConflictDoNothing();
  }
  return `${SITE}/api/media/${id}`;
}

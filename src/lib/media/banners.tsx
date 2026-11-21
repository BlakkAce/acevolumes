import { ImageResponse } from "next/og";

/**
 * Branded social banners — light editorial design (David's approved look):
 * cream field, black logo top-left, gold kicker, big ink headline, muted
 * brand sub-line over a short gold rule, gold vertical bar on the right edge.
 * Satori via next/og; fonts fetched from the site's own /fonts directory and
 * the logo from /media — both embedded as data URIs (serverless-safe).
 */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://acevolumes.vercel.app";

const CREAM_BG = "#f7f1e6";
const INK = "#17120b";
const GOLD = "#8f6208";
const MUTED = "#6f6252";

const fontCache = new Map<string, ArrayBuffer>();
async function font(name: string): Promise<ArrayBuffer> {
  let buf = fontCache.get(name);
  if (!buf) {
    const res = await fetch(`${SITE}/fonts/${name}`);
    if (!res.ok) throw new Error(`font fetch failed: ${name} (${res.status})`);
    buf = await res.arrayBuffer();
    fontCache.set(name, buf);
  }
  return buf;
}

let logoCache: string | null = null;
async function logoDataUrl(): Promise<string> {
  if (!logoCache) {
    const res = await fetch(`${SITE}/media/logo-black.png`);
    if (!res.ok) throw new Error(`logo fetch failed (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    logoCache = `data:image/png;base64,${buf.toString("base64")}`;
  }
  return logoCache;
}

export type BannerShape = "sq" | "land";

const DIM: Record<
  BannerShape,
  { w: number; h: number; head: number; line: number; kick: number; sub: number; logoW: number; logoH: number; pad: number; bar: number; maxChars: number }
> = {
  sq: { w: 1080, h: 1080, head: 84, line: 20, kick: 25, sub: 28, logoW: 162, logoH: 108, pad: 92, bar: 54, maxChars: 58 },
  land: { w: 1200, h: 675, head: 58, line: 30, kick: 21, sub: 22, logoW: 132, logoH: 88, pad: 84, bar: 44, maxChars: 88 },
};

/** Cut long text at a natural phrase boundary (clause end or word + ellipsis). */
function smartCut(text: string, cap: number): string {
  if (text.length <= cap) return text;
  for (let i = cap; i >= Math.floor(cap * 0.5); i -= 1) {
    const ch = text[i];
    if ((ch === "," || ch === ";" || ch === ":") && text[i + 1] === " ") {
      return text.slice(0, i).replace(/[\s.,;:]+$/, "");
    }
  }
  const cut = text.slice(0, cap);
  const at = cut.lastIndexOf(" ");
  return `${cut.slice(0, at > cap * 0.55 ? at : cap).replace(/[\s.,;:]+$/, "")}…`;
}

/** Extract a banner headline from post content: complete sentences that fit. */
export function headlineFromContent(content: string, shape: BannerShape): string {
  const cap = DIM[shape].maxChars;
  let line =
    content
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith(".")) ?? "";
  line = line.replace(/^Direct answer:\s*/i, "");
  line = line.replace(/\s*Save this\.\s*.*$/, "");
  line = line.replace(/#[A-Za-z0-9_]+/g, "").replace(/\s{2,}/g, " ").trim();
  line = line.replace(/[.,;:\s]+$/, "");
  const sentences = line.split(/(?<=[.!?])\s+/).filter(Boolean);
  let acc = "";
  for (const sn of sentences) {
    const cand = acc ? `${acc} ${sn}` : sn;
    if (cand.length <= cap) acc = cand;
    else break;
    if (acc.length >= Math.round(cap * 0.62)) break;
  }
  if (acc.length >= 24) return acc;
  const fits = sentences.find((sn) => sn.length >= 24 && sn.length <= cap);
  if (fits) return fits;
  return smartCut(sentences[0] ?? line, cap);
}

/** Split into balanced display lines that fit the canvas width (max 3). */
function splitLines(text: string, shape: BannerShape): string[] {
  const per = DIM[shape].line;
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w;
    if (cand.length > per && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cand;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > 3) {
    const kept = lines.slice(0, 2);
    const rest = lines.slice(2).join(" ");
    kept.push(smartCut(rest, per - 1));
    lines.length = 0;
    lines.push(...kept);
  }
  // Rebalance: no one-word widow lines.
  for (let i = 0; i < 3; i += 1) {
    const last = lines[lines.length - 1] ?? "";
    const prev = lines[lines.length - 2];
    if (!prev) break;
    const prevWords = prev.split(" ");
    if (last.length < Math.max(7, Math.round(per * 0.3)) && prevWords.length > 2) {
      const moved = prevWords.pop();
      lines[lines.length - 2] = prevWords.join(" ");
      lines[lines.length - 1] = `${moved} ${last}`.trim();
    } else break;
  }
  return lines;
}

export async function renderBannerPng(opts: {
  headline: string;
  shape: BannerShape;
  variant: number;
}): Promise<Buffer> {
  const { headline, shape, variant } = opts;
  const d = DIM[shape];
  const lines = splitLines(headline, shape);
  const logo = await logoDataUrl();
  const centered = variant % 2 === 1;

  const textBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: shape === "sq" ? 34 : 24,
        alignItems: centered ? "center" : "flex-start",
        textAlign: centered ? "center" : "left",
      }}
    >
      <span
        style={{
          color: GOLD,
          fontSize: d.kick,
          fontWeight: 600,
          letterSpacing: 6,
          display: "flex",
        }}
      >
        ACEVOLUMES
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: shape === "sq" ? 10 : 8,
          alignItems: centered ? "center" : "flex-start",
        }}
      >
        {lines.map((l, i) => (
          <span
            key={i}
            style={{
              color: INK,
              fontSize: d.head,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1,
              display: "flex",
            }}
          >
            {l}
          </span>
        ))}
      </div>
      <span
        style={{
          color: MUTED,
          fontSize: d.sub,
          fontWeight: 500,
          display: "flex",
        }}
      >
        Digital systems that make results easier.
      </span>
      <div
        style={{
          width: shape === "sq" ? 116 : 96,
          height: 7,
          background: GOLD,
          display: "flex",
        }}
      />
    </div>
  );

  const body =
    centered && shape === "sq" ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: d.pad,
          paddingRight: d.bar + 40,
          gap: 64,
        }}
      >
        <img src={logo} width={d.logoW} height={d.logoH} style={{ display: "flex" }} />
        {textBlock}
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingLeft: d.pad,
          paddingRight: d.bar + 48,
          paddingTop: shape === "sq" ? 88 : 64,
          paddingBottom: shape === "sq" ? 84 : 60,
        }}
      >
        <img src={logo} width={d.logoW} height={d.logoH} style={{ display: "flex" }} />
        {textBlock}
      </div>
    );

  const res = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: CREAM_BG,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: d.bar,
            background: GOLD,
            display: "flex",
          }}
        />
        {body}
      </div>
    ),
    {
      width: d.w,
      height: d.h,
      fonts: [
        { name: "Archivo", data: await font("archivo-700.ttf"), weight: 700, style: "normal" },
        { name: "Archivo", data: await font("archivo-500.ttf"), weight: 500, style: "normal" },
        { name: "SpaceGrotesk", data: await font("space-grotesk-600.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
  return Buffer.from(await res.arrayBuffer());
}

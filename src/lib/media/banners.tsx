import { ImageResponse } from "next/og";

/**
 * Branded social banners with real typography (satori via next/og).
 * Every post gets its own banner: the post's hook as the headline, brand
 * plum/cream/gold identity, three rotating layouts. Static font weights are
 * pre-instanced from the brand's variable fonts (public/fonts).
 */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://acevolumes.vercel.app";

const PLUM = "#3b153a";
const PLUM_DEEP = "#2a0f29";
const CREAM = "#fbf4e7";
const GOLD = "#cf9d3f";

const fontCache = new Map<string, ArrayBuffer>();
/**
 * Fonts are fetched from the site's own /fonts directory: works on any host
 * (serverless bundles do not reliably include files read via readFileSync).
 */
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

export type BannerShape = "sq" | "land";

const DIM: Record<BannerShape, { w: number; h: number; head: number; line: number; kick: number; foot: number; maxChars: number }> = {
  sq: { w: 1080, h: 1080, head: 82, line: 30, kick: 26, foot: 26, maxChars: 80 },
  land: { w: 1200, h: 675, head: 62, line: 34, kick: 22, foot: 22, maxChars: 92 },
};

/**
 * Cut long text at a natural phrase boundary: prefer the last punctuation
 * mark (a natural clause end), fall back to a word boundary with ellipsis.
 */
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

/** Extract a banner headline from post content: the hook line, cleaned. */
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
  // Prefer complete sentences: a headline that ends mid-thought reads badly.
  const sentences = line.split(/(?<=[.!?])\s+/).filter(Boolean);
  let pick = sentences[0] ?? line;
  if (pick.length < 24 && sentences.length > 1) {
    const two = `${pick} ${sentences[1]}`;
    if (two.length <= cap) pick = two;
  }
  return smartCut(pick, cap);
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
    return kept;
  }
  return lines;
}

function dots(seed: number, count: number): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = Math.sin(seed + i * 12.9898) * 43758.5453;
    const b = Math.sin(seed + i * 78.233) * 12543.1234;
    const x = (a - Math.floor(a)) * 100;
    const y = (b - Math.floor(b)) * 100;
    const r = 2 + ((seed + i) % 4);
    out.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: r * 2,
          height: r * 2,
          borderRadius: 999,
          background: CREAM,
          opacity: 0.14,
        }}
      />,
    );
  }
  return out;
}

function bars(seed: number, height: number, count = 9): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < count; i += 1) {
    const a = Math.sin(seed * 3 + i * 7.31) * 1913.7;
    const hh = 0.25 + (a - Math.floor(a)) * 0.75;
    out.push(
      <div
        key={i}
        style={{
          width: 13,
          height: Math.round(height * hh),
          background: GOLD,
          display: "flex",
        }}
      />,
    );
  }
  return out;
}

function BrandFooter({ shape }: { shape: BannerShape }): React.ReactNode {
  const d = DIM[shape];
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg
          width={d.foot + 8}
          height={d.foot + 8}
          viewBox="0 0 60 52"
          fill="none"
          stroke={CREAM}
          strokeWidth={4.6}
          strokeLinecap="square"
        >
          <path d="M13.5 41 L23.5 14.5 L33.5 41" />
          <line x1="17.7" y1="29.5" x2="29.3" y2="29.5" />
          <path d="M35 14.5 L44.5 41 L54 14.5" />
        </svg>
        <span
          style={{
            color: CREAM,
            fontSize: d.foot,
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          AceVolumes
        </span>
      </div>
      <span
        style={{
          color: CREAM,
          opacity: 0.72,
          fontSize: d.foot - 3,
          letterSpacing: 1,
        }}
      >
        acevolumes.vercel.app
      </span>
    </div>
  );
}

function Kicker({ shape }: { shape: BannerShape }): React.ReactNode {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 56, height: 4, background: GOLD, display: "flex" }} />
      <span
        style={{
          color: GOLD,
          fontSize: DIM[shape].kick,
          fontWeight: 600,
          letterSpacing: 7,
        }}
      >
        ACEVOLUMES
      </span>
    </div>
  );
}

function Headline({
  lines,
  shape,
  align,
}: {
  lines: string[];
  shape: BannerShape;
  align: "flex-start" | "center";
}): React.ReactNode {
  const d = DIM[shape];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: align,
        textAlign: align === "center" ? "center" : "left",
      }}
    >
      {lines.map((l, i) => (
        <span
          key={i}
          style={{
            color: CREAM,
            fontSize: d.head,
            fontWeight: 700,
            lineHeight: 1.14,
            display: "flex",
          }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

export async function renderBannerPng(opts: {
  headline: string;
  shape: BannerShape;
  variant: number;
}): Promise<Buffer> {
  const { headline, shape, variant } = opts;
  const d = DIM[shape];
  const lines = splitLines(headline, shape);
  const centered = variant % 3 === 1;
  const barsHeavy = variant % 3 === 2;

  const body =
    centered && shape === "sq" ? (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: 999,
            border: `3px solid ${GOLD}`,
            opacity: 0.5,
            display: "flex",
            top: 220,
            left: 220,
          }}
        />
        <Kicker shape={shape} />
        <Headline lines={lines} shape={shape} align="center" />
        <BrandFooter shape={shape} />
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: barsHeavy ? "0" : 64,
          paddingBottom: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
            paddingLeft: barsHeavy ? 72 : 0,
            paddingRight: barsHeavy ? 72 : 0,
            paddingTop: barsHeavy ? 96 : 0,
          }}
        >
          <Kicker shape={shape} />
          {barsHeavy ? (
            <div
              style={{
                display: "flex",
                borderLeft: `6px solid ${GOLD}`,
                paddingLeft: 36,
              }}
            >
              <Headline lines={lines} shape={shape} align="flex-start" />
            </div>
          ) : (
            <Headline lines={lines} shape={shape} align="flex-start" />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {barsHeavy ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                paddingLeft: 72,
                height: 90,
              }}
            >
              {bars(variant + 5, 90, 13)}
            </div>
          ) : (
            <div style={{ display: "flex", height: 20 }} />
          )}
          <BrandFooter shape={shape} />
        </div>
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
          background: `radial-gradient(ellipse 900px 700px at 18% 12%, ${PLUM} 0%, ${PLUM_DEEP} 78%)`,
          position: "relative",
        }}
      >
        {dots(variant + 3, 16)}
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

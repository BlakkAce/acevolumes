import { NextResponse, type NextRequest } from "next/server";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { passphraseMatches, sessionExpiresAt, signSession } from "@/lib/studio/session";

// In-memory rate limit: 5 failures per IP per 10 minutes.
// Per-instance on serverless; combined with a strong passphrase and the
// per-attempt delay this is adequate for v1 (upgrade: DB-backed counter).
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gate: string }> },
) {
  const { gate } = await params;
  if (!studioConfigured() || gate !== STUDIO_PATH) {
    return NextResponse.redirect(new URL("/404", req.url), 303);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.until > now && rec.n >= MAX_ATTEMPTS) {
    return NextResponse.redirect(
      new URL(`/${STUDIO_PATH}?e=rate`, req.url),
      303,
    );
  }

  // Level the wall: every attempt costs ~0.4-0.8s, online or offline.
  await sleep(400 + Math.random() * 400);

  const form = await req.formData();
  const passphrase = String(form.get("passphrase") ?? "");

  if (!passphraseMatches(passphrase)) {
    const next = rec && rec.until > now ? rec : { n: 0, until: now + WINDOW_MS };
    next.n += 1;
    attempts.set(ip, next);
    return NextResponse.redirect(new URL(`/${STUDIO_PATH}?e=1`, req.url), 303);
  }

  attempts.delete(ip);
  const expires = sessionExpiresAt();
  const res = NextResponse.redirect(
    new URL(`/${STUDIO_PATH}/dashboard`, req.url),
    303,
  );
  res.cookies.set({
    name: "av_studio",
    value: signSession(expires),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    expires: new Date(expires),
  });
  return res;
}

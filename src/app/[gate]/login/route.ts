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

// Relative Location: browsers resolve it against the current origin, so the
// redirect works behind any proxy/host (bind-address URLs like 0.0.0.0:3000
// break previews and proxied deploys).
function seeOther(location: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gate: string }> },
) {
  const { gate } = await params;
  if (!studioConfigured() || gate !== STUDIO_PATH) {
    return seeOther("/404");
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.until > now && rec.n >= MAX_ATTEMPTS) {
    return seeOther(`/${STUDIO_PATH}?e=rate`);
  }

  // Level the wall: every attempt costs ~0.4-0.8s, online or offline.
  await sleep(400 + Math.random() * 400);

  const form = await req.formData();
  const passphrase = String(form.get("passphrase") ?? "");

  if (!passphraseMatches(passphrase)) {
    const next = rec && rec.until > now ? rec : { n: 0, until: now + WINDOW_MS };
    next.n += 1;
    attempts.set(ip, next);
    return seeOther(`/${STUDIO_PATH}?e=1`);
  }

  attempts.delete(ip);
  const expires = sessionExpiresAt();
  const res = seeOther(`/${STUDIO_PATH}/dashboard`);
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

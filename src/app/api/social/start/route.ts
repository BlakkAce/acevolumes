import { NextResponse, type NextRequest } from "next/server";
import { hasSession } from "@/lib/studio/session";
import { authorizeUrl, makeState, type OAuthPlatform } from "@/lib/social/oauth";

const ALLOWED: OAuthPlatform[] = ["meta", "x", "linkedin"];

// GET /api/social/start?platform=meta  — session-gated OAuth kickoff.
export async function GET(req: NextRequest) {
  if (!(await hasSession())) {
    // Hard, body-less 404: same response middleware gives unknown paths.
    return new NextResponse(null, { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }
  const platform = req.nextUrl.searchParams.get("platform") as OAuthPlatform | null;
  if (!platform || !ALLOWED.includes(platform)) {
    // Hard, body-less 404: same response middleware gives unknown paths.
    return new NextResponse(null, { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }
  const { state } = makeState(platform);
  const url = authorizeUrl(platform, state);
  const res = NextResponse.redirect(url);
  res.cookies.set({
    name: "av_oauth",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 900,
  });
  return res;
}

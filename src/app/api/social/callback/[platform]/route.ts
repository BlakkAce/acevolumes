import { NextResponse, type NextRequest } from "next/server";
import { hasSession } from "@/lib/studio/session";
import { credsFor, callbackUrl, readState, type OAuthPlatform } from "@/lib/social/oauth";
import { saveConnection } from "@/lib/social/store";

const API_BASE = "https://acevolumes.vercel.app";

function done(req: NextRequest, result: string): NextResponse {
  const url = new URL(process.env.STUDIO_PATH ? `/${process.env.STUDIO_PATH}/settings` : "/404", API_BASE);
  url.searchParams.set("connect", result);
  return NextResponse.redirect(url);
}

async function exchangeMeta(code: string) {
  const c = credsFor("meta")!;
  const u = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  u.searchParams.set("client_id", c.id);
  u.searchParams.set("redirect_uri", callbackUrl("meta"));
  u.searchParams.set("client_secret", c.secret);
  u.searchParams.set("code", code);
  const tok = (await (await fetch(u)).json()) as { access_token?: string; error?: { message: string } };
  if (!tok.access_token) throw new Error(tok.error?.message ?? "no token from Meta");
  // long-lived user token, then page tokens derive from it
  const ll = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  ll.searchParams.set("grant_type", "fb_exchange_token");
  ll.searchParams.set("client_id", c.id);
  ll.searchParams.set("client_secret", c.secret);
  ll.searchParams.set("fb_exchange_token", tok.access_token);
  const llTok = (await (await fetch(ll)).json()) as { access_token?: string; error?: { message: string } };
  if (!llTok.access_token) throw new Error(llTok.error?.message ?? "no long-lived token");
  const pages = (await (
    await fetch(`https://graph.facebook.com/v21.0/me/accounts?access_token=${encodeURIComponent(llTok.access_token)}`)
  ).json()) as {
    data?: { id: string; name: string; access_token: string; instagram_business_account?: { id: string } }[];
    error?: { message: string };
  };
  if (pages.error) throw new Error(pages.error.message);
  const page = pages.data?.[0];
  if (!page) throw new Error("No Facebook Page found on this account");
  return { page, userToken: llTok.access_token };
}

async function exchangeX(code: string, verifier: string) {
  const c = credsFor("x")!;
  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${c.id}:${c.secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl("x"),
      code_verifier: verifier,
    }),
  });
  const tok = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string };
  if (!tok.access_token) throw new Error(tok.error ?? "no token from X");
  const me = (await (
    await fetch("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${tok.access_token}` },
    })
  ).json()) as { data?: { username: string } };
  return { token: tok.access_token, refresh: tok.refresh_token, expiresIn: tok.expires_in, username: me.data?.username };
}

async function exchangeLinkedIn(code: string) {
  const c = credsFor("linkedin")!;
  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl("linkedin"),
      client_id: c.id,
      client_secret: c.secret,
    }),
  });
  const tok = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string };
  if (!tok.access_token) throw new Error(tok.error ?? "no token from LinkedIn");
  const me = (await (
    await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tok.access_token}` },
    })
  ).json()) as { sub?: string; name?: string };
  return { token: tok.access_token, refresh: tok.refresh_token, expiresIn: tok.expires_in, sub: me.sub, name: me.name };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const allowed: OAuthPlatform[] = ["meta", "x", "linkedin"];
  if (!allowed.includes(platform as OAuthPlatform) || !(await hasSession())) {
    // Hard, body-less 404: same response middleware gives unknown paths.
    return new NextResponse(null, { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }
  const p = platform as OAuthPlatform;
  if (!credsFor(p)) return done(req, "not_configured");

  const state = req.nextUrl.searchParams.get("state");
  const verified = readState(p, req.cookies.get("av_oauth")?.value ?? null);
  if (!state || !verified.ok) return done(req, "bad_state");

  const code = req.nextUrl.searchParams.get("code");
  const err = req.nextUrl.searchParams.get("error_description");
  if (!code) return done(req, err ? `denied:${err.slice(0, 120)}` : "no_code");

  try {
    if (p === "meta") {
      const { page } = await exchangeMeta(code);
      await saveConnection({
        platform: "facebook",
        handle: page.name,
        accessToken: page.access_token,
        meta: { pageId: page.id, igUserId: page.instagram_business_account?.id ?? null },
      });
      if (page.instagram_business_account) {
        await saveConnection({
          platform: "instagram",
          handle: page.name,
          accessToken: page.access_token,
          meta: { pageId: page.id, igUserId: page.instagram_business_account.id },
        });
      }
      return done(req, "ok");
    }
    if (p === "x") {
      const r = await exchangeX(code, verified.verifier ?? "");
      await saveConnection({
        platform: "x",
        handle: r.username ?? null,
        accessToken: r.token,
        refreshToken: r.refresh ?? null,
        expiresInSeconds: r.expiresIn,
      });
      return done(req, "ok");
    }
    const r = await exchangeLinkedIn(code);
    await saveConnection({
      platform: "linkedin",
      handle: r.name ?? null,
      accessToken: r.token,
      refreshToken: r.refresh ?? null,
      expiresInSeconds: r.expiresIn,
      meta: { memberUrn: r.sub ? `urn:li:person:${r.sub}` : null },
    });
    return done(req, "ok");
  } catch (e) {
    return done(req, `error:${e instanceof Error ? e.message.slice(0, 140) : "unknown"}`);
  }
}

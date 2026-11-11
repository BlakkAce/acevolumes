import { createHash, createHmac, timingSafeEqual } from "crypto";

/**
 * OAuth wiring for the four social platforms. Credentials come from env:
 *   META_APP_ID / META_APP_SECRET        (Facebook page + Instagram business)
 *   X_CLIENT_ID / X_CLIENT_SECRET        (@acevolumes, OAuth 2.0 PKCE)
 *   LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET (Share on LinkedIn product)
 * Redirect URIs to register in each app console:
 *   https://acevolumes.vercel.app/api/social/callback/{meta|x|linkedin}
 * (localhost previews are never registered; production origin only.)
 */

export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://acevolumes.vercel.app";

export type OAuthPlatform = "meta" | "x" | "linkedin";

type Creds = { id: string; secret: string };

export function credsFor(platform: OAuthPlatform): Creds | null {
  const map: Record<OAuthPlatform, [string | undefined, string | undefined]> = {
    meta: [process.env.META_APP_ID, process.env.META_APP_SECRET],
    x: [process.env.X_CLIENT_ID, process.env.X_CLIENT_SECRET],
    linkedin: [process.env.LINKEDIN_CLIENT_ID, process.env.LINKEDIN_CLIENT_SECRET],
  };
  const [id, secret] = map[platform];
  if (!id || !secret) return null;
  return { id, secret };
}

export function callbackUrl(platform: OAuthPlatform): string {
  return `${SITE}/api/social/callback/${platform}`;
}

export function isConfigured(): Record<OAuthPlatform, boolean> {
  return {
    meta: Boolean(credsFor("meta")),
    x: Boolean(credsFor("x")),
    linkedin: Boolean(credsFor("linkedin")),
  };
}

// ---------------------------------------------------------------------------
// Signed state: "<ts>.<platform>.<nonce>.<verifier?>" + HMAC. Prevents CSRF
// and carries the PKCE verifier (X) through the round trip without a DB.

function hmac(payload: string): string {
  const secret = process.env.SESSION_SECRET ?? "";
  return createHmac("sha256", createHmac("sha256", secret).digest()).update(payload).digest("base64url");
}

function randomVerifier(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

export function makeState(platform: OAuthPlatform): {
  state: string;
  verifier: string | null;
} {
  const verifier = platform === "x" ? randomVerifier() : "";
  const payload = `${Date.now()}.${platform}.${verifier || "none"}`;
  return { state: `${payload}.${hmac(payload)}`, verifier: verifier || null };
}

export function readState(
  platform: OAuthPlatform,
  state: string | null,
): { ok: boolean; verifier?: string } {
  if (!state) return { ok: false };
  const parts = state.split(".");
  if (parts.length !== 4) return { ok: false };
  const [ts, plat, verifier, sig] = parts;
  const payload = `${ts}.${plat}.${verifier}`;
  const expected = hmac(payload);
  if (
    expected.length !== sig.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return { ok: false };
  }
  if (plat !== platform) return { ok: false };
  // 15-minute window
  if (Date.now() - Number(ts) > 15 * 60 * 1000) return { ok: false };
  return { ok: true, verifier: verifier === "none" ? undefined : verifier };
}

// ---------------------------------------------------------------------------
// Authorization URLs (the "Connect" jump)

export function authorizeUrl(platform: OAuthPlatform, state: string): string {
  const c = credsFor(platform);
  if (!c) throw new Error(`${platform} credentials not configured`);
  if (platform === "meta") {
    const p = new URLSearchParams({
      client_id: c.id,
      redirect_uri: callbackUrl("meta"),
      state,
      response_type: "code",
      scope: "pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish,business_management",
    });
    return `https://www.facebook.com/v21.0/dialog/oauth?${p}`;
  }
  if (platform === "x") {
    const p = new URLSearchParams({
      response_type: "code",
      client_id: c.id,
      redirect_uri: callbackUrl("x"),
      scope: "tweet.read tweet.write users.read offline.access",
      state,
      code_challenge: createHash("sha256").update(state.split(".")[2]).digest("base64url"),
      code_challenge_method: "S256",
    });
    return `https://twitter.com/i/oauth2/authorize?${p}`;
  }
  const p = new URLSearchParams({
    response_type: "code",
    client_id: c.id,
    redirect_uri: callbackUrl("linkedin"),
    state,
    scope: "openid profile w_member_social",
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${p}`;
}

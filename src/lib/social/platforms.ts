import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { metaOf, saveConnection } from "@/lib/social/store";
import { SITE } from "@/lib/social/oauth";

/**
 * Real platform publishers. Called only by the scheduler for approved, due
 * posts. Tokens live in social_accounts; X refreshes its short-lived token
 * via the stored refresh token before posting when needed.
 */

export type PostOutcome =
  | { ok: true; url: string }
  | { ok: false; reason: "not_connected" | "not_implemented" | "api_error"; detail?: string };

type Row = {
  platform: string;
  handle: string | null;
  status: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  meta: string | null;
};

export async function isConnected(platform: string): Promise<boolean> {
  return Boolean(await rowFor(platform));
}

async function rowFor(platform: string): Promise<Row | null> {
  if (!dbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, platform))
    .limit(1);
  return row?.status === "connected" && row.accessToken ? row : null;
}

function absoluteMedia(ref: string | null): string | null {
  if (!ref) return null;
  return ref.startsWith("http") ? ref : `${SITE}${ref}`;
}

async function refreshX(row: Row): Promise<string | null> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret || !row.refreshToken) return null;
  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: row.refreshToken,
      client_id: clientId,
    }),
  });
  const tok = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number };
  if (!tok.access_token) return null;
  await saveConnection({
    platform: "x",
    handle: row.handle,
    accessToken: tok.access_token,
    refreshToken: tok.refresh_token ?? row.refreshToken,
    expiresInSeconds: tok.expires_in ?? null,
  });
  return tok.access_token;
}

async function postFacebook(row: Row, content: string, mediaRef: string | null): Promise<PostOutcome> {
  const m = metaOf(row);
  const pageId = String(m.pageId ?? "");
  if (!pageId) return { ok: false, reason: "api_error", detail: "missing pageId" };
  const media = absoluteMedia(mediaRef);
  const url = media
    ? `https://graph.facebook.com/v21.0/${pageId}/photos`
    : `https://graph.facebook.com/v21.0/${pageId}/feed`;
  const body = media
    ? { url: media, caption: content }
    : { message: content };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const out = (await res.json()) as { id?: string; post_id?: string; error?: { message: string } };
  if (!res.ok || (!out.id && !out.post_id)) {
    return { ok: false, reason: "api_error", detail: out.error?.message?.slice(0, 140) ?? `HTTP ${res.status}` };
  }
  const id = out.post_id ?? out.id;
  return { ok: true, url: `https://www.facebook.com/${id}` };
}

async function postInstagram(row: Row, content: string, mediaRef: string | null): Promise<PostOutcome> {
  const m = metaOf(row);
  const igUserId = String(m.igUserId ?? "");
  const media = absoluteMedia(mediaRef);
  if (!igUserId) return { ok: false, reason: "api_error", detail: "no business IG account linked" };
  if (!media) return { ok: false, reason: "api_error", detail: "IG posts require an image" };
  const create = (await (
    await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: media, caption: content }),
    })
  ).json()) as { id?: string; error?: { message: string } };
  if (!create.id) return { ok: false, reason: "api_error", detail: create.error?.message?.slice(0, 140) ?? "container failed" };
  const publish = (await (
    await fetch(`https://graph.facebook.com/v21.0/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: create.id }),
    })
  ).json()) as { id?: string; error?: { message: string } };
  if (!publish.id) return { ok: false, reason: "api_error", detail: publish.error?.message?.slice(0, 140) ?? "publish failed" };
  const perm = (await (
    await fetch(`https://graph.facebook.com/v21.0/${publish.id}?fields=permalink&access_token=${encodeURIComponent(row.accessToken ?? "")}`)
  ).json()) as { permalink?: string };
  return { ok: true, url: perm.permalink ?? `https://www.instagram.com/` };
}

async function postX(row: Row, content: string): Promise<PostOutcome> {
  let token = row.accessToken ?? "";
  const expired = row.expiresAt ? row.expiresAt.getTime() < Date.now() + 60_000 : false;
  if (expired) {
    token = (await refreshX(row)) ?? "";
    if (!token) return { ok: false, reason: "api_error", detail: "X token expired, refresh failed — reconnect in Settings" };
  }
  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text: content }),
  });
  const out = (await res.json()) as { data?: { id: string }; error?: string; errors?: { message: string }[] };
  if (!res.ok || !out.data?.id) {
    return { ok: false, reason: "api_error", detail: (out.error ?? out.errors?.[0]?.message ?? `HTTP ${res.status}`).slice(0, 140) };
  }
  return { ok: true, url: `https://x.com/${row.handle ?? "i"}/status/${out.data.id}` };
}

async function postLinkedIn(row: Row, content: string): Promise<PostOutcome> {
  const m = metaOf(row);
  const author = String(m.memberUrn ?? "");
  if (!author) return { ok: false, reason: "api_error", detail: "missing member URN" };
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${row.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202405",
    },
    body: JSON.stringify({
      author,
      commentary: content,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  const urn = res.headers.get("x-restli-id") ?? (res.ok ? await res.text() : null);
  if (!res.ok || !urn) {
    const body = await res.text().catch(() => "");
    return { ok: false, reason: "api_error", detail: `HTTP ${res.status} ${body.slice(0, 120)}` };
  }
  return { ok: true, url: `https://www.linkedin.com/feed/update/${urn.replace(/"/g, "").trim()}` };
}

export async function post(
  platform: string,
  content: string,
  mediaRef: string | null,
): Promise<PostOutcome> {
  const row = await rowFor(platform);
  if (!row) return { ok: false, reason: "not_connected" };
  try {
    if (platform === "facebook") return await postFacebook(row, content, mediaRef);
    if (platform === "instagram") return await postInstagram(row, content, mediaRef);
    if (platform === "x") return await postX(row, content);
    if (platform === "linkedin") return await postLinkedIn(row, content);
    return { ok: false, reason: "not_implemented" };
  } catch (e) {
    return { ok: false, reason: "api_error", detail: e instanceof Error ? e.message.slice(0, 140) : "network error" };
  }
}

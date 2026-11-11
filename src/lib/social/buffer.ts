import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { metaOf } from "@/lib/social/store";
import { eq } from "drizzle-orm";

/**
 * Buffer integration: our app stays the brain (drafts, approval, media);
 * Buffer is the delivery layer that owns the platform connections. One
 * access token from publish.buffer.com/settings/api drives everything.
 *
 * Uses Buffer's REST v1 endpoints (profiles.json, updates/create.json) —
 * the shape is stable and supports scheduled_at + photo URLs.
 */

const BASE = "https://api.bufferapp.com/1";

export function bufferToken(): string | null {
  return process.env.BUFFER_ACCESS_TOKEN?.trim() || null;
}

export type BufferChannel = {
  id: string;
  platform: string; // facebook | instagram | x | linkedin
  handle: string;
};

/** Buffer service names -> our platform names. X is "twitter" in Buffer. */
const SERVICE_MAP: Record<string, string> = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "x",
  linkedin: "linkedin",
};

export async function bufferChannels(): Promise<BufferChannel[]> {
  const token = bufferToken();
  if (!token) return [];
  const res = await fetch(`${BASE}/profiles.json?access_token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`Buffer profiles: HTTP ${res.status}`);
  const rows = (await res.json()) as {
    id: string;
    service: string;
    service_username?: string;
    display_name?: string;
    formatted_username?: string;
  }[];
  return rows
    .map((r) => ({
      id: r.id,
      platform: SERVICE_MAP[r.service] ?? r.service,
      handle: r.formatted_username || r.service_username || r.display_name || r.id,
    }))
    .filter((c) => SERVICE_MAP[c.platform] !== undefined || c.platform in SERVICE_MAP);
}

/** Map from social_accounts: platform -> Buffer profile id. */
export async function bufferProfileFor(platform: string): Promise<string | null> {
  if (!dbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, platform))
    .limit(1);
  if (!row || row.status !== "connected") return null;
  const id = metaOf(row).bufferProfileId;
  return typeof id === "string" ? id : null;
}

export type BufferCreateResult =
  | { ok: true; updateId: string; bufferedAt: string }
  | { ok: false; error: string };

export async function bufferCreate(opts: {
  profileId: string;
  text: string;
  scheduledAt: Date;
  photoUrl?: string | null;
}): Promise<BufferCreateResult> {
  const token = bufferToken();
  if (!token) return { ok: false, error: "Buffer token not configured" };
  const form = new URLSearchParams({
    access_token: token,
    text: opts.text.slice(0, 5000),
    "profile_ids[]": opts.profileId,
    scheduled_at: opts.scheduledAt.toISOString(),
  });
  if (opts.photoUrl) form.set("media[photo]", opts.photoUrl);
  const res = await fetch(`${BASE}/updates/create.json`, { method: "POST", body: form });
  const out = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    updates?: { id: string; scheduled_at?: string }[];
    message?: string;
    error?: string;
  };
  if (!res.ok || !out.success || !out.updates?.[0]) {
    return { ok: false, error: out.message || out.error || `HTTP ${res.status}` };
  }
  return { ok: true, updateId: out.updates[0].id, bufferedAt: out.updates[0].scheduled_at ?? "" };
}

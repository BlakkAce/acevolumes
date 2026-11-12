import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { metaOf } from "@/lib/social/store";

/**
 * Buffer integration via the current GraphQL API (api.buffer.com, Bearer
 * key). Our app stays the brain (drafts, approval, media); Buffer owns the
 * platform connections and does the posting.
 *
 * API surface (developers.buffer.com):
 *   query  account { organizations { id name } }
 *   query  channels(input: { organizationId }) { id name displayName service }
 *   mutation createPost(input: { text, channelId, schedulingType: automatic,
 *             mode: customScheduled, dueAt, assets: [{ image: { url } }] })
 * A failed mutation returns HTTP 200 with a MutationError union — always
 * read the union, never the status code.
 */

const ENDPOINT = "https://api.buffer.com";

export type BufferAccountKey = "1" | "2";

/** Two Buffer accounts are supported (e.g. brand + personal/client). */
export function bufferAccounts(): { key: BufferAccountKey; token: string }[] {
  const out: { key: BufferAccountKey; token: string }[] = [];
  const t1 = (process.env.BUFFER_ACCESS_TOKEN ?? process.env.BUFFER_ACCESS_TOKEN_1)?.trim();
  const t2 = process.env.BUFFER_ACCESS_TOKEN_2?.trim();
  if (t1) out.push({ key: "1", token: t1 });
  if (t2) out.push({ key: "2", token: t2 });
  return out;
}

export function bufferTokenAny(): string | null {
  return bufferAccounts()[0]?.token ?? null;
}

export class BufferError extends Error {
  constructor(
    public kind: "unauthorized" | "rate_limited" | "network" | "graphql" | "empty",
    message: string,
  ) {
    super(message);
  }
}

async function gql<T>(token: string, query: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query }),
    });
  } catch {
    throw new BufferError("network", "Could not reach Buffer (network error).");
  }
  if (res.status === 401 || res.status === 403) {
    throw new BufferError(
      "unauthorized",
      "Buffer rejected the API key (401). Generate a fresh key at publish.buffer.com/settings/api (a Personal API Key) and update the env var in Vercel.",
    );
  }
  if (res.status === 429) {
    const wait = res.headers.get("Retry-After") ?? "60";
    throw new BufferError("rate_limited", `Buffer rate limit hit — retry in ${wait}s.`);
  }
  if (!res.ok) throw new BufferError("network", `Buffer returned HTTP ${res.status}.`);
  const out = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (out.errors?.length) {
    throw new BufferError("graphql", out.errors.map((e) => e.message).join("; ").slice(0, 180));
  }
  if (!out.data) throw new BufferError("graphql", "Buffer returned an empty response.");
  return out.data;
}

type GqlChannel = { id: string; name: string; displayName: string | null; service: string };

export type BufferChannel = {
  id: string;
  platform: string; // facebook | instagram | x | linkedin
  handle: string;
  accountKey: BufferAccountKey;
};

/** Buffer service names -> our platform names. X is "twitter" in Buffer. */
const SERVICE_MAP: Record<string, string> = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "x",
  linkedin: "linkedin",
  pinterest: "pinterest",
  threads: "threads",
};

/** Fetch every channel across all organizations of the account. */
export async function bufferChannels(
  token: string,
  accountKey: BufferAccountKey = "1",
): Promise<BufferChannel[]> {
  const orgs = await gql<{ account: { organizations: { id: string; name: string }[] } }>(
    token,
    `query Orgs { account { organizations { id name } } }`,
  );
  const organizationList = orgs.account?.organizations ?? [];
  if (organizationList.length === 0) {
    throw new BufferError("empty", "No Buffer organization found for this key.");
  }
  const channels: BufferChannel[] = [];
  for (const org of organizationList) {
    const data = await gql<{ channels: GqlChannel[] }>(
      token,
      `query { channels(input: { organizationId: "${org.id}" }) { id name displayName service } }`,
    );
    for (const c of data.channels ?? []) {
      const platform = SERVICE_MAP[c.service];
      if (!platform) continue;
      channels.push({
        id: c.id,
        platform,
        handle: c.displayName || c.name || c.id,
        accountKey,
      });
    }
  }
  return channels;
}

/** Map from social_accounts: platform -> Buffer channel id + owning account. */
export async function bufferProfileFor(
  platform: string,
): Promise<{ profileId: string; accountKey: BufferAccountKey } | null> {
  if (!dbConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, platform))
    .limit(1);
  if (!row || row.status !== "connected") return null;
  const m = metaOf(row);
  const profileId = m.bufferProfileId;
  if (typeof profileId !== "string") return null;
  const accountKey = m.bufferAccountKey === "2" ? "2" : "1";
  return { profileId, accountKey };
}

export type BufferCreateResult =
  | { ok: true; updateId: string; bufferedAt: string }
  | { ok: false; error: string };

export async function bufferCreate(opts: {
  profileId: string;
  text: string;
  scheduledAt: Date;
  photoUrl?: string | null;
  accountKey?: BufferAccountKey;
}): Promise<BufferCreateResult> {
  const token = bufferAccounts().find((a) => a.key === (opts.accountKey ?? "1"))?.token
    ?? bufferAccounts()[0]?.token;
  if (!token) return { ok: false, error: "Buffer token not configured" };
  const assets = opts.photoUrl
    ? `, assets: [{ image: { url: "${opts.photoUrl}" } }]`
    : "";
  const text = opts.text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  try {
    const data = await gql<{
      createPost: { post?: { id: string; dueAt?: string }; message?: string };
    }>(
      token,
      `mutation {
  createPost(input: {
    text: "${text}",
    channelId: "${opts.profileId}",
    schedulingType: automatic,
    mode: customScheduled,
    dueAt: "${opts.scheduledAt.toISOString()}"${assets}
  }) {
    ... on PostActionSuccess { post { id dueAt } }
    ... on MutationError { message }
  }
}`,
    );
    const r = data.createPost;
    if (r?.message || !r?.post) {
      return { ok: false, error: (r?.message ?? "Buffer rejected the post").slice(0, 180) };
    }
    return { ok: true, updateId: r.post.id, bufferedAt: r.post.dueAt ?? "" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message.slice(0, 180) : "unknown error" };
  }
}

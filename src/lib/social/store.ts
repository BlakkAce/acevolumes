import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";

type SaveInput = {
  platform: string;
  handle: string | null;
  accessToken: string;
  refreshToken?: string | null;
  expiresInSeconds?: number | null;
  meta?: Record<string, unknown> | null;
};

/** Upsert a connection row after a successful OAuth callback. */
export async function saveConnection(input: SaveInput): Promise<void> {
  if (!dbConfigured()) return;
  const db = getDb();
  const expiresAt =
    input.expiresInSeconds && input.expiresInSeconds > 0
      ? new Date(Date.now() + input.expiresInSeconds * 1000)
      : null;
  const values = {
    platform: input.platform,
    handle: input.handle,
    status: "connected" as const,
    accessToken: input.accessToken,
    refreshToken: input.refreshToken ?? null,
    expiresAt,
    meta: input.meta ? JSON.stringify(input.meta) : null,
    updatedAt: new Date(),
  };
  const existing = await db
    .select({ id: socialAccounts.id })
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, input.platform))
    .limit(1);
  if (existing.length > 0) {
    await db.update(socialAccounts).set(values).where(eq(socialAccounts.id, existing[0].id));
  } else {
    await db.insert(socialAccounts).values(values);
  }
}

export function metaOf(row: { meta: string | null }): Record<string, unknown> {
  if (!row.meta) return {};
  try {
    return JSON.parse(row.meta) as Record<string, unknown>;
  } catch {
    return {};
  }
}

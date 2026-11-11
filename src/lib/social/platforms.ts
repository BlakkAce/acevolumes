import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";

/**
 * Platform adapters for the post scheduler. v1: connection state lives in
 * social_accounts; OAuth wiring lands per platform as app reviews clear
 * (Meta first, then X, then LinkedIn). Until a platform reports connected,
 * the scheduler leaves approved posts queued and reports them as waiting.
 */

export type PostOutcome =
  | { ok: true; url: string }
  | { ok: false; reason: "not_connected" | "not_implemented" | "api_error"; detail?: string };

export async function isConnected(platform: string): Promise<boolean> {
  const db = getDb();
  const [row] = await db
    .select({ status: socialAccounts.status, token: socialAccounts.accessToken })
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, platform))
    .limit(1);
  return row?.status === "connected" && Boolean(row.token);
}

export async function post(
  platform: string,
  content?: string,
  mediaRef?: string | null,
): Promise<PostOutcome> {
  void content;
  void mediaRef;
  if (!(await isConnected(platform))) return { ok: false, reason: "not_connected" };
  // OAuth publishers land here per platform (Graph API / X v2 / LinkedIn UGC).
  return { ok: false, reason: "not_implemented" };
}

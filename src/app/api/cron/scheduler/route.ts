import { NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentRuns, posts } from "@/lib/db/schema";
import { isConnected, post } from "@/lib/social/platforms";
import { bufferProfileFor, bufferCreate, bufferTokenAny } from "@/lib/social/buffer";
import { ensureMediaUrl } from "@/lib/media/cards";
import { PLATFORMS } from "@/lib/agents/scribe";

// Vercel Cron: daily 06:00 UTC. Posts every approved post that is due.
// A platform that is not connected leaves its posts queued (visible in the
// Content page) and is reported here; nothing is silently dropped.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  // Fail closed: without a configured secret the endpoint stays shut even
  // for Vercel Cron (set CRON_SECRET in Vercel; it is sent automatically).
  if (!secret) {
    return NextResponse.json({ error: "cron secret not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "database not configured" }, { status: 503 });
  }
  const db = getDb();
  const now = new Date();
  const due = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "approved"), lte(posts.scheduledFor, now)));

  const posted: number[] = [];
  const buffered: number[] = [];
  const waiting: { platform: string; count: number }[] = [];
  const failed: { id: number; detail: string }[] = [];

  // Delivery preference: Buffer (one token, owns all platform connections);
  // direct platform APIs remain as fallback for the future.
  const useBuffer = Boolean(bufferTokenAny());

  for (const platform of PLATFORMS) {
    const rows = due.filter((p) => p.platform === platform);
    if (rows.length === 0) continue;
    if (useBuffer) {
      const target = await bufferProfileFor(platform);
      if (!target) {
        waiting.push({ platform, count: rows.length });
        continue;
      }
      for (const row of rows) {
        const photoUrl = await ensureMediaUrl(row.mediaRef, row.id);
        const outcome = await bufferCreate({
          profileId: target.profileId,
          accountKey: target.accountKey,
          text: row.content,
          scheduledAt: row.scheduledFor,
          photoUrl,
        });
        if (outcome.ok) {
          await db
            .update(posts)
            .set({ status: "buffered", postedUrl: `buffer:${outcome.updateId}`, error: null })
            .where(eq(posts.id, row.id));
          buffered.push(row.id);
        } else {
          await db
            .update(posts)
            .set({ status: "failed", error: `buffer: ${outcome.error.slice(0, 140)}` })
            .where(eq(posts.id, row.id));
          failed.push({ id: row.id, detail: outcome.error.slice(0, 60) });
        }
      }
      continue;
    }
    if (!(await isConnected(platform))) {
      waiting.push({ platform, count: rows.length });
      continue;
    }
    for (const row of rows) {
      const outcome = await post(platform, row.content, row.mediaRef);
      if (outcome.ok) {
        await db
          .update(posts)
          .set({ status: "posted", postedUrl: outcome.url })
          .where(eq(posts.id, row.id));
        posted.push(row.id);
      } else {
        await db
          .update(posts)
          .set({ status: "failed", error: `${outcome.reason}${outcome.detail ? `: ${outcome.detail}` : ""}` })
          .where(eq(posts.id, row.id));
        failed.push({ id: row.id, detail: outcome.reason });
      }
    }
  }

  const summary = `Scheduler sweep: ${buffered.length} buffered, ${posted.length} posted direct, ${waiting
    .map((w) => `${w.count} waiting on ${w.platform}`)
    .join(", ") || "none waiting"}, ${failed.length} failed.`;
  await db.insert(agentRuns).values({
    agent: "scribe",
    summary,
    status: failed.length > 0 ? "error" : "ok",
    meta: JSON.stringify({ posted, waiting, failed }),
  });

  return NextResponse.json({ ok: true, buffered, posted, waiting, failed });
}

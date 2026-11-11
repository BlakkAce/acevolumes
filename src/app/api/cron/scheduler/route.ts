import { NextResponse } from "next/server";
import { and, eq, lte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentRuns, posts } from "@/lib/db/schema";
import { isConnected, post } from "@/lib/social/platforms";
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
  const waiting: { platform: string; count: number }[] = [];
  const failed: { id: number; detail: string }[] = [];

  for (const platform of PLATFORMS) {
    const rows = due.filter((p) => p.platform === platform);
    if (rows.length === 0) continue;
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

  const summary = `Scheduler sweep: ${posted.length} posted, ${waiting
    .map((w) => `${w.count} waiting on ${w.platform}`)
    .join(", ") || "none waiting"}, ${failed.length} failed.`;
  await db.insert(agentRuns).values({
    agent: "scribe",
    summary,
    status: failed.length > 0 ? "error" : "ok",
    meta: JSON.stringify({ posted, waiting, failed }),
  });

  return NextResponse.json({ ok: true, posted, waiting, failed });
}

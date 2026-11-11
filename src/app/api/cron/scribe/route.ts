import { NextResponse } from "next/server";
import { draftWeek } from "@/lib/agents/scribe";

// Vercel Cron: daily 05:30 UTC. Authenticated with CRON_SECRET when set
// (Vercel sends it as a Bearer token automatically).
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
  try {
    const result = await draftWeek();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "scribe failed" },
      { status: 500 },
    );
  }
}

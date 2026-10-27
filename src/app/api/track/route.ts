import { NextResponse } from "next/server";
import { dbConfigured, getDb } from "@/lib/db";
import { pageviews } from "@/lib/db/schema";

const BOT = /bot|crawl|spider|slurp|lighthouse|headless|preview|monitor/i;

/**
 * First-party visit log. A sendBeacon POST per public page view.
 * Stores path, referrer and a coarse device class only: no cookies, no IPs,
 * nothing personal. Bot hits (search crawlers) are flagged so the dashboard
 * can show when Google is crawling.
 */
export async function POST(req: Request) {
  if (!dbConfigured) return new NextResponse(null, { status: 204 });
  try {
    const ua = req.headers.get("user-agent") ?? "";
    const body = (await req.json()) as { path?: string; referrer?: string };
    const path = String(body.path ?? "/").slice(0, 300);
    const referrer = String(body.referrer ?? "").slice(0, 300);
    if (!path.startsWith("/")) return new NextResponse(null, { status: 204 });
    const device = /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
    const db = getDb();
    await db.insert(pageviews).values({
      path,
      referrer,
      device,
      isBot: BOT.test(ua),
    });
  } catch {
    // Analytics must never break or leak errors to the page.
  }
  return new NextResponse(null, { status: 204 });
}

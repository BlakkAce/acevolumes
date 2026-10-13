"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, interactions } from "@/lib/db/schema";
import { hasSession } from "@/lib/studio/session";
import { STUDIO_PATH } from "@/lib/studio/config";
import { classifyWebsite, scanMany, type ScanResult } from "@/lib/studio/gap-scan";
import { placesConfigured, searchPlaces, type PlaceHit } from "@/lib/studio/places";

export type ScoutRow = {
  key: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  reviews: number | null;
  mapsUri: string | null;
  service: string | null;
  scan: ScanResult;
  saved: boolean;
  existed?: boolean;
};

async function requireSession() {
  if (!(await hasSession())) throw new Error("Unauthenticated");
}

function filterByWebsiteStatus(
  rows: ScoutRow[],
  status: string,
): ScoutRow[] {
  if (status === "any") return rows;
  return rows.filter((r) => {
    const kind = classifyWebsite(r.website);
    if (status === "no_website") return kind === "none";
    if (status === "social_only") return kind === "social";
    if (status === "improvement")
      return kind === "site" && r.scan.score >= 30;
    if (status === "website_found")
      return kind === "site" && r.scan.score < 30;
    return true;
  });
}

/** Scan pasted businesses: one per line, "Name | URL" (URL optional). */
export async function scanPasted(_prev: ScoutRow[] | null, fd: FormData) {
  await requireSession();
  const raw = String(fd.get("list") ?? "");
  const service = String(fd.get("service") ?? "").trim();
  const entries = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 50)
    .map((line) => {
      const parts = line.split(/\s*[|,]\s*/);
      return { name: parts[0]?.trim() || "Unnamed business", url: parts[1]?.trim() || null };
    });
  if (entries.length === 0) return [];

  const scans = await scanMany(entries.map((e) => e.url));
  return entries.map((e, i): ScoutRow => ({
    key: `p-${i}-${e.name}`,
    name: e.name,
    website: e.url,
    phone: null,
    address: null,
    rating: null,
    reviews: null,
    mapsUri: null,
    service: service || null,
    scan: scans[i],
    saved: false,
  }));
}

/** Search Google Places for niche+location, scan each website, filter. */
export async function searchOpportunities(
  _prev: ScoutRow[] | null,
  fd: FormData,
) {
  await requireSession();
  if (!placesConfigured() || !dbConfigured()) return null;

  const niche = String(fd.get("niche") ?? "").trim();
  const country = String(fd.get("country") ?? "").trim();
  const city = String(fd.get("city") ?? "").trim();
  const service = String(fd.get("service") ?? "").trim();
  const want = Math.min(Math.max(Number(fd.get("count")) || 20, 5), 50);
  const minRating = Number(fd.get("min_rating")) || 0;
  const websiteStatus = String(fd.get("website_status") ?? "any");
  if (!niche) return null;

  const where = [niche, city, country].filter(Boolean).join(" in ");
  const hits: PlaceHit[] = await searchPlaces(where, want);
  const scans = await scanMany(hits.map((h) => h.website));

  const rows: ScoutRow[] = hits.map((h, i): ScoutRow => ({
    key: `g-${h.id}-${i}`,
    name: h.name,
    website: h.website,
    phone: h.phone,
    address: h.address,
    rating: h.rating,
    reviews: h.reviews,
    mapsUri: h.mapsUri,
    service: service || niche,
    scan: scans[i],
    saved: false,
  }));

  const byRating =
    minRating > 0 ? rows.filter((r) => (r.rating ?? 0) >= minRating) : rows;
  const filtered = filterByWebsiteStatus(byRating, websiteStatus);
  return filtered.sort((a, b) => b.scan.score - a.scan.score);
}

/** Save one scouted business as a CRM lead. Idempotent per name+website. */
export async function saveScoutedLead(row: {
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  reviews: number | null;
  score: number;
  gaps: string[];
  service?: string | null;
  via: "paste" | "google";
}): Promise<{ ok: boolean; existed?: boolean }> {
  await requireSession();
  if (!dbConfigured()) return { ok: false };
  const db = getDb();

  const dup = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.name, row.name))
    .limit(1);
  if (dup.length > 0) return { ok: true, existed: true };

  const summaryBits = [
    row.via === "google" ? "Found via Places scouting" : "Found via pasted list scan",
    row.address ?? null,
    row.rating ? `${row.rating}★ (${row.reviews ?? 0} reviews)` : null,
    `Opportunity score ${row.score}/100`,
    row.gaps.length ? `Gaps: ${row.gaps.join("; ")}` : null,
  ].filter(Boolean);

  const [created] = await db
    .insert(clients)
    .values({
      name: row.name,
      company: row.name,
      email: null,
      phone: row.phone,
      source: row.via === "google" ? "scout" : "clientscout",
      status: "lead",
      service: row.service ?? null,
      projectSummary: summaryBits.join(" · "),
      updatedAt: new Date(),
    })
    .returning({ id: clients.id });
  if (!created) return { ok: false };
  await db.insert(interactions).values({
    clientId: created.id,
    type: "note",
    summary: summaryBits.join(" · "),
  });
  revalidatePath("/clients");
  return { ok: true };
}

export async function scoutHome() {
  return `/${STUDIO_PATH}/scout`;
}

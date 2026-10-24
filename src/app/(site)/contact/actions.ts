"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { dbConfigured, getDb } from "@/lib/db";
import { clients, interactions } from "@/lib/db/schema";

// Public enquiry capture: every website enquiry becomes a Lead in the CRM
// (source: website) the moment it is submitted. The FormSubmit email is a
// secondary notification, not the store — nothing is lost if it fails.

// Light abuse guard: 5 submissions per IP per 30 minutes (best-effort,
// per-instance; the honeypot + length caps do most of the work).
const hits = new Map<string, { n: number; until: number }>();
const MAX = 5;
const WINDOW = 30 * 60 * 1000;

export type EnquiryResult = { ok: boolean; stored: boolean; reason?: string };

function str(fd: FormData, k: string, cap = 500): string {
  return String(fd.get(k) ?? "").trim().slice(0, cap);
}

export async function submitEnquiry(
  fd: FormData,
): Promise<EnquiryResult> {
  // Honeypot first: real users never fill this (it is visually hidden).
  if (str(fd, "_honey") !== "") {
    return { ok: true, stored: false, reason: "spam" };
  }

  // Light per-IP throttle (best-effort; honeypot + caps do most of the work).
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = hits.get(ip);
  if (rec && rec.until > now && rec.n >= MAX) {
    return { ok: false, stored: false, reason: "rate" };
  }

  const name = str(fd, "name", 120);
  const email = str(fd, "email", 200);
  const company = str(fd, "company", 160);
  const service = str(fd, "service", 80);
  const budget = str(fd, "budget", 80);
  const currency = str(fd, "currency", 3).toUpperCase();
  const brief = str(fd, "brief", 4000);

  if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || brief.length < 10) {
    const next = rec && rec.until > now ? rec : { n: 0, until: now + WINDOW };
    next.n += 1;
    hits.set(ip, next);
    return { ok: false, stored: false, reason: "invalid" };
  }
  if (rec && rec.until > now) rec.n += 1;
  else hits.set(ip, { n: 1, until: now + WINDOW });

  if (!dbConfigured()) {
    return { ok: false, stored: false, reason: "no-db" };
  }

  const db = getDb();
  const summary = [
    `Website enquiry`,
    service ? `Wants: ${service}` : null,
    budget ? `Budget: ${budget}${currency && currency !== "NGN" ? ` (${currency})` : ""}` : null,
    company ? `Company: ${company}` : null,
    "",
    brief,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const dup = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.email, email))
    .limit(1);

  let clientId: number;
  if (dup.length > 0) {
    clientId = dup[0].id;
    await db.insert(interactions).values({
      clientId,
      type: "email",
      summary: `New website enquiry\n${summary}`,
    });
  } else {
    const [row] = await db
      .insert(clients)
      .values({
        name,
        company: company || null,
        email,
        source: "website",
        status: "lead",
        service: service || null,
        projectSummary: summary,
        updatedAt: new Date(),
      })
      .returning({ id: clients.id });
    if (!row) return { ok: false, stored: false, reason: "db" };
    clientId = row.id;
    await db.insert(interactions).values({
      clientId,
      type: "email",
      summary,
    });
  }
  revalidatePath("/clients");
  return { ok: true, stored: true };
}

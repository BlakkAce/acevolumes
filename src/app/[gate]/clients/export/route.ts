import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { dbConfigured, getDb } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { studioConfigured } from "@/lib/studio/config";
import { hasSession } from "@/lib/studio/session";
import { STATUS_LABEL } from "@/lib/studio/crm";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Your data is never hostage: one click, every field, plain CSV.
export async function GET() {
  if (!studioConfigured() || !(await hasSession())) {
    return new NextResponse(null, { status: 404 });
  }
  if (!dbConfigured()) {
    return new NextResponse("Database not connected", { status: 503 });
  }
  const db = getDb();
  const rows = await db.select().from(clients).orderBy(desc(clients.id));

  const header = [
    "id", "name", "company", "email", "phone", "source", "status",
    "service", "value_usd", "next_follow_up", "project_summary",
    "created", "updated",
  ];
  const lines = [header.join(",")];
  for (const c of rows) {
    lines.push(
      [
        c.id,
        c.name,
        c.company,
        c.email,
        c.phone,
        c.source,
        STATUS_LABEL[c.status as never] ?? c.status,
        c.service,
        c.valueUsd,
        c.nextFollowUpAt?.toISOString().slice(0, 10) ?? "",
        c.projectSummary,
        c.createdAt.toISOString().slice(0, 10),
        c.updatedAt.toISOString().slice(0, 10),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="av-clients-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

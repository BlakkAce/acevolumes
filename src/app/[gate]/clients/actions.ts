"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { clients, interactions } from "@/lib/db/schema";
import { hasSession } from "@/lib/studio/session";
import { STUDIO_PATH } from "@/lib/studio/config";
import { isStatus } from "@/lib/studio/crm";

// Every action re-verifies the session server-side (defence in depth —
// the hidden path is layer one, this is layer two).

async function requireSession() {
  if (!(await hasSession())) {
    throw new Error("Unauthenticated");
  }
}

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}

function optional(fd: FormData, k: string): string | null {
  const v = str(fd, k);
  return v === "" ? null : v;
}

function money(fd: FormData, k: string): string | null {
  const v = str(fd, k).replace(/[$,\s]/g, "");
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n.toFixed(2) : null;
}

function dateOrNull(fd: FormData, k: string): Date | null {
  const v = str(fd, k);
  if (v === "") return null;
  const d = new Date(`${v}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fields(fd: FormData) {
  const status = str(fd, "status");
  return {
    name: str(fd, "name"),
    company: optional(fd, "company"),
    email: optional(fd, "email"),
    phone: optional(fd, "phone"),
    source: str(fd, "source") || "direct",
    status: isStatus(status) ? status : "lead",
    service: optional(fd, "service"),
    projectSummary: optional(fd, "project_summary"),
    valueUsd: money(fd, "value_usd"),
    nextFollowUpAt: dateOrNull(fd, "next_follow_up_at"),
  };
}

export async function createClient(fd: FormData) {
  await requireSession();
  const f = fields(fd);
  if (!f.name) return;
  const db = getDb();
  const [row] = await db
    .insert(clients)
    .values({ ...f, updatedAt: new Date() })
    .returning({ id: clients.id });
  // First interaction preserves how the lead arrived.
  const note = optional(fd, "first_note");
  if (row && note) {
    await db.insert(interactions).values({
      clientId: row.id,
      type: "note",
      summary: note,
    });
  }
  revalidatePath("/clients");
  redirect(`/${STUDIO_PATH}/clients/${row.id}`);
}

export async function updateClient(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  if (!Number.isSafeInteger(id)) return;
  const f = fields(fd);
  if (!f.name) return;
  const db = getDb();
  await db
    .update(clients)
    .set({ ...f, updatedAt: new Date() })
    .where(eq(clients.id, id));
  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
}

export async function setClientStatus(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  const status = str(fd, "status");
  if (!Number.isSafeInteger(id) || !isStatus(status)) return;
  const db = getDb();
  await db
    .update(clients)
    .set({ status, updatedAt: new Date() })
    .where(eq(clients.id, id));
  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
}

export async function addInteraction(fd: FormData) {
  await requireSession();
  const clientId = Number(str(fd, "client_id"));
  const summary = str(fd, "summary");
  const type = str(fd, "type");
  if (!Number.isSafeInteger(clientId) || summary === "") return;
  const db = getDb();
  await db.insert(interactions).values({
    clientId,
    type: ["call", "email", "meeting", "note"].includes(type) ? type : "note",
    summary,
    happenedAt: dateOrNull(fd, "happened_at") ?? new Date(),
  });
  revalidatePath(`/clients/${clientId}`);
}

export async function deleteClient(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  if (!Number.isSafeInteger(id)) return;
  const db = getDb();
  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/clients");
  redirect(`/${STUDIO_PATH}/clients`);
}

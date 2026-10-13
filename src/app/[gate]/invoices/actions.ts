"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { invoiceItems, invoices } from "@/lib/db/schema";
import { hasSession } from "@/lib/studio/session";
import { STUDIO_PATH } from "@/lib/studio/config";
import { computeTotals, nextInvoiceNumber } from "@/lib/studio/invoices";

async function requireSession() {
  if (!(await hasSession())) throw new Error("Unauthenticated");
}

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? "").trim();
}

function dateOrNull(fd: FormData, k: string): Date | null {
  const v = str(fd, k);
  if (!v) return null;
  const d = new Date(`${v}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseItems(fd: FormData) {
  const descs = fd.getAll("li_desc").map((v) => String(v).trim());
  const qtys = fd.getAll("li_qty").map((v) => String(v));
  const prices = fd.getAll("li_price").map((v) => String(v));
  const items = descs
    .map((description, i) => ({
      description,
      qty: Number(qtys[i] ?? "1") || 1,
      unitPrice: Number(prices[i] ?? "0") || 0,
    }))
    .filter((it) => it.description !== "");
  return items.map((it) => ({
    description: it.description,
    qty: it.qty.toFixed(2),
    unitPrice: it.unitPrice.toFixed(2),
  }));
}

function commonFields(fd: FormData) {
  const taxRate = Number(str(fd, "tax_rate").replace("%", "")) || 0;
  const cur = str(fd, "currency").toUpperCase();
  return {
    clientId: Number(str(fd, "client_id")),
    issuedAt: dateOrNull(fd, "issued_at"),
    dueAt: dateOrNull(fd, "due_at"),
    paymentInstructions: str(fd, "payment_instructions") || null,
    taxRatePct: Math.min(Math.max(taxRate, 0), 90),
    currency: /^[A-Z]{3}$/.test(cur) ? cur : "USD",
  };
}

export async function createInvoice(fd: FormData) {
  await requireSession();
  const f = commonFields(fd);
  if (!Number.isSafeInteger(f.clientId) || f.clientId <= 0) return;
  const items = parseItems(fd);
  if (items.length === 0) return;
  const db = getDb();

  const totals = computeTotals(items, f.taxRatePct / 100);
  const [row] = await db
    .insert(invoices)
    .values({
      clientId: f.clientId,
      number: await nextInvoiceNumber(),
      currency: f.currency,
      status: "draft",
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      paymentInstructions: f.paymentInstructions,
      shareToken: randomBytes(24).toString("hex"),
      issuedAt: f.issuedAt,
      dueAt: f.dueAt,
    })
    .returning({ id: invoices.id });
  if (!row) return;
  await db
    .insert(invoiceItems)
    .values(items.map((it, i) => ({ ...it, invoiceId: row.id, position: i })));

  revalidatePath("/invoices");
  redirect(`/${STUDIO_PATH}/invoices/${row.id}`);
}

export async function updateInvoice(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  if (!Number.isSafeInteger(id)) return;
  const f = commonFields(fd);
  const items = parseItems(fd);
  if (items.length === 0) return;
  const db = getDb();

  // Totals are always recomputed server-side; the stored status stays as-is
  // unless the status field explicitly says otherwise.
  const totals = computeTotals(items, f.taxRatePct / 100);
  const status = str(fd, "status");
  await db
    .update(invoices)
    .set({
      clientId: f.clientId,
      currency: f.currency,
      issuedAt: f.issuedAt,
      dueAt: f.dueAt,
      paymentInstructions: f.paymentInstructions,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      ...(status === "draft" || status === "sent" || status === "paid"
        ? { status }
        : {}),
    })
    .where(eq(invoices.id, id));
  await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
  await db
    .insert(invoiceItems)
    .values(items.map((it, i) => ({ ...it, invoiceId: id, position: i })));

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
}

export async function setInvoiceStatus(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  const status = str(fd, "status");
  if (!Number.isSafeInteger(id)) return;
  if (status !== "draft" && status !== "sent" && status !== "paid") return;
  const db = getDb();
  await db.update(invoices).set({ status }).where(eq(invoices.id, id));
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
}

export async function deleteInvoice(fd: FormData) {
  await requireSession();
  const id = Number(str(fd, "id"));
  if (!Number.isSafeInteger(id)) return;
  const db = getDb();
  await db.delete(invoices).where(eq(invoices.id, id));
  revalidatePath("/invoices");
  redirect(`/${STUDIO_PATH}/invoices`);
}

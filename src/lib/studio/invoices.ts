import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { invoices } from "@/lib/db/schema";

// Invoice helpers: numbering, totals, derived display status.

export type InvoiceRow = typeof invoices.$inferSelect;
export type InvoiceItemRow = {
  description: string;
  qty: string;
  unitPrice: string;
};

/** Next number for the current year: AV-2026-001… */
export async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AV-${year}-`;
  const db = getDb();
  const [row] = await db
    .select({
      max: sql<string | null>`max(${invoices.number})`,
    })
    .from(invoices)
    .where(sql`${invoices.number} like ${prefix + "%"}`);
  const last = row?.max ? Number(row.max.slice(prefix.length)) : 0;
  const next = Number.isSafeInteger(last) && last > 0 ? last + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export function computeTotals(items: InvoiceItemRow[], taxRate: number) {
  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.qty || 0) * Number(it.unitPrice || 0),
    0,
  );
  const tax = subtotal * (Number.isFinite(taxRate) ? taxRate : 0);
  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: (subtotal + tax).toFixed(2),
  };
}

export type InvoiceStatus = "draft" | "sent" | "paid";

/** 'sent' past its due date displays as overdue (stored status never mutates). */
export function displayStatus(
  inv: { status: string; dueAt: Date | null },
  now = new Date(),
): InvoiceStatus | "overdue" {
  if (inv.status === "sent" && inv.dueAt && inv.dueAt.getTime() < startOfDay(now)) {
    return "overdue";
  }
  return inv.status === "draft" || inv.status === "paid" ? inv.status : "sent";
}

export function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export const STATUS_STYLE: Record<string, { tint: string; label: string }> = {
  draft: { tint: "#9b9b9b", label: "Draft" },
  sent: { tint: "#8e8eff", label: "Sent" },
  overdue: { tint: "#e5484d", label: "Overdue" },
  paid: { tint: "#4cc38a", label: "Paid" },
};


/** Format an amount in the invoice's own currency (any ISO-4217 code).
 * Invoices always show two decimals — money convention. */
export function usd(v: string | number | null | undefined, code = "USD"): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  const cur = code.toUpperCase();
  if (!Number.isFinite(n)) return `${cur} 0.00`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${cur} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, invoiceItems, invoices } from "@/lib/db/schema";
import { displayStatus } from "@/lib/studio/invoices";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { InvoiceSheet } from "@/components/invoice-sheet";

export default function InvoicePrintPage({
  params,
}: {
  params: Promise<{ gate: string; id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 opacity-40">Loading…</div>}>
      <Print p={params} />
    </Suspense>
  );
}

async function Print({ p }: { p: Promise<{ gate: string; id: string }> }) {
  await connection();
  const { gate, id: idRaw } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) notFound();
  if (!dbConfigured()) notFound();
  const id = Number(idRaw);
  if (!Number.isSafeInteger(id)) notFound();
  const db = getDb();

  const [inv] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  if (!inv) notFound();
  const [client] = await db.select().from(clients).where(eq(clients.id, inv.clientId)).limit(1);
  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(asc(invoiceItems.position));

  return (
    <div className="min-h-[100dvh] bg-[#efe9ec] py-8">
      <InvoiceSheet
        printButton
        data={{
          number: inv.number,
          currency: inv.currency,
          status: displayStatus(inv),
          issuedAt: inv.issuedAt,
          dueAt: inv.dueAt,
          subtotal: inv.subtotal,
          tax: inv.tax,
          total: inv.total,
          paymentInstructions: inv.paymentInstructions,
          clientName: client?.name ?? "—",
          clientCompany: client?.company ?? null,
          clientEmail: client?.email ?? null,
          items: items.map((it) => ({
            description: it.description,
            qty: it.qty,
            unitPrice: it.unitPrice,
          })),
        }}
      />
    </div>
  );
}

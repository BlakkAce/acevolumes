import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { dbConfigured, getDb } from "@/lib/db";
import { clients, invoiceItems, invoices } from "@/lib/db/schema";
import { displayStatus } from "@/lib/studio/invoices";
import { InvoiceSheet } from "@/components/invoice-sheet";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

// Public, unguessable, read-only invoice view. Token is 24 random bytes;
// nothing else on the page leaks (no other client/invoice data reachable).
export default function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 opacity-40">Loading…</div>}>
      <View p={params} />
    </Suspense>
  );
}

async function View({ p }: { p: Promise<{ token: string }> }) {
  await connection();
  const { token } = await p;
  if (!dbConfigured() || !/^[a-f0-9]{48}$/.test(token)) notFound();
  const db = getDb();

  const [inv] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.shareToken, token))
    .limit(1);
  if (!inv) notFound();
  const [client] = await db.select().from(clients).where(eq(clients.id, inv.clientId)).limit(1);
  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, inv.id))
    .orderBy(asc(invoiceItems.position));

  return (
    <div className="min-h-[100dvh] bg-[#efe9ec] py-8">
      <InvoiceSheet
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

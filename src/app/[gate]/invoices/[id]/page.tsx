import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, invoiceItems, invoices } from "@/lib/db/schema";
import { STATUS_STYLE, displayStatus } from "@/lib/studio/invoices";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../../login-view";
import { ItemsEditor } from "../items-editor";
import { ShareBar } from "../share-bar";
import { deleteInvoice, setInvoiceStatus, updateInvoice } from "../actions";

const input =
  "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
const border = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };
const label = "mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ gate: string; id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10 opacity-30">
          <div className="h-64 rounded-2xl bg-current" />
        </div>
      }
    >
      <Detail p={params} />
    </Suspense>
  );
}

async function Detail({ p }: { p: Promise<{ gate: string; id: string }> }) {
  await connection(); // dynamic boundary
  const { gate, id: idRaw } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-4">
        <LoginView error="expired" />
      </div>
    );
  }
  if (!dbConfigured()) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="text-sm opacity-70">Database not connected yet.</p>
      </div>
    );
  }
  const id = Number(idRaw);
  if (!Number.isSafeInteger(id)) notFound();
  const db = getDb();

  const [inv] = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  if (!inv) notFound();
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, inv.clientId))
    .limit(1);
  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(asc(invoiceItems.position));

  const st = STATUS_STYLE[displayStatus(inv)];
  const base = `/${STUDIO_PATH}`;
  const dv = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
  const roster = await db
    .select({ id: clients.id, name: clients.name, company: clients.company })
    .from(clients)
    .orderBy(asc(clients.name));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <a href={`${base}/invoices`} className="font-mono text-[12px] opacity-50 hover:opacity-100">
        ← Invoices
      </a>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-3xl font-semibold tracking-tight">{inv.number}</h1>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
          style={{ background: `color-mix(in oklab, ${st.tint} 16%, transparent)`, color: st.tint }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.tint }} />
          {st.label}
        </span>
      </div>
      <p className="mt-1 text-sm opacity-60">
        {client?.name}
        {client?.company ? ` · ${client.company}` : ""}
      </p>

      <div
        className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl border p-5"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Total</p>
          <p className="text-2xl font-semibold tabular-nums">
            ${Number(inv.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Subtotal</p>
          <p className="text-sm tabular-nums opacity-70">
            ${Number(inv.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Tax</p>
          <p className="text-sm tabular-nums opacity-70">
            ${Number(inv.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Due</p>
          <p className="text-sm font-mono opacity-70">{dv(inv.dueAt) || "—"}</p>
        </div>
      </div>

      {/* status quick actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(["draft", "sent", "paid"] as const)
          .filter((s) => s !== inv.status)
          .map((s) => (
            <form key={s} action={setInvoiceStatus}>
              <input type="hidden" name="id" value={inv.id} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                className="rounded-full border px-3 py-1 text-[12px] opacity-70 hover:opacity-100"
                style={{ borderColor: `color-mix(in oklab, ${STATUS_STYLE[s].tint} 45%, transparent)` }}
              >
                Mark {s}
              </button>
            </form>
          ))}
      </div>

      <div className="mt-6">
        <ShareBar
          token={inv.shareToken}
          number={inv.number}
          total={`$${Number(inv.total).toLocaleString("en-US")}`}
          dueDate={dv(inv.dueAt)}
          clientEmail={client?.email ?? null}
          clientName={client?.name ?? "there"}
          paymentInstructions={inv.paymentInstructions}
          status={inv.status}
        />
      </div>

      {/* edit */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">Edit</h2>
        <form action={updateInvoice} className="mt-3 space-y-5">
          <input type="hidden" name="id" value={inv.id} />
          <input type="hidden" name="status" value={inv.status} />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="client_id" className={label}>Client</label>
              <select id="client_id" name="client_id" defaultValue={String(inv.clientId)} className={input} style={border}>
                {roster.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` — ${c.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="issued_at" className={label}>Issue date</label>
              <input id="issued_at" name="issued_at" type="date" defaultValue={dv(inv.issuedAt)} className={input} style={border} />
            </div>
            <div>
              <label htmlFor="due_at" className={label}>Due date</label>
              <input id="due_at" name="due_at" type="date" defaultValue={dv(inv.dueAt)} className={input} style={border} />
            </div>
          </div>
          <ItemsEditor
            initial={items.map((it) => ({
              description: it.description,
              qty: String(Number(it.qty)),
              unitPrice: String(Number(it.unitPrice)),
            }))}
          />
          <div>
            <label htmlFor="payment_instructions" className={label}>Payment instructions</label>
            <textarea
              id="payment_instructions"
              name="payment_instructions"
              rows={3}
              defaultValue={inv.paymentInstructions ?? ""}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              style={border}
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-lg px-6 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Save changes
          </button>
        </form>
      </section>

      {/* danger zone */}
      <section
        className="mt-12 rounded-2xl border p-5"
        style={{ borderColor: "rgba(220,60,60,0.35)" }}
      >
        <h2 className="text-sm font-semibold" style={{ color: "#e5484d" }}>
          Danger zone
        </h2>
        <p className="mt-1 text-[13px] opacity-60">
          Deleting this invoice also removes its line items and disables the
          client view link. There is no undo.
        </p>
        <form action={deleteInvoice} className="mt-3">
          <input type="hidden" name="id" value={inv.id} />
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 text-[13px]"
            style={{ borderColor: "rgba(220,60,60,0.5)", color: "#e5484d" }}
          >
            Delete invoice permanently
          </button>
        </form>
      </section>
    </div>
  );
}

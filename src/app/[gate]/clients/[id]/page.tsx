import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, interactions, invoices } from "@/lib/db/schema";
import { STATUS_STYLE, displayStatus, usd as money } from "@/lib/studio/invoices";
import { STATUSES, STATUS_LABEL, isStatus, statusTint, usd } from "@/lib/studio/crm";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { hasSession, verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../../login-view";
import { ClientFields } from "../../client-fields";
import { addInteraction, deleteClient, setClientStatus, updateClient } from "../actions";

const INPUT =
  "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
const BORDER = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ gate: string; id: string }>;
}) {
  // Doubly-dynamic route: params must be read inside the Suspense boundary.
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 opacity-30"><div className="h-64 rounded-2xl bg-current" /></div>}>
      <Detail p={params} />
    </Suspense>
  );
}

async function Detail({
  p,
}: {
  p: Promise<{ gate: string; id: string }>;
}) {
  await connection(); // dynamic boundary — everything below is request-time
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
  if (!(await hasSession())) notFound();
  const id = Number(idRaw);
  if (!Number.isSafeInteger(id)) notFound();
  const db = getDb();

  const [c] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!c) notFound();

  const timeline = await db
    .select()
    .from(interactions)
    .where(eq(interactions.clientId, id))
    .orderBy(desc(interactions.happenedAt));

  const clientInvoices = await db
    .select({
      id: invoices.id,
      number: invoices.number,
      status: invoices.status,
      dueAt: invoices.dueAt,
      total: invoices.total,
      currency: invoices.currency,
    })
    .from(invoices)
    .where(eq(invoices.clientId, id))
    .orderBy(desc(invoices.id));

  const base = `/${STUDIO_PATH}`;
  const status = isStatus(c.status) ? c.status : "lead";
  const tint = statusTint(status);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <a href={`${base}/clients`} className="font-mono text-[12px] opacity-50 hover:opacity-100">
        ← Clients
      </a>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{c.name}</h1>
          <p className="mt-1 text-sm opacity-60">
            {c.company ?? "—"} · {c.email ?? "no email"} · {c.phone ?? "no phone"}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
          style={{ background: `color-mix(in oklab, ${tint} 16%, transparent)`, color: tint }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* quick status moves */}
      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.filter((s) => s !== c.status).map((s) => (
          <form key={s} action={setClientStatus}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="status" value={s} />
            <button
              type="submit"
              className="rounded-full border px-3 py-1 text-[12px] opacity-70 hover:opacity-100"
              style={{ borderColor: `color-mix(in oklab, ${statusTint(s)} 40%, transparent)` }}
            >
              → {STATUS_LABEL[s]}
            </button>
          </form>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-3" style={BORDER}>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Value</p>
          <p className="mt-1 font-semibold tabular-nums">{usd(c.valueUsd)}</p>
        </div>
        <div className="rounded-xl border p-3" style={BORDER}>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Source</p>
          <p className="mt-1 font-semibold capitalize">{c.source}</p>
        </div>
        <div className="rounded-xl border p-3" style={BORDER}>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">Next follow-up</p>
          <p className="mt-1 font-semibold font-mono text-[13px]">
            {c.nextFollowUpAt ? c.nextFollowUpAt.toISOString().slice(0, 10) : "—"}
          </p>
        </div>
      </div>

      {/* timeline */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Timeline
        </h2>
        <form action={addInteraction} className="mt-3 grid gap-2 sm:grid-cols-[9rem_1fr_7rem_auto]">
          <input type="hidden" name="client_id" value={c.id} />
          <select name="type" aria-label="Interaction type" className={INPUT} style={BORDER}>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="note" selected>Note</option>
          </select>
          <input
            name="summary"
            required
            placeholder="What happened? e.g. Called, asked for proposal by Friday"
            className={INPUT}
            style={BORDER}
          />
          <input type="date" name="happened_at" aria-label="When" className={INPUT} style={BORDER} />
          <button
            type="submit"
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Log
          </button>
        </form>
        <ol className="mt-5 space-y-3">
          {timeline.length === 0 ? (
            <li className="text-sm opacity-50">No interactions yet.</li>
          ) : (
            timeline.map((t) => (
              <li key={t.id} className="flex gap-3">
                <div className="flex w-20 shrink-0 flex-col items-end pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-50">
                    {t.type}
                  </span>
                  <span className="font-mono text-[10px] opacity-40">
                    {t.happenedAt.toISOString().slice(0, 10)}
                  </span>
                </div>
                <div
                  className="flex-1 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "color-mix(in oklab, var(--fg) 10%, transparent)" }}
                >
                  {t.summary}
                </div>
              </li>
            ))
          )}
        </ol>
      </section>

      {/* invoices */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Invoices
        </h2>
        <ul className="mt-3 space-y-2">
          {clientInvoices.length === 0 ? (
            <li className="text-sm opacity-50">
              No invoices yet.{" "}
              <a href={`${base}/invoices/new`} className="underline">
                Create one →
              </a>
            </li>
          ) : (
            clientInvoices.map((iv) => {
              const st = STATUS_STYLE[displayStatus(iv)];
              return (
                <li key={iv.id}>
                  <a
                    href={`${base}/invoices/${iv.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm hover:opacity-90"
                    style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
                  >
                    <span className="font-mono text-[13px] font-medium">{iv.number}</span>
                    <span className="font-mono text-[12px] opacity-60">
                      {iv.dueAt ? iv.dueAt.toISOString().slice(0, 10) : "—"}
                    </span>
                    <span className="tabular-nums">{money(iv.total, iv.currency)}</span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[12px]"
                      style={{ background: `color-mix(in oklab, ${st.tint} 16%, transparent)`, color: st.tint }}
                    >
                      {st.label}
                    </span>
                  </a>
                </li>
              );
            })
          )}
        </ul>
      </section>

      {/* edit */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Edit details
        </h2>
        <form action={updateClient} className="mt-3 space-y-4">
          <input type="hidden" name="id" value={c.id} />
          <ClientFields
            c={{
              name: c.name,
              company: c.company,
              email: c.email,
              phone: c.phone,
              source: c.source,
              status: c.status,
              service: c.service,
              projectSummary: c.projectSummary,
              valueUsd: c.valueUsd,
              nextFollowUpAt: c.nextFollowUpAt,
            }}
          />
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
      <section className="mt-12 rounded-2xl border p-5" style={{ borderColor: "rgba(220,60,60,0.35)" }}>
        <h2 className="text-sm font-semibold" style={{ color: "#e5484d" }}>
          Danger zone
        </h2>
        <p className="mt-1 text-[13px] opacity-60">
          Deleting removes the client and their whole timeline. There is no undo —
          export CSV first if in doubt.
        </p>
        <form action={deleteClient} className="mt-3">
          <input type="hidden" name="id" value={c.id} />
          <button
            type="submit"
            className="rounded-lg border px-4 py-2 text-[13px]"
            style={{ borderColor: "rgba(220,60,60,0.5)", color: "#e5484d" }}
          >
            Delete client permanently
          </button>
        </form>
      </section>
    </div>
  );
}

import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, invoices } from "@/lib/db/schema";
import { STATUS_STYLE, displayStatus, usd } from "@/lib/studio/invoices";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../login-view";

export default function InvoicesPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton />}>
      <InvoicesContent p={params} />
    </Suspense>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 opacity-30">
      <div className="h-8 w-44 rounded bg-current" />
      <div className="mt-8 h-64 w-full rounded-2xl bg-current" />
    </div>
  );
}

async function InvoicesContent({
  p,
}: {
  p: Promise<{ gate: string }>;
}) {
  await connection(); // dynamic boundary
  const { gate } = await p;
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
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <p className="text-sm opacity-70">Database not connected yet.</p>
      </div>
    );
  }
  const db = getDb();

  const rows = await db
    .select({
      id: invoices.id,
      number: invoices.number,
      status: invoices.status,
      total: invoices.total,
      currency: invoices.currency,
      dueAt: invoices.dueAt,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(invoices)
    .innerJoin(clients, eq(clients.id, invoices.clientId))
    .orderBy(desc(invoices.id))
    .limit(200);

  // Money is grouped per currency — sums across currencies would be fiction.
  const aggs = await db
    .select({
      currency: invoices.currency,
      outstanding: sql<string>`coalesce(sum(case when ${invoices.status} = 'sent' then ${invoices.total} else 0 end), 0)::text`,
      overdue: sql<string>`coalesce(sum(case when ${invoices.status} = 'sent' and ${invoices.dueAt} < now() then ${invoices.total} else 0 end), 0)::text`,
      paid: sql<string>`coalesce(sum(case when ${invoices.status} = 'paid' then ${invoices.total} else 0 end), 0)::text`,
    })
    .from(invoices)
    .groupBy(invoices.currency);
  const active = aggs.filter(
    (a) => Number(a.outstanding) > 0 || Number(a.overdue) > 0 || Number(a.paid) > 0,
  );
  const moneyLines = (pick: (a: (typeof aggs)[number]) => string) =>
    active.length === 0
      ? usd(0, "USD")
      : active.map((a) => usd(pick(a), a.currency)).join("  ·  ");

  const base = `/${STUDIO_PATH}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
        <a
          href={`${base}/invoices/new`}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          + New invoice
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Outstanding (sent)", lines: moneyLines((a) => a.outstanding), tint: "#8e8eff" },
          { label: "Overdue", lines: moneyLines((a) => a.overdue), tint: "#e5484d" },
          { label: "Paid to date", lines: moneyLines((a) => a.paid), tint: "#4cc38a" },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border p-4"
            style={{ borderColor: `color-mix(in oklab, ${c.tint} 30%, transparent)` }}
          >
            <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
              {c.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums leading-snug">
              {c.lines}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-6 overflow-hidden rounded-2xl border"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left font-mono text-[11px] uppercase tracking-wider opacity-60"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 10%, transparent)" }}
            >
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Due</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center opacity-50">
                  No invoices yet — create one from a client.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const st = STATUS_STYLE[displayStatus(r)];
                return (
                  <tr
                    key={r.id}
                    className="border-b last:border-0"
                    style={{ borderColor: "color-mix(in oklab, var(--fg) 8%, transparent)" }}
                  >
                    <td className="px-4 py-3">
                      <a href={`${base}/invoices/${r.id}`} className="font-mono text-[13px] font-medium hover:underline">
                        {r.number}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {r.clientName}
                      <span className="opacity-50"> · {r.clientCompany ?? "—"}</span>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-[12px] opacity-70 sm:table-cell">
                      {r.dueAt ? r.dueAt.toISOString().slice(0, 10) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{usd(r.total, r.currency)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px]"
                        style={{ background: `color-mix(in oklab, ${st.tint} 16%, transparent)`, color: st.tint }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.tint }} />
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

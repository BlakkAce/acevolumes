import { Suspense } from "react";
import { connection } from "next/server";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { STATUSES, STATUS_LABEL, statusTint, usd } from "@/lib/studio/crm";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { hasSession, verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../login-view";

export default function ClientsPage({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <ClientsContent p={params} sp={searchParams} />
    </Suspense>
  );
}

function ListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 opacity-30">
      <div className="h-8 w-40 rounded bg-current" />
      <div className="mt-8 h-64 w-full rounded-2xl bg-current" />
    </div>
  );
}

async function ClientsContent({
  p,
  sp,
}: {
  p: Promise<{ gate: string }>;
  sp: Promise<{ q?: string; status?: string }>;
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
        <p className="text-sm opacity-70">
          Database not connected yet — see the dashboard for the one-step setup.
        </p>
      </div>
    );
  }
  if (!(await hasSession())) notFound();
  const db = getDb();
  const { q, status } = await sp;

  const where: SQL[] = [];
  if (q) {
    const like = `%${q}%`;
    const cond = or(
      ilike(clients.name, like),
      ilike(clients.company, like),
      ilike(clients.email, like),
    );
    if (cond) where.push(cond);
  }
  if (status && (STATUSES as readonly string[]).includes(status)) {
    where.push(eq(clients.status, status));
  }

  const rows = await db
    .select()
    .from(clients)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(clients.updatedAt))
    .limit(200);

  const base = `/${STUDIO_PATH}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
        <div className="flex gap-2">
          <a
            href={`${base}/clients/export`}
            className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          >
            Export CSV
          </a>
          <a
            href={`${base}/clients/new`}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            + Add client
          </a>
        </div>
      </div>

      <form method="get" action={`${base}/clients`} className="mt-6 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, company, email…"
          className="h-10 min-w-52 flex-1 rounded-lg border bg-transparent px-3 text-sm outline-none"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-lg border bg-transparent px-3 text-sm"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg border px-4 text-sm"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 24%, transparent)" }}
        >
          Filter
        </button>
      </form>

      <div
        className="mt-6 overflow-hidden rounded-2xl border"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider opacity-60"
                style={{ borderColor: "color-mix(in oklab, var(--fg) 10%, transparent)" }}>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Service</th>
              <th className="px-4 py-3 text-right font-medium">Value</th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">
                Follow-up
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center opacity-50">
                  No clients {q || status ? "match this filter" : "yet — add your first"}.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-0 hover:bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]"
                  style={{ borderColor: "color-mix(in oklab, var(--fg) 8%, transparent)" }}
                >
                  <td className="px-4 py-3">
                    <a href={`${base}/clients/${c.id}`} className="font-medium hover:underline">
                      {c.name}
                    </a>
                    <p className="text-[12px] opacity-50">{c.company ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px]"
                      style={{
                        background: `color-mix(in oklab, ${statusTint(c.status as never)} 16%, transparent)`,
                        color: statusTint(c.status as never),
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusTint(c.status as never) }} />
                      {STATUS_LABEL[c.status as never]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 opacity-70 sm:table-cell">
                    {c.service ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {usd(c.valueUsd)}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-[12px] opacity-70 md:table-cell">
                    {c.nextFollowUpAt ? c.nextFollowUpAt.toISOString().slice(0, 10) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] opacity-40">
        {rows.length} client{rows.length === 1 ? "" : "s"} shown
      </p>
    </div>
  );
}

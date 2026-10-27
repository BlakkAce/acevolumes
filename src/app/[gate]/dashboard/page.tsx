import { Suspense } from "react";
import { and, desc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, dbConfigured } from "@/lib/db";
import { clients, interactions, invoices, pageviews } from "@/lib/db/schema";
import {
  OPEN_STATUSES,
  STATUSES,
  STATUS_LABEL,
  statusTint,
  usd,
} from "@/lib/studio/crm";
import { usd as usdMoney } from "@/lib/studio/invoices";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/studio/config";
import { LoginView } from "../login-view";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <p
        className="font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: "var(--accent)" }}
      >
        AceVolumes Studio
      </p>
      {children}
    </div>
  );
}

async function TrafficSection({ base }: { base: string }) {
  const db = getDb();
  const since = sql`now() - interval '7 days'`;
  const [totals] = await db
    .select({
      humans: sql<number>`count(*) filter (where ${pageviews.isBot} = false)`,
      bots: sql<number>`count(*) filter (where ${pageviews.isBot} = true)`,
    })
    .from(pageviews)
    .where(gte(pageviews.createdAt, since));
  const topPaths = await db
    .select({ path: pageviews.path, n: sql<number>`count(*)` })
    .from(pageviews)
    .where(and(gte(pageviews.createdAt, since), eq(pageviews.isBot, false)))
    .groupBy(pageviews.path)
    .orderBy(desc(sql`count(*)`))
    .limit(5);
  const topRefs = await db
    .select({ referrer: pageviews.referrer, n: sql<number>`count(*)` })
    .from(pageviews)
    .where(and(gte(pageviews.createdAt, since), eq(pageviews.isBot, false), ne(pageviews.referrer, "")))
    .groupBy(pageviews.referrer)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  return (
    <section
      className="mt-6 rounded-2xl border p-5"
      style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
          Traffic, last 7 days
        </h2>
        <a href={`${base}/clients`} className="text-xs opacity-40">
          first-party, cookieless
        </a>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">Visits</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{Number(totals?.humans ?? 0)}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">Search crawler hits</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{Number(totals?.bots ?? 0)}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">Referrer sources</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{topRefs.length}</p>
        </div>
      </div>
      {topPaths.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">Top pages</p>
            <ul className="mt-2 space-y-1 text-sm tabular-nums">
              {topPaths.map((r) => (
                <li key={r.path} className="flex justify-between gap-4">
                  <span className="truncate opacity-80">{r.path}</span>
                  <span>{Number(r.n)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">Top referrers</p>
            {topRefs.length === 0 ? (
              <p className="mt-2 text-sm opacity-40">None yet: shares and links will appear here.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm tabular-nums">
                {topRefs.map((r) => (
                  <li key={r.referrer} className="flex justify-between gap-4">
                    <span className="truncate opacity-80">{r.referrer}</span>
                    <span>{Number(r.n)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm opacity-40">
          No visits logged yet. Share the site: every view lands here.
        </p>
      )}
    </section>
  );
}

function DbSetupPanel() {
  return (
    <Shell>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
      <div
        className="mt-8 rounded-2xl border p-8"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
      >
        <p className="text-lg font-medium">One step left: connect the database</p>
        <p className="mt-2 max-w-xl text-sm opacity-60">
          The CRM needs its Postgres database. In Vercel: this project →
          Storage → Create Database → Postgres, then add the offered
          <code className="mx-1 rounded px-1 font-mono text-[12px]">DATABASE_URL</code>
          as an environment variable and redeploy. The schema lands via
          <code className="mx-1 rounded px-1 font-mono text-[12px]">drizzle-kit push</code>.
        </p>
      </div>
    </Shell>
  );
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  // No awaits in the shell — dynamic reads happen inside Suspense only.
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <Overview p={params} />
    </Suspense>
  );
}

function OverviewSkeleton() {
  return (
    <Shell>
      <div className="mt-6 h-8 w-48 rounded bg-current opacity-20" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-current opacity-10" />
        ))}
      </div>
    </Shell>
  );
}

async function Overview({ p }: { p: Promise<{ gate: string }> }) {
  await connection(); // dynamic boundary — everything below is request-time
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
  if (!dbConfigured()) return <DbSetupPanel />;
  const db = getDb();

  const counts = await db
    .select({ status: clients.status, n: sql<number>`count(*)::int` })
    .from(clients)
    .groupBy(clients.status);
  const countBy = new Map(counts.map((c) => [c.status, c.n]));

  const [openValue] = await db
    .select({
      total: sql<string | null>`coalesce(sum(${clients.valueUsd}), 0)::text`,
    })
    .from(clients)
    .where(inArray(clients.status, OPEN_STATUSES));

  const invAggs = await db
    .select({
      currency: invoices.currency,
      outstanding: sql<string>`coalesce(sum(case when ${invoices.status} = 'sent' then ${invoices.total} else 0 end), 0)::text`,
      overdue: sql<string>`coalesce(sum(case when ${invoices.status} = 'sent' and ${invoices.dueAt} < now() then ${invoices.total} else 0 end), 0)::text`,
    })
    .from(invoices)
    .groupBy(invoices.currency);
  const invActive = invAggs.filter(
    (a) => Number(a.outstanding) > 0 || Number(a.overdue) > 0,
  );
  const invLines = (pick: (a: (typeof invAggs)[number]) => string) =>
    invActive.length === 0
      ? usdMoney(0, "USD")
      : invActive.map((a) => usdMoney(pick(a), a.currency)).join("  ·  ");

  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const followUps = await db
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      status: clients.status,
      nextFollowUpAt: clients.nextFollowUpAt,
    })
    .from(clients)
    .where(
      and(
        lte(clients.nextFollowUpAt, soon),
        inArray(clients.status, ["lead", "proposal", "active", "delivered"]),
      ),
    )
    .orderBy(clients.nextFollowUpAt)
    .limit(8);

  const recent = await db
    .select({
      id: interactions.id,
      clientId: interactions.clientId,
      type: interactions.type,
      summary: interactions.summary,
      happenedAt: interactions.happenedAt,
      clientName: clients.name,
    })
    .from(interactions)
    .innerJoin(clients, eq(clients.id, interactions.clientId))
    .orderBy(desc(interactions.happenedAt))
    .limit(6);

  const base = `/${STUDIO_PATH}`;

  return (
    <Shell>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <a
            href={`${base}/scout`}
            className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          >
            Scout
          </a>
          <a
            href={`${base}/invoices`}
            className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          >
            Invoices
          </a>
          <a
            href={`${base}/clients`}
            className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          >
            Clients
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

      {/* pipeline row */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`${base}/clients?status=${s}`}
            className="rounded-2xl border p-4 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)",
            }}
          >
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider opacity-60">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: statusTint(s) }}
              />
              {STATUS_LABEL[s]}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {countBy.get(s) ?? 0}
            </p>
          </a>
        ))}
      </div>

      <div
        className="mt-4 rounded-2xl border p-5"
        style={{
          borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)",
          background: "color-mix(in oklab, var(--accent) 7%, transparent)",
        }}
      >
        <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
          Open pipeline value (lead + proposal + active)
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">
          {usd(openValue?.total ?? "0")}
        </p>
      </div>

      {/* money row */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <a
          href={`${base}/invoices`}
          className="rounded-2xl border p-5 transition-transform hover:-translate-y-0.5"
          style={{ borderColor: "color-mix(in oklab, #8e8eff 30%, transparent)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
            Outstanding invoices (sent)
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums leading-snug">
            {invLines((a) => a.outstanding)}
          </p>
        </a>
        <a
          href={`${base}/invoices`}
          className="rounded-2xl border p-5 transition-transform hover:-translate-y-0.5"
          style={{ borderColor: "color-mix(in oklab, #e5484d 30%, transparent)" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
            Overdue
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums leading-snug">
            {invLines((a) => a.overdue)}
          </p>
        </a>
      </div>

      <Suspense fallback={null}>
        <TrafficSection base={base} />
      </Suspense>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
            Follow-ups due / overdue
          </h2>
          <ul className="mt-3 space-y-2">
            {followUps.length === 0 ? (
              <li className="text-sm opacity-50">Nothing due this week.</li>
            ) : (
              followUps.map((f) => (
                <li key={f.id}>
                  <a
                    href={`${base}/clients/${f.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm hover:opacity-90"
                    style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
                  >
                    <span>
                      <span className="font-medium">{f.name}</span>
                      <span className="opacity-50"> · {f.company ?? "—"}</span>
                    </span>
                    <span className="font-mono text-[12px] opacity-70">
                      {f.nextFollowUpAt?.toISOString().slice(0, 10)}
                    </span>
                  </a>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
            Latest activity
          </h2>
          <ul className="mt-3 space-y-2">
            {recent.length === 0 ? (
              <li className="text-sm opacity-50">No interactions logged yet.</li>
            ) : (
              recent.map((r) => (
                <li key={r.id}>
                  <a
                    href={`${base}/clients/${r.clientId}`}
                    className="block rounded-xl border px-4 py-3 text-sm hover:opacity-90"
                    style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider opacity-60">
                      {r.type} · {r.happenedAt.toISOString().slice(0, 10)}
                    </span>
                    <p className="mt-1 line-clamp-2 opacity-90">{r.summary}</p>
                    <p className="mt-1 text-[12px] opacity-50">{r.clientName}</p>
                  </a>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </Shell>
  );
}

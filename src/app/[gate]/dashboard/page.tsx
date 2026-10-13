import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SESSION_COOKIE, STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";

function DashSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 opacity-30">
      <div className="h-3 w-24 rounded bg-current" />
      <div className="mt-3 h-8 w-48 rounded bg-current" />
      <div className="mt-8 h-40 w-full rounded-2xl bg-current" />
    </div>
  );
}

async function DashboardContent({ gate }: { gate: string }) {
  await connection();
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();

  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    redirect(`/${STUDIO_PATH}`);
  }

  const token = store.get(SESSION_COOKIE)!.value;
  const expiry = new Date(Number(token.slice(0, token.indexOf("."))));
  const expires = expiry.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "var(--accent)" }}
          >
            AceVolumes Studio
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
        </div>
        <form action={`/${STUDIO_PATH}/logout`} method="post">
          <button
            type="submit"
            className="h-9 rounded-lg border px-4 text-sm opacity-70 transition-opacity hover:opacity-100"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          >
            Log out
          </button>
        </form>
      </div>

      <div
        className="mt-8 rounded-2xl border p-8"
        style={{
          borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)",
          background: "color-mix(in oklab, var(--fg) 3%, transparent)",
        }}
      >
        <p className="text-lg font-medium">You are in.</p>
        <p className="mt-2 text-sm opacity-60">
          Session valid until {expires}. This gate, login and session guard are
          live — the working CRM (clients, pipeline, follow-ups) lands here in
          Phase 2, invoices in Phase 3, prospecting in Phase 4.
        </p>
        <ul className="mt-6 grid gap-3 font-mono text-[12px] opacity-70 sm:grid-cols-2">
          <li>→ Clients &amp; pipeline (Phase 2)</li>
          <li>→ Follow-up timeline (Phase 2)</li>
          <li>→ Invoices &amp; outstanding (Phase 3)</li>
          <li>→ Prospecting / gap-scan (Phase 4)</li>
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return (
    <Suspense fallback={<DashSkeleton />}>
      <DashboardContentGate params={params} />
    </Suspense>
  );
}

async function DashboardContentGate({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  const { gate } = await params;
  return <DashboardContent gate={gate} />;
}

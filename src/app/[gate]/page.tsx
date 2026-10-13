import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { hasSession } from "@/lib/studio/session";

// cacheComponents/PPR: neutral static shell, everything below streams at
// request time (env vars, cookies, params never touch the prerender).

function LoginSkeleton() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl border p-8 opacity-30"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 14%, transparent)" }}
      >
        <div className="h-3 w-16 rounded bg-current" />
        <div className="mt-4 h-6 w-40 rounded bg-current" />
        <div className="mt-6 h-11 w-full rounded-lg bg-current" />
        <div className="mt-3 h-11 w-full rounded-lg bg-current" />
      </div>
    </div>
  );
}

async function GateContent({
  gate,
  e,
}: {
  gate: string;
  e?: string;
}) {
  await connection(); // dynamic boundary: env + cookies are request-time only
  // Fail closed: wrong slug or missing/malformed env config -> ordinary 404.
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  if (await hasSession()) redirect(`/${STUDIO_PATH}/dashboard`);

  const error =
    e === "rate"
      ? "Too many attempts. Wait ten minutes and try again."
      : e === "1"
        ? "Incorrect passphrase."
        : null;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--card, transparent)",
            borderColor: "color-mix(in oklab, var(--fg) 14%, transparent)",
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "var(--accent)" }}
          >
            Studio
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Private access
          </h1>
          <p className="mt-2 text-sm opacity-60">
            Enter your passphrase to open the studio dashboard.
          </p>
          {error ? (
            <p
              className="mt-4 rounded-lg px-3 py-2 text-[13px]"
              style={{ background: "rgba(220,60,60,0.12)", color: "#e5484d" }}
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <form
            action={`/${STUDIO_PATH}/login`}
            method="post"
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              name="passphrase"
              id="passphrase"
              required
              autoComplete="current-password"
              placeholder="Passphrase"
              className="h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-1"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
            />
            <button
              type="submit"
              className="h-11 w-full rounded-lg text-sm font-semibold"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Unlock
            </button>
          </form>
        </div>
        <p className="mt-4 text-center font-mono text-[11px] opacity-40">
          30-day session · rate-limited · noindex
        </p>
      </div>
    </div>
  );
}

export default function GatePage({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <GateContentWithParams params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function GateContentWithParams({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const [{ gate }, { e }] = await Promise.all([params, searchParams]);
  return <GateContent gate={gate} e={e} />;
}

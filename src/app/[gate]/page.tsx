import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { hasSession } from "@/lib/studio/session";
import { LoginView } from "./login-view";

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

function errorLabel(e?: string): string | null {
  if (e === "rate") return "rate";
  if (e === "1") return "1";
  return null;
}

async function GateContent({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  await connection(); // dynamic boundary: env + cookies are request-time only
  const [{ gate }, { e }] = await Promise.all([params, searchParams]);
  // Fail closed: wrong slug or missing/malformed env config -> ordinary 404.
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  if (await hasSession()) redirect(`/${STUDIO_PATH}/dashboard`);

  return <LoginView error={errorLabel(e)} />;
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
      <GateContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../../login-view";
import { ClientFields } from "../../client-fields";
import { createClient } from "../actions";

export default function NewClientPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-10 opacity-30"><div className="h-72 rounded-2xl bg-current" /></div>}>
      <NewClient p={params} />
    </Suspense>
  );
}

async function NewClient({ p }: { p: Promise<{ gate: string }> }) {
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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <a
        href={`/${STUDIO_PATH}/clients`}
        className="font-mono text-[12px] opacity-50 hover:opacity-100"
      >
        ← Clients
      </a>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Add client</h1>
      <form
        action={createClient}
        className="mt-8 space-y-5"
        style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
      >
        <ClientFields />
        <div>
          <label
            htmlFor="first_note"
            className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60"
          >
            How did this lead arrive? (first timeline note, optional)
          </label>
          <input
            id="first_note"
            name="first_note"
            placeholder="e.g. Found via ClientScout — restaurants, Lagos — no website, 4.6★"
            className="h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
          />
        </div>
        <button
          type="submit"
          className="h-11 w-full rounded-lg text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          Create client
        </button>
      </form>
    </div>
  );
}

import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import {
  SESSION_COOKIE,
  STUDIO_PATH,
  studioConfigured,
} from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { LoginView } from "../../login-view";
import { ItemsEditor } from "../items-editor";
import { createInvoice } from "../actions";

export default function NewInvoicePage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-10 opacity-30">
          <div className="h-72 rounded-2xl bg-current" />
        </div>
      }
    >
      <NewInvoice p={params} />
    </Suspense>
  );
}

async function NewInvoice({ p }: { p: Promise<{ gate: string }> }) {
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
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="text-sm opacity-70">Database not connected yet.</p>
      </div>
    );
  }
  const db = getDb();
  const roster = await db
    .select({ id: clients.id, name: clients.name, company: clients.company })
    .from(clients)
    .orderBy(asc(clients.name));

  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(new Date().getTime() + 14 * 864e5).toISOString().slice(0, 10);
  const input =
    "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
  const border = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <a href={`/${STUDIO_PATH}/invoices`} className="font-mono text-[12px] opacity-50 hover:opacity-100">
        ← Invoices
      </a>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">New invoice</h1>

      {roster.length === 0 ? (
        <p className="mt-8 text-sm opacity-70">
          Add a client first — invoices are always tied to one.{" "}
          <a href={`/${STUDIO_PATH}/clients/new`} className="underline">
            Add a client →
          </a>
        </p>
      ) : (
        <form action={createInvoice} className="mt-8 space-y-5">
          <div>
            <label htmlFor="client_id" className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60">
              Client *
            </label>
            <select id="client_id" name="client_id" required className={input} style={border}>
              {roster.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company ? ` — ${c.company}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="issued_at" className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60">
                Issue date
              </label>
              <input id="issued_at" name="issued_at" type="date" defaultValue={today} className={input} style={border} />
            </div>
            <div>
              <label htmlFor="due_at" className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60">
                Due date
              </label>
              <input id="due_at" name="due_at" type="date" defaultValue={due} className={input} style={border} />
            </div>
          </div>
          <ItemsEditor />
          <div>
            <label htmlFor="payment_instructions" className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60">
              Payment instructions (shown on the invoice)
            </label>
            <textarea
              id="payment_instructions"
              name="payment_instructions"
              rows={3}
              placeholder="Bank transfer — Acct 0123456789, Bank of Lagos, sort code …; or Wise; or PayPal me@…"
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
              style={border}
            />
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-lg text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Create invoice (draft)
          </button>
        </form>
      )}
    </div>
  );
}

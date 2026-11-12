import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts, agentRuns } from "@/lib/db/schema";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { SESSION_COOKIE } from "@/lib/studio/config";
import { LoginView } from "../login-view";
import { metaOf, saveConnection } from "@/lib/social/store";
import { bufferChannels, bufferAccounts } from "@/lib/social/buffer";

// Auth-gated studio page: block instead of streaming a shell.
export const instant = false;

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

async function syncBuffer(formData: FormData) {
  "use server";
  const key = String(formData.get("account") ?? "1") === "2" ? "2" : "1";
  const token = bufferAccounts().find((a) => a.key === key)?.token;
  if (!dbConfigured() || !token) return;
  const db = getDb();
  let n = 0;
  try {
    const channels = await bufferChannels(token, key);
    for (const ch of channels) {
      await saveConnection({
        platform: ch.platform,
        handle: ch.handle,
        accessToken: `buffer-${key}`,
        meta: { bufferProfileId: ch.id, bufferAccountKey: key },
      });
      n += 1;
    }
    await db.insert(agentRuns).values({
      agent: "scribe",
      summary: `Buffer account ${key} sync: ${n} channel${n === 1 ? "" : "s"} detected.`,
      status: "ok",
      meta: JSON.stringify({ key, n }),
    });
  } catch (e) {
    await db.insert(agentRuns).values({
      agent: "scribe",
      summary: `Buffer account ${key} sync failed: ${e instanceof Error ? e.message.slice(0, 120) : "unknown"}`,
      status: "error",
    });
  }
  revalidatePath(`/${STUDIO_PATH}/settings`);
}

async function forgetChannel(formData: FormData) {
  "use server";
  const platform = String(formData.get("platform") ?? "");
  if (!["facebook", "instagram", "x", "linkedin"].includes(platform)) return;
  if (!dbConfigured()) return;
  await getDb().delete(socialAccounts).where(eq(socialAccounts.platform, platform));
  revalidatePath(`/${STUDIO_PATH}/settings`);
}

const PLATFORMS = ["facebook", "instagram", "x", "linkedin"] as const;
const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook Page",
  instagram: "Instagram",
  x: "X (@acevolumes)",
  linkedin: "LinkedIn (David)",
};

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <Settings p={params} sp={searchParams} />;
}

async function Settings({
  p,
  sp,
}: {
  p: Promise<{ gate: string }>;
  sp: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { gate } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  // Runtime data: session + DB reads + possible auto-sync. Never prerendered.
  await connection();
  const store = await cookies();
  if (!verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    return (
      <Shell>
        <LoginView error="expired" />
      </Shell>
    );
  }
  const base = `/${STUDIO_PATH}`;
  const q = await sp;
  const connectResult = typeof q.connect === "string" ? q.connect : "";

  const autoSynced: string[] = [];
  let accountRows: (typeof socialAccounts.$inferSelect)[] = [];
  if (dbConfigured()) {
    const db = getDb();
    let accounts = await db.select().from(socialAccounts);
    // AUTO-SYNC: the moment a token exists, detect its channels once.
    for (const acc of bufferAccounts()) {
      const already = accounts.some((a) => metaOf(a).bufferAccountKey === acc.key);
      if (already) continue;
      try {
        const channels = await bufferChannels(acc.token, acc.key);
        for (const ch of channels) {
          await saveConnection({
            platform: ch.platform,
            handle: ch.handle,
            accessToken: `buffer-${acc.key}`,
            meta: { bufferProfileId: ch.id, bufferAccountKey: acc.key },
          });
        }
        if (channels.length > 0) {
          autoSynced.push(`account ${acc.key}: ${channels.map((c) => c.platform).join(", ")}`);
          await db.insert(agentRuns).values({
            agent: "scribe",
            summary: `Auto-sync (account ${acc.key}): ${channels.length} channel${channels.length === 1 ? "" : "s"} detected.`,
            status: "ok",
            meta: JSON.stringify({ key: acc.key, n: channels.length }),
          });
        }
      } catch {
        // token present but Buffer not reachable/valid yet — manual sync will retry
      }
      accounts = await db.select().from(socialAccounts);
    }
    accountRows = accounts;
  }

  const byPlatform = new Map(accountRows.map((a) => [a.platform, a]));
  const tokens = bufferAccounts();

  return (
    <Shell>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <a
          href={`${base}/dashboard`}
          className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        >
          Dashboard
        </a>
      </div>

      {autoSynced.length > 0 ? (
        <p className="mt-4 rounded-xl border p-3 text-sm" style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}>
          Auto-synced just now: <span className="font-mono">{autoSynced.join(" · ")}</span>
        </p>
      ) : null}
      {connectResult ? (
        <p className="mt-4 rounded-xl border p-3 text-sm" style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}>
          <span className="font-mono">{connectResult.slice(0, 160)}</span>
        </p>
      ) : null}

      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Buffer — the delivery layer
      </h2>
      <p className="mt-3 max-w-2xl text-sm opacity-60">
        Buffer is the only connection method: it owns the platform logins and
        does the posting. The studio drafts, you approve, Buffer delivers.
        The moment an account token exists, its channels are detected and
        mapped automatically.
      </p>
      <div className="mt-3 grid gap-3">
        {[
          { key: "1" as const, label: "Buffer account 1", env: "BUFFER_ACCESS_TOKEN" },
          { key: "2" as const, label: "Buffer account 2", env: "BUFFER_ACCESS_TOKEN_2" },
        ].map((acc) => {
          const has = tokens.some((t) => t.key === acc.key);
          const synced = [...byPlatform.values()].some((a) => metaOf(a).bufferAccountKey === acc.key);
          return (
            <div key={acc.key} className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{acc.label}</p>
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                  style={{ color: has ? (synced ? "#1a7a4d" : "var(--gold)") : "var(--fg-muted)" }}
                >
                  {has ? (synced ? "connected" : "token set — sync pending") : "no token"}
                </span>
              </div>
              {has ? null : (
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm opacity-70">
                  <li>Create/choose the Buffer account (free plan works) and connect its channels inside Buffer.</li>
                  <li>Generate an API token at publish.buffer.com/settings/api.</li>
                  <li>Add to Vercel as <span className="font-mono">{acc.env}</span> and redeploy.</li>
                </ol>
              )}
              <form action={syncBuffer} className="mt-3">
                <input type="hidden" name="account" value={acc.key} />
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                  style={{
                    background: has ? "var(--accent)" : "transparent",
                    color: has ? "var(--accent-fg)" : "var(--fg-muted)",
                  }}
                  disabled={!has}
                >
                  Re-sync channels
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Detected channels
      </h2>
      <div className="mt-3 grid gap-3">
        {PLATFORMS.map((platform) => {
          const row = byPlatform.get(platform);
          const status = row?.status ?? "not connected";
          const m = row ? metaOf(row) : {};
          return (
            <div key={platform} className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{PLATFORM_LABEL[platform]}</p>
                  {row?.handle ? <p className="text-xs opacity-60">{row.handle}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: status === "connected" ? "#1a7a4d" : "var(--fg-muted)" }}
                  >
                    {status === "connected" ? `connected via account ${String(m.bufferAccountKey ?? "1")}` : status}
                  </span>
                  {status === "connected" ? (
                    <form action={forgetChannel}>
                      <input type="hidden" name="platform" value={platform} />
                      <button type="submit" className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100">
                        Forget
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Automation
      </h2>
      <div className="mt-3 grid gap-3 text-sm">
        <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
          <p className="font-semibold">Scribe (drafts)</p>
          <p className="mt-1 opacity-60">Daily 05:30 UTC. Fills the Content queue for the next 7 days in brand voice.</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
          <p className="font-semibold">Scheduler (delivery)</p>
          <p className="mt-1 opacity-60">Daily 06:00 UTC. Approved, due posts go to Buffer with their images and schedules.</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
          <p className="font-semibold">Database backups</p>
          <p className="mt-1 opacity-60">Sundays 03:00 UTC via GitHub Actions, encrypted. Runbook: docs/backups.md.</p>
        </div>
      </div>
    </Shell>
  );
}

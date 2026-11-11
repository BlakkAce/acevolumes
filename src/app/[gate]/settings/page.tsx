import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { SESSION_COOKIE } from "@/lib/studio/config";
import { LoginView } from "../login-view";
import { isConfigured } from "@/lib/social/oauth";
import { metaOf, saveConnection } from "@/lib/social/store";
import { bufferChannels, bufferAccounts } from "@/lib/social/buffer";
import { agentRuns } from "@/lib/db/schema";

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
      summary: `Buffer account ${key} sync: ${n} channel${n === 1 ? "" : "s"} mapped.`,
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

async function disconnect(formData: FormData) {
  "use server";
  const platform = String(formData.get("platform") ?? "");
  if (!["facebook", "instagram", "x", "linkedin"].includes(platform)) return;
  if (!dbConfigured()) return;
  const db = getDb();
  await db.delete(socialAccounts).where(eq(socialAccounts.platform, platform));
  revalidatePath(`/${STUDIO_PATH}/settings`);
}


const SETUP: Record<string, { title: string; steps: string[]; envKeys: string[] }> = {
  meta: {
    title: "Facebook page + Instagram",
    steps: [
      "developers.facebook.com → My Apps → Create App (type: Business), as acevolumesofficial@gmail.com",
      "Add product: Facebook Login for Business",
      "Settings → Basic: copy App ID + App Secret",
      "Facebook Login → Settings → Valid OAuth Redirect URIs: add the URL below",
      "Paste the App ID + Secret into Vercel env (META_APP_ID, META_APP_SECRET) and redeploy",
      "Instagram @acevolumes must be a Business account linked to the brand Page",
    ],
    envKeys: ["META_APP_ID", "META_APP_SECRET"],
  },
  x: {
    title: "X (@acevolumes)",
    steps: [
      "developer.x.com → sign in as @acevolumes → Project & App → create",
      "User authentication settings → Read and write · OAuth 2.0 · Web App",
      "Callback URI: add the URL below · Website: https://acevolumes.vercel.app",
      "Copy Client ID + Client Secret",
      "Paste into Vercel env (X_CLIENT_ID, X_CLIENT_SECRET) and redeploy",
    ],
    envKeys: ["X_CLIENT_ID", "X_CLIENT_SECRET"],
  },
  linkedin: {
    title: "LinkedIn (personal feed of David)",
    steps: [
      "developer.linkedin.com → Create app (as David's account, company: AceVolumes)",
      "Products tab: add 'Share on LinkedIn' (self-serve) and 'Sign In with LinkedIn'",
      "Auth tab → Redirect URLs: add the URL below",
      "Copy Client ID + Client Secret",
      "Paste into Vercel env (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET) and redeploy",
    ],
    envKeys: ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
  },
};

const CALLBACKS = [
  { label: "Meta (Facebook + Instagram)", url: "https://acevolumes.vercel.app/api/social/callback/meta" },
  { label: "X", url: "https://acevolumes.vercel.app/api/social/callback/x" },
  { label: "LinkedIn", url: "https://acevolumes.vercel.app/api/social/callback/linkedin" },
];

const PLATFORMS = ["facebook", "instagram", "x", "linkedin"] as const;

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return <Settings p={params} />;
}

async function Settings({ p }: { p: Promise<{ gate: string }> }) {
  const { gate } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  // Runtime data: session + DB reads, never prerendered.
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
  const h = await headers();
  const connectResult = h.get("x-av-connect") ?? "";

  const accounts = dbConfigured() ? await getDb().select().from(socialAccounts) : [];
  const byPlatform = new Map(accounts.map((a) => [a.platform, a]));
  const configured = isConfigured();

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

      {connectResult ? (
        <p className="mt-4 rounded-xl border p-3 text-sm" style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}>
          Connect result: <span className="font-mono">{connectResult.slice(0, 160)}</span>
        </p>
      ) : null}

      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Buffer accounts (delivery)
      </h2>
      <p className="mt-3 max-w-2xl text-sm opacity-60">
        Approved posts are delivered to Buffer, which owns the platform
        connections and does the actual posting. Two accounts are supported
        (for example one brand account and one personal or client account).
      </p>
      <div className="mt-3 grid gap-3">
        {[
          { key: "1" as const, label: "Buffer account 1", env: "BUFFER_ACCESS_TOKEN (or _1)" },
          { key: "2" as const, label: "Buffer account 2", env: "BUFFER_ACCESS_TOKEN_2" },
        ].map((acc) => {
          const has = bufferAccounts().some((a) => a.key === acc.key);
          return (
            <div key={acc.key} className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{acc.label}</p>
                  <p className="mt-1 text-xs opacity-50 font-mono">env: {acc.env}</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                  style={{ color: has ? "#1a7a4d" : "var(--fg-muted)" }}
                >
                  {has ? "token detected" : "no token"}
                </span>
              </div>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm opacity-70">
                <li>In Buffer: connect the channels this account should own (its own UI, no developer consoles).</li>
                <li>At publish.buffer.com/settings/api generate an API token.</li>
                <li>Add it to Vercel as {acc.env.split(" (")[0]} and redeploy.</li>
              </ol>
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
                  Sync channels
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Social connections (Buffer or direct APIs)
      </h2>
      <div className="mt-3 grid gap-3">
        {PLATFORMS.map((platform) => {
          const row = byPlatform.get(platform);
          const status = row?.status ?? "disconnected";
          const key = platform === "facebook" || platform === "instagram" ? "meta" : platform;
          const ready = configured[key as keyof typeof configured];
          const m = row ? metaOf(row) : {};
          return (
            <div
              key={platform}
              className="rounded-2xl border p-4"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold capitalize">{platform}</p>
                  {row?.handle ? <p className="text-xs opacity-60">{row.handle}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: status === "connected" ? "#1a7a4d" : "var(--fg-muted)" }}
                  >
                    {status}
                  </span>
                  {status === "connected" ? (
                    <form action={disconnect}>
                      <input type="hidden" name="platform" value={platform} />
                      <button type="submit" className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100">
                        Disconnect
                      </button>
                    </form>
                  ) : ready ? (
                    <a
                      href={`/api/social/start?platform=${key}`}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                      style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                    >
                      Connect
                    </a>
                  ) : (
                    <span className="text-xs opacity-50">credentials pending</span>
                  )}
                </div>
              </div>
              {status === "connected" && platform === "instagram" && !m.igUserId ? (
                <p className="mt-2 text-xs" style={{ color: "#a33" }}>
                  No business Instagram linked to the Facebook Page yet: switch the IG account to Business and link it, then reconnect Facebook.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Setup: redirect URIs (paste these in each app console)
      </h2>
      <div className="mt-3 grid gap-2 text-sm">
        {CALLBACKS.map((c) => (
          <div key={c.url} className="rounded-xl border p-3" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
            <span className="opacity-60">{c.label}: </span>
            <span className="font-mono text-xs break-all">{c.url}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {Object.entries(SETUP).map(([key, s]) => {
          const ready = configured[key as keyof typeof configured];
          return (
            <div key={key} className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
              <p className="flex items-center justify-between text-sm font-semibold">
                {s.title}
                <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: ready ? "#1a7a4d" : "var(--fg-muted)" }}>
                  {ready ? "credentials detected" : "not configured"}
                </span>
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm opacity-70">
                {s.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-2 font-mono text-xs opacity-50">env: {s.envKeys.join(", ")}</p>
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
          <p className="mt-1 opacity-60">Daily 05:30 UTC. Fills the Content queue for the next 7 days.</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
          <p className="font-semibold">Scheduler (posting)</p>
          <p className="mt-1 opacity-60">Daily 06:00 UTC. Publishes approved posts that are due.</p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
          <p className="font-semibold">Database backups</p>
          <p className="mt-1 opacity-60">Sundays 03:00 UTC via GitHub Actions, encrypted. Runbook: docs/backups.md.</p>
        </div>
      </div>
    </Shell>
  );
}

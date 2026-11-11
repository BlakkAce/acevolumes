import { cookies } from "next/headers";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { SESSION_COOKIE } from "@/lib/studio/config";
import { LoginView } from "../login-view";

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

const CONNECT_STEPS: Record<string, string> = {
  facebook:
    "Needs the Meta developer app (acevolumesofficial@gmail.com) to clear App Review with pages_manage_posts. David's 30-minute step, then OAuth lands here.",
  instagram:
    "Switch @acevolumes to a Business account and link it to the brand Facebook page, then it rides the same Meta app as Facebook.",
  x: "OAuth on @acevolumes is ready to wire; free-tier posting quota applies.",
  linkedin:
    "Partner application pending (slowest review). Until it clears, LinkedIn posts stay in manual mode: approve here, then post from the LinkedIn app.",
};

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

  const accounts = dbConfigured()
    ? await getDb().select().from(socialAccounts)
    : [];
  const byPlatform = new Map(accounts.map((a) => [a.platform, a]));

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

      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Social connections
      </h2>
      <div className="mt-3 grid gap-3">
        {Object.entries(CONNECT_STEPS).map(([platform, step]) => {
          const row = byPlatform.get(platform);
          const status = row?.status ?? "disconnected";
          return (
            <div
              key={platform}
              className="rounded-2xl border p-4"
              style={{
                borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold capitalize">{platform}</p>
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider"
                  style={{
                    color: status === "connected" ? "#1a7a4d" : "var(--fg-muted)",
                  }}
                >
                  {status}
                </span>
              </div>
              <p className="mt-2 text-sm opacity-60">{step}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
        Automation
      </h2>
      <div className="mt-3 grid gap-3 text-sm">
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
        >
          <p className="font-semibold">Scribe (drafts)</p>
          <p className="mt-1 opacity-60">
            Daily 05:30 UTC. Fills the Content queue for the next 7 days from
            verified studio facts.
          </p>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
        >
          <p className="font-semibold">Scheduler (posting)</p>
          <p className="mt-1 opacity-60">
            Daily 06:00 UTC. Publishes approved posts that are due. Connected
            platforms post automatically; everything else stays queued.
          </p>
        </div>
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
        >
          <p className="font-semibold">Database backups</p>
          <p className="mt-1 opacity-60">
            Sundays 03:00 UTC via GitHub Actions, encrypted before upload.
            Restore runbook: docs/backups.md in the repo.
          </p>
        </div>
      </div>
    </Shell>
  );
}

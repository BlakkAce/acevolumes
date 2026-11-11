import { revalidatePath } from "next/cache";
import { asc, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { posts, socialAccounts } from "@/lib/db/schema";
import { draftWeek, PLATFORMS } from "@/lib/agents/scribe";
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

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
};

const STATUS_TINT: Record<string, string> = {
  draft: "var(--fg-muted)",
  approved: "#1a7a4d",
  rejected: "#a33",
  posted: "var(--accent)",
  failed: "#a33",
};

async function approve(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  const db = getDb();
  await db.update(posts).set({ status: "approved", error: null }).where(inArray(posts.id, [id]));
  revalidatePath(`/${STUDIO_PATH}/content`);
}

async function reject(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  const db = getDb();
  await db.update(posts).set({ status: "rejected" }).where(inArray(posts.id, [id]));
  revalidatePath(`/${STUDIO_PATH}/content`);
}

async function remove(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  const db = getDb();
  await db.delete(posts).where(inArray(posts.id, [id]));
  revalidatePath(`/${STUDIO_PATH}/content`);
}

async function saveEdit(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const content = String(formData.get("content") ?? "").trim();
  if (!Number.isSafeInteger(id) || content.length < 4) return;
  const db = getDb();
  await db.update(posts).set({ content }).where(inArray(posts.id, [id]));
  revalidatePath(`/${STUDIO_PATH}/content`);
}

async function generate() {
  "use server";
  if (!dbConfigured()) return;
  await draftWeek();
  revalidatePath(`/${STUDIO_PATH}/content`);
}

const btn =
  "rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ gate: string }>;
}) {
  return <Content p={params} />;
}

async function Content({ p }: { p: Promise<{ gate: string }> }) {
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

  if (!dbConfigured()) {
    return (
      <Shell>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Content</h1>
        <p className="mt-4 text-sm opacity-60">Database not configured.</p>
      </Shell>
    );
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .orderBy(asc(posts.scheduledFor))
    .limit(200);

  const accounts = await db.select().from(socialAccounts);
  const connected = new Set(
    accounts.filter((a) => a.status === "connected").map((a) => a.platform),
  );

  const byDay = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = r.scheduledFor.toISOString().slice(0, 10);
    const list = byDay.get(key) ?? [];
    list.push(r);
    byDay.set(key, list);
  }

  return (
    <Shell>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Content</h1>
        <div className="flex gap-2">
          <a href={`${base}/settings`} className={btn}>
            Connections
          </a>
          <form action={generate}>
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Draft this week
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {PLATFORMS.map((p) => (
          <span
            key={p}
            className="rounded-full border px-3 py-1 font-mono uppercase tracking-wider"
            style={{
              borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)",
              color: connected.has(p) ? "#1a7a4d" : "var(--fg-muted)",
            }}
          >
            {PLATFORM_LABEL[p]} {connected.has(p) ? "connected" : "not connected"}
          </span>
        ))}
      </div>

      <p className="mt-4 max-w-2xl text-sm opacity-60">
        Scribe drafts a week of posts from verified studio facts. Approve what
        you like; the scheduler posts approved items at their scheduled hour.
        Platforms that are not connected keep their posts queued here.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm opacity-60">
          No posts yet. Tap Draft this week to fill the queue.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {[...byDay.entries()].map(([day, list]) => (
            <section key={day}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
                {new Date(`${day}T12:00:00Z`).toUTCString().slice(0, 11)}
              </h2>
              <div className="mt-3 grid gap-3">
                {list.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono uppercase tracking-wider opacity-60">
                        {PLATFORM_LABEL[r.platform] ?? r.platform} ·{" "}
                        {r.scheduledFor.toISOString().slice(11, 16)} UTC
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono uppercase tracking-wider"
                        style={{ color: STATUS_TINT[r.status] ?? "var(--fg-muted)" }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm">{r.content}</p>
                    <div className="mt-2 text-xs opacity-50">
                      {r.mediaRef ? `media: ${r.mediaRef}` : "no media"}
                      {r.postedUrl ? ` · ${r.postedUrl}` : ""}
                      {r.error ? ` · ${r.error}` : ""}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.status !== "approved" && r.status !== "posted" ? (
                        <form action={approve}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                            style={{
                              background: "var(--accent)",
                              color: "var(--accent-fg)",
                            }}
                          >
                            Approve
                          </button>
                        </form>
                      ) : null}
                      {r.status !== "rejected" && r.status !== "posted" ? (
                        <form action={reject}>
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className={btn}>
                            Reject
                          </button>
                        </form>
                      ) : null}
                      {r.status !== "posted" ? (
                        <details className="contents">
                          <summary className={`${btn} inline-flex cursor-pointer items-center`}>
                            Edit
                          </summary>
                          <form action={saveEdit} className="mt-2 block">
                            <input type="hidden" name="id" value={r.id} />
                            <textarea
                              name="content"
                              defaultValue={r.content}
                              rows={5}
                              className="w-full rounded-xl border p-3 text-sm"
                              style={{
                                borderColor:
                                  "color-mix(in oklab, var(--fg) 18%, transparent)",
                              }}
                            />
                            <button
                              type="submit"
                              className={`${btn} mt-2`}
                            >
                              Save
                            </button>
                          </form>
                        </details>
                      ) : null}
                      {r.status !== "posted" ? (
                        <form action={remove}>
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className={btn}>
                            Delete
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}

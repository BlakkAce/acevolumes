import { cookies } from "next/headers";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb, dbConfigured } from "@/lib/db";
import { agentRuns } from "@/lib/db/schema";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";
import { verifySessionToken } from "@/lib/studio/session";
import { SESSION_COOKIE } from "@/lib/studio/config";
import { LoginView } from "../login-view";
import { GateStream } from "../gate-stream";

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

type Brief = {
  business: string;
  customer: string;
  dream: string;
  price: string;
  objection: string;
};

function offerDoc(b: Brief): string {
  const dream = b.dream || `the result ${b.customer} actually want, stated as a destination rather than a service`;
  const price = b.price ? `$${b.price.replace(/[^0-9.]/g, "")}` : "your current price";
  const anchor = b.price && Number(b.price.replace(/[^0-9.]/g, "")) > 0
    ? (Number(b.price.replace(/[^0-9.]/g, "")) * 3).toFixed(0)
    : "";
  return `# Offer system — ${b.business}

Prepared with the AceVolumes offer playbook (value equation, grand-slam
structure, objection map, hook bank). Fill every [bracket] before sending.

## 1. Dream outcome (sell the destination)
${b.customer} do not want "${b.business}'s service" — they want ${dream}.
Rewrite the headline of every page and pitch as the destination, with a
number or a deadline attached: [dream outcome + metric + timeframe].

## 2. Problem list (every step where the journey can break)
List 8–12 frictions between "interested" and "result". Starters:
1. Belief: "this will not work for a business like mine"
2. Belief: "I have been burned by ${b.business === "AceVolumes" ? "agencies" : "providers"} before"
3. Effort: "this will eat my time" — answer: what you remove from their plate
4. Time: "too slow" — answer: your first milestone and its date
5. Money: "too expensive" — answer: the cost of the problem, not the price of the fix
6. Trust: "who exactly does the work?" — answer: named humans
7. [their specific objection: ${b.objection || "the one they always raise"}]

## 3. Value stack (each problem reversed into a named deliverable)
1. [Problem] → **[Solution name]** — one line on how it feels to receive it
2. …aim for 5–8 items; name everything, named things feel like more.

## 4. Pricing (anchor, never discount)
- Anchor: the cost of the problem per year for ${b.customer}.
- Three tiers: DIY (guide/template) · DWY (done-with-you) · DFY (done-for-you at ${price}${anchor ? `, anchored against ~$${anchor} value stack` : ""}).
- Middle tier is the yes. Make its name the outcome.
- Guarantees only what you can always keep (reply times, milestone dates).
- Objection "${b.objection || "price"}" is answered by tier structure, not by a lower number.

## 5. Guarantees & risk reversal (pick 1–2 you can 100% keep)
- [e.g. "First preview within N days or you do not pay that milestone"]
- [e.g. "Replies within one working day, in your timezone"]

## 6. Hooks (test 2–3 per channel; specific beats clever)
1. [Outcome] ${b.customer}: ${dream} — without [the pain].
2. [Time] From first call to [first milestone] in [N] days.
3. [Effort] One hour of your time. We do the rest.
4. [Contrarian] You do not need [what everyone buys]. You need [what actually moves it].
5. [Callout] ${b.customer} who are tired of ${b.objection || "the usual excuses"}.

## 7. One-line pitch
"${b.business} helps ${b.customer} get ${dream} — ${b.objection ? `without ${b.objection.toLowerCase()}` : "without the usual friction"}."

## Next steps
1. Fill brackets. 2. Delete anything you cannot deliver 100%. 3. Put the
dream outcome in the first screen of every page and the first line of
every pitch. 4. Price against the problem, present three tiers, stop
discounting.
`;
}

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ gate: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <GateStream title="Offer">
      <Offer p={params} sp={searchParams} />
    </GateStream>
  );
}

async function Offer({
  p,
  sp,
}: {
  p: Promise<{ gate: string }>;
  sp: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { gate } = await p;
  if (!studioConfigured() || gate !== STUDIO_PATH) notFound();
  // Runtime data: session + form result, never prerendered.
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
  const get = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : "");
  const brief: Brief | null = get("business")
    ? {
        business: get("business").slice(0, 120),
        customer: get("customer").slice(0, 160),
        dream: get("dream").slice(0, 300),
        price: get("price").slice(0, 20),
        objection: get("objection").slice(0, 200),
      }
    : null;

  if (brief && dbConfigured()) {
    await getDb().insert(agentRuns).values({
      agent: "offer-strategist",
      summary: `Offer draft generated for ${brief.business}.`,
      status: "ok",
      meta: JSON.stringify(brief),
    });
  }

  const field =
    "w-full rounded-xl border p-3 text-sm";
  const borderColor = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };

  return (
    <Shell>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Offer Strategist</h1>
        <a
          href={`${base}/dashboard`}
          className="rounded-lg border px-3 py-1.5 text-sm opacity-75 hover:opacity-100"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        >
          Dashboard
        </a>
      </div>
      <p className="mt-3 max-w-2xl text-sm opacity-60">
        Turn a client brief into a structured offer document: dream outcome,
        problem list, value stack, three-tier pricing, guarantees, hooks.
        Billable as a discovery deliverable. Fill what you know; brackets
        mark what the client call must answer.
      </p>

      <form method="get" className="mt-6 grid gap-3 md:grid-cols-2">
        <input name="gate" type="hidden" value={STUDIO_PATH} />
        <input
          name="business"
          defaultValue={brief?.business}
          placeholder="Client business name"
          className={field}
          style={borderColor}
          required
        />
        <input
          name="customer"
          defaultValue={brief?.customer}
          placeholder="Who they sell to (e.g. first-time US homebuyers)"
          className={field}
          style={borderColor}
          required
        />
        <input
          name="dream"
          defaultValue={brief?.dream}
          placeholder="The dream outcome (optional — you can refine on the call)"
          className={field}
          style={borderColor}
        />
        <input
          name="price"
          defaultValue={brief?.price}
          placeholder="Current / intended price in USD (e.g. 3500)"
          className={field}
          style={borderColor}
        />
        <input
          name="objection"
          defaultValue={brief?.objection}
          placeholder="The objection that keeps coming up"
          className={`${field} md:col-span-2`}
          style={borderColor}
        />
        <button
          type="submit"
          className="rounded-lg px-4 py-2 text-sm font-semibold md:col-span-2 md:w-fit"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          Generate offer draft
        </button>
      </form>

      {brief ? (
        <section className="mt-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">
            Draft (markdown — paste anywhere)
          </h2>
          <pre
            className="mt-3 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-2xl border p-4 text-xs leading-relaxed"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
          >
            {offerDoc(brief)}
          </pre>
        </section>
      ) : null}
    </Shell>
  );
}

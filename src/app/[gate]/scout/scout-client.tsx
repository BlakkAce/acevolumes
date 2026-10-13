"use client";

import { useActionState, useState } from "react";
import {
  scanPasted,
  searchOpportunities,
  saveScoutedLead,
  type ScoutRow,
} from "./actions";

const input =
  "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
const border = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };
const label = "mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60";

function scoreTint(score: number): string {
  if (score >= 70) return "#e5484d";
  if (score >= 40) return "#f0c987";
  return "#8e8eff";
}

function ScoreBadge({ score }: { score: number }) {
  const tint = scoreTint(score);
  return (
    <span
      className="rounded-full px-2.5 py-0.5 font-mono text-[12px] font-semibold"
      style={{ background: `color-mix(in oklab, ${tint} 16%, transparent)`, color: tint }}
    >
      {score}/100
    </span>
  );
}

function ResultsTable({
  rows,
  onSaved,
}: {
  rows: ScoutRow[];
  onSaved: (key: string, existed: boolean) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [existedKeys, setExistedKeys] = useState<Set<string>>(new Set());
  const sorted = [...rows].sort((a, b) => b.scan.score - a.scan.score);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr
            className="border-b text-left font-mono text-[11px] uppercase tracking-wider opacity-60"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 10%, transparent)" }}
          >
            <th className="px-3 py-2.5 font-medium">Business</th>
            <th className="px-3 py-2.5 font-medium">Score</th>
            <th className="px-3 py-2.5 font-medium">Gaps</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Contact</th>
            <th className="px-3 py-2.5 text-right font-medium">Save</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.key}
              className="border-b align-top last:border-0"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 8%, transparent)" }}
            >
              <td className="px-3 py-3">
                <p className="font-medium">{r.name}</p>
                {r.website ? (
                  <a
                    href={r.website.startsWith("http") ? r.website : `https://${r.website}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[12px] opacity-60 underline-offset-2 hover:underline"
                  >
                    {r.website.replace(/^https?:\/\//, "").slice(0, 40)}
                  </a>
                ) : (
                  <span className="text-[12px] opacity-50">no website</span>
                )}
                {r.scan.builder !== "unknown" && r.scan.builder !== "—" ? (
                  <span className="ml-2 rounded-full border px-1.5 font-mono text-[10px] opacity-60"
                        style={border}>
                    {r.scan.builder}
                  </span>
                ) : null}
                {r.rating ? (
                  <p className="mt-0.5 text-[11.5px] opacity-50">
                    {r.rating}★ ({r.reviews ?? 0})
                  </p>
                ) : null}
              </td>
              <td className="px-3 py-3">
                <ScoreBadge score={r.scan.score} />
              </td>
              <td className="px-3 py-3 text-[12.5px] opacity-80">
                {r.scan.gaps.length ? r.scan.gaps.join("; ") : "healthy — weak lead"}
              </td>
              <td className="hidden px-3 py-3 text-[12.5px] opacity-70 md:table-cell">
                {r.phone ? (
                  <>
                    <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="hover:underline">
                      {r.phone}
                    </a>
                    {r.phone.replace(/\D/g, "").length > 5 ? (
                      <a
                        href={`https://wa.me/${r.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="ml-2 underline-offset-2 hover:underline"
                      >
                        WhatsApp
                      </a>
                    ) : null}
                  </>
                ) : (
                  "—"
                )}
                {r.address ? <p className="mt-0.5 text-[11px] opacity-50">{r.address}</p> : null}
              </td>
              <td className="px-3 py-3 text-right">
                {r.saved || existedKeys.has(r.key) ? (
                  <span className="text-[12px] opacity-60">
                    {existedKeys.has(r.key) ? "Already saved" : "Saved ✓"}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={busy === r.key}
                    onClick={async () => {
                      setBusy(r.key);
                      try {
                        const res = await saveScoutedLead({
                          name: r.name,
                          website: r.website,
                          phone: r.phone,
                          address: r.address,
                          rating: r.rating,
                          reviews: r.reviews,
                          score: r.scan.score,
                          gaps: r.scan.gaps,
                          service: r.service,
                          via: r.key.startsWith("g-") ? "google" : "paste",
                        });
                        if (res.ok) {
                          if (res.existed) setExistedKeys((s0) => new Set(s0).add(r.key));
                          onSaved(r.key, Boolean(res.existed));
                        }
                      } finally {
                        setBusy(null);
                      }
                    }}
                    className="rounded-lg px-3 py-1.5 text-[12px] font-semibold disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                  >
                    {busy === r.key ? "Saving…" : "Save as lead"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScoutClient({ placesOn }: { placesOn: boolean }) {
  const [mode, setMode] = useState<"paste" | "google">("paste");
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const [pasteRows, pasteAction, pastePending] = useActionState(
    scanPasted,
    null as ScoutRow[] | null,
  );
  const [googleRows, googleAction, googlePending] = useActionState(
    searchOpportunities,
    null as ScoutRow[] | null,
  );

  const markSaved = (key: string) =>
    setSavedKeys((s) => new Set(s).add(key));
  const decorate = (rows: ScoutRow[] | null) =>
    rows?.map((r) => (savedKeys.has(r.key) ? { ...r, saved: true } : r)) ?? null;

  const rows = mode === "paste" ? decorate(pasteRows) : decorate(googleRows);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>
            AceVolumes Studio
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Scout</h1>
        </div>
        <div className="flex rounded-lg border" style={border}>
          {(["paste", "google"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className="px-4 py-2 text-[13px] font-medium"
              style={
                mode === m
                  ? { background: "var(--accent)", color: "var(--accent-fg)", borderRadius: 8 }
                  : { opacity: 0.7 }
              }
            >
              {m === "paste" ? "Paste a list" : "Search Places"}
            </button>
          ))}
        </div>
      </div>

      {mode === "paste" ? (
        <form action={pasteAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="list" className={label}>
              Businesses — one per line: <code>Name | website.com</code> (URL optional)
            </label>
            <textarea
              id="list"
              name="list"
              rows={7}
              required
              placeholder={"Golden Restaurant House | \nCedar Restaurant Point | cedarpoint.com\nNova Restaurant Works"}
              className="w-full rounded-lg border bg-transparent px-3 py-2 font-mono text-[13px] outline-none"
              style={border}
            />
            <p className="mt-1 text-[11.5px] opacity-50">
              Up to 50 lines. Every website is probed live: mobile support, TLS,
              meta basics, speed, builder fingerprint → opportunity score.
            </p>
          </div>
          <div className="max-w-xs">
            <label htmlFor="p-service" className={label}>Service you&rsquo;d pitch (optional)</label>
            <input id="p-service" name="service" placeholder="Website Design" className={input} style={border} />
          </div>
          <button
            type="submit"
            disabled={pastePending}
            className="h-11 rounded-lg px-6 text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            {pastePending ? "Scanning websites…" : "Scan list"}
          </button>
        </form>
      ) : (
        <div className="mt-6">
          {!placesOn ? (
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 14%, transparent)" }}
            >
              <p className="text-lg font-medium">Connect Google Places to unlock search</p>
              <p className="mt-2 max-w-2xl text-sm opacity-60">
                Create a free Google Cloud project, enable <b>Places API (New)</b>,
                and add <code className="rounded px-1 font-mono text-[12px]">PLACES_API_KEY</code>{" "}
                to the environment variables in Vercel — 1,000 searches/month free,
                which covers roughly 20,000 businesses. Meanwhile the{" "}
                <b>Paste a list</b> tab works fully: paste businesses from anywhere
                and the gap-scan scores them.
              </p>
            </div>
          ) : (
            <form action={googleAction} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="niche" className={label}>Business niche *</label>
                <input id="niche" name="niche" required placeholder="Restaurants" className={input} style={border} />
              </div>
              <div>
                <label htmlFor="country" className={label}>Country</label>
                <input id="country" name="country" placeholder="Nigeria" className={input} style={border} />
              </div>
              <div>
                <label htmlFor="city" className={label}>City / area</label>
                <input id="city" name="city" placeholder="Lagos" className={input} style={border} />
              </div>
              <div>
                <label htmlFor="g-service" className={label}>Service you&rsquo;d pitch</label>
                <input id="g-service" name="service" placeholder="Website Design" className={input} style={border} />
              </div>
              <div>
                <label htmlFor="count" className={label}>Number of leads</label>
                <select id="count" name="count" defaultValue="20" className={input} style={border}>
                  {["10", "20", "40", "50"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="min_rating" className={label}>Minimum rating</label>
                <select id="min_rating" name="min_rating" defaultValue="0" className={input} style={border}>
                  <option value="0">Any</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.8">4.8+</option>
                </select>
              </div>
              <div>
                <label htmlFor="website_status" className={label}>Website status</label>
                <select id="website_status" name="website_status" defaultValue="any" className={input} style={border}>
                  <option value="any">Any</option>
                  <option value="no_website">No website</option>
                  <option value="social_only">Social only</option>
                  <option value="improvement">Improvement candidates</option>
                  <option value="website_found">Healthy website</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={googlePending}
                  className="h-10 rounded-lg px-6 text-sm font-semibold disabled:opacity-50"
                  style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                >
                  {googlePending ? "Searching…" : "Find opportunities"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {rows && rows.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-60">
            Results — {rows.length} business{rows.length === 1 ? "" : "es"}, best opportunities first
          </h2>
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
          >
            <ResultsTable rows={rows} onSaved={markSaved} />
          </div>
          <p className="mt-3 text-[12px] opacity-50">
            Saving creates a Lead in your CRM (source: scout) with the full scan
            as the first timeline note.
          </p>
        </section>
      ) : rows && rows.length === 0 ? (
        <p className="mt-8 text-sm opacity-60">No businesses matched — widen the filters.</p>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — AceVolumes",
  description:
    "Answer-first guides on websites that win clients: lender site checklists, conversion fixes, honest pricing. From the AceVolumes studio in Lagos.",
  alternates: { canonical: "/blog" },
};

function fmt(d: string): string {
  return new Date(`${d}T12:00:00Z`).toUTCString().slice(5, 16);
}

export default function BlogIndex() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
        Guides, answer-first
      </p>
      <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)]">
        Straight answers about websites that win clients.
      </h1>
      <p className="mt-4 max-w-2xl text-lg muted">
        Everything here opens with the direct answer, then the depth — written
        to be useful to you and quotable by the AI assistants your clients ask.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col rounded-2xl border p-6 transition-transform hover:-translate-y-1"
            style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-wider muted">
              {fmt(p.date)} · {p.answers}
            </p>
            <h2 className="mt-3 font-display text-xl leading-snug group-hover:text-[var(--gold)]">
              {p.title}
            </h2>
            <p className="mt-3 text-sm muted">{p.description.slice(0, 120)}…</p>
            <span className="mt-4 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              Read the guide →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

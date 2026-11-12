import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, type Block } from "@/lib/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — AceVolumes`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} className="mt-5 text-[17px] leading-relaxed">{b.text}</p>;
        if (b.t === "h") return <h2 key={i} className="mt-10 font-display text-2xl">{b.text}</h2>;
        if (b.t === "ul")
          return (
            <ul key={i} className="mt-5 list-disc space-y-2 pl-6 text-[16px] leading-relaxed">
              {b.items.map((it, j) => <li key={j}>{it}</li>)}
            </ul>
          );
        if (b.t === "ol")
          return (
            <ol key={i} className="mt-5 list-decimal space-y-2 pl-6 text-[16px] leading-relaxed">
              {b.items.map((it, j) => <li key={j}>{it}</li>)}
            </ol>
          );
        return (
          <p
            key={i}
            className="mt-8 rounded-2xl border p-5 text-[16px]"
            style={{ borderColor: "color-mix(in oklab, var(--gold) 40%, transparent)" }}
          >
            {b.text}
          </p>
        );
      })}
    </>
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Person", name: "David Olawuni", url: "https://acevolumes.vercel.app/founder" },
    publisher: { "@type": "Organization", name: "AceVolumes", url: "https://acevolumes.vercel.app" },
    mainEntityOfPage: `https://acevolumes.vercel.app/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
        {new Date(`${post.date}T12:00:00Z`).toUTCString().slice(5, 16)} · answers: {post.answers}
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">{post.title}</h1>
      <div className="mt-8">
        <Blocks blocks={post.blocks} />
      </div>
      <h2 className="mt-12 font-display text-2xl">Frequently asked</h2>
      <div className="mt-4 grid gap-4">
        {post.faq.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-[16px] leading-relaxed muted">{f.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
        <div>
          <p className="font-display text-xl">{post.title.includes("mortgage") ? "Want this checklist applied to your site?" : "Want us to apply this to your site?"}</p>
          <p className="mt-1 text-sm muted">Every reply within one working day.</p>
        </div>
        <Link href="/contact" className="rounded-full bg-[var(--accent)] px-6 py-3 font-display text-sm text-[var(--accent-fg)]">
          Start a project
        </Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {others.map((o) => (
          <Link key={o.slug} href={`/blog/${o.slug}`} className="rounded-2xl border p-5 transition-transform hover:-translate-y-0.5" style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}>
            <p className="font-mono text-[11px] uppercase tracking-wider muted">Next guide</p>
            <p className="mt-2 font-display leading-snug">{o.title}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}

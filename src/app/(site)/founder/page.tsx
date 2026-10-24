import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Amplitude, MARK as MARK_VALUES } from "@/components/amplitude";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { FOUNDER } from "@/lib/founder";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${FOUNDER.name} — ${FOUNDER.role}`,
  description: `Meet the founder of AceVolumes: a Lagos-based digital studio founder working with clients worldwide since 2016 — mortgage, real estate and e-commerce brands.`,
  alternates: { canonical: "./founder" },
};

export default function FounderPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: FOUNDER.name,
            jobTitle: FOUNDER.role,
            image: `${"https://acevolumes.com.ng"}${FOUNDER.photo}`,
            worksFor: { "@type": "Organization", name: "AceVolumes" },
            address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
            ...(FOUNDER.links.length
              ? { sameAs: FOUNDER.links.map((l) => l.href) }
              : {}),
          },
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Founder", path: "/founder" },
        ])}
      />

      <section className="border-b hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-12 md:px-8 md:pb-24 md:pt-20">
          <Reveal className="md:col-span-5">
            <div className="relative mx-auto max-w-sm">
              <Amplitude values={MARK_VALUES} className="absolute -bottom-6 left-0 w-3/4 opacity-70" barClassName="bg-[var(--gold)]" />
              <div
                className="relative overflow-hidden rounded-[4px] border hairline"
                style={{ boxShadow: "24px 24px 0 -12px color-mix(in oklab, var(--accent) 22%, transparent)" }}
              >
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.photoAlt}
                  width={640}
                  height={640}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--gold)]">
                The person behind the volume
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight">
                {FOUNDER.name}
              </h1>
              <p className="mt-3 text-lg muted">{FOUNDER.role} · {FOUNDER.location}</p>
              {FOUNDER.links.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {FOUNDER.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 rounded-[4px] border hairline px-4 py-2 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors hover:border-[var(--accent)]"
                    >
                      {l.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[820px] px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            I started AceVolumes in 2016 with a simple bet.
          </h2>
          <div className="mt-6 space-y-5 text-[17px] leading-relaxed muted">
            <p>
              That small businesses — lenders, agents, brands with something
              genuinely worth selling — were being badly served by agencies
              that talked in vague deliverables and disappeared after
              launch. I bet that one studio, obsessed with outcomes instead
              of invoices, could hold its own against any of them.
            </p>
            <p>
              Ten years on, that bet has carried the studio from Lagos to
              clients across the United States and beyond: mortgage bankers
              and brokers, a 220-strong realty and mortgage company, an
              Emmy-winning artist&apos;s store, wellness brands shipping
              across continents. Somewhere along the way we stopped just
              building websites and started building the machinery behind
              them — a custom loan operating system, CRM pipelines,
              integrations between mortgage platforms.
            </p>
            <p>
              I still personally touch every engagement. The promise I make
              to every client is the one this studio runs on: a plan, a
              fixed price, a delivery date — and work we are willing to put
              our name on.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            How I work
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              {
                t: "Listen first",
                d: "Every project starts with questions, not a quote. I cannot price what I do not understand yet.",
              },
              {
                t: "One number, one date",
                d: "Fixed price, fixed delivery date, stated before work begins. No surprise invoices, ever.",
              },
              {
                t: "Business outcomes",
                d: "Design is the tool; the goal is enquiry volume, funded pipelines, and stores that sell.",
              },
              {
                t: "Work worth naming",
                d: "If a project is not something we would put our name on in public, we do not take it.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-[4px] border hairline bg-[var(--bg-2)] p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--gold)]">
                  {c.t}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed muted">{c.d}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <div className="rounded-[4px] border hairline bg-[var(--bg-2)] p-8 md:p-10">
            <Amplitude values={MARK_VALUES} className="h-10 w-24" barClassName="bg-[var(--gold)]" />
            <p className="mt-4 font-display text-xl leading-snug md:text-2xl">
              &ldquo;We pride ourselves on delivering the very best — for the
              client in front of us, and the wider world they sell to.&rdquo;
            </p>
            <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] muted">
              {FOUNDER.name} · {FOUNDER.role}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14 text-center">
          <p className="text-[15px] muted">Want to work together?</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-[4px] px-7 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            Start a project
          </Link>
        </Reveal>
      </section>
    </>
  );
}

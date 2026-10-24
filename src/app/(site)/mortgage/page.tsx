import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { organizationLd, breadcrumbLd, SITE } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ImageReveal } from "@/components/image-reveal";
import { Reveal } from "@/components/reveal";
import { ARIVE_CLUSTERS, MORTGAGE_AREAS, MORTGAGE_RECORD } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE}/mortgage` },
  title: "Mortgage Technology",
  description:
    "Custom mortgage software, loan pipeline management, borrower application systems, mortgage CRM workflows, ARIVE integration pathways, MISMO export tooling and system audits from AceVolumes.",
};

export default function MortgagePage() {
  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Mortgage technology", path: "/mortgage" }])} />
      <PageHeader
        eyebrow="Mortgage Technology"
        title="Software for the business of lending."
        intro="We design and develop custom software for mortgage businesses: loan pipeline management, borrower application systems, CRM workflows and integrations between mortgage platforms. We also audit existing systems to find workflow gaps and integration failures."
      />

      {/* Delivered record. */}
      <section aria-label="Delivered mortgage work" className="border-b hairline">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8">
          <Reveal>
            <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
              Delivered and audited by this studio
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {MORTGAGE_RECORD.map((r, i) => (
              <Reveal as="li" key={r} delay={i * 0.06} className="border-l-2 border-[var(--gold)] pl-5">
                <p className="max-w-[26ch] text-[15.5px] font-medium leading-snug">{r}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Seven areas, editorial rows. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.4rem)]">
            What we build for mortgage teams.
          </h2>
        </Reveal>
        <div className="mt-14 border-t hairline">
          {MORTGAGE_AREAS.map((a, i) => (
            <Reveal key={a.title} className="border-b hairline" delay={0.03}>
              <div className="grid gap-4 py-9 md:grid-cols-12 md:gap-10">
                <div className="flex items-baseline gap-4 md:col-span-5">
                  <span className="font-mono text-[12px] text-[var(--gold)]">0{i + 1}</span>
                  <h3 className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)]">{a.title}</h3>
                </div>
                <p className="max-w-[58ch] text-[15.5px] leading-relaxed muted md:col-span-7">
                  {a.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ARIVE implementation consulting, grouped workstreams. */}
      <section className="border-y hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)]">
                  ARIVE implementation consulting.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="mt-5 max-w-[36ch] text-[16px] leading-relaxed muted">
                For teams already on ARIVE, we configure the platform and wire
                it into your CRM, communications and reporting, workstream by
                workstream.
              </Reveal>
              <Reveal delay={0.14} className="mt-10 hidden md:block">
                <ImageReveal className="relative aspect-[4/3] overflow-hidden rounded-[4px] border hairline">
                  <div className="relative h-full w-full">
                    <Image
                      src="/img/mortgage-tech.jpg"
                      alt="A loan pipeline dashboard in plum and gold"
                      fill
                      sizes="30vw"
                      className="object-cover"
                    />
                  </div>
                </ImageReveal>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="space-y-10">
              {ARIVE_CLUSTERS.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.05}>
                  <h3 className="font-display text-[1.25rem]">{c.name}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {c.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border hairline px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.07em]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Honest scoping + CTA. */}
      <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-6">
          <Reveal>
            <h2 className="max-w-[18ch] font-display text-[clamp(1.9rem,4vw,3rem)]">
              What we claim is what we can show you.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-5 max-w-[54ch] text-[16px] leading-relaxed muted">
            In the first call we will walk you through delivered systems, export
            tooling and audit reports, and tell you plainly which parts of your
            environment are proven and which are new builds. That is the same
            honesty we want from our own vendors.
          </Reveal>
        </div>
        <div className="md:col-span-5 md:col-start-8 md:self-center">
          <Reveal delay={0.12}>
            <Link
              href="/contact?service=mortgage"
              className="glow inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-opacity duration-300 hover:opacity-90"
            >
              Talk to the mortgage desk
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

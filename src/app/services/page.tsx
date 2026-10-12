import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ServicesExplorer } from "@/components/services-explorer";
import { Amplitude, GROWTH_CURVE } from "@/components/amplitude";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Nine service categories from AceVolumes: AI video, websites, branding, digital and email marketing, custom development, AI automation, business systems, content and technical consulting, plus a dedicated mortgage technology vertical.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Nine disciplines, one studio."
        intro="Everything below is offered today. Pick a category to see what is inside it, and one number comes back when you enquire: a fixed price with a delivery date."
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <ServicesExplorer />
      </div>

      {/* Mortgage tech gets its own door. */}
      <section className="border-y hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-5">
            <Reveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]">
                Dedicated vertical
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)]">
                Mortgage technology.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-5 max-w-[46ch] text-[16px] leading-relaxed muted">
              Loan pipeline systems, borrower applications, mortgage CRM
              workflows, ARIVE integration pathways and MISMO export tooling,
              built and audited by this studio.
            </Reveal>
            <Reveal delay={0.14} className="mt-8">
              <Link
                href="/mortgage"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-opacity duration-300 hover:opacity-90"
              >
                Explore the mortgage vertical
              </Link>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-center">
            <Reveal>
              <Amplitude
                values={GROWTH_CURVE}
                className="h-20 w-full opacity-30"
                barClassName="bg-[var(--gold)]"
                label=""
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.1rem)]">
              Pricing, honestly.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-5 max-w-[44ch] text-[16px] leading-relaxed muted">
            A logo for one clinic costs less than an identity for a lender with
            thirty loan officers, and a landing page costs less than a SaaS
            build. We tell you which one you are before you commit to anything.
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal className="max-w-[50ch] text-[16px] leading-relaxed muted">
            We do not bill by the hour and we do not ask for the full amount up
            front. Projects are split into a deposit to start and a balance on
            delivery. Monthly retainers are invoiced on the first working day.
          </Reveal>
        </div>
      </section>
    </>
  );
}

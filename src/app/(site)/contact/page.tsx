import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Amplitude, MARK } from "@/components/amplitude";
import { JsonLd } from "@/components/json-ld";
import { faqLd, organizationLd, breadcrumbLd, SITE } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE}/contact` },
  title: "Contact",
  description:
    "Start a project with AceVolumes. Tell us what you sell and who you are trying to reach, and we will reply with a plan, a price and a timeline.",
};

const FAQS = [
  {
    q: "How fast do you reply?",
    a: "Within one working day, usually with questions rather than a quote. We cannot price what we do not understand yet.",
  },
  {
    q: "Do you work with US clients?",
    a: "We work across borders and timezones — the United States remains our deepest market, with clients in other countries too. We keep daily call slots that line up with US mornings and European afternoons, and reports land in your timezone, not ours.",
  },
  {
    q: "Can you take over a website someone else built?",
    a: "Often. We will audit it first and tell you honestly whether fixing it costs less than replacing it.",
  },
  {
    q: "What do you need from us to start?",
    a: "Your logo files if you have them, any product photos, and one hour of your time in the first week.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <JsonLd data={organizationLd()} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you need."
        intro="A paragraph is enough to start. We will reply with a plan, a fixed price and a timeline, not a sales call invitation."
      />

      <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-5 py-20 md:grid-cols-12 md:gap-16 md:px-8 md:py-28">
        <div className="md:col-span-7">
          <EnquiryForm />
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <Reveal>
            <Amplitude
              values={MARK}
              className="h-6 w-10"
              barClassName="bg-[var(--accent)]"
              label=""
            />
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] muted">
              Direct
            </h2>
            <a
              href="mailto:acevolumesofficial@gmail.com"
              className="mt-3 block font-display text-[clamp(1.1rem,2vw,1.4rem)] text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-[6px] transition-colors hover:decoration-[var(--accent)]"
            >
              acevolumesofficial@gmail.com
            </a>
          </Reveal>

          <Reveal delay={0.12} className="mt-10">
            <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] muted">
              Studio hours
            </h2>
            <p className="mt-3 max-w-[30ch] text-[15.5px] leading-relaxed muted">
              Monday to Friday, 9am to 6pm West Africa Time, with daily call
              slots that suit US mornings.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-10">
            <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] muted">
              Where we are
            </h2>
            <address className="mt-3 text-[15.5px] not-italic leading-relaxed muted">
              Lagos, Nigeria
            </address>
          </Reveal>
        </aside>
      </div>

      <section className="border-t hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-4">
            <Reveal>
              <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">
                Before you write
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <dl>
              {FAQS.map((f, i) => (
                <Reveal
                  key={f.q}
                  delay={i * 0.05}
                  className="border-b hairline py-6 first:border-t first:pt-0"
                >
                  <dt className="font-display text-[1.15rem]">{f.q}</dt>
                  <dd className="mt-2 max-w-[56ch] text-[15.5px] leading-relaxed muted">{f.a}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

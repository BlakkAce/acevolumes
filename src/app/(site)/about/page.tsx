import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { ImageReveal } from "@/components/image-reveal";
import { Reveal } from "@/components/reveal";
import { STEPS, VALUES } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE}/about` },
  title: "Studio",
  description:
    "AceVolumes is a Lagos digital studio working since 2016 on brand identity, websites and social media for Nigerian businesses.",
};

const TIMELINE = [
  { year: "2016", note: "The studio starts with brand identity work for small businesses in Lagos." },
  { year: "2019", note: "Website design becomes the second service, built in-house rather than outsourced." },
  { year: "2022", note: "Social media management and paid advertising join the offer." },
  { year: "2026", note: "Mostly US clients across mortgage, real estate and e-commerce. Still small on purpose." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title="Small studio, working since 2016."
        intro="AceVolumes is a Lagos digital studio with clients across the United States and a growing list of other countries. We work with teams that have something worth selling and no patience for agencies that overpromise."
      />

      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-6">
            <ImageReveal className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border hairline bg-[var(--bg-2)]">
              <div className="relative h-full w-full">
                <Image
                  src="/img/team-studio.jpg"
                  alt="The AceVolumes team working in the Lagos studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <Reveal>
              <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">
                Why we started
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4">
              {[
                "We started in 2016 doing brand work for Lagos businesses that had one of two options back then: a cousin who knows Photoshop, or an agency charging corporate rates for a template.",
                "Over time our clients moved overseas, and the work moved with them: mortgage and real estate teams first, then the e-commerce brands that sell to the same households. Today they are anchored in the United States and reach into other countries.",
                "We are deliberately small. Every project gets the people you met in the first call, and we cap how many we run at once so nothing gets rushed.",
              ].map((para) => (
                <Reveal key={para} delay={0.06}>
                  <p className="max-w-[54ch] text-[16px] leading-relaxed muted">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values, as an asymmetric three-block editorial layout, not three equal cards. */}
      <section className="border-y hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-y-14 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
          {VALUES.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 0.07}
              className={
                i === 0 ? "md:col-span-5" : i === 1 ? "md:col-span-4 md:col-start-7" : "md:col-span-5 md:col-start-3"
              }
            >
              <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)]">{v.title}</h2>
              <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed muted">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline. Real dates only. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)]">
            Ten years, briefly.
          </h2>
        </Reveal>
        <ol className="mt-14 grid gap-y-10 md:grid-cols-4 md:gap-x-8">
          {TIMELINE.map((t, i) => (
            <Reveal as="li" key={t.year} delay={i * 0.07}>
              <p className="font-display text-[2.2rem] text-[var(--accent)]">{t.year}</p>
              <p className="mt-3 max-w-[34ch] text-[15.5px] leading-relaxed muted">{t.note}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section
        id="process"
        className="scroll-mt-28 border-t hairline bg-[var(--bg-2)]"
        aria-labelledby="about-process"
      >
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2 id="about-process" className="font-display text-[clamp(1.9rem,4vw,3rem)]">
                  How a project runs.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="mt-5 max-w-[34ch] text-[16px] leading-relaxed muted">
                The same five stages for a logo and for a full campaign. The
                length changes, the order does not.
              </Reveal>
            </div>
          </div>
          <ol className="md:col-span-7 md:col-start-6">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 0.05} className="border-b hairline first:border-t">
                <div className="grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8">
                  <h3 className="font-display text-[1.35rem]">{s.name}</h3>
                  <p className="max-w-[54ch] text-[15.5px] leading-relaxed muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ImageReveal } from "@/components/image-reveal";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "./work" },
  title: "Work",
  description:
    "Selected brand identity, website and social media projects from the AceVolumes studio in Lagos.",
};

const SPANS = [
  "md:col-span-7",
  "md:col-span-5 md:mt-24",
  "md:col-span-5",
  "md:col-span-7 md:mt-16",
];

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Selected projects."
        intro="A short list rather than a gallery of everything we have ever touched. Most of these clients are based in the United States, others sit in other countries, and several engagements are still under confidentiality."
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-16 md:grid-cols-12 md:gap-y-28">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} className={SPANS[i] ?? "md:col-span-6"} y={30} delay={i * 0.05}>
              <article>
                <Link href={`/work/${p.slug}`} className="group block" aria-label={`Read the ${p.client} case study`}>
                <ImageReveal
                  className={`relative w-full overflow-hidden rounded-[4px] border hairline bg-[var(--bg-2)] ${
                    i === 2 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={p.image}
                      alt={`${p.discipline} project by AceVolumes`}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority={i === 0}
                      className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                  </div>
                </ImageReveal>
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] transition-colors group-hover:text-[var(--gold)]">
                      {p.client}
                    </h2>
                    <p className="font-mono text-[12px] uppercase tracking-[0.1em] muted">
                      {p.discipline}
                    </p>
                  </div>
                  <p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed muted">
                    {p.summary}
                  </p>
                </Link>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]"
                  >
                    Visit live site
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="border-t hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)]">
                Some engagements stay private.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.08} className="max-w-[50ch] text-[16px] leading-relaxed muted">
              The write-ups above are the ones we can publish. We keep more under
              confidentiality agreements, including detailed numbers. Ask in your
              enquiry and we will share the ones relevant to your industry.
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

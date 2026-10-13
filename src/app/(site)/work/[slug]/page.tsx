import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ImageReveal } from "@/components/image-reveal";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/content";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Metadata {
  void params;
  return {
    title: "Case study",
    description: "A delivered AceVolumes project: the challenge, the work and the outcome.",
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <>
      <header className="border-b hairline bg-[var(--bg-2)]">
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.1em] muted transition-colors hover:text-[var(--gold)]"
            >
              <ArrowLeft size={14} />
              All work
            </Link>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]">
              {project.discipline}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-5">
            <h1 className="max-w-[20ch] font-display text-[clamp(2.4rem,6vw,4.5rem)]">
              {project.client}
            </h1>
          </Reveal>
          <Reveal delay={0.16} className="mt-7 max-w-[58ch] text-[17px] leading-relaxed muted">
            {project.summary}
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-2.5">
            {project.services.map((s) => (
              <span
                key={s}
                className="rounded-full border hairline px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.07em]"
              >
                {s}
              </span>
            ))}
          </Reveal>
          {project.live && (
            <Reveal delay={0.24} className="mt-8">
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]"
              >
                Visit live site
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
          )}
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1400px] px-5 pt-16 md:px-8 md:pt-20">
        <ImageReveal className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px] border hairline">
          <div className="relative h-full w-full">
            <Image
              src={project.image}
              alt={`${project.client} case study visual`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </ImageReveal>
      </section>

      <section className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <Reveal>
              <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">The challenge.</h2>
            </Reveal>
          </div>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Reveal className="max-w-[58ch] text-[17px] leading-relaxed">
            {project.challenge}
          </Reveal>
        </div>
      </section>

      <section className="border-y hairline bg-[var(--bg-2)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">The work.</h2>
              </Reveal>
            </div>
          </div>
          <ol className="md:col-span-7 md:col-start-6">
            {project.approach.map((a, i) => (
              <Reveal as="li" key={a} delay={i * 0.05} className="border-b hairline first:border-t">
                <div className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-[12px] text-[var(--gold)]">0{i + 1}</span>
                  <p className="max-w-[54ch] text-[16px] leading-relaxed">{a}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">The outcome.</h2>
          </Reveal>
        </div>
        <ul className="space-y-7 md:col-span-7 md:col-start-6">
          {project.outcome.map((o, i) => (
            <Reveal as="li" key={o} delay={i * 0.06} className="border-l-2 border-[var(--gold)] pl-6">
              <p className="max-w-[50ch] font-display text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.25]">
                {o}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t hairline bg-[var(--bg-2)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] muted">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-3 inline-flex items-center gap-4 font-display text-[clamp(1.5rem,3vw,2.2rem)] transition-colors hover:text-[var(--gold)]"
            >
              {next.client}
              <ArrowRight size={24} className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/contact"
              className="glow inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-opacity duration-300 hover:opacity-90"
            >
              Start something like this
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

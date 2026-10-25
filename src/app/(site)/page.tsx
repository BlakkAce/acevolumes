import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { organizationLd, websiteLd } from "@/lib/seo";
import { CapabilityMarquee } from "@/components/capability-marquee";
import { CountUp } from "@/components/count-up";
import { Hero } from "@/components/hero";
import { NichePan } from "@/components/niche-pan";
import { KineticHeading } from "@/components/kinetic-heading";
import { Reveal } from "@/components/reveal";
import { WorkStack } from "@/components/work-stack";
import { CATALOG, CLIENT_PROOF, MARQUEE_ITEMS, PROOF, STEPS, VALUES } from "@/lib/content";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={websiteLd()} />
      <Hero />

      {/* Credentials band. Real numbers only, counted up on arrival. */}
      <section aria-label="Studio record" className="border-b hairline">
        <div className="mx-auto grid w-full max-w-[1400px] gap-y-10 px-5 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-12">
          {PROOF.map((p, i) => (
            <Reveal
              key={p.label}
              delay={i * 0.07}
              className={
                i === 0
                  ? "lg:col-span-4"
                  : i === 1
                    ? "lg:col-span-2"
                    : i === 2
                      ? "lg:col-span-3"
                      : "lg:col-span-3 lg:pl-10"
              }
            >
              <p className="font-display text-[clamp(2.4rem,5vw,3.75rem)] text-[var(--gold)] text-glow">
                {p.kind === "static" ? (
                  p.display
                ) : (
                  <CountUp value={p.to} prefix={p.prefix ?? ""} suffix={p.suffix ?? ""} />
                )}
              </p>
              <p className="mt-2 max-w-[22ch] text-[14.5px] leading-snug muted">{p.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Niches as a pinned horizontal sweep. */}
      <NichePan />

      {/* The catalogue, as an index. */}
      <section id="services" className="mx-auto w-full max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        <KineticHeading
          as="h2"
          text="Nine disciplines, one studio."
          className="max-w-[19ch] font-display text-[clamp(2.2rem,5vw,3.75rem)]"
        />
        <Reveal delay={0.08} className="mt-6 max-w-[52ch] text-[17px] leading-relaxed muted">
          Everything below is offered today. Open a category for the full
          list, then ask for one number: a fixed price with a delivery date.
        </Reveal>

        <div className="mt-16 grid gap-x-14 border-t hairline md:grid-cols-2">
          {CATALOG.map((c, i) => (
            <Reveal key={c.id} className="group border-b hairline" delay={(i % 2) * 0.05}>
              <Link
                href={`/services#${c.id}`}
                className="grid gap-2 py-7 sm:grid-cols-[3rem_1fr] sm:gap-5"
              >
                <span className="font-mono text-[12px] text-[var(--gold)]">0{i + 1}</span>
                <span>
                  <span className="relative block font-display text-[clamp(1.25rem,2.2vw,1.7rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                    {c.title}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                    />
                  </span>
                  <span className="mt-1.5 block max-w-[46ch] text-[14.5px] leading-relaxed muted">
                    {c.line}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CapabilityMarquee items={MARQUEE_ITEMS} />

      {/* Selected work as a pinned stack. */}
      <section id="work" className="relative">
        <div className="mx-auto w-full max-w-[1400px] px-5 pt-24 md:px-8 md:pt-32">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <KineticHeading
              as="h2"
              text="Work we are willing to put our name on."
              className="max-w-[16ch] font-display text-[clamp(2.2rem,5vw,3.75rem)]"
            />
            <Link
              href="/work"
              className="font-mono text-[12.5px] uppercase tracking-[0.09em] text-[var(--gold)] underline decoration-[var(--gold)]/40 underline-offset-[6px] transition-colors hover:decoration-[var(--gold)]"
            >
              All projects
            </Link>
          </Reveal>
        </div>
        <WorkStack />
      </section>

      {/* Process: sticky label on the left, verb-named steps on the right. */}
      <section
        id="process"
        className="border-t hairline bg-[var(--bg-2)]"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-24 md:grid-cols-12 md:px-8 md:py-32">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2
                  id="process-heading"
                  className="font-display text-[clamp(2rem,4.4vw,3.25rem)]"
                >
                  How a project runs.
                </h2>
              </Reveal>
              <Reveal delay={0.08} className="mt-5 max-w-[34ch] text-[16px] leading-relaxed muted">
                Five stages, in order, with a price agreed before the first one starts.
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

      {/* Why us, then client words, in one asymmetric editorial block. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)]">
                What clients keep coming back for.
              </h2>
            </Reveal>
            <ul className="mt-10 space-y-8">
              {VALUES.map((v, i) => (
                <Reveal as="li" key={v.title} delay={i * 0.06}>
                  <h3 className="font-display text-[1.2rem]">{v.title}</h3>
                  <p className="mt-2 max-w-[46ch] text-[15.5px] leading-relaxed muted">{v.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="space-y-12">
              <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] muted">
                Numbers our clients publish about themselves
              </p>
              {CLIENT_PROOF.map((t, i) => (
                <Reveal
                  key={t.client}
                  delay={i * 0.08}
                  className={i === 1 ? "md:pl-12" : undefined}
                >
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block border-l-2 border-[var(--gold)] pl-6"
                  >
                    <p className="font-display text-[clamp(2rem,4vw,3rem)] leading-none text-[var(--gold)] text-glow">
                      {t.value}
                    </p>
                    <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed">{t.label}</p>
                    <p className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.1em] muted">
                      {t.client} ↗
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA. */}
      <section className="border-t hairline bg-[var(--bg-2)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-24 md:px-8 md:py-32 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <KineticHeading
              as="h2"
              text="Let's turn your volume up."
              className="max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.5rem)]"
            />
          </Reveal>
          <Reveal delay={0.1} className="max-w-[42ch] lg:pb-3">
            <p className="text-[16px] leading-relaxed muted">
              Send a paragraph about your business. Within one working day you
              get a real plan back: one fixed price, one delivery date. No
              obligation until you say go.
            </p>
            <Link
              href="/contact"
              className="glow mt-7 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-colors duration-300 hover:opacity-90"
            >
              Start a project
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

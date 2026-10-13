"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { ImageReveal } from "@/components/image-reveal";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    tag: "Primary niche",
    title: "Mortgage and real estate",
    body: "Lenders, brokers, agents and teams. We know how a borrower actually chooses a loan officer online, because we have built the funnel and watched the numbers.",
    points: ["Loan officer personal brands", "Team and brokerage websites", "Rate-update social systems", "Lead capture that reports back"],
    image: "/img/work-realestate.jpg",
    alt: "A modern home at dusk with gold light in the windows",
    href: null,
  },
  {
    tag: "Dedicated vertical",
    title: "Mortgage technology",
    body: "Custom loan pipeline systems, borrower applications, CRM workflows, ARIVE integration pathways and MISMO export tooling. Built and audited by this studio.",
    points: ["Custom mortgage software", "Loan pipeline & CRM", "ARIVE integrations", "System audits"],
    image: "/img/mortgage-tech.jpg",
    alt: "A loan pipeline dashboard rendered in plum and gold",
    href: "/mortgage",
  },
  {
    tag: "Second home",
    title: "E-commerce brands",
    body: "Storefronts that load fast on any connection and look worth the price tag. We design the store, then run the social and ads that feed it.",
    points: ["Conversion-first storefronts", "Product content systems", "Launch and retention campaigns"],
    image: "/img/work-ecommerce.jpg",
    alt: "Premium e-commerce packaging in plum and gold",
    href: null,
  },
];

/**
 * The niches, as a pinned horizontal pan: vertical scroll slides the track.
 * Motion motive: storytelling, the three audiences read as one continuous
 * sweep instead of three stacked boxes.
 */
export function NichePan() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;

    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={wrap}
      className="relative overflow-hidden bg-[var(--bg-2)]"
      aria-label="Who we work with"
    >
      <div
        ref={track}
        className={
          reduce
            ? "mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-20 md:px-8"
            : "flex min-h-[100dvh] items-stretch gap-6 py-16 md:gap-10 md:px-[max(2rem,calc((100vw-1400px)/2))]"
        }
      >
        <div
          className={
            reduce
              ? "flex max-w-[34rem] flex-col justify-center"
              : "flex w-[82vw] shrink-0 flex-col justify-center md:w-[34rem]"
          }
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]">
            Who we work with
          </p>
          <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.2rem,5vw,3.75rem)]">
            Two niches we know cold.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed muted">
            We serve plenty of industries, but these are the rooms where we
            already know the players.
          </p>
        </div>

        {PANELS.map((p) => (
          <article
            key={p.title}
            className={
              reduce
                ? "grid overflow-hidden rounded-[4px] border hairline bg-[var(--bg)] md:grid-cols-2"
                : "grid w-[86vw] shrink-0 overflow-hidden rounded-[4px] border hairline bg-[var(--bg)] md:w-[62rem] md:grid-cols-2"
            }
          >
            {p.image ? (
              <ImageReveal className="relative min-h-[240px] md:min-h-full">
                <div className="relative h-full w-full">
                  <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) 86vw, 31rem" className="object-cover" />
                </div>
              </ImageReveal>
            ) : (
              <div className="relative flex min-h-[240px] items-center justify-center bg-[var(--accent)] md:min-h-full">
                <p className="px-8 text-center font-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--accent-fg)]">
                  Your industry next.
                </p>
              </div>
            )}
            <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
              <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-[var(--gold)]">
                {p.tag}
              </p>
              {p.href ? (
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">
                  <a href={p.href} className="transition-colors hover:text-[var(--gold)]">
                    {p.title}
                  </a>
                </h3>
              ) : (
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">{p.title}</h3>
              )}
              <p className="max-w-[46ch] text-[15.5px] leading-relaxed muted">{p.body}</p>
              <ul className="mt-2 flex flex-wrap gap-2.5">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="rounded-full border hairline px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.07em]"
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <div className={reduce ? "flex items-center" : "flex w-[70vw] shrink-0 items-center md:w-[30rem]"}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 font-display text-[clamp(1.4rem,2.6vw,2rem)] text-[var(--gold)]"
          >
            Start yours
            <ArrowRight size={26} className="transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

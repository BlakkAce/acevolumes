"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ImageReveal } from "@/components/image-reveal";
import { PROJECTS } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected work as a sticky stack. Each card pins at the top of the viewport and
 * recedes as the next one arrives, so three case studies occupy one screen of
 * scroll instead of three.
 * Motion motive: storytelling, the sequence reads as a stack of work, not a list.
 */
export function WorkStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;

    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");

      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        // The card surface must stay opaque while pinned, otherwise the older
        // cards beneath show through it; only the inner content recedes.
        gsap.to(card, {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        gsap.to(card.querySelector(".stack-card-inner"), {
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      {PROJECTS.map((p, i) => (
        <section
          key={p.slug}
          className="stack-card sticky top-0 flex min-h-[100dvh] items-center bg-[var(--bg)] py-10"
          style={{ zIndex: i + 1 }}
        >
          <div className="stack-card-inner mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
            <ImageReveal className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border hairline bg-[var(--bg-2)]">
              <div className="relative h-full w-full">
                <Image
                  src={p.image}
                  alt={`${p.discipline} project by AceVolumes`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            </ImageReveal>

            <div className="max-w-[52ch]">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--accent)]">
                {p.discipline}
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.9rem)]">
                {p.client}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed muted">{p.summary}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  href={`/work/${p.slug}`}
                  className="group inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]"
                >
                  Read the case study
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] muted transition-colors hover:text-[var(--gold)]"
                  >
                    Visit live site
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                )}
              </div>
              <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] muted">
                {p.year}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

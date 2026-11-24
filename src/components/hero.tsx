"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Constellation } from "@/components/constellation";
import { KineticHeading } from "@/components/kinetic-heading";
import { MagneticLink } from "@/components/magnetic-link";
import { Swoosh } from "@/components/swoosh";
import { useMediaQuery } from "@/components/use-media-query";
import { ClientStrip } from "@/components/client-marquee";
import { SCROLL_SPRING } from "@/lib/motion-tokens";
import { FOUNDER } from "@/lib/founder";

const Hero3D = dynamic(() => import("@/components/hero-3d").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => null,
});

/**
 * Cinematic entrance: eyebrow, word-masked headline, drawn swoosh, sub, CTAs,
 * then the framed studio visual. The frame tilts with the pointer, the field
 * behind is a real 3D network on capable devices (2D constellation elsewhere),
 * and the whole composition settles away as you scroll into the record band.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const fine = useMediaQuery("(pointer: fine)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const field3d = fine && wide && !reduce;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll exit: content drifts up and recedes as the next section arrives.
  const copyY = useSpring(useTransform(scrollYProgress, [0.12, 0.55], [0, -70]), SCROLL_SPRING);
  const copyOpacity = useTransform(scrollYProgress, [0.12, 0.5], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col overflow-hidden border-b hairline lg:min-h-[calc(100dvh-72px)]">
      {field3d ? <Hero3D target={sectionRef} /> : <Constellation />}

      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 content-center gap-y-10 px-5 pb-8 pt-12 md:px-8 md:pb-10 md:pt-14 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <motion.div
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
          className="grid grid-cols-1 gap-y-10 lg:col-span-12 lg:grid-cols-12 lg:items-center lg:gap-x-10"
        >
          <div className="lg:col-span-8">
            <p
              className="anim-enter font-mono text-[12px] uppercase tracking-[0.12em] muted"
              style={{ animationDelay: "80ms" }}
            >
              The studio you email back directly — since 2016
            </p>

            <KineticHeading
              as="h1"
              text="Websites built to win clients, not compliments."
              className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)]"
            />

            <Swoosh className="mt-2 h-10 w-[min(420px,80%)]" />

            <p
              className="anim-enter mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--gold)]"
              style={{ animationDelay: "480ms" }}
            >
              Digital systems that make results easier.
            </p>

            <p
              className="anim-enter mt-5 max-w-[52ch] text-[17px] leading-relaxed muted md:text-[18px]"
              style={{ animationDelay: "560ms" }}
            >
              Conversion-first websites for mortgage teams and small
              businesses — 100+ shipped since 2016. You see a real preview of
              your site in 10 days or less, then we iterate until it closes.
            </p>

            <p
              className="anim-enter mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--gold)]"
              style={{ animationDelay: "640ms" }}
            >
              First preview ≤ 10 days · Fixed price up front · Direct line to the founder
            </p>

            <div
              className="anim-enter mt-8 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "760ms" }}
            >
              <a
                href="mailto:acevolumesofficial@gmail.com?subject=Project%20inquiry"
                className="group inline-flex items-center justify-between gap-8 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-colors duration-300 whitespace-nowrap hover:bg-[var(--fg)] hover:text-[var(--bg)]"
              >
                Reply to my email
                <ArrowUpRight size={17} weight="bold" />
              </a>
              <MagneticLink href="/work" variant="outline">
                See the work
              </MagneticLink>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div
              className="anim-enter rounded-2xl border hairline bg-[var(--bg-2)] p-6 md:p-7"
              style={{ animationDelay: "880ms" }}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.photoAlt}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border hairline object-cover"
                />
                <div>
                  <p className="font-display text-[16px]">{FOUNDER.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] muted">
                    {FOUNDER.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed">
                I run this studio and I wrote you myself. Expect a reply from
                me — not a bot — within 24 hours.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--gold)]">
                We pride in delivering the very best.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Worked-with strip: on screen the moment the page loads. */}
      <ClientStrip />
    </section>
  );
}

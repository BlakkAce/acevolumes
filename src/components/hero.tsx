"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "motion/react";
import { Amplitude, GROWTH_CURVE } from "@/components/amplitude";
import { Constellation } from "@/components/constellation";
import { KineticHeading } from "@/components/kinetic-heading";
import { MagneticLink } from "@/components/magnetic-link";
import { Swoosh } from "@/components/swoosh";
import { TiltFrame } from "@/components/tilt-frame";
import { useMediaQuery } from "@/components/use-media-query";
import { ClientStrip } from "@/components/client-marquee";
import { SCROLL_SPRING } from "@/lib/motion-tokens";

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
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 0.6], [1, 1.07]), SCROLL_SPRING);
  const imgOpacity = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.35]);

  return (
    <section ref={sectionRef} className="relative flex flex-col overflow-hidden border-b hairline lg:min-h-[calc(100dvh-72px)]">
      {field3d ? <Hero3D target={sectionRef} /> : <Constellation />}

      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 content-center gap-y-10 px-5 pb-8 pt-12 md:px-8 md:pb-10 md:pt-14 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <motion.div
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
          className="lg:col-span-6"
        >
          <p
            className="anim-enter font-mono text-[12px] uppercase tracking-[0.12em] muted"
            style={{ animationDelay: "80ms" }}
          >
            Lagos studio. Clients worldwide: US, Europe, Africa and beyond.
          </p>

          <KineticHeading
            as="h1"
            text="Digital systems that make results easier."
            className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)]"
          />

          <Swoosh className="mt-2 h-10 w-[min(420px,80%)]" />

          <p
            className="anim-enter mt-7 max-w-[46ch] text-[17px] leading-relaxed muted md:text-[18px]"
            style={{ animationDelay: "560ms" }}
          >
            One Lagos studio for teams in the US and worldwide, since 2016.
            We pride in delivering the very best.
          </p>

          <p
            className="anim-enter mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--gold)]"
            style={{ animationDelay: "700ms" }}
          >
            Web design · E-commerce · Branding · Marketing · AI content · Software
          </p>

          <div
            className="anim-enter mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "820ms" }}
          >
            <MagneticLink href="/contact">Start a project</MagneticLink>
            <MagneticLink href="/work" variant="outline">
              See the work
            </MagneticLink>
          </div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : { scale: imgScale, opacity: imgOpacity }}
          className="lg:col-span-6"
        >
          <TiltFrame className="relative aspect-[4/3] w-full lg:aspect-[5/5]">
            <div className="glow relative h-full w-full overflow-hidden rounded-[4px] border hairline">
              <Image
                src="/img/hero-studio.jpg"
                alt="The AceVolumes studio at night, lit in plum and gold"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-70 lg:opacity-40"
              />
              <Amplitude
                values={GROWTH_CURVE}
                animate
                className="absolute bottom-6 left-6 right-6 h-12 lg:left-8 lg:right-8"
                barClassName="bg-[var(--gold)]"
                label="AceVolumes signal band"
              />
            </div>
          </TiltFrame>
        </motion.div>
      </div>

      {/* Worked-with strip: on screen the moment the page loads. */}
      <ClientStrip />
    </section>
  );
}

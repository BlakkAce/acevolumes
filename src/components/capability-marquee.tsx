"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";

/**
 * The studio's capabilities, as one continuous kinetic line.
 * Motion motive: it is the single place on the page that runs continuously,
 * so the discipline list reads as breadth rather than as a menu.
 */
export function CapabilityMarquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const raw = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const x = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.5 });

  const run = [...items, ...items];

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y hairline bg-[var(--bg-2)] py-9"
      aria-label="Capabilities"
    >
      <motion.div style={reduce ? undefined : { x }} className="flex w-max">
        {run.map((item, i) => (
          <Reveal key={`${item}-${i}`} delay={0} className="flex items-center">
            <span className="font-display whitespace-nowrap px-6 text-[clamp(1.6rem,3.4vw,2.6rem)] text-[var(--fg)]/80">
              {item}
            </span>
            <span
              aria-hidden
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--accent)]"
            />
          </Reveal>
        ))}
      </motion.div>
    </div>
  );
}

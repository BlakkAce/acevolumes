"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { DUR, EASE, STAGGER } from "@/lib/motion-tokens";

/**
 * Word-by-word mask reveal: each word rises out of its own clipped slot.
 * Motion motive: hierarchy, the headline lands before anything else.
 */
export function KineticHeading({
  text,
  className = "",
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.12 } },
  };

  const word: Variants = {
    hidden: reduce ? { y: "0%" } : { y: "112%" },
    show: { y: "0%", transition: { duration: DUR.slow, ease: EASE } },
  };

  const MotionTag = Tag === "h1" ? motion.h1 : motion.h2;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${
            i < words.length - 1 ? "mr-[0.26em]" : ""
          }`}
        >
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The underline stroke from the AceVolumes logo, drawn in on view.
 * It is the brand's own mark, used as a kinetic signature under headlines.
 * Motion motive: brand storytelling, the stroke signs the headline.
 */
export function Swoosh({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 500 70"
      fill="none"
      aria-hidden
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.path
        d="M8 52 C 120 14, 330 6, 492 34"
        stroke="var(--gold)"
        strokeWidth="12"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      />
    </motion.svg>
  );
}

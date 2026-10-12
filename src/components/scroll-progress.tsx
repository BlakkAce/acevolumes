"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { SCROLL_SPRING } from "@/lib/motion-tokens";

/**
 * A 2px gold progress line at the very top. Orientation on long pages.
 * Scroll-driven; removed entirely under reduced motion.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SCROLL_SPRING);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[65] h-[2px] origin-left bg-[var(--gold)]"
    />
  );
}

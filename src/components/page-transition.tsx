"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE } from "@/lib/motion-tokens";

/**
 * Route enter transition: a short opacity settle on every navigation.
 * Opacity only (no transform) so GSAP's pinned sections never measure a
 * transformed ancestor, and no exit animation, so navigation is never
 * delayed. Time-driven.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DUR.fast, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

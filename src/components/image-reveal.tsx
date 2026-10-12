"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { DUR, EASE } from "@/lib/motion-tokens";

/**
 * Mask reveal for imagery: the frame clips open top-to-bottom while the
 * image settles from a slight scale, so photos arrive instead of popping.
 * Scroll-triggered, fires once. Static under reduced motion.
 *
 * The intersection is measured on the unclipped wrapper: an element that is
 * fully clipped by its own clip-path reports a zero intersection ratio, so a
 * reveal that observes itself can never trigger.
 */
export function ImageReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const show = reduce ? true : inView;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.18 }}
        animate={
          show
            ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
            : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.18 }
        }
        transition={{ duration: DUR.slow, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

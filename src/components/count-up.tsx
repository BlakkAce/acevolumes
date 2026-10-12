"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Number ticks up once when it enters view. Writes straight to the DOM node,
 * never through React state, so it costs nothing per frame.
 * Motion motive: storytelling, the record assembles as you arrive at it.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !inView) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix]);

  // Final value in markup everywhere, so server and client always agree;
  // the animation above simply takes over when the number scrolls into view.
  return (
    <span ref={ref} className={className}>
      {`${prefix}${value}${suffix}`}
    </span>
  );
}

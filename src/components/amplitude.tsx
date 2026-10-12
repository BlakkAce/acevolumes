"use client";

import { motion, useReducedMotion } from "motion/react";

type AmplitudeProps = {
  values: number[];
  className?: string;
  barClassName?: string;
  /** Animate the bars up once on mount. Motive: introduces the brand motif. */
  animate?: boolean;
  label?: string;
};

/**
 * The AceVolumes mark: an amplitude band. The name is about volume, so the
 * visual system is a signal meter rather than an arbitrary swoosh.
 * Heights come from real data arrays passed in, never random noise.
 */
export function Amplitude({
  values,
  className = "",
  barClassName = "",
  animate = false,
  label,
}: AmplitudeProps) {
  const reduce = useReducedMotion();
  const max = Math.max(...values, 1);

  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      role="img"
      aria-label={label ?? "AceVolumes signal mark"}
    >
      {values.map((v, i) => {
        const h = `${Math.max(6, (v / max) * 100)}%`;
        if (reduce || !animate) {
          return (
            <span
              key={i}
              className={`block w-full rounded-[1px] ${barClassName}`}
              style={{ height: h }}
            />
          );
        }
        return (
          <motion.span
            key={i}
            className={`block w-full rounded-[1px] ${barClassName}`}
            initial={{ height: "6%" }}
            animate={{ height: h }}
            transition={{
              duration: 0.9,
              delay: i * 0.022,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </div>
  );
}

/** 31 bars of a real engagement curve, reused across the site. */
export const GROWTH_CURVE = [
  8, 9, 7, 11, 10, 14, 13, 16, 15, 19, 22, 20, 25, 28, 26, 31, 35, 33, 39, 44, 42,
  48, 53, 51, 58, 64, 61, 69, 76, 74, 83,
];

/** Short 12-bar mark used in the nav and footer. */
export const MARK = [4, 7, 5, 10, 8, 14, 11, 17, 13, 20, 16, 24];

/**
 * The AceVolumes motion system. One easing family, three durations, fixed
 * stagger intervals, so every animation on the site shares the same feel.
 *
 * - EASE: signature deceleration curve (fast start, long settle)
 * - DUR: entrance durations in seconds
 * - STAGGER: interval between siblings
 */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
} as const;

/** Scroll-linked helpers share this spring so parallax layers feel related. */
export const SCROLL_SPRING = { stiffness: 90, damping: 24, mass: 0.6 } as const;

/** Pointer physics (magnetic CTA, tilt) share this spring. */
export const POINTER_SPRING = { stiffness: 220, damping: 18, mass: 0.4 } as const;

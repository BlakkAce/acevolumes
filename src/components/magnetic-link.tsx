"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  external?: boolean;
};

/**
 * Primary CTA. The pointer offset is tracked with motion values so dragging the
 * cursor across it never re-renders the React tree.
 * Motion motive: feedback, so the button reads as pressable.
 */
export function MagneticLink({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: MagneticLinkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  const arrowX = useTransform(x, (v) => v * 0.35);
  const arrowY = useTransform(y, (v) => v * 0.35);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const base =
    "group inline-flex items-center justify-between gap-8 rounded-full px-7 py-4 font-display text-[15px] transition-colors duration-300 whitespace-nowrap";
  const skin =
    variant === "solid"
      ? "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
      : "border hairline text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]";

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`${base} ${skin} ${className}`}
    >
      {children}
      <motion.span style={{ x: arrowX, y: arrowY }} className="shrink-0">
        <ArrowUpRight size={17} weight="bold" />
      </motion.span>
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className="inline-block">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="inline-block">
      {inner}
    </Link>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE } from "@/lib/motion-tokens";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset in px. Motive: hierarchy, so blocks resolve in reading order. */
  y?: number;
  delay?: number;
  as?: "div" | "li" | "section" | "span" | "h2" | "p";
};

export function Reveal({ children, className = "", y = 22, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: DUR.base, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

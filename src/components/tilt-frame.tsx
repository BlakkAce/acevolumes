"use client";


import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { POINTER_SPRING } from "@/lib/motion-tokens";
import { useMediaQuery } from "@/components/use-media-query";

/**
 * Pointer-driven perspective tilt with a soft gold glare that follows the
 * cursor. Gated to fine pointers and motion-allowed environments; otherwise
 * it renders as a plain frame. Max rotation is 3.5 degrees, enough to read
 * as physical without becoming a toy.
 */
export function TiltFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduce;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const ry = useSpring(useMotionValue(0), POINTER_SPRING);
  const rx = useSpring(useMotionValue(0), POINTER_SPRING);

  const glare = useMotionTemplate`radial-gradient(420px at ${mx}% ${my}%, rgba(240, 201, 135, 0.13), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
    ry.set(0);
    rx.set(0);
  }

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{ perspective: 1200 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[4px]"
        />
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Drifting particle field with thin connection lines, the futuristic backdrop.
 * Pure canvas: no React state per frame, paused off-screen, static under
 * prefers-reduced-motion.
 * Motion motive: atmosphere for the hero, reads as a signal network.
 */
export function Constellation({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    type Dot = { x: number; y: number; vx: number; vy: number; r: number };
    let dots: Dot[] = [];

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor(rect.width / 22));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function draw(step: boolean) {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const gold = "240, 201, 135";

      for (const d of dots) {
        if (step) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > rect.width) d.vx *= -1;
          if (d.y < 0 || d.y > rect.height) d.vy *= -1;
        }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(${gold}, ${0.14 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const d of dots) {
        ctx.fillStyle = `rgba(${gold}, 0.5)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!visible) {
        running = false;
        return;
      }
      draw(true);
      raf = requestAnimationFrame(loop);
    }

    resize();
    draw(false);

    if (!reduce) {
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          if (visible && !running) {
            running = true;
            raf = requestAnimationFrame(loop);
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      window.addEventListener("resize", resize);
      return () => {
        visible = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

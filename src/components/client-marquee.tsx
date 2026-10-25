"use client";

import Image from "next/image";
import Link from "next/link";
import { CLIENTS } from "@/lib/content";

/**
 * "Worked with": a static strip of real client marks, placed at the bottom of
 * the hero so it is on screen the moment the page loads. No autoplay, no
 * drift - proof should sit still and be read, not perform.
 * Marks render monochrome (brightness-0, inverted in dark) so mixed source
 * artwork reads as one considered band in both themes; hover restores ink.
 */
export function ClientStrip() {
  return (
    <div className="relative border-t hairline">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-5 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--gold)]">
          Worked with
        </p>
        {CLIENTS.map((c) => {
          const linkCls = "group flex shrink-0 items-center";
          const inner = c.logo ? (
            <Image
              src={c.logo}
              alt=""
              width={c.logoW ?? 160}
              height={c.logoH ?? 40}
              sizes="150px"
              loading="lazy"
              className="h-7 w-auto max-w-[150px] object-contain brightness-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100 dark:invert md:h-8"
            />
          ) : (
            <span className="font-display whitespace-nowrap text-[1.15rem] text-[var(--fg)] opacity-60 transition-opacity duration-300 group-hover:opacity-100">
              {c.name}
            </span>
          );
          return c.internal ? (
            <Link key={c.name} href={c.href} aria-label={c.name} className={linkCls}>
              {inner}
            </Link>
          ) : (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.name}
              className={linkCls}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}

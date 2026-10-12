"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X, Sun, Moon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/mortgage", label: "Mortgage" },
  { href: "/about", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b hairline bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" className="flex items-center" aria-label="AceVolumes home">
            <Image
              src="/brand/logo-cream.png"
              alt=""
              aria-hidden
              width={311}
              height={207}
              className="hidden h-9 w-auto dark:block"
            />
            <Image
              src="/brand/logo-ink.png"
              alt="AceVolumes"
              width={311}
              height={207}
              className="block h-9 w-auto dark:hidden"
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`font-mono text-[12.5px] uppercase tracking-[0.09em] transition-colors duration-200 ${
                    active ? "text-[var(--accent)]" : "muted hover:text-[var(--fg)]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle colour theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border hairline transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {/* Pure CSS theme switch keeps server and client markup identical. */}
              <Sun size={16} className="hidden dark:block" aria-hidden />
              <Moon size={16} className="block dark:hidden" aria-hidden />
            </button>
            <Link
              href="/contact"
              className="hidden rounded-full bg-[var(--fg)] px-5 py-2.5 font-mono text-[12.5px] uppercase tracking-[0.09em] text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] md:inline-block"
            >
              Start a project
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border hairline md:hidden"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-[var(--bg)] md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-[72px] items-center justify-between border-b hairline px-5">
              <span className="font-display text-[17px]">AceVolumes</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border hairline"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col px-5 pt-8" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                  className="border-b hairline last:border-b-0"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-display text-[30px] tracking-[-0.03em]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-5 pt-8">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[var(--accent)] py-4 text-center font-display text-[16px] text-[var(--accent-fg)]"
              >
                Start a project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

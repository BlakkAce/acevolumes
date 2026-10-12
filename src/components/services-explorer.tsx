"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CATALOG } from "@/lib/content";

/**
 * The nine-category catalogue as an explorer: sticky index on the left,
 * selected category detail on the right. URL hashes (#web, #branding)
 * deep-link straight into a category.
 */
export function ServicesExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(CATALOG[0].id);

  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.replace("#", "");
      if (CATALOG.some((c) => c.id === id)) setActive(id);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function pick(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  const current = CATALOG.find((c) => c.id === active) ?? CATALOG[0];

  return (
    <div className="grid gap-12 md:grid-cols-12">
      <nav className="md:col-span-4" aria-label="Service categories">
        <ul className="md:sticky md:top-28">
          {CATALOG.map((c, i) => {
            const selected = c.id === active;
            return (
              <li key={c.id} className="border-b hairline first:border-t">
                <button
                  type="button"
                  onClick={() => pick(c.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`flex w-full items-baseline gap-4 py-4 text-left transition-colors duration-200 ${
                    selected ? "text-[var(--gold)]" : "hover:text-[var(--gold)]"
                  }`}
                >
                  <span className="font-mono text-[11.5px]">0{i + 1}</span>
                  <span
                    className={`font-display text-[1.05rem] md:text-[1.15rem] ${
                      selected ? "" : "opacity-80"
                    }`}
                  >
                    {c.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="md:col-span-7 md:col-start-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)]">{current.title}</h2>
            <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed muted">{current.line}</p>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {current.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-snug">
                  <span
                    aria-hidden
                    className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--gold)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={`/contact?service=${current.id}`}
              className="mt-10 inline-flex items-center gap-3 rounded-full border hairline px-6 py-3.5 font-display text-[15px] transition-colors duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Enquire about {current.title.toLowerCase()}
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

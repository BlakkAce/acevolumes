"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mobile-only fixed bottom CTA. Hidden on the contact page itself and on
// desktop (sm and up). Safe-area aware for notched phones.
export function StickyCta() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t hairline sm:hidden"
      style={{
        background: "var(--bg-2)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 px-4 py-3.5 font-display text-[15px] font-semibold"
        style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
      >
        Start a project
      </Link>
    </div>
  );
}

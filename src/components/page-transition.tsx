"use client";

import { usePathname } from "next/navigation";

/**
 * Route enter transition: a short opacity settle on every navigation.
 * Implemented as a CSS animation so content paints on the first frame
 * (no JS gate): even before hydration, or with JavaScript off entirely,
 * the page is visible. Opacity only, so pinned sections never measure a
 * transformed ancestor. Re-keying on pathname replays it per route.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

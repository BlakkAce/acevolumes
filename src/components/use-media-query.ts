"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a media query without effects: the value is external state,
 * read through useSyncExternalStore so server and client stay consistent.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

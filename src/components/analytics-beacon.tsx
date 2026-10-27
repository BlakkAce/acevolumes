"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires one sendBeacon per public page view into /api/track. Fire-and-forget;
 * renders nothing.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const payload = JSON.stringify({
        path: pathname,
        referrer: document.referrer ? document.referrer.slice(0, 300) : "",
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // never surface analytics failures
    }
  }, [pathname]);

  return null;
}

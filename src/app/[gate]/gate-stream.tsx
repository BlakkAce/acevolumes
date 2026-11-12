import { Suspense } from "react";

// Prerender-safe loading shell for gated pages. The prerendered PPR shell is
// this skeleton (never a login form), so the CDN can cache it harmlessly while
// the real, session-checked content streams per request.
export function GateSkeleton({ title }: { title: string }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <p
        className="font-mono text-[11px] uppercase tracking-[0.3em]"
        style={{ color: "var(--accent)" }}
      >
        AceVolumes Studio
      </p>
      <div className="mt-6 h-8 w-48 rounded bg-current opacity-20" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-2xl bg-current opacity-10" />
        <div className="h-40 rounded-2xl bg-current opacity-10" />
      </div>
      <span className="sr-only">{title} is loading</span>
    </div>
  );
}

// Standard wrapper: outer page renders the skeleton at prerender time; the
// async body (session check + data) streams inside the Suspense boundary.
export function GateStream({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<GateSkeleton title={title} />}>{children}</Suspense>
  );
}

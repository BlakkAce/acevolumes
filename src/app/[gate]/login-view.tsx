import { STUDIO_PATH } from "@/lib/studio/config";

// Shared login card — used by the gate page and rendered inline by the
// dashboard when the session is missing/expired (no redirect needed).

export function LoginView({
  error,
  compact,
}: {
  error?: string | null;
  compact?: boolean;
}) {
  return (
    <div
      className={compact ? "w-full max-w-sm" : "flex min-h-[100dvh] items-center justify-center px-4"}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "var(--card, transparent)",
            borderColor: "color-mix(in oklab, var(--fg) 14%, transparent)",
          }}
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "var(--accent)" }}
          >
            Studio
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Private access
          </h1>
          <p className="mt-2 text-sm opacity-60">
            {error === "expired"
              ? "Your session expired. Sign in again to continue."
              : "Enter your passphrase to open the studio dashboard."}
          </p>
          {error && error !== "expired" ? (
            <p
              className="mt-4 rounded-lg px-3 py-2 text-[13px]"
              style={{ background: "rgba(220,60,60,0.12)", color: "#e5484d" }}
              role="alert"
            >
              {error === "rate"
                ? "Too many attempts. Wait ten minutes and try again."
                : "Incorrect passphrase."}
            </p>
          ) : null}
          <form
            action={`/${STUDIO_PATH}/login`}
            method="post"
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              name="passphrase"
              id="passphrase"
              required
              autoComplete="current-password"
              placeholder="Passphrase"
              className="h-11 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:ring-1"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
            />
            <button
              type="submit"
              className="h-11 w-full rounded-lg text-sm font-semibold"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Unlock
            </button>
          </form>
        </div>
        {compact ? null : (
          <p className="mt-4 text-center font-mono text-[11px] opacity-40">
            30-day session · rate-limited · noindex
          </p>
        )}
      </div>
    </div>
  );
}

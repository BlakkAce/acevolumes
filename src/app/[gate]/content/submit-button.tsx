"use client";

import { useFormStatus } from "react-dom";

// Submit button with a real pending state: shows "Working..." and disables
// while its server action runs, so a click is never a silent mystery.
export function SubmitButton({
  children,
  pending,
  primary = false,
}: {
  children: React.ReactNode;
  pending: string;
  primary?: boolean;
}) {
  const { pending: running } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={running}
      className="rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
      style={
        primary
          ? { background: "var(--accent)", color: "var(--accent-fg)" }
          : undefined
      }
    >
      {running ? pending : children}
    </button>
  );
}

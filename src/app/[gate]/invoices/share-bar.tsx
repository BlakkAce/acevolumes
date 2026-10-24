"use client";

import { useState, useSyncExternalStore } from "react";

// Origin-dependent bits of the invoice page: the client view link, copy
// button, and the mailto handoff ("send" without any SMTP credentials —
// opens the owner's own mail app with everything prefilled).
export function ShareBar({
  token,
  number,
  total,
  dueDate,
  clientEmail,
  clientName,
  paymentInstructions,
  status,
}: {
  token: string;
  number: string;
  total: string;
  dueDate: string;
  clientEmail: string | null;
  clientName: string;
  paymentInstructions: string | null;
  status: string;
}) {
  const [copied, setCopied] = useState(false);
  // Read the browser origin without setState-in-effect (SSR-safe).
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const url = `${origin}/invoice/${token}`;

  const subject = `Invoice ${number} — AceVolumes`;
  const body = [
    `Hi ${clientName},`,
    "",
    `Here is invoice ${number} for ${total}, due ${dueDate}.`,
    "",
    `View it any time here: ${url}`,
    paymentInstructions ? `Payment details: ${paymentInstructions}` : "",
    "",
    "Thank you —",
    "AceVolumes",
    "acevolumesofficial@gmail.com",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "color-mix(in oklab, var(--fg) 12%, transparent)" }}
    >
      <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
        Client view link
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg border bg-transparent px-3 py-2 font-mono text-[12px] opacity-80"
              style={{ borderColor: "color-mix(in oklab, var(--fg) 14%, transparent)" }}>
          {url || "…"}
        </code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="h-10 rounded-lg border px-4 text-[13px] opacity-80 hover:opacity-100"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
        {clientEmail ? (
          <a
            href={`mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
            className="h-10 rounded-lg px-4 text-[13px] font-semibold leading-10"
            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
          >
            {status === "draft" ? "Prepare email" : "Email to client"}
          </a>
        ) : (
          <span className="text-[12px] opacity-50">
            Add an email on the client to enable sending
          </span>
        )}
        <a
          href={`print`}
          target="_blank"
          className="h-10 rounded-lg border px-4 text-[13px] leading-10 opacity-80 hover:opacity-100"
          style={{ borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" }}
        >
          Printable view
        </a>
      </div>
      <p className="mt-2 text-[12px] opacity-50">
        The link opens a read-only page for the client — no login needed, it
        cannot be guessed. “Email to client” opens your own mail app with the
        message ready; nothing is sent from a server.
      </p>
    </div>
  );
}

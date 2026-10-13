"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { CATALOG } from "@/lib/content";

const NEEDS = [
  { id: "branding", label: "Branding" },
  { id: "web", label: "Websites" },
  { id: "marketing", label: "Marketing & Email" },
  { id: "mortgage", label: "Mortgage Tech" },
  { id: "ai", label: "AI & Automation" },
  { id: "other", label: "Something else" },
];

const PARAM_MAP: Record<string, string> = {
  brand: "branding",
  branding: "branding",
  web: "web",
  marketing: "marketing",
  social: "marketing",
  ads: "marketing",
  ai: "ai",
  mortgage: "mortgage",
};

type Status = "idle" | "error" | "sending" | "sent" | "fallback";

// Canonical budget bands in NGN; labels convert to the visitor's chosen
// currency via the shared static-rate table (approximate, marked with ≈).
import { CURRENCY_CHOICES, fmtApprox } from "@/lib/currency";

const BANDS: { value: string; ngn: [number, number | null] | null }[] = [
  { value: "Under ₦250,000", ngn: [0, 250000] },
  { value: "₦250,000 to ₦500,000", ngn: [250000, 500000] },
  { value: "₦500,000 to ₦1,000,000", ngn: [500000, 1000000] },
  { value: "Over ₦1,000,000", ngn: [1000000, null] },
  { value: "Not sure yet", ngn: null },
];

function bandLabel(band: (typeof BANDS)[number], currency: string): string {
  if (!band.ngn) return band.value;
  const [lo, hi] = band.ngn;
  if (hi === null) {
    return `Over ${fmtApprox(lo, currency)}`;
  }
  return `${fmtApprox(lo, currency)} to ${fmtApprox(hi, currency)}`;
}

const inputClass =
  "w-full rounded-[4px] border hairline bg-[var(--bg)] px-4 py-3.5 text-[15.5px] text-[var(--fg)] transition-colors duration-200 placeholder:text-[var(--fg-muted)]/70 focus:border-[var(--accent)] focus:outline-none";

const labelClass = "mb-2 block font-mono text-[11.5px] uppercase tracking-[0.1em] muted";

/**
 * Reads ?service= from the query so a link from the services page can preselect
 * the right option. Isolated here so the rest of the page stays prerendered.
 */
export function EnquiryForm() {
  return (
    <Suspense fallback={<p className="muted text-[15px]">Loading the form...</p>}>
      <EnquiryFormInner />
    </Suspense>
  );
}

function EnquiryFormInner() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requested = searchParams.get("service") ?? "";
  const field = PARAM_MAP[requested] && NEEDS.some((n) => n.id === PARAM_MAP[requested])
    ? PARAM_MAP[requested]
    : requested && CATALOG.some((c) => c.id === requested)
      ? "other"
      : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const brief = String(data.get("brief") ?? "").trim();

    if (name.length < 2) next.name = "Tell us who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "That email address does not look right.";
    if (brief.length < 20) next.brief = "A couple of sentences, please. At least 20 characters.";

    setErrors(next);

    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    // Bots fill the hidden field; humans never see it.
    if (String(data.get("_honey") ?? "").trim() !== "") {
      setStatus("sent");
      form.reset();
      return;
    }

    const company = String(data.get("company") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const budget = String(data.get("budget") ?? "").trim();

    const subject = encodeURIComponent(`Project enquiry from ${name}`);
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "-"}`,
      `Service: ${service || "-"}`,
      `Budget: ${budget ? `${budget}${currency !== "NGN" ? ` (${currency})` : ""}` : "-"}`,
      "",
      brief,
    ];

    setStatus("sending");
    try {
      // Direct delivery to the studio inbox; no third-party account needed.
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("https://formsubmit.co/ajax/bestacesales@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          _subject: `Project enquiry from ${name}`,
          _captcha: "false",
          _template: "table",
          name,
          email,
          company: company || "-",
          service: service || "-",
          budget: budget || "-",
          brief,
        }),
      });
      clearTimeout(timer);
      const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
      const ok = res.ok && (json?.success === "true" || json?.success === true);
      if (!ok) throw new Error(`delivery ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      // Delivery service unreachable: open the visitor's mail app instead.
      window.location.href = `mailto:bestacesales@gmail.com?subject=${subject}&body=${encodeURIComponent(
        bodyLines.join("\n"),
      )}`;
      setStatus("fallback");
      form.reset();
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" className={inputClass} placeholder="Adaeze Okonkwo" />
          {errors.name && <p className="mt-2 text-[13px] text-[#d4553f]">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="you@company.com"
          />
          {errors.email && <p className="mt-2 text-[13px] text-[#d4553f]">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="company">
            Company
          </label>
          <input id="company" name="company" className={inputClass} placeholder="Optional" />
        </div>
        <div>
          <label className={labelClass} htmlFor="budget">
            Budget range
          </label>
          <select id="budget" name="budget" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            {BANDS.map((b) => (
              <option key={b.value} value={b.value}>
                {bandLabel(b, currency)}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center gap-2">
            <label className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)]" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="rounded-[4px] border hairline bg-[var(--bg)] px-3 py-2 text-[13.5px] text-[var(--fg)] focus:border-[var(--accent)] focus:outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCY_CHOICES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="text-[11.5px] text-[var(--fg-muted)]">
              {currency === "NGN" ? "" : "approximate conversion"}
            </span>
          </div>
        </div>
      </div>

      <div>
        <span className={labelClass}>What do you need?</span>
        <div className="flex flex-wrap gap-3">
          {NEEDS.map((n) => (
            <label
              key={n.id}
              className="cursor-pointer rounded-full border hairline px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors duration-200 has-checked:border-[var(--accent)] has-checked:bg-[var(--accent)] has-checked:text-[var(--accent-fg)] hover:border-[var(--accent)]"
            >
              <input
                type="radio"
                name="service"
                value={n.label}
                defaultChecked={field === n.id}
                className="sr-only"
              />
              {n.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="brief">
          About the project
        </label>
        <textarea
          id="brief"
          name="brief"
          rows={6}
          className={`${inputClass} resize-y`}
          placeholder="What you sell, who buys it, what you have tried so far, and when you want it live."
        />
        {errors.brief && <p className="mt-2 text-[13px] text-[#d4553f]">{errors.brief}</p>}
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2.5 text-[14px] text-[#d4553f]">
          <WarningCircle size={18} weight="fill" />
          Check the highlighted fields and try again.
        </p>
      )}

      {status === "sent" && (
        <p className="flex items-center gap-2.5 text-[14px] text-[var(--accent)]">
          <CheckCircle size={18} weight="fill" />
          Sent. It is on its way to bestacesales@gmail.com - we reply as fast as we can.
        </p>
      )}

      {status === "fallback" && (
        <p className="flex items-start gap-2.5 text-[14px] text-[#d4553f]">
          <WarningCircle size={18} weight="fill" className="mt-[2px] shrink-0" />
          The delivery service could not be reached, so we opened your email app
          instead. Or write to us directly at bestacesales@gmail.com.
        </p>
      )}

      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-7 py-4 font-display text-[15px] text-[var(--accent-fg)] transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send the enquiry"}
          <PaperPlaneTilt size={17} weight="fill" />
        </button>
        <p className="mt-4 flex max-w-[52ch] items-start gap-2.5 text-[14px] leading-relaxed muted">
          <CheckCircle size={18} weight="fill" className="mt-[2px] shrink-0 text-[var(--accent)]" />
          Enquiries are delivered straight to bestacesales@gmail.com. We reply as
          fast as we can - usually within a day.
        </p>
      </div>
    </motion.form>
  );
}

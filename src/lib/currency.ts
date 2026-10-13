// Currency helpers shared by the public site (budget bands) and the studio
// (invoices). Static reference rates vs NGN — the owner's canonical market.
// They are approximate by design; anything user-facing says "≈".

export const NGN_PER_UNIT: Record<string, number> = {
  USD: 1550,
  GBP: 1950,
  EUR: 1680,
  CAD: 1120,
  AUD: 1010,
  AED: 422,
  ZAR: 85,
  KES: 12,
  GHS: 105,
  INR: 18.5,
  NGN: 1,
};

export const CURRENCY_CHOICES = Object.keys(NGN_PER_UNIT);

export function rateFor(code: string): number {
  return NGN_PER_UNIT[code.toUpperCase()] ?? 1;
}

/** Format an amount in a currency via Intl; falls back to "CODE 1,234" for
 * codes Intl doesn't know, so ANY ISO-4217 code is safe to store/display. */
export function money(v: string | number | null | undefined, code = "USD"): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n)) return `${code} 0`;
  const cur = code.toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  } catch {
    return `${cur} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }
}

/** Round to two significant figures — band labels stay honest-ish. */
function sig2(n: number): number {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / mag) * mag;
}

export function fmtApprox(ngnAmount: number, code: string): string {
  const cur = code.toUpperCase();
  if (cur === "NGN") {
    return `₦${ngnAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  const converted = sig2(ngnAmount / rateFor(cur));
  return `≈ ${money(converted, cur)}`;
}

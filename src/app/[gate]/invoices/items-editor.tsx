"use client";

import { useState } from "react";

export type ItemRow = { description: string; qty: string; unitPrice: string };

// Line-item editor. Client-side rows, server-computed totals (the server
// action recalculates everything — this preview is convenience only).
export function ItemsEditor({ initial }: { initial?: ItemRow[] }) {
  const [rows, setRows] = useState<ItemRow[]>(
    initial && initial.length
      ? initial
      : [{ description: "", qty: "1", unitPrice: "" }],
  );
  const [taxPct, setTaxPct] = useState<string>("0");

  const set = (i: number, patch: Partial<ItemRow>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const remove = (i: number) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  const subtotal = rows.reduce(
    (s, r) => s + (Number(r.qty) || 0) * (Number(r.unitPrice) || 0),
    0,
  );
  const tax = subtotal * ((Number(taxPct) || 0) / 100);

  const input =
    "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
  const border = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };

  return (
    <div className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-wider opacity-60">
        Line items
      </p>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_5rem_7rem_2.2rem] gap-2">
          <input
            name="li_desc"
            value={r.description}
            onChange={(e) => set(i, { description: e.target.value })}
            placeholder={i === 0 ? "e.g. Website redesign — deposit" : "Description"}
            className={input}
            style={border}
          />
          <input
            name="li_qty"
            value={r.qty}
            onChange={(e) => set(i, { qty: e.target.value })}
            inputMode="decimal"
            aria-label="Quantity"
            className={input}
            style={border}
          />
          <input
            name="li_price"
            value={r.unitPrice}
            onChange={(e) => set(i, { unitPrice: e.target.value })}
            inputMode="decimal"
            aria-label="Unit price (USD)"
            placeholder="0.00"
            className={input}
            style={border}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove line"
            className="rounded-lg border text-sm opacity-50 hover:opacity-100"
            style={border}
          >
            ×
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { description: "", qty: "1", unitPrice: "" }])}
          className="rounded-lg border px-3 py-1.5 text-[13px] opacity-75 hover:opacity-100"
          style={border}
        >
          + Add line
        </button>
        <div className="flex items-center gap-2 text-[13px]">
          <label htmlFor="tax_rate" className="opacity-60">
            Tax %
          </label>
          <input
            id="tax_rate"
            name="tax_rate"
            value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)}
            inputMode="decimal"
            className="h-9 w-16 rounded-lg border bg-transparent px-2 text-center text-sm outline-none"
            style={border}
          />
          <span className="ml-3 tabular-nums opacity-70">
            ${(subtotal + tax).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}

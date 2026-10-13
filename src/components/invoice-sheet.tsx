"use client";

// Presentational invoice sheet, shared by the printable view and the public
// client link. Print-optimised: embedded @media print rules, system fonts
// plus the site's serif-ish display feel, zero external assets.

export type SheetData = {
  number: string;
  status: string; // draft | sent | paid | overdue (display)
  issuedAt: Date | null;
  dueAt: Date | null;
  subtotal: string;
  tax: string;
  total: string;
  paymentInstructions: string | null;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string | null;
  items: { description: string; qty: string; unitPrice: string }[];
};

function fmtDate(d: Date | null): string {
  return d
    ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";
}

export function InvoiceSheet({ data, printButton }: { data: SheetData; printButton?: boolean }) {
  const money = (v: string) =>
    Number(v).toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="invoice-sheet mx-auto w-full max-w-2xl bg-white p-10 text-[#241222]">
      <style>{`
        .invoice-sheet { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .invoice-sheet { padding: 0; max-width: none; }
        }
      `}</style>

      <div className="flex items-start justify-between gap-6 border-b-2 border-[#3B153A] pb-6">
        <div>
          <p className="text-[26px] font-black uppercase leading-none tracking-[0.18em] text-[#3B153A]">
            Ace<span className="text-[#B8860B]">Volumes</span>
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#6b5566]">
            Brand, web &amp; social for mortgage, real estate and e-commerce
            <br />
            bestacesales@gmail.com
          </p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#6b5566]">Invoice</p>
          <p className="mt-1 font-mono text-[18px] font-semibold">{data.number}</p>
          <p className="mt-1 text-[12px] capitalize text-[#6b5566]">{data.status}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-8 text-[13px]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5566]">Billed to</p>
          <p className="mt-1 font-semibold">{data.clientName}</p>
          {data.clientCompany ? <p className="text-[#4a3a45]">{data.clientCompany}</p> : null}
          {data.clientEmail ? <p className="text-[#4a3a45]">{data.clientEmail}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5566]">Issued</p>
          <p className="mt-1">{fmtDate(data.issuedAt)}</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5566]">Due</p>
          <p className="mt-1">{fmtDate(data.dueAt)}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#d8c9d4] text-left text-[10px] uppercase tracking-[0.18em] text-[#6b5566]">
            <th className="pb-2 font-bold">Description</th>
            <th className="pb-2 text-right font-bold">Qty</th>
            <th className="pb-2 text-right font-bold">Unit</th>
            <th className="pb-2 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((it, i) => {
            const amt = Number(it.qty) * Number(it.unitPrice);
            return (
              <tr key={i} className="border-b border-[#efe6ec]">
                <td className="py-2.5 pr-3">{it.description}</td>
                <td className="py-2.5 text-right tabular-nums">{Number(it.qty)}</td>
                <td className="py-2.5 text-right tabular-nums">{money(it.unitPrice)}</td>
                <td className="py-2.5 text-right tabular-nums">{money(String(amt))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-56 space-y-1.5 text-[13px]">
          <div className="flex justify-between text-[#4a3a45]">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(data.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#4a3a45]">
            <span>Tax</span>
            <span className="tabular-nums">{money(data.tax)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-[#3B153A] pt-2 text-[16px] font-bold text-[#3B153A]">
            <span>Total due</span>
            <span className="tabular-nums">{money(data.total)}</span>
          </div>
        </div>
      </div>

      {data.paymentInstructions ? (
        <div className="mt-8 rounded-lg bg-[#f7f1f5] p-4 text-[12px] leading-relaxed text-[#4a3a45]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b5566]">
            Payment instructions
          </p>
          <p className="mt-1 whitespace-pre-wrap">{data.paymentInstructions}</p>
        </div>
      ) : null}

      <p className="mt-8 text-center text-[11px] text-[#9b8a97]">
        Thank you for working with AceVolumes — we pride ourselves on delivering the very best.
      </p>

      {printButton ? (
        <div className="no-print mt-8 text-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-[#3B153A] px-6 py-2.5 text-[13px] font-semibold text-white"
          >
            Print / save as PDF
          </button>
        </div>
      ) : null}
    </div>
  );
}

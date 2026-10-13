import { INTERACTION_TYPES } from "@/lib/studio/crm";

const INPUT =
  "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none";
const BORDER = { borderColor: "color-mix(in oklab, var(--fg) 18%, transparent)" };

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60"
    >
      {children}
    </label>
  );
}

// Shared field set for create + edit. Plain server-rendered inputs; the
// surrounding form's server action does the work — no client JS needed.
export function ClientFields({
  c,
}: {
  c?: {
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    source: string;
    status: string;
    service: string | null;
    projectSummary: string | null;
    valueUsd: string | null;
    nextFollowUpAt: Date | null;
  };
}) {
  const dateValue = c?.nextFollowUpAt
    ? c.nextFollowUpAt.toISOString().slice(0, 10)
    : "";
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <input
          id="name"
          name="name"
          required
          defaultValue={c?.name ?? ""}
          className={INPUT}
          style={BORDER}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Company</Label>
          <input id="company" name="company" defaultValue={c?.company ?? ""} className={INPUT} style={BORDER} />
        </div>
        <div>
          <Label htmlFor="service">Service</Label>
          <input
            id="service"
            name="service"
            defaultValue={c?.service ?? ""}
            placeholder="Website Design, SEO…"
            className={INPUT}
            style={BORDER}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <input id="email" name="email" type="email" defaultValue={c?.email ?? ""} className={INPUT} style={BORDER} />
        </div>
        <div>
          <Label htmlFor="phone">Phone (with country code)</Label>
          <input id="phone" name="phone" defaultValue={c?.phone ?? ""} placeholder="+1…" className={INPUT} style={BORDER} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={c?.status ?? "lead"} className={INPUT} style={BORDER}>
            <option value="lead">Lead</option>
            <option value="proposal">Proposal</option>
            <option value="active">Active</option>
            <option value="delivered">Delivered</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <select id="source" name="source" defaultValue={c?.source ?? "direct"} className={INPUT} style={BORDER}>
            <option value="direct">Direct</option>
            <option value="referral">Referral</option>
            <option value="website">Website enquiry</option>
            <option value="clientscout">ClientScout import</option>
            <option value="scout">Own scouting</option>
            <option value="social">Social / DM</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="value_usd">Deal value (USD)</Label>
          <input
            id="value_usd"
            name="value_usd"
            inputMode="decimal"
            defaultValue={c?.valueUsd ? String(Math.round(Number(c.valueUsd))) : ""}
            placeholder="2500"
            className={INPUT}
            style={BORDER}
          />
        </div>
        <div>
          <Label htmlFor="next_follow_up_at">Next follow-up</Label>
          <input
            id="next_follow_up_at"
            name="next_follow_up_at"
            type="date"
            defaultValue={dateValue}
            className={INPUT}
            style={BORDER}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="project_summary">Project summary</Label>
        <textarea
          id="project_summary"
          name="project_summary"
          rows={3}
          defaultValue={c?.projectSummary ?? ""}
          className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"
          style={BORDER}
        />
      </div>
      <input type="hidden" name="types_hint" value={INTERACTION_TYPES.join(",")} />
    </div>
  );
}

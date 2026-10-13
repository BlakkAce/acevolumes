// Shared pipeline vocabulary — the CRM speaks these everywhere.

export const STATUSES = [
  "lead",
  "proposal",
  "active",
  "delivered",
  "archived",
] as const;
export type ClientStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<ClientStatus, string> = {
  lead: "Lead",
  proposal: "Proposal",
  active: "Active",
  delivered: "Delivered",
  archived: "Archived",
};

// Open pipeline = money still in play.
export const OPEN_STATUSES: ClientStatus[] = ["lead", "proposal", "active"];

export const INTERACTION_TYPES = ["call", "email", "meeting", "note"] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export function isStatus(v: string): v is ClientStatus {
  return (STATUSES as readonly string[]).includes(v);
}

export function statusTint(s: ClientStatus): string {
  switch (s) {
    case "lead":
      return "#8e8eff";
    case "proposal":
      return "#f0c987"; // gold
    case "active":
      return "#4cc38a";
    case "delivered":
      return "#54b9c5";
    case "archived":
      return "#9b9b9b";
  }
}

export function usd(v: string | number | null | undefined): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n) || n === 0) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

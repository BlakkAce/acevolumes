# AceVolumes Studio Dashboard — CRM Plan

Status: PLAN (v1 draft, awaiting owner decisions)
Owner-facing summary of what we'll build, what it costs, and what is needed.

---

## 1. Goal

A private, login-protected area inside the AceVolumes site where the owner
manages clients: who they are, what stage the work/deal is at, what it's
worth, what was last discussed, and what needs following up. It must never
be discoverable from the public site.

## 2. Security model — read this first

**A hidden link is a disguise, not a lock.** The plan uses both:

| Layer | What it does |
| --- | --- |
| Secret URL (e.g. `/mvx-studio-9f3a`) | Not linked anywhere in nav/footer/sitemap. You type it or bookmark it. Browsers and scanners never find it by crawling. |
| Real authentication | Passphrase login, rate-limited, signed `httpOnly` session cookie. Even if someone guesses the URL, they hit a login wall. |
| Server-side guard | Every dashboard page/API checks the session **on the server** before rendering or returning data. Not just a hidden menu item. |
| `noindex` header | Studio pages send `X-Robots-Tag: noindex` so search engines never list them. Deliberately NOT listed in `robots.txt` — that file is public, and listing the secret path there would leak it. |
| HTTPS everywhere | Enforced by the host (Vercel by default). |

Optional v2 nicety: "stealth 404" — logged-out visits to the secret path
receive an ordinary 404 page instead of a login screen, so even the
existence of the dashboard is invisible.

## 3. How it fits the current site

- Same Next.js app, same repo, one deployment. The dashboard lives under a
  secret route group; the marketing site is untouched and keeps shipping as
  static pages.
- Public bundle never includes dashboard code (route-level code splitting;
  server components keep data access off the client).
- Deploy target: **Vercel** (the standard host for Next.js, free tier to
  start). This also gets the public site properly online — currently it has
  no live deployment at all, so Step 1 of Phase 1 is deploying it.

```
Browser ──> your-domain/{secret-path}     (Vercel)
              ├─ login page ──> session cookie (httpOnly, signed, 30 days)
              └─ studio pages ──> server actions ──> Drizzle ORM ──> Postgres (Neon free tier)
Public pages: static, unchanged, zero links to the studio.
```

## 4. Tool shopping list (what you need)

| Tool | Purpose | Cost |
| --- | --- | --- |
| Vercel account | Hosting (site + dashboard APIs) | $0 Hobby tier; Pro $20/mo when this is business production |
| Postgres database (Vercel Postgres / Neon) | Where client data lives | $0 free tier to start |
| Auth.js | Login + session handling (audited, standard library) | $0 |
| Drizzle ORM | Type-safe database access in code | $0 |
| Resend (Phase 3 only) | Emailing invoices + follow-up reminders | $0 up to 3k emails/mo |
| Stripe (optional, Phase 3) | "Pay now" card payments on invoices | free + ~2.9% + 30c/US transaction |

**Total to run v1: $0/month.** Realistic worst case once the business
depends on it: ~$20/mo (Vercel Pro). You bring: a Vercel account, a GitHub
login to connect the repo, and the decisions at the bottom of this file.

## 5. Data model (v1)

```
clients
  id, name, company, email, phone, source
  status        lead | proposal | active | delivered | archived
  service       (from the nine-category catalogue)
  project_summary, value_usd
  next_follow_up_at
  created_at, updated_at

interactions (timeline per client)
  id, client_id, type  call | email | meeting | note
  summary, happened_at

invoices (Phase 3 — schema locked now so it slots in cleanly)
  id, client_id, number (AV-2026-001…)
  status      draft | sent | paid | overdue (auto-flagged from due_at)
  issued_at, due_at, currency USD
  subtotal, tax, total, payment_instructions
invoice_items
  id, invoice_id, description, qty, unit_price
```

- CSV export button from day one — your data is never hostage to the tool.
- Invoices pull client + deal data automatically; dashboard later gains
  "outstanding" and "overdue" money figures alongside pipeline value.
- Client data is real PII: strong passphrase (4–5 random words minimum),
  never share the studio URL, occasional CSV backups.

## 6. Screens (v1)

| Screen | Shows |
| --- | --- |
| `/{secret}` | Login (passphrase) |
| `/{secret}/dashboard` | Pipeline counts + total value, follow-ups due this week |
| `/{secret}/clients` | Table, filter by status/service, search |
| `/{secret}/clients/new` | Add client |
| `/{secret}/clients/[id]` | Full record, edit, interaction timeline |
| `/{secret}/invoices` (P3) | List w/ status filters, outstanding + overdue totals |
| `/{secret}/invoices/[id]` (P3) | Editor, mark sent/paid, brand-styled printable PDF, send action |
| `/invoice/[token]` (P3) | Unguessable read-only invoice page the client can open |

Style: same brand system as the site (plum/gold, Archivo/Hanken), no fluff —
a working tool, not a showpiece.

## 7. Phases

- **Phase 1 — foundation (one session):** deploy site to Vercel, provision
  database, secret route + passphrase login + server-side guard, schema.
  Exit test: you log in at the hidden URL on the live domain.
- **Phase 2 — the CRM (one–two sessions):** clients CRUD, pipeline list,
  dashboard overview, interactions timeline, CSV export. Exit test: your
  real clients entered and it replaces whatever spreadsheet/notes you keep now.
- **Phase 3 — invoicing (one–two sessions):** invoices tied to clients with
  line items + numbering, brand-styled invoice (print-to-PDF from a
  print-optimised page), send via Gmail SMTP app-password (from
  bestacesales@gmail.com, best deliverability, no domain DNS needed) or
  Resend; unguessable client view link; outstanding/overdue figures on the
  dashboard. Optional same phase: Stripe "Pay now" if the owner wants card
  payments (~2.9% + 30c per US transaction) — otherwise payment
  instructions text on the invoice, $0.
- **Phase 4 — backlog (later, pick as needed):** follow-up email reminders
  (Resend), file attachments, TOTP two-factor, stealth-404, audit log,
  invoice/deal fields.

## 8. Alternatives considered (honesty section)

- **Airtable / Notion / HubSpot Free as the CRM:** zero build, real products.
  Downsides: your client data lives in someone else's SaaS shape, no brand,
  per-seat costs as it grows, and the "hidden link" story doesn't really
  apply. Reasonable Plan B — say the word and we pivot.
- **Supabase backend instead of Vercel+Neon:** managed Postgres with
  ready-made auth. Slightly less auth code, one more account/dashboard.
  Viable; recommended only if you outgrow single-admin auth.
- **Building custom (recommended):** data stays in your own database under
  your own domain, matches the brand, $0 tools, and the code is ours.

- **Free dedicated invoicing tools (Zoho Invoice, Wave):** genuinely good
  for invoicing alone. Build-it-in wins when invoices should pull client and
  deal data automatically and the dashboard shows outstanding money; if we
  ever only need invoicing, these are the honest Plan B.

## 9. Decisions needed from the owner

1. Approach: custom CRM (recommended) vs Supabase vs Airtable-first.
2. Auth: passphrase-only (recommended v1) vs email magic-link each login.
3. Fields: is the §5 field set right for how you actually sell?
4. Pipeline stages: default `lead → proposal → active → delivered → archived`
   or your own words?
5. Secret path: pick an unguessable slug (not `/admin`, not `/crm`) — e.g.
   two random words + two digits. You choose; it can be changed later.

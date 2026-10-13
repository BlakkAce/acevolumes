# ClientScout — Product & Business Analysis

Analyzed 2026-10-13 from the live app (DOM supplied by owner), the public
landing page, and the owner's screenshot of the logged-in dashboard.
Confidence is marked per section: [V] verified from source, [D] deduced.

---

## 1. What it is [V]

ClientScout is a **local-business lead finder for freelancers**: pick the
service you sell (28 options from Website Design to CRM Automation), pick a
business niche and country, and it returns businesses that "may need your
service" — scored, filtered by website status and rating, saveable,
exportable.

| Fact | Value |
| --- | --- |
| Product | Lead-gen SaaS for freelancers/agencies |
| Built on | Lovable (AI app builder; "Edit with Lovable" badge live in production) |
| URL | clientscout.lovable.app (Lovable hosting, no custom domain) |
| Pricing | **$1.79 one-time "lifetime access"**, no subscription |
| Fair-use clause | "Lifetime" includes a configurable lead allowance, 500 leads/month default |
| Login | Email-based auth (signup/login at `/auth`) |
| App sections | Find Opportunities · My Prospects · Search History · Announcements · Account |

## 2. How it works — the funnel and the machinery

**Funnel [V]:** landing page sells the promise ("find businesses that need
your service") with an example lead → $1.79 signup → dashboard search.

**Data pipeline [D]:** the lead data has to come from somewhere, and the
filters reveal it:

- Niche + Country + City + "Minimum Rating" (4.0/4.5/4.8+) + review counts
  in the example card (4.7★, 327 reviews) → this is **Google Places /
  Maps data** (via an API like Google Places, or a cheaper reseller such as
  SerpApi / Outscraper / ScrapingBee).
- "Website Status" categories — No Website · Social Only · Website
  Improvement · Website Found — are computed by probing each place's
  website field: no domain → "No Website"; a Facebook/Instagram/Linktree
  URL → "Social Only"; a real site → crawled and scored for gaps (no SSL,
  not mobile-friendly, slow, no booking, outdated) → "Website Improvement"
  vs "Website Found" [D].
- The 0–100 **opportunity score** [V] weights signals a freelancer cares
  about: high rating + many reviews (established demand) + weak/absent web
  presence (the gap you sell to). "HOT" flag on 92/100 [V].
- Contact actions [V]: call, WhatsApp, email, visit website. Phone numbers
  come from the Places data; email is the weak link (Places has no emails)
  — either they scrape the prospect's site for a mailto/contact address or
  the email action is just a mailto with no address [D — worth testing].

**The honest summary:** it's an aggregator over public map data with a
gap-detection layer and a score on top. That's a proven, useful model —
the moat is not the data (everyone can buy it); it's the scoring and the
workflow.

## 3. Feature audit

**Genuinely good [V]:**
- The **Website Status filter is the product.** "No Website" + "Social
  Only" is exactly the list a web freelancer wants to cold-call. Sharp
  positioning.
- The scored example card ("Why this lead?" reasons + HOT flag) is great
  sales psychology — it tells the buyer *how to pitch*.
- Sensible filters (rating floor avoids slums; lead count 10–1000).
- Workflow basics present: save prospects, search history, CSV export,
  mobile bottom-nav.
- $1.79 is an impulse price. Zero friction.

**Gaps and weaknesses [V unless noted]:**
- **No outreach in the product.** It stops at "contact them" — you leave
  for WhatsApp/email with no templates, no sequencing, no follow-up
  reminders, no way to track who was contacted. The saved-prospects list
  is a dead-end list, not a pipeline. (This is precisely the CRM territory
  AceVolumes is planning for itself.)
- **Email discovery dubious [D]:** Google Places exposes phones, not
  emails. If emails aren't scraped from prospect sites, the "email" action
  is a dead button for many leads.
- **"Website Improvement" scoring depth unknown** — a real crawler
  (Lighthouse-class) is expensive per lead at $1.79/500-per-month; more
  likely shallow checks [D]. If it's shallow, scores mislead.
- **"Announcements" with a badge in a solo tool is odd** — looks like
  broadcast messaging to users (marketing/upsell channel).
- **Trust deficit:** Lovable badge in production, `.lovable.app` subdomain,
  no custom domain, no company identity, no privacy policy link visible,
  no terms. For a tool that asks freelancers to trust its data and take
  prospects' contact info, that's fragile.
- **Unit economics are precarious [D]:** Google Places data costs roughly
  $0.02–0.05+ per place fetched with detail fields; a 1,000-lead search
  could cost a meaningful fraction of the $1.79 — once. The 500-leads/month
  clause exists precisely because of this. Charges for 100–1000 result
  pages can also silently multiply. Sustainable only on cheap reseller
  APIs or aggressive caching.
- **Data quality reality [D]:** "No official website found" from Places
  is noisy — plenty of businesses have sites that just aren't linked on
  their Google profile. Expect false positives in the hottest category.
- **The $1.79 lifetime price** reads as a land-grab: build a user base
  fast, presumably to raise prices, add subscriptions, or flip the asset.
  The "configurable allowance" line means the price can be de-facto
  repriced anytime by tightening the allowance.

## 4. Tech stack [V/D]

- Lovable-generated **React SPA** (single `/assets/index-*.js` module),
  Tailwind-class utility soup, shadcn/radix-style comboboxes, Lucide
  icons, client-side routing with `data-status` active links [V].
- Almost certainly **Supabase** behind it (the default Lovable backend:
  auth, Postgres, edge functions calling the data APIs) [D].
- Server-rendered marketing landing content is minimal; the SPA does the
  work [V].
- Implication: a competent dev team can match this feature set in weeks;
  nothing here is technically hard. The only real asset is API plumbing
  and whatever caching they've built.

## 5. What this means for AceVolumes

ClientScout is, in effect, the **top-of-funnel that feeds exactly the CRM
AceVolumes is planning.** Three ways to play it:

**Play A — Use it (cheapest, start now).** At $1.79 it costs nothing to
buy access and judge the lead quality with your own searches (test Lagos
restaurants against streets you know; count false "no website" flags).
Use its CSV export to feed prospects *into* the AceVolumes dashboard as
`source: clientscout` leads. The CRM becomes the pipeline layer
ClientScout lacks; ClientScout stays the discovery layer. Caveat: check
its ToS before exporting — many such tools prohibit redistribution of the
data, and Google-licensed content has its own terms.

**Play B — Copy the playbook into your dashboard (the strategic move).**
Add a "Prospecting" module to the planned studio dashboard: paste or
import businesses, or later auto-pull from the same data sources
(Places via a reseller API), auto-detect website gaps (we control the
crawler depth, so scoring can be *deeper and truer* than ClientScout's),
and land each prospect directly in the pipeline with contact tracking,
follow-ups, and — Phase 3 — invoices. That's the full loop ClientScout
explicitly does not close: find → contact → track → win → bill. For
AceVolumes' own business development this beats any $1.79 tool, and it
sits behind the same hidden login.

**Play C — Productise it (only if you want a second business).** The
freelancer-lead-finder market is real but brutal: data costs vs a $1.79
price, no moat, a likely price/subscription pivot coming from the current
owner, and Google ToS exposure. If the itch is to sell tools rather than
use them, it needs a real differentiation (deeper audits, outreach
automation, agency white-label) and real money for data APIs. Not
recommended as a distraction from the studio.

## 6. Recommendation

1. **Now:** buy the $1.79, run 3–4 real searches in AceVolumes' niches
   (mortgage/real-estate-adjacent and e-commerce brands in target cities),
   judge lead accuracy by hand. Keep expectations calibrated per §3.
2. **Phase 2 of the dashboard:** make sure `source` and contact/outreach
   fields are first-class so exported ClientScout leads slot in cleanly.
3. **Later (own decision):** if prospecting becomes a habit, greenlight a
   "Prospecting" module (Play B) as Phase 4 of the dashboard plan — the
   schema and auth are already designed to take it.

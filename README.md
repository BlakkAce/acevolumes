# AceVolumes

Marketing site for AceVolumes, a Lagos digital studio working since 2016 with
clients mainly in the United States. Primary niches: mortgage and real estate,
then e-commerce brands.

## Brand

- Logo files in `public/brand/` (backgrounds removed from the two originals):
  `logo-ink` (light backgrounds), `logo-cream` and `logo-gold` (dark
  backgrounds), `logo-plum` (mark only). `src/app/icon.png` is the favicon.
- Palette sampled from the logos: plum `#3B153A`, gold `#F0C987`, ink, paper.
  Dark theme = plum night with gold signal; light theme = warm paper with plum
  ink. Tokens live in `src/app/globals.css`.
- The amplitude band under the hero image echoes the three strokes in the
  logo mark; the swoosh under the headline is the logo underline, drawn in.

## Stack

- Next.js 16 (App Router, static prerender)
- Tailwind CSS v4
- Motion (`motion/react`): kinetic word-mask headline, reveals, magnetic CTAs,
  scroll parallax, count-up stats
- GSAP ScrollTrigger: pinned horizontal niche pan + pinned work stack
- Canvas constellation field in the hero (paused off-screen, static under
  `prefers-reduced-motion`)
- Fonts: Archivo display, Hanken Grotesk body, Space Grotesk mono

## Pages

- `/` hero with the static worked-with client strip in the first view,
  studio record, niche pan (real estate, mortgage tech, e-commerce),
  nine-category catalogue index, marquee, work stack, process, values,
  testimonials, CTA
- `/services` the full nine-category catalogue as a sticky-index explorer with
  hash deep links, mortgage vertical teaser, pricing approach
- `/mortgage` dedicated vertical: delivered record, seven build areas, ARIVE
  implementation consulting clusters, honest-scoping CTA
- `/work` asymmetric gallery of real client work, each with a live-site link
- `/work/[slug]` case-study pages: challenge, approach, deliverables and
  qualitative outcomes (e.g. `/work/hcmg-command`,
  `/work/instafi-home-loans`)
- `/about` story, values, timeline, process
- `/contact` validated enquiry form (opens the visitor's mail client), FAQs

Service catalogue content lives in `src/lib/content.ts` (CATALOG,
MORTGAGE_AREAS, ARIVE_CLUSTERS, MORTGAGE_RECORD). All nine categories are
presented as available today, per the owner's decision.

## Motion & interaction system

One shared token set (`src/lib/motion-tokens.ts`: easing `[0.16,1,0.3,1]`,
durations 0.4/0.7/1.1s, stagger steps, spring presets) drives every entrance,
hover and scroll behaviour.

- Scroll-driven: top progress bar, hero scroll exit, pinned work stack and
  niche pan (GSAP), image mask reveals, marquee, 3D field rotation.
- Pointer-driven: magnetic CTAs, card tilt + glare, 3D field tilt, hover
  sweeps/zooms with keyboard-focus parity.
- Time-driven: page fade, sequenced hero entrance, stat count-ups, logo
  swoosh draw.
- Genuine 3D (`hero-3d.tsx`, raw Three.js): fibonacci node field with
  nearest-neighbour lines; lazy-loaded chunk, pointer-fine + wide-viewport
  gate only, paused off-screen, full dispose on unmount.
- Accessibility/perf: transform+opacity only, `prefers-reduced-motion`
  collapses every animation to a static state, IntersectionObserver reveals
  measure an unclipped wrapper (a clipped element reports zero intersection
  and can never trigger itself), no horizontal overflow, navigation is never
  delayed (page transitions are enter-only fades).

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm run start
```

## Content notes (swap before going live)

- Testimonials use realistic placeholder names and US roles; replace with real
  client quotes and permission.
- Enquiry form and all contact points use `bestacesales@gmail.com`. The form
  posts to FormSubmit (no account needed) and falls back to the visitor's mail
  client if the service is unreachable. FormSubmit sends a one-time activation
  email to the inbox on first use - click it once and deliveries go live.
- Starting prices are market research figures, not a confirmed rate card.

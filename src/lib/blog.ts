/**
 * Blog content. Answer-first structure (GEO/AEO): every post opens with the
 * direct answer to the query it targets, then depth, then an FAQ block that
 * carries valid FAQPage schema. AI engines cite pages that answer cleanly.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "cta"; text: string };

export type Post = {
  slug: string;
  title: string;
  answers: string; // the query this post answers (shown as subtitle)
  description: string; // meta description
  date: string; // ISO
  keywords: string[];
  blocks: Block[];
  faq: { q: string; a: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "what-pages-does-a-mortgage-website-need",
    title: "What pages does a mortgage website need? The 2026 checklist",
    answers: "what pages should a mortgage website have",
    description:
      "The exact pages a mortgage lender or broker website needs in 2026: product pages, calculators, loan officer bios, compliance elements — and the two that get skipped.",
    date: "2026-11-11",
    keywords: [
      "mortgage website pages",
      "lender website checklist",
      "loan officer website",
      "NMLS website requirements",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a mortgage website needs nine pages to compete in 2026 — a homepage with rates or a clear next step, one page per loan product (conventional, FHA, VA, jumbo, refinance), a calculator page, loan officer profiles with NMLS numbers, an about page, a contact page, a resources section, and compliant licensing disclosures. Most lender sites miss the last two: an honest rates explainer and a fast application start.",
      },
      { t: "h", text: "The nine pages, in priority order" },
      {
        t: "ol",
        items: [
          "Homepage — states who you lend to and what to do next in one screen. A prominent rate display or a clear 'start application' path; both work, vagueness does not.",
          "Loan product pages — one page per product (FHA, VA, conventional, jumbo, refinance). Each answers: who qualifies, what the limits are, what the first step is. These are the pages borrowers actually search for.",
          "Payment calculator — historically the highest-engagement tool on lender sites. Show monthly payment with tax and insurance, not just principal and interest.",
          "Loan officer profiles — borrowers search for people. Each profile carries a real photo, NMLS number, direct contact, and a link to apply. This page also captures branded searches for the officer's own name.",
          "About — who runs the company, in person, with faces. Trust decides high-stakes finance.",
          "Contact — phone, form, hours in the borrower's timezone, and what happens after they send it.",
          "Resources — guides that answer real borrower questions; this is where search traffic compounds.",
          "Rates explainer — why your rates are what they are, what APR includes, what changes them. Honest rate content earns links and trust.",
          "Compliance — NMLS company and individual license numbers, Equal Housing Lender marking, state licensing disclosures, and the standard rate disclaimers. Not optional, and best placed near forms rather than only in footers.",
        ],
      },
      { t: "h", text: "The two pages most lenders skip" },
      {
        t: "p",
        text: "First, a genuine rates explainer — borrowers are not confused because rates are complex; they are confused because nobody explains them plainly. Second, an application start that is actually fast: ask for a zip code and a goal before asking for a life history. Sites that ask less in the first step convert more of the same traffic.",
      },
      {
        t: "cta",
        text: "AceVolumes builds lender websites with this exact structure — see the Harris Capital case study, or ask us to map your site against this checklist in one working day.",
      },
    ],
    faq: [
      {
        q: "What compliance elements does a mortgage website need?",
        a: "NMLS company and individual license numbers, Equal Housing Lender logo, state licensing disclosures where you lend, and Truth-in-Lending style rate disclaimers wherever rates appear. Place them near forms and rate tables, not only in the footer.",
      },
      {
        q: "Do mortgage websites really need a loan calculator?",
        a: "Yes — calculator pages are typically the highest-engagement pages on lender sites. Show monthly payment including principal, interest, tax and insurance, and state clearly that figures are estimates.",
      },
      {
        q: "Should loan officers have their own pages?",
        a: "Yes. Borrowers search for loan officers by name. A profile page with photo, NMLS number and a direct apply link captures those searches and builds personal trust under the company domain.",
      },
    ],
  },
  {
    slug: "why-your-website-loses-customers-in-two-seconds",
    title: "Why your website loses customers in the first two seconds",
    answers: "why is my website not converting visitors into customers",
    description:
      "The 7 fixes that stop a website losing customers before it loads: speed, first-screen clarity, one action per page, mobile-first, trust placement, answer-first copy, and honest forms.",
    date: "2026-11-11",
    keywords: [
      "website conversion",
      "website load speed leads",
      "why website not converting",
      "bounce rate fix",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: websites lose customers in the first two seconds for one dominant reason — the visitor cannot tell, instantly, that they are in the right place and what to do next. The seven fixes are: load under two seconds, one screen that says who you serve and what to do, a single primary action per page, mobile-first layout, trust signals next to the action, answer-first copy, and forms that ask less before asking more.",
      },
      { t: "h", text: "The seven fixes, ranked by impact" },
      {
        t: "ol",
        items: [
          "Speed. Every extra second of load time is a share of visitors gone before your first word renders. Under two seconds is the target; zero third-party scripts is how you get there.",
          "First-screen clarity. One screen must answer: who is this for, what do they get, what is the next step. If a visitor has to scroll or decode, they leave.",
          "One action per page. Two competing buttons equal zero buttons. Decide the single next step for each page and make it unmistakable.",
          "Mobile-first. Most visitors are on phones, on cellular, possibly walking. Design for that thumb first; the desktop is the adaptation.",
          "Trust next to the action. Put proof — names, faces, numbers, client logos — beside the form or button, not six scrolls below.",
          "Answer-first copy. Lead every page with the answer to the question that brought the visitor. This also makes the page citable by AI assistants, which increasingly send the visitors.",
          "Honest forms. Ask for what you need to be useful, nothing more. A zip code and a goal beat a nine-field interrogation in step one.",
        ],
      },
      { t: "h", text: "How to find where you are losing them" },
      {
        t: "p",
        text: "Watch real numbers instead of guessing: time-to-first-byte and load time (speed), scroll depth (clarity), and the drop-off between page views and form starts (action and trust). A first-party analytics setup — cookieless, private, yours — answers all three without banner consents. That is how we build.",
      },
      {
        t: "cta",
        text: "AceVolumes sites ship sub-2-second, zero third-party scripts, answer-first. See the work, or send us your current site for a one-day review.",
      },
    ],
    faq: [
      {
        q: "How fast should a website load?",
        a: "Aim for full content within two seconds on a phone. The biggest wins come from removing third-party scripts, properly sized images, and serving text first.",
      },
      {
        q: "Why do visitors leave without clicking anything?",
        a: "Usually the first screen fails to say who the site is for and what to do next, or the page asks for too much too early. Fix clarity and the first form step before touching design.",
      },
      {
        q: "How do I track where visitors drop off?",
        a: "Use first-party analytics (no cookies needed) to compare page views against form starts per page. The pages with high views and low starts are where clarity, speed or trust is failing.",
      },
    ],
  },
  {
    slug: "how-much-should-a-small-business-website-cost",
    title: "How much should a small business website cost in 2026?",
    answers: "how much does a website cost for a small business",
    description:
      "Honest 2026 pricing ranges for small business websites: template, freelance, and studio builds — what changes the price, and the monthly costs nobody mentions upfront.",
    date: "2026-11-11",
    keywords: [
      "small business website cost",
      "website pricing 2026",
      "how much does a website cost",
      "custom website vs template",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a serious small business website in 2026 costs somewhere between about $500 and $10,000 upfront, plus $20–$200 per month. Templates with self-service tools sit at the low end, custom studio builds with strategy, copy and integrations sit at the top. The right question is not the sticker price — it is what the site earns. A $2,000 site that converts is cheaper than a $500 site that loses every visitor it paid for.",
      },
      { t: "h", text: "What the tiers actually buy" },
      {
        t: "ul",
        items: [
          "DIY / template ($0–$500 upfront, $20–$60/mo): your time is the budget. Fine for validating an idea; the ceiling is generic look and slow load from plugin sprawl.",
          "Freelance build ($500–$3,000): one person, variable depth. Get clarity on who writes the copy, who owns the accounts, and what happens after launch.",
          "Studio build ($3,000–$10,000+): strategy, copy, design, engineering, analytics and a named human who stays accountable. This is where conversion, speed and search structure are engineered, not hoped for.",
          "Custom systems ($10,000+): dashboards, portals, CRM integrations — software, not just a site. Priced per system.",
        ],
      },
      { t: "h", text: "The monthly costs nobody mentions upfront" },
      {
        t: "p",
        text: "Hosting and domain ($10–$40/mo), maintenance and updates ($0 if you enjoy doing it, $50–$200/mo if you do not), analytics (free when first-party), and — the real cost — content. Sites that publish useful answers keep earning search and AI traffic; sites that freeze after launch quietly decay. Budget for the habit, not just the build.",
      },
      { t: "h", text: "How to judge any quote" },
      {
        t: "ol",
        items: [
          "Does the quote include load-speed targets in writing?",
          "Who writes the copy — and is it answer-first for search and AI engines?",
          "Do you own the domain, hosting account and analytics?",
          "What happens in the 30 days after launch — who watches, who tunes?",
          "Is there a named human who replies within one working day?",
        ],
      },
      {
        t: "cta",
        text: "AceVolumes publishes its working model openly: founder-built, one hour of your time, live in weeks, every reply within one working day. Start a project or see the work.",
      },
    ],
    faq: [
      {
        q: "Is a cheap website worth it?",
        a: "A template build can be the right call for testing an idea. Once you are paying for traffic or relying on the site for leads, the cheapest option is usually the most expensive: it loses the visitors you paid to attract.",
      },
      {
        q: "Why do studio builds cost more?",
        a: "You are paying for strategy, copywriting, engineering and accountability — not just pages. The measurable differences are speed, conversion structure, search structure and someone who answers when something matters.",
      },
      {
        q: "What monthly costs should I expect?",
        a: "Hosting and domain ($10–$40), optional maintenance ($50–$200), and your own content effort. Anyone quoting a build without mentioning the monthly picture is selling the easy half.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

import type { Post } from "./blog";

// Batch 4 (posts 20-24): selling, redesign, breakage, briefing.

export const POSTS_EXTRA_4: Post[] = [
  {
    slug: "should-your-business-take-bookings-online",
    title: "Should your business take bookings online? (and what it takes)",
    answers: "should i add online booking to my website",
    description:
      "Online booking wins when appointments repeat and no-shows cost money. When it pays off, what it costs, and the three things a booking system must do to be worth it.",
    date: "2026-11-13",
    keywords: [
      "online booking system",
      "appointment booking website",
      "scheduling for small business",
      "add booking to website",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: take bookings online when two things are true: appointments repeat (hair, clinics, consults, rentals, classes) and a missed slot costs you real money. Then a booking system pays for itself fast, because it removes the phone tag, fills quiet hours, and cuts no-shows with automatic reminders. If your calendar is chaotic and customers chase you for slots, you are ready; if enquiries are rare and bespoke, a form and a phone call still serve you fine.",
      },
      { t: "h", text: "What a booking system must do to be worth it" },
      {
        t: "ol",
        items: [
          "Show real availability and let the customer pick a slot themselves, any hour, without waiting for you to reply.",
          "Confirm instantly by email or SMS, and send a reminder before the appointment (this alone cuts no-shows dramatically).",
          "Feed the booking into a list you actually look at: your calendar plus your CRM, not a dashboard nobody opens.",
          "Let you block, buffer and control: travel time, minimum notice, deposits for expensive slots.",
        ],
      },
      { t: "h", text: "What it costs, honestly" },
      {
        t: "p",
        text: "Standard booking tools run $0 to $40 per month and can be wired into your site in days. Custom systems (deposits, resource scheduling, multiple staff with rules) are a build: priced per system. The hidden cost is not software; it is discipline: keep availability current and reply to the rare edge cases within your promised window. A stale calendar is worse than no calendar.",
      },
      {
        t: "p",
        text: "Sequence it sensibly: get the site live with a plain enquiry form first, then add booking once volume justifies it. Booking is a feature of a site that exists, not a substitute for one.",
      },
      {
        t: "cta",
        text: "AceVolumes wires booking flows that fit how you actually work: real availability, instant confirmations, automatic reminders, and every booking logged where you track customers. Ask what yours would cost, one number, one date.",
      },
    ],
    faq: [
      {
        q: "Does online booking reduce no-shows?",
        a: "Yes, mainly through automatic reminders sent the day before and an hour before. Requiring small deposits for premium slots cuts no-shows further. The reminder loop is the single biggest win.",
      },
      {
        q: "Can I keep taking phone bookings too?",
        a: "Of course, and you should for customers who prefer it. Just log phone bookings in the same system so the calendar stays truthful. Two calendars is how double-bookings happen.",
      },
      {
        q: "Is a booking system expensive to run?",
        a: "Standard tools cost about the price of a few coffees monthly and pay for themselves with a single saved slot per week. The real investment is keeping availability accurate and honoring your reply promises.",
      },
    ],
  },
  {
    slug: "selling-on-dms-vs-online-store",
    title: "Selling on DMs vs a real online store: when you need which",
    answers: "do i need an online store or can i sell on instagram dm",
    description:
      "DM selling works for custom quotes and small volume; a store wins when orders repeat and you want to sell while asleep. The honest decision guide with costs and failure modes.",
    date: "2026-11-13",
    keywords: [
      "sell on instagram or website",
      "dm selling vs online store",
      "do i need an online store",
      "ecommerce vs social selling",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: sell on DMs when every order is negotiated, custom or high-touch (services, bespoke goods, wholesale): conversation is the product. Build a real online store when orders repeat with fixed prices, when you want to sell outside your waking hours, or when payment collection over chat starts leaking customers. Many businesses need both: DMs for custom work, a store for the standard catalog.",
      },
      { t: "h", text: "Where DM selling breaks" },
      {
        t: "ul",
        items: [
          "You are the checkout: no sale happens while you sleep, travel or nurse a flu.",
          "Payment chasing lives in chat: screenshots, bank transfers, 'I have sent it', and the disputes that follow.",
          "Nothing compounds: a DM sale leaves no searchable product page behind.",
          "You cannot answer 'how much is X' for the hundredth time without spending the same minutes every time.",
          "Platform risk: account locks hit hardest when the storefront and the sales record live inside one app.",
        ],
      },
      { t: "h", text: "Where a store wins immediately" },
      {
        t: "p",
        text: "Fixed-price, repeatable products: cards, candles, garments, digital goods, packaged services. A store answers price, stock and payment questions automatically, records every order, and lets paid ads point at a checkout instead of a chat window. Costs in 2026: honest small stores run from a few hundred dollars (lean catalog, one payment provider) to a few thousand (inventory, shipping rules, integrations), plus payment processing fees around 2 to 4 percent. Anything can start small: ten products done properly beat a hundred half-listed.",
      },
      {
        t: "p",
        text: "The move that combines both: keep DMs for custom enquiries, put fixed products on the store, and link the store from every post. Social is the megaphone; the store is the till.",
      },
      {
        t: "cta",
        text: "AceVolumes builds fast, honest stores: real checkout, real order records, mobile-first, sub-2-second loads, and analytics that show which posts actually produce orders. See the work, or ask what your catalog would cost to put online.",
      },
    ],
    faq: [
      {
        q: "Can I take payments on social media directly?",
        a: "Partly: some platforms offer native shops, but fees, rules and reach change without notice, and your sales records live in someone else's app. For anything beyond pocket money, a store you own is the safer till.",
      },
      {
        q: "How much does a small online store cost?",
        a: "A lean, well-built store with a short catalog typically starts around one to two thousand dollars plus payment fees; heavier inventory and shipping needs push higher. Beware building big before the first ten orders prove the catalog.",
      },
      {
        q: "What about WhatsApp Business for selling?",
        a: "It is a great ordering channel and better than DMs for structure (catalogs, labels, quick replies), but it is still chat: no independent storefront, no search traffic, and records tied to the platform. Use it as a channel into a store, not instead of one.",
      },
    ],
  },
  {
    slug: "website-redesign-cost",
    title: "How much does it cost to redo an existing website?",
    answers: "how much does a website redesign cost",
    description:
      "Redesign pricing in 2026: light refresh vs full rebuild, what pushes the price up (content, old accounts, redirects), and how to tell which one your site actually needs.",
    date: "2026-11-14",
    keywords: [
      "website redesign cost",
      "how much to redo a website",
      "website refresh vs rebuild",
      "redesign pricing 2026",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a light redesign (new design on existing pages and content) runs roughly $1,000 to $3,000 for a small business site; a full rebuild (new structure, new copy, new speed and SEO plumbing) runs $3,000 to $10,000+, the same as a new build, because that is what it honestly is. The price is driven less by graphics than by content: who writes the pages, and how much of the old site's material survives.",
      },
      { t: "h", text: "Which one do you actually need?" },
      {
        t: "ul",
        items: [
          "Light refresh fits when the structure is sound: pages answer real questions, speed is decent, but the look is dated or the brand changed.",
          "Full rebuild fits when the fundamentals are wrong: slow loads, no mobile care, pages that do not answer anything, forms that leak, or a platform held together by plugins.",
          "The two-question test: does each page answer a real customer question in its first screen? Does the site load in about two seconds on a phone? Two noes means rebuild.",
        ],
      },
      { t: "h", text: "What pushes redesign prices up" },
      {
        t: "ol",
        items: [
          "Content nobody can find: lost logins, missing logo files, copy locked in an old builder. Account archaeology is real work.",
          "Page sprawl: 40 thin pages that should be 12 strong ones. Consolidation is strategy, not just deletion.",
          "Redirects ignored: a redesign that breaks old URLs throws away years of search credit. Mapping every old address to its new home is non-negotiable and takes time.",
          "Scope creep: 'while we are at it' additions priced mid-build instead of quoted properly.",
        ],
      },
      {
        t: "p",
        text: "A redesign should leave you measurably better: faster loads, clearer pages, more enquiries. Ask any bidder where those numbers will land and how you will see them; the good ones answer with specifics.",
      },
      {
        t: "cta",
        text: "AceVolumes redesigns with the same discipline as new builds: fixed price, one date, every old URL mapped, sub-2-second result measured before handover. Send us your current site for a one-day verdict: refresh or rebuild, honestly.",
      },
    ],
    faq: [
      {
        q: "Is it cheaper to redesign or start over?",
        a: "When structure and content are weak, starting over is usually cheaper in total: you pay once for strategy and copy instead of retrofitting design onto pages that do not work. A refresh is cheaper only when the bones are genuinely good.",
      },
      {
        q: "Will a redesign hurt my Google rankings?",
        a: "Not if redirects are mapped properly and content keeps answering the same questions. Rankings drop when redesigns break URLs or delete pages that had earned positions. Redirect mapping is the safeguard.",
      },
      {
        q: "How long does a redesign take?",
        a: "Two to five weeks for a small business site when content and access are ready. The unknowns in old accounts and legacy pages are what stretch the calendar, not the design work.",
      },
    ],
  },
  {
    slug: "why-websites-break-after-launch",
    title: "Why websites break after launch (and how to prevent it)",
    answers: "why does my website keep breaking",
    description:
      "The real reasons sites break after launch: expired domains and certificates, plugin conflicts, dead forms, untested updates and nobody watching. A prevention list that fits on one page.",
    date: "2026-11-13",
    keywords: [
      "website broke after launch",
      "website keeps breaking",
      "website downtime causes",
      "prevent website problems",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: websites break after launch for five boring reasons: renewals that lapsed (domain, hosting, certificate), updates applied blind or never applied, plugins and third-party services that changed under you, forms and integrations that died silently, and nobody watching anything. None of these are mysterious; all of them are preventable with a one-page routine.",
      },
      { t: "h", text: "The five, and the fix for each" },
      {
        t: "ol",
        items: [
          "Lapsed renewals. Domain and certificate expiries take whole sites down and get scraped within hours. Fix: auto-renew on, current card, calendar reminders a month ahead.",
          "Blind or skipped updates. Either extreme breaks things. Fix: patch on a schedule, test after, and keep a backup from immediately before each round.",
          "Third-party changes. Plugins, embeds and APIs update or vanish under you. Fix: fewer dependencies (the leaner the site, the fewer doors), and a quarterly sweep that clicks every page like a customer would.",
          "Silent form deaths. The enquiry form stops delivering and nobody knows for months. Fix: submit your own form monthly, and route submissions to a monitored inbox plus a store that logs everything.",
          "No monitoring. Breakage discovered by customers is the expensive kind. Fix: uptime monitoring with alerts to a human who acts within a working day.",
        ],
      },
      { t: "h", text: "The one-page routine that prevents 90% of it" },
      {
        t: "p",
        text: "Monthly: submit the form yourself, click the top five pages on a real phone, check uptime alerts are quiet. Quarterly: restore one backup, re-test speed, clear search console errors. Yearly: audit accounts and access, verify renewals, retire anything unused. That is the whole discipline. Sites do not break because their owners are careless; they break because no one assigned the routine.",
      },
      {
        t: "cta",
        text: "AceVolumes runs this routine inside the Care Plan: monitoring, tested backups, patching, monthly form checks and a named human on one-working-day replies. Hand us the worry, or ask for the routine sheet and run it yourself.",
      },
    ],
    faq: [
      {
        q: "What is the most common cause of website downtime?",
        a: "Expired renewals: domains, certificates and hosting lapses. They are completely preventable with auto-renew and reminders, and they are the classic outage nobody saw coming.",
      },
      {
        q: "How do I know if my contact form stopped working?",
        a: "Submit it yourself monthly, and better: route submissions into a system that logs every entry so a gap is visible. A form that only emails can die silently; a logged form shows the hole.",
      },
      {
        q: "How often should a website be checked?",
        a: "A monthly self-check (forms, key pages, alerts) catches most problems early; monitoring runs continuously; a deeper quarterly pass covers backups, speed and search errors. The habit matters more than the intensity.",
      },
    ],
  },
  {
    slug: "how-to-brief-a-web-designer",
    title: "How to brief a web designer so you get the site you want first time",
    answers: "how to brief a web designer",
    description:
      "The brief that gets better quotes and better sites: goals, customers, proof, assets and dealbreakers. A fill-in template, plus the questions a good designer will ask you.",
    date: "2026-11-14",
    keywords: [
      "how to brief a web designer",
      "website brief template",
      "website requirements document",
      "what to tell a web designer",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a good brief answers six things in one page: what the site must achieve (enquiries, bookings, sales), who exactly it is for, what proof you can show (numbers, clients, reviews), what pages you think you need, what assets exist (logo files, photos, text), and your dealbreakers (deadline, budget ceiling, must-keep features). Send that to three designers and you will get three comparable, quotable answers instead of three guesses.",
      },
      { t: "h", text: "The one-page brief, section by section" },
      {
        t: "ol",
        items: [
          "Goal: what should a visitor do? 'Fill the enquiry form', 'book a consult', 'buy the starter pack'. One primary goal, one secondary at most.",
          "Customer: who they are, where they are, and the words they use. Two or three real customer sentences beat a persona document.",
          "Proof: what you can honestly claim. Clients, years, results with numbers, reviews. This is what separates persuasive sites from pretty ones.",
          "Pages: your guess at the structure (home, services, about, proof, contact). The designer will refine it; your draft starts the conversation.",
          "Assets: logo files (SVG or high-res), photos, existing text, domain and hosting access. Missing assets are the number one delay.",
          "Dealbreakers: launch date it must hit, budget range you are working with, anything that must not change (brand rules, compliance text).",
        ],
      },
      { t: "h", text: "What a good designer will ask you back" },
      {
        t: "p",
        text: "Expect sharp questions: what happens after someone submits the form, who replies to enquiries and how fast, which page matters most in search, who owns the domain account, and what your competitors' first screens promise. A designer who asks none of these is about to decorate, not build. And you should ask them: speed targets in writing, who writes the copy, what happens 30 days after launch, and who owns everything when it is done.",
      },
      {
        t: "p",
        text: "The brief is not a contract; it is the start of the conversation that becomes one. One page of honesty saves weeks of round-trips.",
      },
      {
        t: "cta",
        text: "AceVolumes quotes from briefs exactly like this, and we made you a head start: send us your answers to those six sections and you get back a fixed price and a date, not a sales call. Start at the contact page.",
      },
    ],
    faq: [
      {
        q: "Should I tell the designer my budget?",
        a: "Yes, a range. It lets them propose the right depth instead of guessing, and it screens out mismatches fast. A good studio responds with what the range buys, not with a number just under it.",
      },
      {
        q: "How detailed should the brief be?",
        a: "One page. Long briefs get skimmed; short, honest ones get used. If a section would take a paragraph to fake or a sentence to state, state the sentence.",
      },
      {
        q: "What if I do not know what pages I need?",
        a: "Say so in the brief; structuring the site is part of what you are buying. Give the goal and the customer, and let the designer propose the map. Your draft just needs to show how you think about the business.",
      },
    ],
  },
];

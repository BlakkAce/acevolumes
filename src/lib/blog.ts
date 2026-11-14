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
      "The exact pages a mortgage lender or broker website needs in 2026: product pages, calculators, loan officer bios, compliance elements, and the two that get skipped.",
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
        text: "Direct answer: a mortgage website needs nine pages to compete in 2026: a homepage with rates or a clear next step, one page per loan product (conventional, FHA, VA, jumbo, refinance), a calculator page, loan officer profiles with NMLS numbers, an about page, a contact page, a resources section, and compliant licensing disclosures. Most lender sites miss the last two: an honest rates explainer and a fast application start.",
      },
      { t: "h", text: "The nine pages, in priority order" },
      {
        t: "ol",
        items: [
          "Homepage: states who you lend to and what to do next in one screen. A prominent rate display or a clear 'start application' path; both work, vagueness does not.",
          "Loan product pages: one page per product (FHA, VA, conventional, jumbo, refinance). Each answers: who qualifies, what the limits are, what the first step is. These are the pages borrowers actually search for.",
          "Payment calculator: historically the highest-engagement tool on lender sites. Show monthly payment with tax and insurance, not just principal and interest.",
          "Loan officer profiles: borrowers search for people. Each profile carries a real photo, NMLS number, direct contact, and a link to apply. This page also captures branded searches for the officer's own name.",
          "About: who runs the company, in person, with faces. Trust decides high-stakes finance.",
          "Contact: phone, form, hours in the borrower's timezone, and what happens after they send it.",
          "Resources: guides that answer real borrower questions; this is where search traffic compounds.",
          "Rates explainer: why your rates are what they are, what APR includes, what changes them. Honest rate content earns links and trust.",
          "Compliance: NMLS company and individual license numbers, Equal Housing Lender marking, state licensing disclosures, and the standard rate disclaimers. Not optional, and best placed near forms rather than only in footers.",
        ],
      },
      { t: "h", text: "The two pages most lenders skip" },
      {
        t: "p",
        text: "First, a genuine rates explainer. Borrowers are not confused because rates are complex; they are confused because nobody explains them plainly. Second, an application start that is actually fast: ask for a zip code and a goal before asking for a life history. Sites that ask less in the first step convert more of the same traffic.",
      },
      {
        t: "cta",
        text: "AceVolumes builds lender websites with this exact structure: see the Harris Capital case study, or ask us to map your site against this checklist in one working day.",
      },
    ],
    faq: [
      {
        q: "What compliance elements does a mortgage website need?",
        a: "NMLS company and individual license numbers, Equal Housing Lender logo, state licensing disclosures where you lend, and Truth-in-Lending style rate disclaimers wherever rates appear. Place them near forms and rate tables, not only in the footer.",
      },
      {
        q: "Do mortgage websites really need a loan calculator?",
        a: "Yes. Calculator pages are typically the highest-engagement pages on lender sites. Show monthly payment including principal, interest, tax and insurance, and state clearly that figures are estimates.",
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
        text: "Direct answer: websites lose customers in the first two seconds for one dominant reason: the visitor cannot tell, instantly, that they are in the right place and what to do next. The seven fixes are: load under two seconds, one screen that says who you serve and what to do, a single primary action per page, mobile-first layout, trust signals next to the action, answer-first copy, and forms that ask less before asking more.",
      },
      { t: "h", text: "The seven fixes, ranked by impact" },
      {
        t: "ol",
        items: [
          "Speed. Every extra second of load time is a share of visitors gone before your first word renders. Under two seconds is the target; zero third-party scripts is how you get there.",
          "First-screen clarity. One screen must answer: who is this for, what do they get, what is the next step. If a visitor has to scroll or decode, they leave.",
          "One action per page. Two competing buttons equal zero buttons. Decide the single next step for each page and make it unmistakable.",
          "Mobile-first. Most visitors are on phones, on cellular, possibly walking. Design for that thumb first; the desktop is the adaptation.",
          "Trust next to the action. Put proof (names, faces, numbers, client logos) beside the form or button, not six scrolls below.",
          "Answer-first copy. Lead every page with the answer to the question that brought the visitor. This also makes the page citable by AI assistants, which increasingly send the visitors.",
          "Honest forms. Ask for what you need to be useful, nothing more. A zip code and a goal beat a nine-field interrogation in step one.",
        ],
      },
      { t: "h", text: "How to find where you are losing them" },
      {
        t: "p",
        text: "Watch real numbers instead of guessing: time-to-first-byte and load time (speed), scroll depth (clarity), and the drop-off between page views and form starts (action and trust). A first-party analytics setup, cookieless and private, answers all three without banner consents. That is how we build.",
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
      "Honest 2026 pricing ranges for small business websites: template, freelance, and studio builds, what changes the price, and the monthly costs nobody mentions upfront.",
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
        text: "Direct answer: a serious small business website in 2026 costs somewhere between about $500 and $10,000 upfront, plus $20–$200 per month. Templates with self-service tools sit at the low end, custom studio builds with strategy, copy and integrations sit at the top. The right question is not the sticker price. It is what the site earns. A $2,000 site that converts is cheaper than a $500 site that loses every visitor it paid for.",
      },
      { t: "h", text: "What the tiers actually buy" },
      {
        t: "ul",
        items: [
          "DIY / template ($0–$500 upfront, $20–$60/mo): your time is the budget. Fine for validating an idea; the ceiling is generic look and slow load from plugin sprawl.",
          "Freelance build ($500–$3,000): one person, variable depth. Get clarity on who writes the copy, who owns the accounts, and what happens after launch.",
          "Studio build ($3,000–$10,000+): strategy, copy, design, engineering, analytics and a named human who stays accountable. This is where conversion, speed and search structure are engineered, not hoped for.",
          "Custom systems ($10,000+): dashboards, portals, CRM integrations: software, not just a site. Priced per system.",
        ],
      },
      { t: "h", text: "The monthly costs nobody mentions upfront" },
      {
        t: "p",
        text: "Hosting and domain ($10–$40/mo), maintenance and updates ($0 if you enjoy doing it, $50–$200/mo if you do not), analytics (free when first-party), and the real cost, content. Sites that publish useful answers keep earning search and AI traffic; sites that freeze after launch quietly decay. Budget for the habit, not just the build.",
      },
      { t: "h", text: "How to judge any quote" },
      {
        t: "ol",
        items: [
          "Does the quote include load-speed targets in writing?",
          "Who writes the copy, and is it answer-first for search and AI engines?",
          "Do you own the domain, hosting account and analytics?",
          "What happens in the 30 days after launch: who watches, who tunes?",
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
        a: "You are paying for strategy, copywriting, engineering and accountability, not just pages. The measurable differences are speed, conversion structure, search structure and someone who answers when something matters.",
      },
      {
        q: "What monthly costs should I expect?",
        a: "Hosting and domain ($10–$40), optional maintenance ($50–$200), and your own content effort. Anyone quoting a build without mentioning the monthly picture is selling the easy half.",
      },
    ],
  },
  {
    slug: "how-to-get-your-business-found-on-google-without-ads",
    title: "How to get your business found on Google without ads (2026 playbook)",
    answers: "how to get your business found on google without ads",
    description:
      "The five free levers that get a small business found on Google without ads: a complete Google Business Profile, consistent contact details, service and location pages, steady reviews, and a fast crawlable site.",
    date: "2026-11-12",
    keywords: [
      "how to get found on google without ads",
      "local seo checklist small business",
      "google business profile optimization",
      "get business on google maps free",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: five free levers get a small business found on Google without ads, in this order: a complete and verified Google Business Profile, identical contact details everywhere on the web, one real page per service and location, a steady stream of reviews with replies, and a fast mobile site with proper business schema. Roughly half of all Google searches have local intent, and most people who search for a local business on a phone visit one within a day. Ads rent that attention; these five levers own it.",
      },
      { t: "h", text: "The five levers, in order" },
      {
        t: "ol",
        items: [
          "Google Business Profile. Claim your listing at google.com/business and verify it. Use your real business name (no keyword stuffing; Google suspends profiles for that), the most specific primary category available, and fill every field: address, hours, services, a description under 750 characters, service areas. Add at least ten real photos and post a weekly update. The profile powers the map results and the side panel, which is where local customers click.",
          "Contact details that match everywhere. Your name, address and phone number must be identical on your website, Google profile, Bing Places, Apple Business Connect, Yelp, Facebook and the directories that matter in your industry. Mismatches split Google's confidence across versions of your business. Old listings linger for years, so audit them after any move or rebrand.",
          "One page per service, one page per location. A page dedicated to each service, with the city or service area in the title and the first paragraph, beats a generic services page every time. If you serve several towns, give each a page with real substance: neighborhoods, recent work, local requirements. Cloned pages with the city name swapped out are detected and ignored.",
          "Reviews, steadily, with replies. Ask every happy customer with a direct link, aim for a steady trickle rather than a burst, and reply to every review within a couple of days, especially the critical ones. A calm, useful reply to a bad review often sells better than a wall of five stars.",
          "A fast, crawlable site. Mobile-first, loading in about two and a half seconds or less, secure (HTTPS), every page with a unique descriptive title under about 60 characters, and LocalBusiness schema whose name, address, phone and hours match your Google profile exactly. Schema is behind-the-scenes code that helps search engines and AI assistants confirm your details and cite your business.",
        ],
      },
      { t: "h", text: "What to expect, honestly" },
      {
        t: "p",
        text: "Profile work moves the map results fastest: improvements usually show within two to four weeks. Organic ranking for local terms takes three to six months of consistency, and small towns move faster than big cities. Track what matters: calls, direction requests and profile clicks from Google Business Profile insights, plus Search Console for the site. Review the numbers monthly and double down on what produced enquiries, not what produced impressions.",
      },
      { t: "h", text: "When paid help is worth it" },
      {
        t: "p",
        text: "If your site is under ten pages, you do not need a monthly SEO retainer. The fundamentals above are free and can be done in an afternoon or two. Paid help earns its fee when you are competing in a crowded market, producing content at scale, or fixing a technical mess faster than you could learn to. Judge any agency by named humans, measurable work and written speed targets, not by report volume.",
      },
      {
        t: "cta",
        text: "AceVolumes builds the site half of this playbook: location and service pages that deserve to rank, business schema that matches your Google profile, sub-2-second loads and first-party analytics. See the work, or ask for a one-day review of your current site.",
      },
    ],
    faq: [
      {
        q: "How long does it take to rank on Google without ads?",
        a: "A completed Google Business Profile can move map results within two to four weeks. Organic ranking for local search terms usually takes three to six months of consistent effort. Businesses in smaller towns tend to rank faster than those in major cities.",
      },
      {
        q: "Do I need to pay an SEO agency to rank on Google?",
        a: "Not for a simple site. The fundamentals (a complete Google Business Profile, matching contact details, real service pages, reviews and a fast site) are free and DIY-able. Retainers earn their fee in crowded markets or at content scale; judge them by named humans and measurable work.",
      },
      {
        q: "What is a Google Business Profile and is it really free?",
        a: "It is Google's free listing that powers your appearance on Google Maps and in local search results. Claim it at google.com/business, verify by postcard, phone or video, fill in every field, and keep the details identical to your website.",
      },
    ],
  },
];


export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export type Project = {
  slug: string;
  client: string;
  discipline: string;
  year: string;
  image: string;
  summary: string;
  challenge: string;
  approach: string[];
  outcome: string[];
  services: string[];
  /** Live client site, when this is work we point at publicly. */
  live?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "instafi-home-loans",
    client: "InstaFi Home Loans",
    discipline: "Mortgage",
    year: "2024",
    image: "/img/work/client-instafi.jpg",
    live: "https://instafiloans.com",
    summary:
      "A California mortgage banker-and-broker site built around one promise: we shop till we drop your rate. Purchase, refinance and cash-out paths one tap away, with calculators and instant pre-qualification.",
    challenge:
      "InstaFi operates as both a mortgage banker and a mortgage broker with 70+ lending relationships - and online, that advantage was invisible. The site had to explain why banker-and-broker matters to a borrower in plain language, in seconds.",
    approach: [
      "Message hierarchy built around banker-and-broker and rate shopping",
      "Three clear journeys - purchase, refinance, cash-out - wired to the application portal",
      "Calculator suite and a loan-programme index borrowers can self-serve",
      "Track record up front: two decades in lending, 12,000+ closed transactions",
    ],
    outcome: [
      "The banker-and-broker story lands on the first screen",
      "Every CTA routes into a live application flow",
      "Live today, sending borrowers to the team",
    ],
    services: ["Website Design", "Content"],
  },
  {
    slug: "excel-realty-mortgage",
    client: "Excel Realty & Mortgage",
    discipline: "Real Estate",
    year: "2024",
    image: "/img/work/client-excel-realty.jpg",
    live: "https://teamerm.com",
    summary:
      "One roof over two businesses: a 220-person realty and mortgage company. Buying, selling and financing journeys plus a recruiting engine for agents and loan officers.",
    challenge:
      "A large independent firm that still wants to feel boutique. The site had to serve four audiences at once - buyers, sellers, borrowers and recruits - without reading as four different websites.",
    approach: [
      "Separate, clear journeys for buying, selling, financing and joining the team",
      "Recruiting section with agent and loan-officer testimonials and a video library",
      "Mortgage tools and pre-approval wired straight into the lending flow",
      "A concierge tone carried through every page",
    ],
    outcome: [
      "Four audiences, one coherent brand",
      "Recruits and borrowers reach the right application from one nav",
      "Live today, serving the firm's California market",
    ],
    services: ["Website Design", "Content"],
  },
  {
    slug: "hcmg-command",
    client: "HCMG Command",
    discipline: "Mortgage Technology",
    year: "2026",
    image: "/img/mortgage-tech.jpg",
    summary:
      "A custom mortgage operating system: loan pipeline, CRM and borrower applications in one build, with ARIVE integration pathways and a workflow audit.",
    challenge:
      "A mortgage business was running loans across spreadsheets, a generic CRM and three tools that did not talk to each other. Pipeline state lived in the operations manager's head.",
    approach: [
      "Custom mortgage OS: React interface, Express API, PostgreSQL data models",
      "Loan pipeline with stages, assignments and activity tracking",
      "Borrower applications with URLA / MISMO 3.4 XML export",
      "ARIVE integration pathways with webhooks and Zapier, plus a workflow audit",
    ],
    outcome: [
      "Pipeline, CRM and applications live in one system",
      "Export and integration pathways delivered and documented",
      "An audit report the team uses to plan the next build",
    ],
    services: ["Mortgage Technology", "Website Design"],
  },
  {
    slug: "harris-capital-mortgage",
    client: "Harris Capital Mortgage Group",
    discipline: "Mortgage",
    year: "2025",
    image: "/img/work/client-hcmg-loans.jpg",
    live: "https://hcmgloans.com",
    summary:
      "A lender site that leads with a 60-second affordability estimate - no hard credit pull, no pressure - before a borrower ever talks to a loan officer.",
    challenge:
      "Most borrowers spend weeks talking to lenders before understanding what they can actually afford. HCMG wanted the reverse: know your numbers first, then connect when you are ready.",
    approach: [
      "60-second estimate flow with a full principal, tax and insurance breakdown",
      "Licensing map across 11 active states with 13 more pending",
      "Calculator with amortisation schedule across FHA, VA, USDA and conventional",
      "Handoff that routes each borrower to a licensed officer in their state",
    ],
    outcome: [
      "Borrowers know their numbers before the first call",
      "State-level routing keeps every lead with a licensed officer",
      "Live today, funding loans across 11 states",
    ],
    services: ["Website Design", "Mortgage Technology", "Content"],
  },
  {
    slug: "the-tab-team",
    client: "The Tab Team",
    discipline: "Real Estate",
    year: "2025",
    image: "/img/work/client-tab-team.jpg",
    live: "https://thetabteam.org",
    summary:
      "A Maryland and DC realty team positioned around equity strategy: home-worth tooling, buyer and seller journeys, and 1,200+ Google reviews doing the talking.",
    challenge:
      "A team with 25 years in the business and hundreds of five-star reviews was presenting like everybody else. The site needed a position - equity strategists, not just another agent - and the proof to back it.",
    approach: [
      "Positioning as MD and DC equity strategists across every page",
      "Home-worth and consultation flows as the primary calls to action",
      "Google and Yelp review volume surfaced directly on the page",
      "Selling, buying, refinance and short-sale services clearly mapped",
    ],
    outcome: [
      "The team reads as strategists, not order-takers",
      "Social proof sells before the first call",
      "Live today, booking consultations across MD and DC",
    ],
    services: ["Website Design", "SEO", "Content"],
  },
  {
    slug: "trueterra-oils",
    client: "TrueTerra Oils",
    discipline: "E-commerce",
    year: "2025",
    image: "/img/work/client-trueterra.jpg",
    live: "https://trueterraoils.com",
    summary:
      "A doTERRA wellness storefront organised by goal - sleep, stress, immunity - with guided routines and a 24/7 AI guide instead of a wall of products.",
    challenge:
      "New-to-oils shoppers do not buy product names, they buy outcomes. The store had to turn a huge catalogue into simple, safe routines a first-time buyer could actually follow.",
    approach: [
      "Shop-by-wellness-goal architecture over product-first categories",
      "Routine bundles with safety cheatsheets for kids, pets and sensitive skin",
      "A 24/7 AI guide trained on official education",
      "Trust layer: official pricing, secure checkout, 30-day guarantee",
    ],
    outcome: [
      "First-time buyers land on a routine, not a guess",
      "The catalogue reads as guidance instead of noise",
      "Live store, shipping across the United States",
    ],
    services: ["E-commerce", "Website Design", "Content"],
  },
  {
    slug: "jason-samuels-smith",
    client: "Jason Samuels Smith",
    discipline: "Brand & Store",
    year: "2024",
    image: "/img/work/client-jsamsmith.jpg",
    live: "https://www.jsamsmith.com",
    summary:
      "A personal-brand home for an Emmy-winning tap dancer: bio, events, speaking, a tap-shoe store and booking - one stage for the artist and the business.",
    challenge:
      "An artist with a global profile needed one home for many audiences - fans, students, event bookers, shoppers - without the site reading as a brochure or as a store with extras.",
    approach: [
      "Stage-first homepage that leads with the artist",
      "Store, events, speaking and booking as first-class journeys",
      "Press-ready bio and partnership sections",
      "A design as confident as the footwork",
    ],
    outcome: [
      "One address for every audience",
      "Bookers and shoppers convert from the same stage",
      "Live today, serving fans worldwide",
    ],
    services: ["Brand Identity", "Website Design", "E-commerce"],
  },
  {
    slug: "top-trading-discounts",
    client: "Top Trading Discounts",
    discipline: "Content & Community",
    year: "2025",
    image: "/img/work/client-top-trading.jpg",
    live: "https://toptradingdiscounts.com",
    summary:
      "A community-ranked deals hub for prop-firm traders: compare offers, vote them up or down, and subscribe for the best discount codes first.",
    challenge:
      "Prop-firm discount codes live scattered across affiliate pages. The play was one trusted place where community votes decide which firms rise to the top.",
    approach: [
      "Ranked deals index with community up-and-down voting",
      "Trustpilot scores and review links beside every offer",
      "Newsletter capture for exclusive offers",
      "An advertising pipeline for prop firms that want the spotlight",
    ],
    outcome: [
      "Traders compare ten firms in one scroll",
      "The voting loop keeps the ranking honest",
      "Live today, growing a trader community",
    ],
    services: ["Website Design", "Content", "Social Media"],
  },
];

/** Verified public numbers from the studio's own team history. */
export type Proof =
  | { kind: "static"; display: string; label: string }
  | { kind: "count"; to: number; prefix?: string; suffix?: string; label: string };

export const PROOF: Proof[] = [
  { kind: "static", display: "2016", label: "Working since" },
  { kind: "count", to: 15, suffix: "+", label: "Websites redesigned" },
  { kind: "count", to: 30, prefix: "+", suffix: "%", label: "Average lift in site engagement" },
  { kind: "count", to: 20, prefix: "+", suffix: "%", label: "Average lift in organic search traffic" },
];

export const MARQUEE_ITEMS = [
  "Mortgage & Real Estate",
  "Mortgage Technology",
  "E-commerce",
  "AI Video",
  "Websites",
  "Branding",
  "Email Marketing",
  "Automation",
  "SEO",
];

export const STEPS = [
  {
    name: "Listen",
    body: "We ask what you sell, who buys it, and what has already failed - and we get back to you as fast as we can. Most of our clients are in the US, but we work with teams anywhere in the world, as long as they are willing to work with us.",
  },
  {
    name: "Shape",
    body: "Positioning, moodboards and a flat quote. No hourly billing surprises, no scope that grows on its own.",
  },
  {
    name: "Build",
    body: "Design and development in the open. You see work in progress every Friday, not a reveal at the end.",
  },
  {
    name: "Launch",
    body: "We deploy, connect your analytics, and train your team so the thing does not die the week we leave.",
  },
  {
    name: "Measure",
    body: "Ninety days of reporting on what moved. If a channel is not earning its spend, we say so and reallocate it.",
  },
];

export const VALUES = [
  {
    title: "Experienced team",
    body: "The people who pitch your project are the people who build it. No handoff to a junior team after the contract is signed.",
  },
  {
    title: "Tailored strategies",
    body: "A mortgage desk in Texas and a skincare store in California do not need the same plan. We write one for you rather than reselling a template.",
  },
  {
    title: "Results-driven",
    body: "We report on enquiries, calls and sales, not impressions. If the number you care about did not move, the work is not finished.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Our pre-approval starts tripled in a quarter. They are the first agency that showed us numbers instead of screenshots.",
    name: "Marcus Whitfield",
    role: "Mortgage broker, Dallas",
  },
  {
    quote:
      "They run our launches from Lagos and we forget the distance. The store finally feels like the brand we meant to build.",
    name: "Allyson Reed",
    role: "E-commerce founder, Seattle",
  },
];

/** Evaluated once at module load so prerender never touches the current time. */
export const CURRENT_YEAR = new Date().getFullYear();

export type CatalogCategory = {
  id: string;
  title: string;
  line: string;
  items: string[];
};

/** The full public catalogue. All nine are offered today. */
export const CATALOG: CatalogCategory[] = [
  {
    id: "ai-video",
    title: "AI Video & Multimedia",
    line: "Ads, explainers and channel content produced with AI pipelines.",
    items: [
      "AI-generated ads and promo videos",
      "Faceless YouTube videos",
      "AI avatar and spokesperson videos",
      "Product videos, explainers and storytelling",
      "Reels, Shorts and TikTok edits",
      "Captions, voiceover and localization",
    ],
  },
  {
    id: "web",
    title: "Website Design & Development",
    line: "WordPress, Shopify and WooCommerce builds that load fast and sell.",
    items: [
      "WordPress design and development",
      "Shopify stores and theme development",
      "WooCommerce and e-commerce websites",
      "Landing pages and sales funnels",
      "Cloning, migration and redesign",
      "Maintenance, speed and security",
    ],
  },
  {
    id: "branding",
    title: "Graphic Design & Branding",
    line: "Identity systems and the everyday assets a brand runs on.",
    items: [
      "Logo and visual identity design",
      "Brand guidelines and digital assets",
      "Social media graphics and ad creative",
      "Flyers, brochures and business documents",
      "Pitch decks and presentation design",
      "Product mockups and AI-generated imagery",
    ],
  },
  {
    id: "marketing",
    title: "Digital & Email Marketing",
    line: "SEO, email systems and paid support that report in plain numbers.",
    items: [
      "Search engine optimization",
      "Email campaigns and newsletter design",
      "Automated welcome and follow-up sequences",
      "Lead nurturing and re-engagement",
      "Social media content and management",
      "Paid advertising and conversion optimization",
      "Deliverability: SPF, DKIM and DMARC setup",
    ],
  },
  {
    id: "dev",
    title: "Custom Development",
    line: "Web applications, portals and SaaS builds on solid backends.",
    items: [
      "Custom websites and web applications",
      "SaaS platforms and subscription software",
      "Dashboards and admin panels",
      "Client portals and business platforms",
      "Booking, payment, membership and marketplace systems",
      "API development and third-party integrations",
    ],
  },
  {
    id: "ai",
    title: "AI Solutions & Automation",
    line: "Chatbots, workflows and AI wired into the tools you already use.",
    items: [
      "AI chatbots and virtual assistants",
      "AI-powered business applications",
      "Automated workflows and notifications",
      "Lead capture and automated follow-ups",
      "Document and data processing workflows",
      "AI-assisted content production",
    ],
  },
  {
    id: "systems",
    title: "Business Systems & Infrastructure",
    line: "The operational backbone: CRM, onboarding, invoicing, hosting.",
    items: [
      "Business management systems",
      "Client onboarding and portals",
      "CRM setup and sales pipeline management",
      "Project, task and permission management",
      "Invoicing and payment tracking",
      "Hosting, deployment and support",
    ],
  },
  {
    id: "content",
    title: "Content & Creator Services",
    line: "Copy, scripts and channel ops for brands that publish.",
    items: [
      "Website copywriting and blog content",
      "Video scripts and content research",
      "YouTube channel setup and optimization",
      "Thumbnail design",
      "Podcast editing and repurposing",
      "Long-form to short-form conversion",
    ],
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    line: "Audits, architecture and integrations for systems that must not fail.",
    items: [
      "Technical audits and system reviews",
      "Architecture and implementation planning",
      "API and webhook integration",
      "Third-party platform integrations",
      "Performance, reliability and security reviews",
      "Documentation and implementation support",
    ],
  },
];

export const MORTGAGE_AREAS = [
  {
    title: "Custom mortgage software",
    body: "Mortgage operating systems with a React interface, Express APIs and PostgreSQL data models: loan records, applications, role-based access and workflow logic.",
  },
  {
    title: "Loan pipeline & workflow management",
    body: "Pipeline views, stage transitions, officer assignments, processing and approval workflows, activity tracking and operational handoffs.",
  },
  {
    title: "Mortgage CRM & lead management",
    body: "Contact and lead records, stages and ownership, tasks and reminders, loan-to-contact linking, follow-up workflows and referral support.",
  },
  {
    title: "Digital mortgage applications",
    body: "Borrower-facing application flows with status tracking, income, asset, liability and property data structures, and URLA / MISMO 3.4 XML generation and export.",
  },
  {
    title: "Platform integrations",
    body: "ARIVE-related integration development, webhook data exchange, Zapier pathways, MISMO export tooling, status mapping and delivery verification.",
  },
  {
    title: "Communication & follow-up systems",
    body: "Drip-campaign and broadcast workers, loan milestone follow-up logic, contact activity tracking and notification integrations.",
  },
  {
    title: "System audits & technical improvement",
    body: "Codebase and architecture reviews, API and webhook audits, duplicate-record analysis, access-control reviews and remediation planning.",
  },
];

export const ARIVE_CLUSTERS = [
  {
    name: "Pipeline & automation",
    items: ["Loan stages", "Automation rules", "Client needs rules", "Point of sale review"],
  },
  {
    name: "Borrower journey",
    items: ["Credit & underwriting flow", "Fees & disclosure handoffs", "Email & SMS milestones"],
  },
  {
    name: "Integrations & data",
    items: ["CRM stage mapping", "MISMO / URLA export", "Webhooks & Zapier paths"],
  },
  {
    name: "Operations & reporting",
    items: ["Payroll & commission handoff", "Closing & funding map", "EPO tracking", "Pipeline scorecards"],
  },
  {
    name: "People & AI",
    items: ["Role-based training", "AI with human verification"],
  },
];

/** Delivered mortgage work we claim publicly. */
export const MORTGAGE_RECORD = [
  "HCMG Command, a custom mortgage operating system",
  "ARIVE integration pathways and workflow audit",
  "Mortgage business websites and landing pages",
  "Mortgage CRM and email campaign programmes",
];

/** Clients whose live sites we can point at. Logo marks render monochrome. */
export type Client = {
  name: string;
  href: string;
  logo?: string;
  logoW?: number;
  logoH?: number;
  internal?: boolean;
};

export const CLIENTS: Client[] = [
  { name: "InstaFi Home Loans", href: "https://instafiloans.com", logo: "/img/clients/instafi.png", logoW: 2000, logoH: 1326 },
  { name: "Excel Realty & Mortgage", href: "https://teamerm.com", logo: "/img/clients/teamerm.png", logoW: 450, logoH: 322 },
  { name: "Harris Capital Mortgage Group", href: "https://hcmgloans.com", logo: "/img/clients/hcmg-light.svg", logoW: 800, logoH: 380 },
  { name: "The Tab Team", href: "https://thetabteam.org" },
  { name: "TrueTerra Oils", href: "https://trueterraoils.com", logo: "/img/clients/trueterra.png", logoW: 857, logoH: 291 },
  { name: "Jason Samuels Smith", href: "https://www.jsamsmith.com", logo: "/img/clients/jss.png", logoW: 296, logoH: 315 },
  { name: "Top Trading Discounts", href: "https://toptradingdiscounts.com" },
  { name: "HCMG Command", href: "/work/hcmg-command", internal: true },
];

import type { Post } from "./blog";

// Batch 1 of the November 2026 expansion (posts 5-9). Same answer-first
// shape as the base posts: direct answer, depth, FAQ for AI citation.

export const POSTS_EXTRA_1: Post[] = [
  {
    slug: "what-is-aeo-how-to-get-cited-by-ai-assistants",
    title: "What is AEO? How to get your business cited by AI assistants",
    answers: "what is aeo and how do i get my business cited by ai assistants",
    description:
      "AEO explained plainly: why ChatGPT, Gemini and Perplexity cite some businesses and ignore others, and the four things that make your site citable.",
    date: "2026-11-13",
    keywords: [
      "what is aeo",
      "answer engine optimization",
      "get cited by chatgpt",
      "ai search visibility small business",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: AEO (answer engine optimization) is the practice of structuring your website so AI assistants like ChatGPT, Gemini and Perplexity can quote it. Four things make a site citable: a direct answer to a real question in the first sentences of the page, clean factual structure (headings, lists, FAQ schema), a sitemap and robots.txt that let crawlers in, and specific proof (numbers, dates, named examples) the assistant can repeat with confidence.",
      },
      { t: "h", text: "Why AI engines cite what they cite" },
      {
        t: "p",
        text: "Assistants answer from pages they can read and trust. They favor content that states the answer immediately (not a 300-word wind-up), matches the exact question people ask, carries structured data (FAQPage, Article, LocalBusiness schema), and shows freshness. A page that buries its answer under a story gets skipped for one that opens with it. This is not a trick: the same clarity that wins AI citations is what converts human visitors.",
      },
      { t: "h", text: "The four fixes, in order" },
      {
        t: "ol",
        items: [
          "Open every important page with the direct answer in two or three sentences. If someone only read the first paragraph, they should already be served.",
          "Mark up your pages with schema: Article and FAQPage for guides, LocalBusiness with matching details for your business page. Schema is code that tells machines what the page is, without guessing.",
          "Keep a sitemap.xml and robots.txt and submit the sitemap in Google Search Console. AI crawlers largely follow the same roads Google drives.",
          "Publish specific, checkable facts: real prices or ranges, real timelines, real case studies with numbers. Vague marketing is uncitable; specifics get quoted.",
        ],
      },
      {
        t: "p",
        text: "Then give it time and measure it: your analytics referrers will start showing chatgpt.com, perplexity.ai and gemini.google.com once assistants begin citing you. That is the feedback loop. Two answers-first posts a month beats one brochure rewrite a year.",
      },
      {
        t: "cta",
        text: "This blog is built to that exact standard, and we build client sites the same way: answer-first pages, full schema, sitemap hygiene and first-party analytics that show you when AI engines start sending visitors. Ask us to AEO-proof your site in one working day.",
      },
    ],
    faq: [
      {
        q: "What does AEO stand for?",
        a: "Answer Engine Optimization: structuring your website so AI assistants (ChatGPT, Gemini, Perplexity and similar) can read, trust and quote it when people ask questions in your field.",
      },
      {
        q: "Is AEO replacing SEO?",
        a: "No, it extends it. Search engines and AI crawlers reward largely the same things: clear answers, real substance, crawlable structure and fresh content. Do both once: write pages that answer questions plainly and mark them up properly.",
      },
      {
        q: "How long before AI assistants cite my site?",
        a: "Crawling and citation take weeks to a few months, and volume matters: a handful of answer-first pages with schema, published consistently, is what gets a site into the rotation. Watch your analytics referrers for chatgpt.com and perplexity.ai as the signal.",
      },
    ],
  },
  {
    slug: "loan-officer-website-checklist",
    title: "Website checklist for loan officers (personal brand under a brokerage)",
    answers: "what does a loan officer need on their personal website",
    description:
      "The 8 things a loan officer's personal site needs when you work under a brokerage: bio with NMLS number, rate clarity, application start, reviews, and the compliance lines that keep you safe.",
    date: "2026-11-13",
    keywords: [
      "loan officer website",
      "loan officer personal website checklist",
      "mortgage loan officer bio page",
      "NMLS number website",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a loan officer's personal site needs eight things: a homepage that says who you lend to in one screen, a bio page with your NMLS number and a real photo, one page per loan product you actually write, a payment calculator, a reviews section with names, a fast application start (zip code and goal before life history), your brokerage's compliance lines near every rate, and a contact page that promises a specific reply time. Borrowers search your name; this site is what they find.",
      },
      { t: "h", text: "The eight, in priority order" },
      {
        t: "ol",
        items: [
          "Homepage. One screen: who you serve (first-time buyers, VA, jumbo), your market, and one button that starts the application. No wall of slogans.",
          "Bio page with your NMLS number. Borrowers search your name before they trust you with six figures. A real photo, your story in three paragraphs, your number, and a direct apply link convert those searches.",
          "Product pages. One per product you write (FHA, VA, conventional, jumbo, refinance). Each answers who qualifies, what the limits are, what step one is.",
          "Calculator. Show the monthly payment with tax and insurance included, and label it an estimate. It is the highest-engagement page on every lender site we have measured.",
          "Reviews with names. Three real client quotes with full names beat thirty anonymous stars. Ask recent closings directly and rotate new ones in.",
          "Fast application start. Ask zip code and goal first. Every extra field before the promise costs completions.",
          "Compliance, placed properly. Equal Housing Lender marking, your brokerage's license details, and rate disclaimers near rates and forms, not only in the footer. Your compliance officer will thank you.",
          "Contact with a promise. Phone, form, hours in the client's timezone, and a stated reply time (for example, within one working day).",
        ],
      },
      {
        t: "p",
        text: "Brokerage rule of thumb: your personal site markets you; it does not take applications away from your brokerage's system unless they agree. Link your apply button to the approved flow and keep licensing details exactly as your brokerage publishes them.",
      },
      {
        t: "cta",
        text: "AceVolumes built Harris Capital Mortgage Group's site, and we build loan officer personal sites on the same structure: bio pages that capture name searches, calculators that show PITI honestly, compliance placed where regulators look. See the case study or ask for your checklist mapped in one day.",
      },
    ],
    faq: [
      {
        q: "Do loan officers really need their own website if the brokerage has one?",
        a: "Yes. Borrowers search the officer's name before committing. A personal site captures those searches, builds personal trust, and keeps working when you change brokerages. The brokerage site markets the company; yours markets you.",
      },
      {
        q: "Where does my NMLS number go?",
        a: "On your bio page next to your photo and on every page footer, matching how your brokerage displays its company license. Regulators and careful borrowers both look for it in the same places.",
      },
      {
        q: "Can I show rates on a personal loan officer site?",
        a: "You can show rates with proper disclaimers (what changes them, APR explanation, estimates) placed near the numbers. Never publish a rate you cannot stand behind the same day; a rates explainer beats a stale rate table.",
      },
    ],
  },
  {
    slug: "landing-page-vs-website-small-business",
    title: "Landing page vs website: which does a small business need first?",
    answers: "landing page vs website which does a small business need first",
    description:
      "A landing page sells one thing; a website is your business's home. Which to build first depends on how you get customers. The honest breakdown with costs and timelines.",
    date: "2026-11-13",
    keywords: [
      "landing page vs website",
      "small business first website",
      "one page website enough",
      "landing page cost",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: if you drive traffic on purpose (ads, a launch, one specific offer), build the landing page first. If customers find you by searching or asking around, build the small website first, because search and referrals land on the page that explains your whole business, not one offer. Most service businesses should start with a tight 4 or 5 page site and add landing pages per campaign afterwards.",
      },
      { t: "h", text: "What each one is for" },
      {
        t: "ul",
        items: [
          "Landing page: one page, one offer, one action. No navigation to speak of. It exists to convert a specific click from a specific place (an ad, a QR code, a campaign post). Cheap and fast: days, not weeks.",
          "Small website: your permanent home. Homepage, services, about, contact, proof. It answers the questions people have about you over months and years, collects search traffic, and carries your reputation. Weeks to build properly.",
          "Full website with content: the small site plus guides and tools that earn search and AI citations over time. This is the compounding asset.",
        ],
      },
      { t: "h", text: "How to decide in one question" },
      {
        t: "p",
        text: "Ask: where will tomorrow's customer come from? If the honest answer is an ad or a campaign you control, the landing page earns its keep immediately. If the answer is Google, word of mouth, or your Instagram bio link, a real site serves you better, because those visitors arrive with different questions and one page cannot answer them all. The expensive mistake is building a landing page, then rebuilding a site a quarter later and paying twice for strategy, copy and design.",
      },
      {
        t: "p",
        text: "The middle path most businesses should take: a small, fast site (5 pages, sub-2-second loads, one action per page) plus one dedicated landing page for your current best offer. The site carries the brand; the page carries the campaign.",
      },
      {
        t: "cta",
        text: "AceVolumes builds both: tight 5-page sites that answer real questions, and campaign landing pages that convert one click. Tell us where tomorrow's customer comes from and we will price the right one, fixed number and date.",
      },
    ],
    faq: [
      {
        q: "Is a one-page website enough for a small business?",
        a: "For a single-offer business testing demand, yes. Once you serve more than one kind of customer or want search traffic, one page starts losing visitors whose questions do not fit the page. A 4 to 5 page site is the usual tipping point.",
      },
      {
        q: "How much does a landing page cost?",
        a: "A serious landing page (strategy, copy, design, build, speed) typically runs a few hundred to about two thousand dollars depending on depth. Anything cheaper is usually a template with your text pasted in, which converts accordingly.",
      },
      {
        q: "Can I add a landing page to my existing website?",
        a: "Yes, and you usually should: your best campaigns deserve a page with no navigation and one action, while your site carries the brand. Keep the page on your own domain so it builds your site's authority, not a rented one.",
      },
    ],
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    title: "How long does it take to build a small business website?",
    answers: "how long does it take to build a website",
    description:
      "Realistic 2026 timelines: template in days, freelance in 2 to 6 weeks, studio in 3 to 8 weeks, systems in months. What actually causes delays (it is rarely the coding).",
    date: "2026-11-14",
    keywords: [
      "how long to build a website",
      "website timeline small business",
      "how long does a website take",
      "website launch timeline",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a small business website takes 3 to 8 weeks with a studio, 2 to 6 weeks with a freelancer, and days on a template if you supply the copy yourself. The single biggest cause of delay is not the building; it is waiting on content: text, photos, logos, account access and approvals. Teams that get copy and assets in week one launch on schedule.",
      },
      { t: "h", text: "Where the weeks actually go" },
      {
        t: "ul",
        items: [
          "Strategy and copy (week 1): deciding what the site must say and to whom. If the copy is right, everything after is faster.",
          "Design (week 1 to 2): one review round beats five scattered ones. Consolidate feedback once, decisively.",
          "Build (week 2 to 4): the fastest part when scope is fixed. Speed targets, mobile, forms, analytics.",
          "Content loading and SEO plumbing (week 4 to 5): titles, descriptions, schema, sitemap, redirects.",
          "Review and launch (week 5 to 8): final checks on real phones, real emails, real payments, then go live.",
        ],
      },
      { t: "h", text: "How to make it faster, honestly" },
      {
        t: "ol",
        items: [
          "Bring your logo files, photos and one hour of answers before day one. Sites with assets ready launch weeks earlier.",
          "Nominate one decision-maker. Two decision-makers double the calendar.",
          "Approve in rounds, not drips. One consolidated round of feedback per stage.",
          "Fix scope before the build. Mid-build additions are the second-biggest delay after content.",
        ],
      },
      {
        t: "p",
        text: "Beware anyone promising a serious custom site in a week: the calendar gets shortchanged somewhere, usually speed, mobile or the copy. A realistic date you can hold beats an optimistic one you cannot.",
      },
      {
        t: "cta",
        text: "AceVolumes gives every project one number and one date before work starts, reports progress every Friday, and asks for your logo files, photos and one hour up front so the calendar holds. Start a project and get your date in writing.",
      },
    ],
    faq: [
      {
        q: "Why do website projects get delayed?",
        a: "Content and approvals, overwhelmingly. Waiting on copy, photos, account access and feedback rounds moves launch far more than any technical work. Prepare assets in week one and the schedule holds.",
      },
      {
        q: "Can a website be built in a week?",
        a: "A template page or a single landing page, yes. A full custom site with strategy, copy, speed engineering and SEO plumbing in one week is a red flag; something gets skipped, usually the things that make the site earn.",
      },
      {
        q: "How long does a redesign take?",
        a: "Less than a new build when content carries over: typically 2 to 5 weeks for a small business site. The unknowns (old accounts, broken redirects, legacy content) are what stretch redesigns, not the design itself.",
      },
    ],
  },
  {
    slug: "what-goes-above-the-fold-small-business-homepage",
    title: "What goes above the fold on a small business homepage",
    answers: "what should be at the top of my homepage",
    description:
      "The five elements every homepage's first screen needs: who you serve, what they get, one action, proof, and a reason to believe. With examples and the mistakes that cost customers.",
    date: "2026-11-14",
    keywords: [
      "above the fold homepage",
      "homepage first screen",
      "what to put on homepage",
      "small business homepage tips",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: the first screen of a small business homepage needs five things, all visible without scrolling: who you serve and where (a clear one-line statement), what the visitor gets (the outcome, not the process), one primary action (a single button), proof beside the action (a client name, a number, a review), and a reason to believe (your one honest differentiator). Anything else competes with these five and usually loses you the visitor.",
      },
      { t: "h", text: "The five, with examples" },
      {
        t: "ol",
        items: [
          "Who and where: 'Inventory financing for US auto dealers', not 'Welcome to our website'. A stranger must know they are in the right place within two seconds.",
          "The outcome: what changes for the customer after they buy. 'Approvals in 48 hours' beats 'innovative solutions' every time.",
          "One action: one button, repeated if the screen is wide. Two competing calls to action measure as zero.",
          "Proof beside the action: 'Trusted by 40+ dealerships' or a one-line client quote with a name. Proof next to the button converts; proof six scrolls down does not.",
          "One differentiator: the thing a competitor cannot honestly claim. Founder involvement, a reply-time promise, a guarantee. Pick one; three is noise.",
        ],
      },
      { t: "h", text: "What does not belong up there" },
      {
        t: "p",
        text: "A carousel of five rotating slogans (nobody waits for slide three), a stock photo of a handshake, a wall of badges, your company history, or an empty hero with just your logo. The first screen is not a greeting; it is a door with the important information taped to it. Every element you add dilutes the ones that were working.",
      },
      {
        t: "p",
        text: "Test it honestly: show your homepage's first screen to someone outside your business for five seconds, then ask who the site is for and what they would click. If they hesitate, the fix is subtraction, not more design.",
      },
      {
        t: "cta",
        text: "AceVolumes builds homepages around this five-element rule, engineered to sub-2-second loads so the first screen actually appears in two seconds. See the work, or send us your current homepage for a one-day review.",
      },
    ],
    faq: [
      {
        q: "What does above the fold mean on a website?",
        a: "The part of the page visible without scrolling, on a phone as well as a desktop. It is the only screen most visitors judge you on, which is why clarity there decides whether the rest of the page is ever seen.",
      },
      {
        q: "Should my logo be big at the top?",
        a: "The logo anchors the navigation; it is not the message. Visitors who do not know you do not care about the logo yet. Make the statement about them (who you serve and what they get) the biggest element.",
      },
      {
        q: "How many buttons should the first screen have?",
        a: "One primary action, visually dominant. A quiet secondary path (for example, see the work) is acceptable if it does not compete. If you cannot decide which button matters, your visitor cannot either.",
      },
    ],
  },
];

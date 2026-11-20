import type { Post } from "./blog";

// Batch 3 (posts 15-19): trust, operations, selling online.

export const POSTS_EXTRA_3: Post[] = [
  {
    slug: "what-makes-a-good-contact-page",
    title: "What makes a good contact page? 8 things that get more enquiries",
    answers: "what makes a good contact page",
    description:
      "The 8 elements of a contact page that actually produces enquiries: one form, honest expectations, zero friction, visible address and hours, and what happens next spelled out.",
    date: "2026-11-12",
    keywords: [
      "good contact page",
      "contact page best practices",
      "contact page design",
      "get more enquiries website",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: a good contact page has eight things: one form with as few fields as you can defend, visible expectations (reply time and what happens next), your real address and hours, a phone and email alternative, reassurance near the button (no sales calls, no spam), honest field labels, an error state that helps, and a thank-you step that sets the next move. Every field you add and every expectation you hide costs enquiries.",
      },
      { t: "h", text: "The eight, in order" },
      {
        t: "ol",
        items: [
          "One form. Not three options, not a portal. The main action is obvious.",
          "Fewest defensible fields: name, email, what you need, one optional budget. A paragraph beats a questionnaire; you can ask sharp questions in your reply.",
          "Expectations above the fold: 'We reply within one working day with a plan and a fixed price.' A stated reply time converts fence-sitters.",
          "Address and hours. Real location builds real trust, and hours stop the 'are you open' emails.",
          "Alternatives: phone and direct email, visibly linked. Some buyers will never fill a form.",
          "Reassurance next to the button: no newsletter, no cold calls, no sharing of details. Say it in one line.",
          "Helpful errors: red text under the field that says how to fix it, not a red banner at the top that says nothing.",
          "A thank-you page that continues the journey: what happens now, plus two links (your work, your guides). It also gives analytics a clean conversion count.",
        ],
      },
      { t: "h", text: "The mistakes that quietly cost money" },
      {
        t: "p",
        text: "A CAPTCHA that fights humans, a form that emails to an address nobody checks, a map but no address text, a 'we'll get back to you soon' with no timeframe, and fields nobody needs (fax, title, second phone). Then the silent killer: a broken form discovered months later. Test your own form monthly by submitting it yourself, and route every submission somewhere that is monitored.",
      },
      {
        t: "cta",
        text: "AceVolumes contact pages promise a plan, a fixed price and a date, and every enquiry lands in a monitored inbox and the CRM automatically, never in a dead folder. See the contact page on this very site, or ask us to rebuild yours.",
      },
    ],
    faq: [
      {
        q: "How many fields should a contact form have?",
        a: "As few as you can defend: name, email, and the message essentials. Two to five fields total. Every additional field trades completions for convenience on your side, and the convenience is rarely worth it.",
      },
      {
        q: "Should I put a phone number on the contact page?",
        a: "Yes, if you can actually answer it. A phone number with stated hours builds trust even for people who prefer email. If nobody answers calls, give email and form as the paths and say when you reply.",
      },
      {
        q: "Do I need a separate thank-you page?",
        a: "It is strongly worth it: it confirms the send actually worked, sets expectations for what happens next, and gives analytics an exact conversion count. A inline 'thanks' message cannot do any of those cleanly.",
      },
    ],
  },
  {
    slug: "website-security-basics-small-business",
    title: "Website security basics every small business should tick",
    answers: "small business website security basics",
    description:
      "The 7 security basics that stop most small-business website disasters: HTTPS, updates, backups, least privilege, monitored forms, tested recovery, and no shared passwords in chat.",
    date: "2026-11-13",
    keywords: [
      "website security basics",
      "small business website security",
      "https website",
      "website hacked prevention",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: seven basics stop the overwhelming majority of small-business website disasters: HTTPS everywhere, everything updated, automatic off-site backups, one account per person with least privilege, monitored forms and logins, a recovery you have actually tested, and no passwords shared in chat groups. Small sites are attacked constantly and automatically; the bots do not check your revenue first.",
      },
      { t: "h", text: "The seven, with why they matter" },
      {
        t: "ol",
        items: [
          "HTTPS (the padlock). Non-negotiable: it is free, it is a trust signal, and browsers now shame sites without it.",
          "Updates on a schedule. Outdated platforms and plugins are the number one entry point. Patch monthly, test before shipping.",
          "Backups off-site, automatic, and tested. Restore one quarterly. A backup you have never restored is a wish.",
          "One account per human, least privilege. No shared logins, contractors get exactly the access their task needs and it gets revoked after.",
          "Monitored forms and logins. A contact form that silently dies or a login page nobody watches is both a security and a revenue hole.",
          "Tested recovery. Know, in advance, who rehosts, who restores, and how long it takes. Write it on one page.",
          "Password discipline. A password manager for the team, and never credentials pasted into WhatsApp. Rotate anything that ever left a chat.",
        ],
      },
      {
        t: "p",
        text: "Two more that cost nothing: keep your domain renewal on auto-pay with a current card (expired domains get scraped within hours), and keep software you do not need off the site entirely (dead plugins, unused themes, leftover test files are all doors).",
      },
      {
        t: "p",
        text: "If a breach happens: restore from the tested backup, rotate every credential, patch the entry point, and tell affected users honestly. The businesses that recover fastest are the ones that rehearsed.",
      },
      {
        t: "cta",
        text: "AceVolumes builds lean sites with few doors to begin with: zero third-party scripts, static-first architecture, monitored forms, and a Care Plan that patches and backs up on schedule. Ask us to audit your current site in one day.",
      },
    ],
    faq: [
      {
        q: "Why would hackers target my small website?",
        a: "They mostly do not target you specifically: automated bots attack every site constantly, harvesting forms, guessing logins and exploiting old plugins. Size does not protect you; hygiene does.",
      },
      {
        q: "Is HTTPS enough to be safe?",
        a: "No. HTTPS encrypts traffic in transit; it does nothing about outdated software, weak passwords or missing backups. It is the first basic, not the whole list.",
      },
      {
        q: "How often should a website be backed up?",
        a: "Whenever content changes materially, at minimum weekly for an active site, and always immediately before any update or change. Store backups off the server and test-restore quarterly.",
      },
    ],
  },
  {
    slug: "do-you-need-a-logo-before-a-website",
    title: "Do you need a logo and brand identity before you build a website?",
    answers: "do i need a logo before building a website",
    description:
      "You need a name, a color and a clear promise; a full brand identity can come with the site or after it. What to prepare before a build, what it costs, and what can wait.",
    date: "2026-11-14",
    keywords: [
      "logo before website",
      "brand identity for website",
      "do i need a logo first",
      "branding before website build",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: you do not need a full brand identity before a website, but you do need three things settled: the business name, one primary color, and a clear one-line promise of who you serve. A simple wordmark and those decisions are enough to start; a complete logo suite, brand fonts and photography can be built alongside the site, which is usually cheaper and more coherent than doing branding in a vacuum first.",
      },
      { t: "h", text: "What to actually prepare before a build" },
      {
        t: "ul",
        items: [
          "The name, decided and available as a domain and social handles.",
          "One primary color and one accent, chosen for contrast (we will sanity-check accessibility).",
          "Your promise in one line: who you serve, what they get, where.",
          "Whatever real photos exist of you, your team, your work. Phone photos of real work beat stock handshakes.",
          "Logo files if they exist (SVG or high-res PNG). If they do not, a clean wordmark carries the site until identity work is done.",
        ],
      },
      { t: "h", text: "What can wait until after launch" },
      {
        t: "p",
        text: "Full brand guidelines, illustration systems, packaging, merchandise and a bespoke icon set. Polishing identity before you have a single customer is a classic small-business delay: the market gives you better information in the first month live than three months of navel-gazing. Launch with the three essentials, learn from real visitors, then invest in identity where the evidence points.",
      },
      {
        t: "p",
        text: "One caveat: do not launch with three different logos, five fonts and clashing colors across pages. Consistency is what brand means at this stage, not complexity. Pick simple choices and repeat them everywhere.",
      },
      {
        t: "cta",
        text: "AceVolumes ships brand-consistent sites from a name, a color and a promise, and builds the identity as the business earns it. Bring your logo files, photos and one hour; we handle the rest. Start a project.",
      },
    ],
    faq: [
      {
        q: "Can I build a website with just a wordmark?",
        a: "Yes, and plenty of strong brands launched that way. A well-set business name in a good typeface, one color and consistent spacing reads as deliberate design. Upgrade to full identity when the business justifies it.",
      },
      {
        q: "How much does a logo and brand identity cost?",
        a: "A simple professional wordmark runs a few hundred dollars; full identity systems (logo suite, fonts, guidelines, collateral) run into the thousands. Sequence it: essentials first, depth after revenue.",
      },
      {
        q: "Should the web designer do the logo?",
        a: "Often yes for small businesses: whoever designs the site knows exactly what the brand needs on screen. Make sure you still receive the source files and full usage rights when it is done.",
      },
    ],
  },
  {
    slug: "what-is-seo-plain-english",
    title: "What is SEO, in plain English (and what actually moves rankings)",
    answers: "what is seo in simple terms",
    description:
      "SEO explained without jargon: what search engines actually reward, the five levers that move rankings, how long it takes, and what is a waste of money in 2026.",
    date: "2026-11-12",
    keywords: [
      "what is seo",
      "seo explained simply",
      "how to rank on google",
      "seo for small business",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: SEO (search engine optimization) is making your website the best, clearest answer to the questions your customers type into Google, in a form Google's machines can read. What actually moves rankings: pages that answer real questions directly, technical basics done right (fast, mobile-friendly, crawlable, described with titles and schema), proof and depth that beat thin competitor pages, and mentions from other real websites. What is mostly wasted money: keyword stuffing, buying links, and magic guarantees.",
      },
      { t: "h", text: "The five levers, ranked" },
      {
        t: "ol",
        items: [
          "Answer-first content aimed at real queries. Every page should answer one question a customer actually asks, opening with the answer. This also earns AI citations now.",
          "Speed and mobile experience. Sub-2-second loads on a phone. Slow sites lose rankings and customers at once.",
          "Titles, descriptions and schema. The plumbing that tells machines what each page is about, accurately.",
          "Local signals if you are local: Google Business Profile complete and matching, consistent name-address-phone, reviews.",
          "Real mentions: chambers, suppliers, press, directories that exist for humans. A few genuine ones beat a thousand purchased ones.",
        ],
      },
      { t: "h", text: "How long it takes, honestly" },
      {
        t: "p",
        text: "Local visibility from profile work: two to four weeks. Organic rankings for specific, local phrases: three to six months of consistent publishing. Competitive national terms: longer than most businesses want to hear. Anyone promising page one in a week is selling something other than SEO. The compounding part is real, though: two good pages a month becomes a moat nobody can copy quickly.",
      },
      {
        t: "p",
        text: "Measure what matters: Search Console for what you rank for and what gets clicks, your own analytics for which pages produce enquiries. Rankings are a means; enquiries are the point.",
      },
      {
        t: "cta",
        text: "AceVolumes builds SEO into the bones: answer-first pages, sub-2-second loads, schema, sitemaps and honest monthly publishing plans. See our blog for the method, or ask us to map your site's gaps in one day.",
      },
    ],
    faq: [
      {
        q: "Do I need to hire an SEO agency?",
        a: "Not for a small site. The fundamentals (answers to real questions, speed, titles and schema, profile and reviews) are free and learnable. Agencies earn their fee at content scale or in brutally competitive markets; judge them by named humans and specific work, not reports.",
      },
      {
        q: "Are keywords still a thing?",
        a: "Yes, differently: you match the exact phrasing your customers use, one question per page, rather than sprinkling a word fifty times. Write for the person asking, structure for the machine reading.",
      },
      {
        q: "How many blog posts do I need to rank?",
        a: "There is no magic number. A dozen genuinely useful, answer-first posts targeting real questions beats a hundred filler posts. Consistency over two to six months is what search engines and AI assistants both reward.",
      },
    ],
  },
  {
    slug: "how-to-write-website-copy-that-converts",
    title: "How to write website copy that converts (a framework you can copy)",
    answers: "how to write website copy that converts",
    description:
      "The copy framework behind sites that turn visitors into enquiries: one question per page, the customer's words, proof beside promises, and verbs that start with a verb. With before and after examples.",
    date: "2026-11-14",
    keywords: [
      "website copy that converts",
      "how to write website copy",
      "homepage copy framework",
      "website copywriting tips",
    ],
    blocks: [
      {
        t: "p",
        text: "Direct answer: converting copy answers four questions in the visitor's order: What is this? Is it for me? Can I trust them? What do I do now? Write each page around one question the customer actually asks, use their words (not your industry's), put proof beside every promise, and end every section with a verb that starts with a verb: see the work, book a slot, start the application. Clarity converts; cleverness decorates.",
      },
      { t: "h", text: "The framework, applied" },
      {
        t: "ol",
        items: [
          "One page, one question. A page trying to answer everything answers nothing. Decide the question (how much does X cost, can you do X for my industry) and answer it completely.",
          "Open with the answer. First two sentences carry the payload. Wind-ups ('In today's fast-paced world...') are where visitors leave.",
          "Use the customer's words. Mine your emails, reviews and DMs for phrasing and mirror it. 'Stop losing customers in two seconds' beats 'optimize conversion funnels'.",
          "Proof beside every promise. A number, a name, a date, a screenshot, next to the claim it supports. A promise alone is an opinion.",
          "One action per page, phrased as a verb the visitor performs. 'See the work' and 'Get your fixed price' outperform generic 'Submit'.",
        ],
      },
      { t: "h", text: "Before and after" },
      {
        t: "p",
        text: "Before: 'We provide innovative digital solutions that empower businesses to leverage synergies.' After: 'We build fast websites for small businesses in Lagos that turn visitors into enquiries. 100+ built since 2016, replies within one working day.' Same words count, radically different conversion. The second version names who it is for, what happens, and why it is believable.",
      },
      {
        t: "p",
        text: "Then let real visitors edit: your analytics and your reply emails tell you which words customers actually use and which questions they actually ask. Copy is never finished; it is your best current answer, updated as you learn.",
      },
      {
        t: "cta",
        text: "AceVolumes writes copy with this framework on every build: one question per page, customer words, proof beside promises. See the work, or hand us your draft for a one-day copy pass.",
      },
    ],
    faq: [
      {
        q: "How long should website copy be?",
        a: "As long as the question deserves and no longer. A service page might need 300 words; a pricing page 600; a guide 1,000. Length follows the question, and the first two sentences must always carry the answer.",
      },
      {
        q: "Should I write the copy myself or hire a copywriter?",
        a: "You know the customer's words best; a copywriter knows structure. A strong middle path: you dump everything you know about customers in one hour, a professional shapes it into pages. Most of our builds work exactly this way.",
      },
      {
        q: "What makes a call to action good?",
        a: "Specific, first-person-verby, and low-drama: what the visitor gets when they click. 'Get your fixed price' beats 'Contact us' because it promises an outcome, not a chore.",
      },
    ],
  },
];

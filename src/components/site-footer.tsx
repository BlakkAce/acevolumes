import Link from "next/link";
import Image from "next/image";
import { CURRENT_YEAR } from "@/lib/content";

const SERVICES = [
  { href: "/services#branding", label: "Graphic Design & Branding" },
  { href: "/services#web", label: "Websites & E-commerce" },
  { href: "/services#marketing", label: "Digital & Email Marketing" },
  { href: "/services#ai-video", label: "AI Video & Multimedia" },
  { href: "/mortgage", label: "Mortgage Technology" },
];

const STUDIO = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About the studio" },
  { href: "/about#process", label: "How we work" },
  { href: "/founder", label: "Meet the founder" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t hairline bg-[var(--bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-b hairline py-12 md:flex-row md:items-center">
          <Image
            src="/brand/logo-gold.png"
            alt="AceVolumes"
            width={311}
            height={207}
            className="h-14 w-auto md:h-16"
          />
          <p className="max-w-[36ch] text-[15px] leading-relaxed muted">
            We pride ourselves on delivering the very best. From Lagos, for clients
            across the United States and the wider world — same promise, any timezone.
          </p>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-display text-[clamp(2rem,4.5vw,3.25rem)] tracking-[-0.04em]">
              Let us make some noise.
            </p>
            <a
              href="mailto:acevolumesofficial@gmail.com"
              className="mt-6 inline-block font-mono text-[13px] uppercase tracking-[0.09em] text-[var(--gold)] underline decoration-[var(--gold)]/40 underline-offset-[6px] transition-colors hover:decoration-[var(--gold)]"
            >
              acevolumesofficial@gmail.com
            </a>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed muted">
              Tell us what you sell and who you are trying to reach. We will reply
              with a plan, not a brochure.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Services">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-[15px] transition-colors hover:text-[var(--gold)]"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Studio">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
              Studio
            </h2>
            <ul className="mt-5 space-y-3">
              {STUDIO.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-[15px] transition-colors hover:text-[var(--gold)]"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] muted">
              Based in
            </h2>
            <address className="mt-5 space-y-1 text-[15px] not-italic leading-relaxed muted">
              <p>Lagos, Nigeria</p>
              <p>Clients across borders</p>
              <p>Mon to Fri, 9am to 6pm WAT</p>
            </address>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-[12px] uppercase tracking-[0.08em]">
              <a href="https://www.linkedin.com/company/acevolumes" target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-[var(--gold)]">LinkedIn</a>
              <a href="https://www.instagram.com/acevolumes/" target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-[var(--gold)]">Instagram</a>
              <a href="https://web.facebook.com/acevolumes" target="_blank" rel="noreferrer noopener" className="transition-colors hover:text-[var(--gold)]">Facebook</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t hairline py-7 text-[13px] muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {CURRENT_YEAR} AceVolumes. All rights reserved.</p>
          <p className="font-mono text-[12px] uppercase tracking-[0.09em]">
            Working since 2016
          </p>
        </div>
      </div>
    </footer>
  );
}

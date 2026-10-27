import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { PageTransition } from "@/components/page-transition";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

// Public marketing site chrome. The studio dashboard ([gate]) deliberately
// lives outside this group so it never renders the public navigation.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[4px] focus:px-4 focus:py-2"
        style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
      >
        Skip to content
      </a>
      <ScrollProgress />
      <SiteNav />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <AnalyticsBeacon />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acevolumes.com.ng"),
  title: {
    default: "AceVolumes - Volume that moves markets",
    template: "%s - AceVolumes",
  },
  description:
    "Lagos digital studio working since 2016 with clients across the United States. Brand identity, websites and social media for mortgage, real estate and e-commerce teams.",
  openGraph: {
    title: "AceVolumes",
    description:
      "Brand identity, website design and social media for mortgage, real estate and e-commerce brands. Lagos studio, US clients, working since 2016.",
    type: "website",
    locale: "en_NG",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#170a16" },
    { media: "(prefers-color-scheme: light)", color: "#fbf7ee" },
  ],
};

// Sets the theme before first paint so there is no flash.
const themeScript = `(function(){try{var s=localStorage.getItem('av-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${archivo.variable} ${hanken.variable} ${space.variable} grain antialiased`}
      >
        <ThemeProvider>
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
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

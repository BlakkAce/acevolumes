import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE } from "@/lib/seo";
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
  metadataBase: new URL(SITE),
  verification: {
    google: "5PsjQYlCMILsjXZ3uw9Q3k9WQ1E8tKNRUGrJk7n5aow",
  },
  title: {
    default: "AceVolumes - Volume that moves markets",
    template: "%s - AceVolumes",
  },
  description:
    "Lagos digital studio working since 2016 with clients worldwide — from the United States to Europe, Africa and beyond. Brand identity, websites and social media for mortgage, real estate and e-commerce teams.",
  openGraph: {
    title: "AceVolumes",
    description:
      "Brand identity, website design and social media for mortgage, real estate and e-commerce brands. Lagos studio, clients worldwide, working since 2016.",
    type: "website",
    locale: "en_NG",
    siteName: "AceVolumes",
  },
  twitter: {
    card: "summary_large_image",
    title: "AceVolumes — Volume that moves markets",
    description:
      "Brand identity, website design and social media for mortgage, real estate and e-commerce brands. Lagos studio, clients worldwide, working since 2016.",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

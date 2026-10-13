import type { Metadata } from "next";

// Applies to every studio route: never indexed, never linked.
// Deliberately absent from robots.txt (that file is public and would leak).
export const metadata: Metadata = {
  title: { absolute: "Log in" },
  robots: { index: false, follow: false, nocache: true },
};

export default function GateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

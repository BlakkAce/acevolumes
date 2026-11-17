import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you — AceVolumes",
  description: "Your enquiry reached AceVolumes. We reply within one working day, usually with a few sharp questions.",
  robots: { index: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-24 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[var(--gold)]">
        Received
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        Thank you. Your enquiry is in.
      </h1>
      <div className="mt-6 space-y-4 text-[16px] leading-relaxed">
        <p>
          It has been logged in our studio and delivered to
          acevolumesofficial@gmail.com. We reply within one working day,
          usually with a few sharp questions so we can price honestly.
        </p>
        <p>While you wait, two places worth your time:</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/work"
          className="rounded-full px-6 py-3 font-display text-[15px] transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          See the work
        </Link>
        <Link
          href="/blog"
          className="rounded-full border px-6 py-3 font-display text-[15px] hairline transition-opacity hover:opacity-80"
        >
          Read the guides
        </Link>
      </div>
    </div>
  );
}

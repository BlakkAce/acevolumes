import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AceVolumes",
  description:
    "How AceVolumes handles data: what the website collects, what we never do, and your rights. No cookies, no ad tracking, no data sales.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-16 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[var(--gold)]">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-[14px] muted">Last updated: 14 November 2026</p>

      <div className="mt-8 space-y-8 text-[16px] leading-relaxed">
        <section>
          <h2 className="font-display text-2xl">The short version</h2>
          <p className="mt-3">
            This website does not use cookies, does not run advertising trackers,
            and does not sell data. We count anonymous pageviews on our own
            servers, and the only information we keep is what you deliberately
            send us through the enquiry form.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong>Enquiry details.</strong> When you submit the contact form
              we receive your name, email, company, service and budget selection,
              and your brief. This is stored in our private studio database as a
              lead and delivered to acevolumesofficial@gmail.com.
            </li>
            <li>
              <strong>Anonymous pageview counts.</strong> Each visit records the
              page path, the referring site, and a rough location (country and
              city, derived from connection routing by our hosting layer). No
              cookie, no identifier, no cross-site tracking, and IP addresses
              are never stored. We cannot single you out and do not try.
            </li>
            <li>
              <strong>Nothing else.</strong> No advertising pixels, no session
              recording, no fingerprinting, no third-party analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">What we never do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Sell, rent or trade your information.</li>
            <li>Send marketing email you did not ask for.</li>
            <li>Use your project material in public without your written permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">Why we hold data</h2>
          <p className="mt-3">
            To reply to your enquiry and to deliver the work you hire us for.
            Enquiry records are kept while a project is active and for up to 24
            months afterwards, then deleted. Pageview counts are aggregate and
            expire with the analytics table.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Your rights</h2>
          <p className="mt-3">
            You can ask what we hold about you, ask for a copy, ask for
            corrections, or ask for deletion, at any time: write to
            acevolumesofficial@gmail.com and we action it within 30 days. If you
            are in the EEA or UK you may also complain to your local data
            protection authority.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Who we are</h2>
          <p className="mt-3">
            AceVolumes, Lagos, Nigeria. Working since 2016. Contact:
            acevolumesofficial@gmail.com. See also our{" "}
            <a className="underline" href="/terms">Terms</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

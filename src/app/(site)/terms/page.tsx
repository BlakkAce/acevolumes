import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AceVolumes",
  description:
    "The plain terms of working with AceVolumes: quotes, payment, intellectual property, timelines and liability. Written to be read, not to hide.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-16 md:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[var(--gold)]">
        Legal
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-[14px] muted">Last updated: 14 November 2026</p>

      <div className="mt-8 space-y-8 text-[16px] leading-relaxed">
        <section>
          <h2 className="font-display text-2xl">1. What these terms cover</h2>
          <p className="mt-3">
            These terms govern work delivered by AceVolumes ("we", "us") to you
            or your organisation ("you"): websites, e-commerce stores, landing
            pages, dashboards, CRM and automation systems, and related design
            and content services. A signed proposal or accepted quote takes
            precedence over anything here where the two differ.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">2. Quotes and payment</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Every project gets one written number and one delivery date before work starts.</li>
            <li>Payment runs in milestones: an initial deposit to book the slot, and the balance at agreed stages. The schedule is in your quote.</li>
            <li>Quotes are valid for 30 days. Work outside the agreed scope gets a fresh, written mini-quote before it starts. Nothing grows silently.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">3. Your responsibilities</h2>
          <p className="mt-3">
            You provide accurate business information, access to accounts we
            need (domain, hosting, social profiles), and feedback within the
            review windows we agree. Delays in content or approvals move the
            delivery date by the same amount of time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">4. Intellectual property</h2>
          <p className="mt-3">
            When the final milestone is paid, you own the deliverables we
            produced for you: designs, code written for your project, and copy
            we drafted. We keep the right to reuse our general techniques,
            internal tools and libraries, and to show the work in our portfolio
            unless you ask us in writing not to. Third-party licences (fonts,
            stock, services) follow their own terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">5. Timelines</h2>
          <p className="mt-3">
            We commit to dates in writing and report progress every Friday. If
            we miss a committed date for reasons on our side, we make it right
            before we take new work. Force majeure (outages of third-party
            platforms, payment failures, natural events) pauses the clock, not
            the commitment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">6. What we do not promise</h2>
          <p className="mt-3">
            We engineer for speed, clarity and conversion, but we do not
            guarantee specific revenue, rankings or lead volumes. Any figure
            from our case studies is an example of past work, not a promise of
            yours.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">7. Liability</h2>
          <p className="mt-3">
            Our total liability for any claim connected to a project is capped
            at the amount you paid us for that project. We are not liable for
            indirect or consequential losses. Nothing here limits liability
            where doing so is not allowed by law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">8. Law and contact</h2>
          <p className="mt-3">
            These terms are governed by the laws of the Federal Republic of
            Nigeria. Disputes go to the courts of Lagos State. Questions:
            acevolumesofficial@gmail.com. See also our{" "}
            <a className="underline" href="/privacy">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

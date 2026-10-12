import { KineticHeading } from "@/components/kinetic-heading";
import { Reveal } from "@/components/reveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Narrower measure for editorial pages. */
  wide?: boolean;
};

export function PageHeader({ eyebrow, title, intro, wide = false }: PageHeaderProps) {
  return (
    <header className="border-b hairline bg-[var(--bg-2)]">
      <div
        className={`mx-auto w-full max-w-[1400px] px-5 pb-16 pt-16 md:px-8 md:pb-20 md:pt-24 ${
          wide ? "" : "max-w-[1400px]"
        }`}
      >
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] muted">{eyebrow}</p>
        </Reveal>
        <div className="mt-6">
          <KineticHeading
            as="h1"
            text={title}
            className={`font-display text-[clamp(2.6rem,6.6vw,5rem)] ${
              wide ? "max-w-[24ch]" : "max-w-[19ch]"
            }`}
          />
        </div>
        {intro && (
          <Reveal delay={0.12} className="mt-7 max-w-[54ch] text-[17px] leading-relaxed muted">
            {intro}
          </Reveal>
        )}
      </div>
    </header>
  );
}

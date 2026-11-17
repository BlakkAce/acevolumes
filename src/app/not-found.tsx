import Link from "next/link";

// Branded 404 for the whole site (replaces the Next default page).
export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 text-center"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      <p
        className="font-mono text-[12px] uppercase tracking-[0.3em]"
        style={{ color: "var(--gold)" }}
      >
        AceVolumes
      </p>
      <h1 className="font-display text-4xl tracking-tight md:text-5xl">Page not found</h1>
      <p className="max-w-[46ch] text-[15.5px] leading-relaxed muted">
        The page you tried does not exist or moved. Everything real is one click away.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full px-6 py-3 font-display text-[15px] transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          Go home
        </Link>
        <Link
          href="/work"
          className="rounded-full border px-6 py-3 font-display text-[15px] hairline transition-opacity hover:opacity-80"
        >
          See the work
        </Link>
        <Link
          href="/blog"
          className="rounded-full border px-6 py-3 font-display text-[15px] hairline transition-opacity hover:opacity-80"
        >
          Read the blog
        </Link>
      </div>
    </main>
  );
}

const WORD_DELAY = 60; // ms between words

/**
 * Word-by-word mask reveal as pure CSS: each word rises out of its clipped
 * slot starting at first paint. No JS gates the text, so the headline is
 * readable even before hydration and costs nothing on the main thread.
 * Reduced-motion users get the words immediately.
 */
export function KineticHeading({
  text,
  className = "",
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const words = text.split(" ");

  return (
    <Tag className={`kinetic ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden
          className={`kinetic-slot ${i < words.length - 1 ? "kinetic-gap" : ""}`}
        >
          <span
            className="kinetic-word"
            style={{ animationDelay: `${100 + i * WORD_DELAY}ms` }}
          >
            {w}
          </span>
        </span>
      ))}
    </Tag>
  );
}

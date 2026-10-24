// Renders JSON-LD. Placed once per page/section that needs structured data.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static content, not user input; the replace guards
      // against accidental "</script>" breaking out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

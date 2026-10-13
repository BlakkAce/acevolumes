// Studio configuration. All three env vars must be present or the studio
// fails closed (any /{gate} path renders a plain 404).
export const STUDIO_PATH = (process.env.STUDIO_PATH ?? "")
  .trim()
  .replace(/^\/+|\/+$/g, "");
export const STUDIO_PASSPHRASE = (process.env.STUDIO_PASSPHRASE ?? "").trim();
export const SESSION_SECRET = (process.env.SESSION_SECRET ?? "").trim();

export const SESSION_COOKIE = "av_studio";
export const SESSION_DAYS = 30;

const PATH_RE = /^[a-z0-9]+(-[a-z0-9]+)+$/; // two-or-more words, hyphenated

export function studioConfigured(): boolean {
  return (
    STUDIO_PATH.length >= 6 &&
    STUDIO_PATH.length <= 64 &&
    PATH_RE.test(STUDIO_PATH) &&
    STUDIO_PASSPHRASE.length >= 12 &&
    SESSION_SECRET.length >= 32
  );
}

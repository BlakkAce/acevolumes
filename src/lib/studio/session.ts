import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_DAYS, SESSION_SECRET } from "./config";

// Stateless signed session: "<expiresAtMs>.<hmac(expiresAtMs)>".
// No DB needed for auth (Phase 1); the secret never leaves the server.
// Upgrade path: swap for DB-backed sessions if we ever need revocation.

function key(): Buffer {
  return createHash("sha256").update(SESSION_SECRET).digest();
}

export function sessionExpiresAt(): number {
  return Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
}

export function signSession(expiresAtMs: number): string {
  const sig = createHmac("sha256", key())
    .update(String(expiresAtMs))
    .digest("hex");
  return `${expiresAtMs}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isSafeInteger(exp) || exp < Date.now()) return false;
  const expected = Buffer.from(
    createHmac("sha256", key()).update(expStr).digest("hex"),
  );
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Hash-then-compare so lengths always match and comparison is constant time.
export function passphraseMatches(candidate: string): boolean {
  const a = createHash("sha256").update(STUDIO_PASSPHRASE_NORMALIZED).digest();
  const b = createHash("sha256").update(candidate.trim()).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

const STUDIO_PASSPHRASE_NORMALIZED = (process.env.STUDIO_PASSPHRASE ?? "")
  .trim()
  // NFKC folds lookalike unicode so a paste from a password manager matches.
  .normalize("NFKC");

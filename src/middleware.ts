import { NextResponse, type NextRequest } from "next/server";

// Status-correct gate enforcement ahead of rendering: the [gate] catch-all
// would otherwise match every unknown path and PPR streams a 200 shell
// before notFound() can fire. Middleware runs first, so:
//   - the exact secret slug (and its subpaths) -> studio, noindex headers
//   - known public routes                    -> normal site
//   - everything else (wrong slugs, probes)  -> hard, body-less 404
// The dashboard still cryptographically verifies the session server-side —
// this fence is for correct statuses and not leaking that the studio exists.

const PUBLIC_ROUTES = ["/", "/about", "/contact", "/founder", "/mortgage", "/services", "/work"];
const PATH_RE = /^[a-z0-9]+(-[a-z0-9]+)+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const slug = (process.env.STUDIO_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
  const configured =
    slug.length >= 6 &&
    PATH_RE.test(slug) &&
    (process.env.STUDIO_PASSPHRASE ?? "").trim().length >= 12 &&
    (process.env.SESSION_SECRET ?? "").trim().length >= 32;

  const base = `/${slug}`;
  if (configured && (pathname === base || pathname.startsWith(`${base}/`))) {
    // NOTE: no redirects here — edge middleware validates Location as an
    // absolute URL, which leaks bind-address hosts behind proxies. The
    // dashboard page itself renders the login form when unauthenticated.
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (
    PUBLIC_ROUTES.some(
      (p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)),
    ) ||
    // Public read-only client invoice links (unguessable tokens).
    pathname.startsWith("/api/track") ||
    pathname.startsWith("/invoice/") ||
    // Generated metadata routes (opengraph-image, icons): extensionless.
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image") ||
    pathname.startsWith("/apple-icon") ||
    pathname.startsWith("/icon") ||
    // public/ asset folders and files — anything else is a probe and 404s.
    pathname.startsWith("/img/") ||
    pathname.startsWith("/brand/") ||
    /\.(svg|webmanifest|txt|xml)$/i.test(pathname)
  ) {
    const res = NextResponse.next();
    if (pathname.startsWith("/invoice/")) {
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return res;
  }

  // Unknown path: hard 404, no body, nothing to fingerprint.
  return new NextResponse(null, {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}

export const config = {
  // Site-wide matcher; the slug cannot be baked into a static matcher
  // without leaking it, so gate membership is decided inside.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};

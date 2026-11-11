import { NextResponse } from "next/server";
import { ensureMediaUrl } from "@/lib/media/cards";

// Small square preview for the Content queue. Redirects to the image that
// will actually travel to Buffer (existing asset or generated card).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ref = url.searchParams.get("ref");
  const id = Number(url.searchParams.get("id") ?? "0");
  const target = await ensureMediaUrl(ref && ref !== "null" ? ref : null, Number.isSafeInteger(id) ? id : 0);
  if (!target) return new NextResponse(null, { status: 404 });
  const proxied = target.replace("https://acevolumes.vercel.app", "");
  return NextResponse.redirect(new URL(proxied, url.origin));
}

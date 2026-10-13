import { NextResponse, type NextRequest } from "next/server";
import { STUDIO_PATH, studioConfigured } from "@/lib/studio/config";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gate: string }> },
) {
  const { gate } = await params;
  if (!studioConfigured() || gate !== STUDIO_PATH) {
    return NextResponse.redirect(new URL("/404", req.url), 303);
  }
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: `/${STUDIO_PATH}` },
  });
  res.cookies.set({
    name: "av_studio",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

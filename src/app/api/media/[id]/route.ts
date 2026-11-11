import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";

// Public media endpoint: stable URLs that Buffer (and platforms) fetch.
// Ids are unguessable tokens; content is immutable and cached hard.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!dbConfigured()) return new Response(null, { status: 503 });
  const [row] = await getDb()
    .select({ mime: mediaAssets.mime, data: mediaAssets.data })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!row) return new Response(null, { status: 404 });
  return new Response(Buffer.from(row.data, "base64"), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

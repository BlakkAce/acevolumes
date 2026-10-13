// Google Places API (New) — Text Search client for the prospecting module.
// SKU note: requesting websiteUri/nationalPhoneNumber puts calls in Text
// Search Enterprise ($35/1k, 1,000 free/month at 2026 pricing) — at this
// studio's volume that is effectively $0. Key: PLACES_API_KEY env var.

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "nextPageToken",
].join(",");

export type PlaceHit = {
  id: string;
  name: string;
  address: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviews: number | null;
  mapsUri: string | null;
};

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

/** Pure parser — unit-testable without network. */
export function parseTextSearch(json: unknown): {
  hits: PlaceHit[];
  nextPageToken: string | null;
} {
  const body = json as { places?: RawPlace[]; nextPageToken?: string };
  const hits: PlaceHit[] = (body.places ?? []).map((p) => ({
    id: p.id ?? "",
    name: p.displayName?.text ?? "Unknown business",
    address: p.formattedAddress ?? null,
    website: p.websiteUri ?? null,
    phone: p.nationalPhoneNumber ?? null,
    rating: typeof p.rating === "number" ? p.rating : null,
    reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
    mapsUri: p.googleMapsUri ?? null,
  }));
  return { hits, nextPageToken: body.nextPageToken ?? null };
}

export function placesConfigured(): boolean {
  return Boolean((process.env.PLACES_API_KEY ?? "").trim());
}

async function textSearchPage(
  query: string,
  pageToken: string | null,
): Promise<{ hits: PlaceHit[]; nextPageToken: string | null }> {
  const key = (process.env.PLACES_API_KEY ?? "").trim();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "en",
      ...(pageToken ? { pageToken } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Places ${res.status}: ${detail.slice(0, 200)}`);
  }
  return parseTextSearch(await res.json());
}

/** Search up to `want` businesses for a niche+location query. */
export async function searchPlaces(
  query: string,
  want: number,
): Promise<PlaceHit[]> {
  const hits: PlaceHit[] = [];
  let token: string | null = null;
  for (let page = 0; page < 3 && hits.length < want; page++) {
    const { hits: pageHits, nextPageToken } = await textSearchPage(
      query,
      token,
    );
    hits.push(...pageHits);
    token = nextPageToken;
    if (!token) break;
  }
  return hits.slice(0, want);
}

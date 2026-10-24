import { ImageResponse } from "next/og";

// Site-wide social card (1200x630): plum night, gold wordmark, tagline.
// Next attaches it automatically to every page's opengraph/twitter metadata.
export const alt = "AceVolumes — brand, web and social for teams that sell";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #170a16 0%, #3B153A 100%)",
          padding: 72,
          color: "#FBF7EE",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 34,
            letterSpacing: "0.32em",
            color: "#F0C987",
          }}
        >
          <div
            style={{
              width: 56,
              height: 10,
              background: "#F0C987",
              borderRadius: 5,
            }}
          />
          ACEVOLUMES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Volume that
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#F0C987" }}>
            moves markets.
          </div>
          <div style={{ display: "flex", fontSize: 30, opacity: 0.75 }}>
            Brand · Web · Social — mortgage, real estate &amp; e-commerce
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.6 }}>
          acevolumes.com.ng · Lagos · clients worldwide since 2016
        </div>
      </div>
    ),
    size,
  );
}

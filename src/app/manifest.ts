import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AceVolumes",
    short_name: "AceVolumes",
    description:
      "Lagos digital studio — brand, websites and social media for mortgage, real estate and e-commerce teams worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#170a16",
    theme_color: "#170a16",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

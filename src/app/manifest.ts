import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AceVolumes",
    short_name: "AceVolumes",
    description:
      "AceVolumes: digital systems that make results easier. Websites, e-commerce, branding, marketing and custom software. Lagos studio, clients worldwide since 2016.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ee",
    theme_color: "#fbf7ee",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/img/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/img/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

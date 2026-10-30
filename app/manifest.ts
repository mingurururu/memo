import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "메모",
    short_name: "메모",
    description: "간단한 메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F2F4F6",
    theme_color: "#3182F6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

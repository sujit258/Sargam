import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

/**
 * PWA manifest for Sargam.
 * Matched to the dark obsidian shell so splash screen does not flash white.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.shortName,
    description: brand.description,
    start_url: "/",
    // Everything is under the origin root. Stated rather than left to default,
    // so a link outside it opens in the browser instead of silently inside the
    // installed app with no way back.
    scope: "/",
    display: "standalone",
    // Matched to the app shell so the splash screen does not flash white.
    background_color: brand.backgroundColor,
    theme_color: brand.themeColor,
    // Phones stay upright. The layout is built for a tall narrow window and
    // there is nothing a 400px-tall one can show well; tilting produced a
    // wider, shorter version of a design that needed the height.
    orientation: "portrait",
    categories: ["music", "entertainment"],
    icons: [
      // "any" and "maskable" are listed separately: Android crops maskable
      // icons to its own shape, which would cut into the badge's border if it
      // were the only entry.
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

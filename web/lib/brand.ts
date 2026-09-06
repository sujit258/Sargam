/**
 * Central Brand Configuration for Sargam.
 *
 * Single source of truth for application identity, naming, metadata,
 * localStorage namespace keys, and attribution.
 */

export const brand = {
  name: "Sargam — Retro Bollywood Melodies",
  shortName: "Sargam",
  tagline: "Golden Era Hindi Classics",
  description:
    "Browse and play golden-era Hindi film music by singer, composer, lyricist, actor, film and mood. Over 3,900 songs across 66 stations.",
  themeColor: "#0f121a",
  backgroundColor: "#0f121a",
  storageKeys: {
    backdrop: "sargam:backdrop:v1",
    welcomeSeen: "sargam:notice-seen:v1",
    favourites: "sargam:favourites:v1",
    installDismissed: "sargam.installDismissed",
    // Legacy keys for seamless migration
    legacy: {
      backdrop: "mehfil:backdrop:v1",
      welcomeSeen: "mehfil:notice-seen:v1",
      favourites: "mehfil:favourites:v1",
      installDismissed: "mehfil.installDismissed",
    },
  },
  historyStateKey: "sargamPlayer",
  credit: {
    inspiredBy: "Mehfil",
    url: "https://mehfil.shashwa7.in",
    attributionText: "Inspired by Mehfil · Built and customized by our team",
  },
} as const;

export type Brand = typeof brand;

/**
 * Central Brand Configuration for Sargam.
 *
 * Single source of truth for application identity, naming, metadata,
 * localStorage namespace keys, and attribution.
 */

export const brand = {
  name: "Sargam",
  shortName: "Sargam",
  tagline: "Golden Era Hindi Classics",
  description: "Discover timeless Indian music across languages, eras and moods.",
  productionUrl: "https://sargam.suvidhatools.in",
  repoUrl: "https://github.com/sujit258/Sargam",
  themeColor: "#0f121a",
  backgroundColor: "#0f121a",
  storageKeys: {
    // Current unified keys
    favorites: "sargam:favorites",
    history: "sargam:history",
    preferences: "sargam:preferences",
    queue: "sargam:queue",
    backdrop: "sargam:backdrop",
    welcomeSeen: "sargam:notice-seen",
    installDismissed: "sargam.installDismissed",

    // Alias for backward compatibility with existing components
    favourites: "sargam:favorites",

    // Legacy keys for seamless transparent migration
    legacy: {
      backdrop: "sargam:backdrop:v1",
      welcomeSeen: "sargam:notice-seen:v1",
      favourites: "sargam:favourites:v1",
      installDismissed: "sargam.installDismissed",
      oldMehfilFavourites: "mehfil:favourites:v1",
      oldMehfilBackdrop: "mehfil:backdrop:v1",
      oldMehfilWelcome: "mehfil:notice-seen:v1",
      oldMehfilDismissed: "mehfil.installDismissed",
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

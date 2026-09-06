/**
 * SARGAM Release History
 *
 * Official release log of the SARGAM Indian music discovery platform.
 */

export type Release = {
  version: string;
  date: string;
  title: string;
  added?: string[];
  fixed?: string[];
};

export const RELEASES: readonly Release[] = [
  {
    version: "1.2",
    date: "2026-09-07",
    title: "Discovery Engine & Modern IA",
    added: [
      "Expanded desktop sidebar with dedicated Discover, Search, Languages, Stations, and Library views.",
      "Aajcha Sargam (आजचा सरगम) — deterministic daily classic recommendation calculated stably across all global listeners.",
      "Surprise Me — weighted discovery algorithm surfacing high-confidence classics across diverse stations.",
      "Golden Eras navigation (1950s Black & White, 1960s Golden Dawn, 1970s Technicolor, 1980s Retro).",
      "Mobile bottom navigation bar with integrated persistent player and expandable full Now Playing screen.",
      "Recently Played local playback history tracking.",
    ],
    fixed: [
      "Smooth keyboard shortcuts (Space for Play/Pause, J for Prev, L for Next, M for Mute, F for Favorite).",
      "Seamless transparent storage migration preserving existing user favorites.",
    ],
  },
  {
    version: "1.1",
    date: "2026-09-06",
    title: "Marathi Edition & Regional Expansion",
    added: [
      "First-class multi-language architecture supporting Hindi, Marathi, and future regional languages.",
      "Marathi Regional Spotlight highlighting Bhavgeet, Natya Sangeet, Golden Marathi Cinema, and Bhakti.",
      "Modular Python Sargam Catalog Engine in catalog/ with multi-source ingestion, validation, and publishing.",
      "Strict zero-fabrication catalog validation verifying all 3,916 baseline Hindi songs and 66 stations.",
    ],
    fixed: [
      "Fixed metadata normalization to preserve authentic classical ragas and multi-singer duets.",
    ],
  },
  {
    version: "1.0",
    date: "2026-09-06",
    title: "Sargam Foundation",
    added: [
      "Launch of SARGAM — Retro Bollywood Melodies independent music PWA.",
      "Deep Obsidian Velvet & Radiant Luminous Amber design system in perceptual OKLCH color space.",
      "Full offline-capable PWA support across Chromium desktop, Android, and iOS Safari.",
      "Zero-latency virtualized catalog playback powered by official YouTube embedded players.",
      "Transparent local storage privacy model with zero user tracking or profile creation.",
    ],
    fixed: [
      "100% preservation of the golden-era catalogue (3,916 songs, 66 stations, 415 artists, 1,379 films).",
    ],
  },
];

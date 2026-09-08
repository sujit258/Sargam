import { hydrate, type Catalogue, type RawSong, type Song } from "@/lib/catalogue";

export interface MarathiStationInfo {
  name: string;
  slug: string;
  desc: string;
}

export const MARATHI_STATIONS: MarathiStationInfo[] = [
  { name: "Marathi Classics", slug: "marathi-classics", desc: "Hallmark recordings from legends" },
  { name: "Marathi Bhavageet", slug: "marathi-bhavageet", desc: "Poetic melodies of longing & nature" },
  { name: "Natya Sangeet", slug: "natya-sangeet", desc: "Musical theatre stage classics" },
  { name: "Lavani", slug: "lavani", desc: "Vibrant rhythms & dholki beats" },
  { name: "Marathi Bhakti", slug: "marathi-bhakti", desc: "Devotional hymns to Vitthal & Ganesh" },
  { name: "Gavlani", slug: "gavlani", desc: "Krishna folk narratives & playful tales" },
  { name: "Marathi Folk", slug: "marathi-folk", desc: "Koli geet, Gondhal & Powada" },
  { name: "Marathi Romance", slug: "marathi-romance", desc: "Tender duets & cinematic romance" },
];

export const MARATHI_STATION_NAMES = MARATHI_STATIONS.map((s) => s.name);

export interface LanguageSongCounts {
  hindi: number;
  marathi: number;
}

export interface LanguageStationCounts {
  hindi: number;
  marathi: number;
}

export interface RegionalStats {
  total: number;
  verified: number;
  unresolved: number;
}

export interface MarathiCatalogueData {
  songs: Song[];
  raw: RawSong[];
  playableRaw: RawSong[];
  stats: RegionalStats;
  categoryCounts: Record<string, number>;
}

/**
 * Returns song counts grouped by supported language.
 */
export function getLanguageSongCounts(catalogue?: Catalogue | null): LanguageSongCounts {
  if (!catalogue?.songs) {
    return { hindi: 3916, marathi: 341 };
  }

  let hindi = 0;
  let marathi = 0;

  for (const song of catalogue.songs) {
    if (song.lang === "marathi" || (typeof song.id === "string" && song.id.startsWith("mar-"))) {
      marathi++;
    } else {
      hindi++;
    }
  }

  return { hindi, marathi };
}

/**
 * Returns station counts grouped by supported language.
 */
export function getLanguageStationCounts(catalogue?: Catalogue | null): LanguageStationCounts {
  if (!catalogue?.stationMeta) {
    return { hindi: 66, marathi: 8 };
  }

  const allStations = Object.keys(catalogue.stationMeta);
  const marathiSet = new Set<string>(MARATHI_STATION_NAMES);
  let marathi = 0;

  for (const station of allStations) {
    if (marathiSet.has(station)) {
      marathi++;
    }
  }

  const hindi = allStations.length - marathi;
  return {
    hindi: hindi > 0 ? hindi : 66,
    marathi: marathi > 0 ? marathi : 8,
  };
}

/**
 * Derives verified playable vs metadata-only counts for the Marathi catalogue.
 */
export function getMarathiStats(catalogue?: Catalogue | null): RegionalStats {
  if (!catalogue?.songs) {
    return { total: 341, verified: 132, unresolved: 209 };
  }

  let total = 0;
  let verified = 0;

  for (const s of catalogue.songs) {
    if (s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-"))) {
      total++;
      if (s.v && s.source_verified !== false) {
        verified++;
      }
    }
  }

  return {
    total,
    verified,
    unresolved: total - verified,
  };
}

/**
 * Derives a lookup Map of ID -> RawSong from catalogue for O(1) retrieval.
 */
export function getSongMap(catalogue?: Catalogue | null): Map<number | string, RawSong> {
  if (!catalogue?.songs) return new Map();
  return new Map(catalogue.songs.map((s) => [s.id, s]));
}

/**
 * Hydrates a list of song IDs in specified order, skipping any missing from catalogue.
 */
export function resolveHydratedSongs(
  catalogue: Catalogue | null | undefined,
  ids: (number | string)[]
): Song[] {
  if (!catalogue?.songs || ids.length === 0) return [];
  const map = getSongMap(catalogue);
  const matched: Song[] = [];

  for (const id of ids) {
    const raw = map.get(id);
    if (raw) {
      matched.push(hydrate(raw, catalogue.facets));
    }
  }

  return matched;
}

/**
 * Resolves a list of song IDs into ordered RawSong records, skipping missing IDs.
 */
export function resolveRawSongs(
  catalogue: Catalogue | null | undefined,
  ids: (number | string)[]
): RawSong[] {
  if (!catalogue?.songs || ids.length === 0) return [];
  const map = getSongMap(catalogue);
  const matched: RawSong[] = [];

  for (const id of ids) {
    const raw = map.get(id);
    if (raw) {
      matched.push(raw);
    }
  }

  return matched;
}

/**
 * Derives hydrated Marathi songs, playable raw tracks, stats, and category counts in a single pass.
 */
export function getMarathiCatalogueData(catalogue?: Catalogue | null): MarathiCatalogueData {
  if (!catalogue?.songs) {
    return {
      songs: [],
      raw: [],
      playableRaw: [],
      stats: { total: 341, verified: 132, unresolved: 209 },
      categoryCounts: { all: 0 },
    };
  }

  const songs: Song[] = [];
  const raw: RawSong[] = [];
  const playableRaw: RawSong[] = [];
  const categoryCounts: Record<string, number> = { all: 0 };
  let verified = 0;

  for (const s of catalogue.songs) {
    if (s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-"))) {
      raw.push(s);
      const hydrated = hydrate(s, catalogue.facets);
      songs.push(hydrated);

      if (s.v) {
        playableRaw.push(s);
      }
      if (s.v && s.source_verified !== false) {
        verified++;
      }

      if (hydrated.categories) {
        for (const cat of hydrated.categories) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      }
    }
  }

  categoryCounts.all = songs.length;
  const total = songs.length;

  return {
    songs,
    raw,
    playableRaw,
    stats: {
      total,
      verified,
      unresolved: total - verified,
    },
    categoryCounts,
  };
}

# Sargam Catalog Data Schema

The Sargam music data schema defines the canonical data models for songs, facets, stations, and multi-language regional collections.

---

## 1. Runtime JSON Structure (`catalogue.json`)

The client application downloads a single optimized JSON payload (`web/public/catalogue.json`) with indexed compression:

```typescript
export interface CatalogPayload {
  version?: string; // e.g. "1.0.0"
  facets: {
    artists: string[];
    films: string[];
    stations: string[];
    moods: string[];
    composer: string[];
    lyricist: string[];
    actor: string[];
    singer: string[];
    director: string[];
  };
  songs: RawCatalogSong[];
  stationMeta: Record<string, StationMeta>;
}

export interface RawCatalogSong {
  id: number;          // Permanent integer ID
  t: string;           // Title
  f: number | null;    // Film facet index
  v: string;           // YouTube Video ID (11 chars)
  c: number;           // Verification confidence (0.80 - 1.0)
  a: number[];         // Artist facet indices
  s: number[];         // Station facet indices
  m: number[];         // Mood facet indices
  cr?: number[];       // Composer facet indices
  lt?: number[];       // Lyricist facet indices
  ar?: number[];       // Actor facet indices
  sr?: number[];       // Singer facet indices
  dr?: number[];       // Director facet indices
}
```

---

## 2. Extended Multi-Language Model (`ExtendedSong`)

When hydrated in the application domain layer:

```typescript
export interface ExtendedSong {
  id: string | number;
  title: string;
  language: "hindi" | "marathi" | "bengali" | "gujarati" | "punjabi" | "tamil" | "telugu";
  year?: number;
  film?: {
    name: string;
    year?: number;
  };
  artists: string[];
  composers?: string[];
  lyricists?: string[];
  genres?: string[];
  moods?: string[];
  eras?: string[];
  source?: {
    type: "youtube" | "archive";
    id: string;
  };
  artwork?: string;
  duration?: number;
}
```

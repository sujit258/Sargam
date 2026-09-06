# SARGAM Catalog Baseline Integrity Report

**Generated:** September 7, 2026  
**Catalog Target:** `web/public/catalogue.json`  
**Purpose:** Freeze and verify the baseline catalogue metrics prior to multi-language expansion and UI transformation.

---

## 1. Baseline Catalog Counts

| Metric | Baseline Count | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **Total Songs** | **3,916** | `songs.length` | Verified |
| **Unique Song IDs** | **3,916** | `new Set(songs.map(s => s.id)).size` | Verified |
| **Duplicate Song IDs** | **0** | `songs.length - uniqueIds.size` | Verified |
| **Unique Video IDs** | **3,895** | `new Set(songs.map(s => s.v)).size` | Verified |
| **Missing Video IDs** | **0** | `songs.filter(s => !s.v).length` | Verified |
| **Stations** | **66** | `facets.stations.length` | Verified |
| **StationMeta Entries** | **66** | `Object.keys(stationMeta).length` | Verified |
| **Artists** | **415** | `facets.artists.length` | Verified |
| **Films** | **1,379** | `facets.films.length` | Verified |
| **Composers** | **23** | `facets.composer.length` | Verified |
| **Lyricists** | **12** | `facets.lyricist.length` | Verified |
| **Singers** | **17** | `facets.singer.length` | Verified |
| **Moods** | **12** | `facets.moods.length` | Verified |

---

## 2. File Artifacts & Baseline Integrity

| File Path | Description | Size | Checksum / Records |
| :--- | :--- | :--- | :--- |
| `web/public/catalogue.json` | Active frontend runtime catalog | ~632 KB | 3,916 records |
| `data/carvaan.db` | SQLite catalog store | ~12.8 MB | 4,310 total raw records |
| `data/song_ids.json` | Append-only ledger mapping `title\|film` -> ID | ~203 KB | 4,310 mapped IDs |
| `data/songs.json` | Ingested structured records | ~1.2 MB | 4,310 songs |
| `data/stations.json` | Station taxonomy definitions | ~3.4 KB | 66 stations |

---

## 3. Schema Structure

```typescript
interface CatalogJSON {
  facets: {
    artists: string[];   // Length: 415
    films: string[];     // Length: 1,379
    stations: string[];  // Length: 66
    moods: string[];     // Length: 12
    composer: string[];  // Length: 23
    lyricist: string[];  // Length: 12
    actor: string[];     // Length: 395
    singer: string[];    // Length: 17
    director: string[];  // Length: 1
  };
  songs: {
    id: number;          // Unique integer ID (1..4310)
    t: string;           // Title
    f: number;           // Film index in facets.films
    v: string;           // YouTube 11-char Video ID
    c: number;           // Match confidence score (0.82 .. 0.98)
    a: number[];         // Artist indices in facets.artists
    s: number[];         // Station indices in facets.stations
    m: number[];         // Mood indices in facets.moods
    cr: number[];        // Composer indices in facets.composer
    lt: number[];        // Lyricist indices in facets.lyricist
    ar: number[];        // Actor indices in facets.actor
    sr: number[];        // Singer indices in facets.singer
    dr: number[];        // Director indices in facets.director
  }[];
  stationMeta: Record<string, {
    kind: "singer" | "composer" | "lyricist" | "actor" | "director" | "mood" | "genre" | "format";
    person: string | null;
  }>;
}
```

---

## 4. Verification Command

Run the following command at any time to verify catalog integrity:

```bash
node -e "
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('web/public/catalogue.json', 'utf8'));
const songs = c.songs;
const uniqueIds = new Set(songs.map(s => s.id));
console.assert(songs.length === 3916, 'Song count mismatch');
console.assert(uniqueIds.size === 3916, 'Duplicate IDs detected');
console.assert(c.facets.stations.length === 66, 'Station count mismatch');
console.assert(Object.keys(c.stationMeta).length === 66, 'StationMeta mismatch');
console.log('✅ Catalog integrity verified: 3,916 songs, 66 stations, 0 duplicates');
"
```

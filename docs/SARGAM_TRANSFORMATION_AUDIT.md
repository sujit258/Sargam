# SARGAM Transformation Audit Report

**Date:** September 2026  
**Target Product:** SARGAM — Retro Bollywood Melodies  
**Target Domain:** https://sargam.suvidhatools.in  
**Target Repository:** https://github.com/sujit258/Sargam  
**Target Branch:** `feature/sargam-transformation`

---

## 1. Executive Summary & Transformation Mandate

This audit establishes the boundary between **useful engineering infrastructure** (which should be preserved and enhanced) and **original product identity/storytelling** (which must be completely redesigned and replaced).

Sargam is an independent, production-ready music Progressive Web Application (PWA) focused on golden-era Indian music, supporting multi-language discovery (commencing with Hindi and Marathi), a modular Python catalog engine, modern desktop/mobile navigation, and reliable offline playback capabilities.

---

## 2. Complete Repository Inventory

### A. Frontend Architecture (`web/`)
- **Framework:** Next.js 16.2.12 (App Router, Turbopack, static prerendering enabled).
- **Core Libraries:** React 19.2.4, Tailwind CSS v4, Base UI primitives (`@base-ui/react`), TanStack React Query v5, Lucide React icons, `react-virtuoso` for virtualized track lists.
- **Routing:**
  - `/` — Main discovery view.
  - `/songs` — Virtualized catalog of 3,916 songs with search and facet filters.
  - `/favourites` — User's liked tracks, stored locally.
  - `/themes` — Backdrop video/still selection.
  - `/[kind]/[slug]` — Static prerendered dynamic collections (e.g. `/station/*`, `/singer/*`, `/composer/*`, `/actor/*`, `/film/*`, `/mood/*`).
  - `/about` — About page, legal disclaimers, image credits.
  - `/releases` — Release notes and changelog.
  - `/curious/design` — Design system documentation.
  - `/curious/architecture` — System architecture disclosure.
  - `/contribute` — Song contribution and missing link locator.
  - `/api/feedback` — Proxy route to Google Apps Script webhook for corrections.
- **Player Architecture:**
  - Layout sibling `PlayerProvider` in `web/app/layout.tsx` hosting hidden YouTube iframe (`www.youtube-nocookie.com`).
  - Media Session API integration in `web/lib/media-session.ts`.
  - Player bar (`web/components/player-bar.tsx`) with expandable portal sheet.
- **PWA & Storage:**
  - `web/app/manifest.ts` delivering `/manifest.webmanifest`.
  - Service worker in `web/public/sw.js`.
  - LocalStorage keys: `sargam:favourites:v1`, `sargam:backdrop:v1`, `sargam:notice-seen:v1`, `sargam.installDismissed`.

### B. Catalogue Data (`data/` & `web/public/`)
- `web/public/catalogue.json`: Runtime catalogue (632 KB) containing:
  - 3,916 songs (`id`, `t`, `f`, `v`, `c`, `a`, `s`, `m`, `cr`, `lt`, `ar`, `sr`, `dr`).
  - 66 stations with metadata (`stationMeta`).
  - Facet registries (`artists`: 415, `films`: 1,379, `composer`: 23, `lyricist`: 12, `singer`: 17, `moods`: 12).
- `data/carvaan.db`: SQLite database (12.8 MB) containing raw scrape, parsed records, YouTube matches, and resolutions.
- `data/song_ids.json`: Append-only ledger mapping `title|film` to immutable song ID.
- `data/songs.json`: Intermediate structured JSON from songlist parse.
- `data/stations.json`: Station definitions.

### C. Pipeline Scripts (`pipeline/`)
- 24 standalone Python scripts responsible for parsing PDF (`parse_songlist.py`), storing to SQLite (`store.py`), matching YouTube videos (`match_videos.py`, `harvest_youtube.py`), verifying embeddability (`verify_embeddable.py`), and exporting JSON (`export_catalogue.py`).

---

## 3. Search Audit for Upstream References

A thorough grep of the repository for `Mehfil`, `shashwa7`, `Shashwat`, and upstream URLs identified the following items:

| Location | Context | Classification | Action Required |
| :--- | :--- | :--- | :--- |
| `docs/superpowers/*` | Personal developer scratchpad from upstream author | **Copied internal scratchpad** | **Delete folder** |
| `docs/feedback-apps-script.gs` | "Mehfil song reports -> Google Sheet" | **Technical identifier** | Rename to Sargam |
| `pipeline/fetch_station_posters.py` | `UA = {"User-Agent": "MehfilPersonalProject/1.0"}` | **Technical identifier** | Update to Sargam User-Agent |
| `web/lib/releases.ts` & `/releases/page.tsx` | Upstream Mehfil releases v0.1 - v0.9 | **Copied product history** | **Replace with Sargam release history** |
| `web/app/curious/architecture/page.tsx` | Upstream project narrative & URLs | **Copied product storytelling** | **Rewrite for Sargam** |
| `web/app/about/page.tsx` | Mehfil credits & links | **Attribution** | Maintain clean, minimal attribution in `docs/ATTRIBUTION.md` & about page |
| `README.md` | Mixed Mehfil/Sargam text | **Product documentation** | **Rewrite completely for Sargam** |
| `web/public/catalogue.json` | Authentic Hindi song titles (e.g. "Dil Kya Mehfil Hai") | **Legitimate music metadata** | **PRESERVE UNTOUCHED** |
| `web/lib/brand.ts` | Central brand configuration | **Sargam brand config** | Update with production domain `sargam.suvidhatools.in` |

---

## 4. Classification Summary

### What Can Safely Remain
1. **Core YouTube Audio Playback Engine:** The YouTube iframe embed lifecycle, queue management, and media session synchronization.
2. **Virtualized Track Rendering:** `react-virtuoso` virtualization logic for 3,916 track rows.
3. **PWA Shell:** Service worker registration, focus updates, and offline fallback.
4. **Facet Taxonomies:** Singer, Composer, Lyricist, Actor, Film, and Station index relationships.
5. **Legitimate Hindi Song Titles:** Song titles containing the authentic word "Mehfil" (e.g. "Yeh Duniya Yeh Mehfil", "Dil Ki Mehfil Sajane").

### What Must Be Rewritten
1. **Desktop & Mobile Navigation / Layout:** Replace the single-purpose browse view with an expanded Information Architecture:
   - Desktop sidebar: Discover, Search, Languages, Stations, Library, Favorites, History, Playlists.
   - Mobile bottom bar: Home, Search, Stations, Library.
2. **Main Discover Page:** Implement 10 discovery sections: Greeting, Aajcha Sargam, Explore Languages, Golden Eras, Popular Stations, Moods, Recently Played, Recommended Classics, Marathi Spotlight, Surprise Me.
3. **Release Notes & Architecture Pages:** Replace upstream development storytelling with Sargam's authentic multi-language architecture and release log.
4. **Catalog Pipeline:** Restructure the flat `pipeline/` scripts into the modular, multi-source `catalog/` engine.

### What Requires Attribution
1. Attribution to original project creator (Shashwat Tripathi / Mehfil) documented in `docs/ATTRIBUTION.md` and accessible via the About page.
2. Wikimedia Commons and Wikidata artist portraits licensing.
3. Saregama public songlist factual metadata acknowledgment.

### What Data Must Be Preserved
1. All 3,916 songs in `web/public/catalogue.json`.
2. All 66 stations and station metadata.
3. Append-only ledger IDs in `data/song_ids.json`.
4. YouTube video mappings (`v` attribute).

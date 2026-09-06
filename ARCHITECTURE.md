# Sargam System Architecture

## 1. Architectural Philosophy
**Sargam — Retro Bollywood Melodies** is an offline-capable, serverless Progressive Web Application (PWA) dedicated to golden-era Hindi film music. It operates with **zero runtime database**, **zero server-side authentication**, and **zero music hosting**. All 3,916 songs, 66 stations, and thousands of artist facets are rendered from an optimized, static catalogue file (`web/public/catalogue.json`), while audio is played through official YouTube iframe embeds.

```
┌─────────────────────────────────────────────────────────────┐
│                       Root Layout                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   TanStack Query Provider (Catalogue + Manifests)    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  PlayerProvider (YouTube IFrame + Queue Engine) │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │ AppFrame (Sidebar, Header, PlayerBar,     │  │  │  │
│  │  │  │           Page Content, Modals)           │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Application Routing & Page Structure
Built on Next.js 16 App Router using React 19:

- **`/` (Home / Browse)**: Discover Golden Era music across 66 curated stations (Singers, Composers, Lyricists, Actors, Moods, Eras), quick play, and station grids.
- **`/songs`**: The complete virtualized catalogue of 3,916 songs with search and facet filtering.
- **`/favourites`**: Personal offline collection of liked tracks.
- **`/themes`**: Ambient animated video and still backdrop selection.
- **`/[kind]/[slug]`**: Dynamic static-prerendered collections (e.g. `/singer/lata-mangeshkar`, `/composer/r-d-burman`, `/lyricist/anand-bakshi`, `/mood/romance`).
- **`/curious/design`**: Live design system documentation, token palettes, breakpoints, and component patterns.
- **`/curious/architecture`**: Engineering disclosure of runtime behavior and metrics.
- **`/about`**: Product purpose, legal disclaimers, station poster credits, and artist portrait provenance.
- **`/releases`**: Version history and changelog.
- **`/api/feedback`**: Single serverless route forwarding error/link corrections to Google Sheets webhook without leaking credentials.

---

## 3. Catalogue & Station Data Architecture
The data model lives in `web/public/catalogue.json` (approx. 632 KB gzipped/optimized):
- **Songs**: Compact array of song records:
  - `id`: Append-only persistent unique integer.
  - `t`: Title.
  - `f`: Film ID.
  - `v`: YouTube Video ID.
  - `c`: Confidence rating.
  - `s`: Array of Station IDs.
  - `m`: Mood IDs.
  - `a`: Performer IDs.
  - `cr`: Composer IDs.
  - `lt`: Lyricist IDs.
- **Stations**: 66 stations categorized into Singers, Composers, Lyricists, Actors, Moods, and Genres.
- **Integrity**: Verified append-only ledger prevents IDs from shifting during pipeline rebuilds.

---

## 4. Player Lifecycle & State Management
Because playback is driven by a YouTube embedded iframe, **unmounting the iframe destroys the player state and interrupts music**:
1. **Layout Sibling**: `PlayerProvider` resides in `web/app/layout.tsx`. Navigating between routes never unmounts the player.
2. **Queue Engine**: Manages shuffle, repeat, previous, next, and active station context.
3. **Modal Expansion & Back Button**:
   - The expanded player view mounts via a React Portal to `document.body`.
   - When opened, it pushes `{ [brand.historyStateKey]: true }` to `window.history`.
   - Pressing the browser back button or hardware back gesture pops the history state and dismisses the expanded sheet without navigating away from the current page.
4. **Media Session API**: Integrates with device lock screens and notification controls (`navigator.mediaSession`) for title, artist, album artwork, and play/pause/skip triggers.

---

## 5. Storage Namespace & Legacy Migration
Storage keys are centralized in `web/lib/brand.ts`:
- Favourites: `sargam:favourites:v1`
- Active Backdrop: `sargam:backdrop:v1`
- First-run Welcome Notice: `sargam:notice-seen:v1`
- Install Dismissal: `sargam.installDismissed`

### Transparent Data Migration:
On read, if the new `sargam:*` key does not exist, the storage utility checks the legacy `mehfil:*` key. If present, it migrates data to the `sargam:*` key immediately, ensuring existing users never lose their liked songs or custom settings.

---

## 6. Theme System: Deep Obsidian Velvet & Radiant Luminous Amber
Defined in `web/app/globals.css` using perceptual OKLCH color space:
- `--background`: `oklch(0.14 0.016 260)` (Deep midnight obsidian)
- `--sidebar`: `oklch(0.10 0.014 260)` (Receding rail)
- `--card`: `oklch(0.185 0.018 260)` (Soft glass elevated surface)
- `--primary`: `oklch(0.82 0.16 75)` (Luminous warm amber)
- `--heart`: `oklch(0.72 0.20 18)` (Restrained crimson/rose)
- `--foreground`: `oklch(0.96 0.008 260)` (WCAG AAA legible high-contrast text)
- `--muted-foreground`: `oklch(0.72 0.015 260)` (Accessible secondary labels)
- `--border`: `oklch(1 0 0 / 10%)` (Crisp hairline translucent boundary)

### Responsive Height-Aware Breakpoints:
Tailwind breakpoints enforce height validation (e.g. `width >= 48rem and height >= 30rem`) so rotated smartphones do not render cramped tablet navigation rails.

---

## 7. Deployment & Verification
- Framework: Next.js 16 (App Router, Turbopack, Standalone Static Export capability).
- Build command: `npm run build` in `web/`.
- Zero environment variable requirements for core music discovery and playback.

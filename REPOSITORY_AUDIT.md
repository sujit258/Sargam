# REPOSITORY AUDIT: Transformation to Independent Branded Product

**Repository Location:** `f:/Mahfil`  
**Target Product Name:** **Sargam** (Configurable via `lib/brand.ts`)  
**Date:** September 2026  

---

## 1. Architecture Overview
The repository contains a full Next.js 16 (App Router) + React 19 + Tailwind CSS v4 application located in the `web/` folder, accompanied by Python pipeline scripts in `pipeline/` and static metadata in `data/`.

- **Web Framework:** Next.js 16.2.12 with App Router and React 19.2.4.
- **CSS / Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), custom OKLCH design tokens in `web/app/globals.css`, and `@base-ui/react` primitives styled with `class-variance-authority` and `tailwind-merge`.
- **State Management:**
  - `QueryClient` (TanStack React Query v5) for the static JSON catalog query and paged lists.
  - `React.createContext` for the YouTube Player Provider (`PlayerProvider`).
  - `useSyncExternalStore` for reactive `localStorage` subscriptions (`favourites`, `backdrops`).
- **Media Playback:** Persistent YouTube iframe mounted in `app/layout.tsx` above dynamic page routes, controlled via the YouTube IFrame API and HTML5 Media Session API.
- **Performance:** Virtualized lists using `react-virtuoso` for rendering up to ~3,916 song rows without DOM bloat.

---

## 2. Directory Structure
```
Mahfil/
├── data/                    # Pipeline input data and song ID ledgers
├── docs/                    # Architecture notes and feedback script
├── pipeline/                # Python scripts for parsing, resolving, and verifying catalogue
└── web/                     # Production Next.js web application
    ├── app/                 # Next.js App Router routes and layouts
    │   ├── [kind]/[slug]/   # Dynamic collections (station, singer, composer, etc.)
    │   ├── about/           # About & credits page
    │   ├── api/feedback/    # Feedback submission route
    │   ├── contribute/      # Missing recordings submission page
    │   ├── curious/         # Design system and architecture deep dives
    │   ├── favourites/      # User liked songs page
    │   ├── releases/        # Release notes timeline
    │   ├── songs/           # Full virtualized songs catalog
    │   ├── themes/          # Backdrop theme selection
    │   ├── globals.css      # Core CSS tokens & Tailwind v4 setup
    │   ├── layout.tsx       # Root layout, persistent backdrop, providers, metadata
    │   ├── manifest.ts      # Dynamic PWA Web App Manifest
    │   ├── opengraph-image.tsx # Dynamic OG image generator
    │   └── providers.tsx    # TanStack Query, Tooltips, Service Worker lifecycle
    ├── components/          # Reusable UI and player components
    │   ├── ui/              # Base UI + Tailwind primitives (alert-dialog, sheet, etc.)
    │   ├── app-frame.tsx    # App chrome (sidebar rail, top search bar, drawer)
    │   ├── player-bar.tsx   # Persistent music player bar & expanded modal
    │   ├── install-prompt.tsx # PWA install detection & iOS instructions
    │   ├── install-card.tsx # Smart 5-second PWA install prompt
    │   ├── notice-dialog.tsx# First-run welcome & disclaimer dialog
    │   └── ...
    ├── lib/                 # Core logic, stores, and utilities
    │   ├── brand.ts         # [NEW] Centralized brand config & tokens
    │   ├── catalogue.ts     # Catalogue lookup, facet extraction, song formatting
    │   ├── favourites.ts    # Reactive localStorage liked songs store
    │   ├── backdrops.ts     # Reactive localStorage theme backdrops store
    │   ├── welcome.ts       # Welcome dialog seen state store
    │   └── routes.ts        # Slugs, route mappings, category definitions
    └── public/              # Static assets, icons, service worker, and catalogue
        ├── catalogue.json   # 646 KB compiled song catalogue
        ├── sw.js            # Custom cache-first & network-first service worker
        ├── logo.png         # Brand logo
        └── icons/           # PWA and Apple touch icons
```

---

## 3. Existing Functionality
1. **Catalog Query & Search:** Fast client-side fuzzy searching across titles, films, and artists; instant filtering across 66 stations, 415 singers, 23 composers, 12 lyricists, and 12 moods.
2. **Audio Streaming:** Seamless playback with queue management, shuffle, repeat, scrub bar, volume control, and lock screen media keys (Media Session API).
3. **Favourites:** Instant liking with particle burst visual effect; persistent in browser `localStorage` across tabs.
4. **Theme Backdrops:** 7 animated ambient video backdrops with low-power poster fallbacks.
5. **Full PWA Suite:** `manifest.ts` standalone display, early `beforeinstallprompt` capture, custom iOS Safari instructions, update-on-focus service worker, offline fallback.
6. **Responsive Layout:** Adaptive desktop sidebar rail, tablet drawer, and mobile bottom bar with height-guarded breakpoints.

---

## 4. Dependencies
- `@base-ui/react`: Unstyled accessible primitives (alert-dialog, tooltip, sheet, etc.).
- `@tanstack/react-query`: Static query caching and infinite virtualization pagination.
- `react-virtuoso`: High-performance DOM row virtualization for ~4,000 items.
- `lucide-react`: Lightweight SVG icon set.
- `next`: 16.2.12 (React 19 compatible).
- `tailwindcss` & `@tailwindcss/postcss`: Tailwind v4 compiler.

---

## 5. Areas Requiring Transformation
1. **Central Brand Configuration (`lib/brand.ts`):**
   - Centralize product name ("Sargam"), short name, tagline, description, author/credits, and storage keys.
2. **Visual Theme & Design Tokens (`globals.css` & `curious/design/page.tsx`):**
   - Transform from the Mehfil warm brass/brown theme (`#1a1613`, OKLCH 60 hue) to our own distinct, luxury theme: **Deep Midnight Obsidian & Radiant Luminous Amber/Gold with Rose Crimson accent**.
   - Update `--background`, `--sidebar`, `--card`, `--primary`, `--heart`, `--border`, `--muted-foreground`, and border radiuses.
3. **Brand Identity Assets (`public/`):**
   - Replace logo and icons: `logo.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`, `apple-icon.png`, `icon.png`, `favicon.ico`.
   - Update `opengraph-image.tsx` and `twitter-image.tsx` to render our new brand name, colors, and layout.
4. **PWA Manifest & Service Worker:**
   - In `app/manifest.ts`: Update name, short_name, description, theme_color, background_color.
   - In `public/sw.js`: Update cache prefix from `mehfil-${VERSION}` to `sargam-${VERSION}`.
5. **Install Prompt & Dialogs:**
   - In `components/install-prompt.tsx`, `components/install-card.tsx`, and `components/notice-dialog.tsx`: Replace hardcoded references to "Mehfil" with dynamic brand config.
   - Update `DISMISSED_KEY`, `SEEN_KEY`, `KEY` to new brand keys.
6. **Navigation, Footers & Header:**
   - Update `components/app-frame.tsx`: Logo, title, sidebar credits ("Inspired by Mehfil · Built and customized by our team").
7. **Documentation & Information Pages:**
   - `app/about/page.tsx`: Full rebranding with tasteful attribution to Mehfil.
   - `app/curious/design/page.tsx`: Fix syntax glitch and update palette display table to match new OKLCH tokens.
   - `app/curious/architecture/page.tsx`: Update text references.
   - `app/releases/page.tsx`: Add Release 1.0 (Our Branded Transformation).

---

## 6. Areas That Must Remain Unchanged
1. **Catalog Data Engine (`public/catalogue.json`, `lib/catalogue.ts`):**
   - The compiled song indexes, facet mapping, and YouTube IDs must remain intact to preserve full playback functionality.
2. **YouTube Player Engine (`components/player-provider.tsx`, `lib/media-session.ts`):**
   - The IFrame lifecycle, event listeners, and background persistence in root layout.
3. **Virtualization (`react-virtuoso` in `components/song-list.tsx`, `app/songs/page.tsx`):**
   - The performant scrolling and pagination logic.
4. **Routing Structure (`app/[kind]/[slug]/page.tsx`, `lib/routes.ts`):**
   - Preservation of deep links for stations, singers, composers, and films.

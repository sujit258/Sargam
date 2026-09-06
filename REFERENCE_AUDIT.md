# REFERENCE AUDIT: Mehfil (https://mehfil.shashwa7.in/)

**Audited Website:** [https://mehfil.shashwa7.in/](https://mehfil.shashwa7.in/)  
**Design Reference:** [https://mehfil.shashwa7.in/curious/design](https://mehfil.shashwa7.in/curious/design)  
**Architecture Reference:** [https://mehfil.shashwa7.in/curious/architecture](https://mehfil.shashwa7.in/curious/architecture)  
**Date:** September 2026  

---

## 1. Executive Summary
Mehfil is a retro Bollywood golden-era music discovery and player Progressive Web App (PWA). It is designed around browsing ~3,916 songs across 66 stations, 415 singers, 1,379 films, 23 composers, 12 lyricists, and 12 moods derived from the Carvaan Gold songlist. Audio playback is powered by embedded YouTube iframes with zero audio stored or hosted on the server.

---

## 2. Routes & Page Hierarchy
1. `/` — **Browse & Home**
   - Header with search bar, favourites shortcut, themes shortcut, and "Surprise" button (plays a random track with fanned artist avatars).
   - Category carousels: Stations, Decades, Featured Singers, Composers, Lyricists, Moods.
   - Ambient animated backdrop (Lofi room by default) with subdued wash.
2. `/songs` — **All Songs (Virtualised)**
   - Virtualized track list (~3,916 rows powered by `react-virtuoso`).
   - Sticky filter bar with facet drawers (Singers, Composers, Decades, Moods, etc.).
   - Instant search input with highlighting and instant query filtering.
3. `/favourites` — **Your Favourites**
   - Tracks liked by the user (stored in `localStorage`).
   - Shuffle play, track rows with like burst animation, empty state with invitation to browse.
4. `/[kind]/[slug]` — **Taxonomy / Facet Detail**
   - Collections for specific stations (`/station/lata-mangeshkar`), singers (`/singer/kishore-kumar`), composers, films, moods.
   - Header with station poster or artist photo portrait, song count, Play All, Shuffle buttons, and track rows.
5. `/contribute` — **Help Us Find Songs**
   - List of unverified / missing recording entries from the catalog.
   - "I have a link" button opening report dialog to submit YouTube links.
6. `/themes` — **Backdrop Theme Selector**
   - Selection of 7 animated video backdrops (Lofi room, Reading room, Meadow, Evening flock, Bus stop dusk, Bus stop night, Sleeping porch, None).
   - Instant live preview and localStorage persistence.
7. `/releases` — **Release Notes**
   - Chronological release timeline (0.1 to 0.9+) documenting new features, UX fixes, and catalog corrections.
8. `/curious/design` — **Design System**
   - Interactive tokens documentation (OKLCH palette, Figtree typography, height-guarded breakpoints, Base UI primitives, 4 core idioms).
9. `/curious/architecture` — **Architecture Deep-Dive**
   - Technical breakdown of the client-side architecture, player lifecycle in root layout, 24-step Python data pipeline, append-only song ID ledger, and service worker update mechanism.
10. `/about` — **About & Credits**
    - Legal disclaimers, Saregama/YouTube licensing statement, Wikimedia Commons portraits credit list, Openverse station artwork credits, and feedback contact.

---

## 3. Core UI Elements & Layout Architecture
- **Sidebar (Desktop, `lg:` breakpoint):**
  - Brand header with logo and song/station counts.
  - Primary navigation links: Browse (`/`), All songs (`/songs`), Your favourites (`/favourites`), Help us find songs (`/contribute`), and Install App button.
  - Texture: Ambient collage overlay (`/collage.jpg`) with gradient mask.
  - Secondary navigation: Themes (`/themes`), Release notes (`/releases`), For the curious (`/curious/design`), About & credits (`/about`).
  - Legal disclaimer & author attribution footer.
- **Top Bar / Header:**
  - Compact logo on mobile (`< lg`).
  - Search input with rounded pill design, glassmorphic backdrop blur.
  - Quick action icons: Favourites (warm red heart badge), Themes (palette), Surprise (disc icon with fanned artist portraits), Mobile Sheet menu trigger (hamburger).
- **Persistent Player Bar (Bottom):**
  - Survives page navigation because it is mounted in `app/layout.tsx` above page components.
  - Now playing track info with YouTube thumbnail art and right-fade gradient.
  - Controls: Previous, Play/Pause, Next, Shuffle, Repeat.
  - Scrub slider with elapsed time and duration (`tabular-nums`).
  - Interactive like button with particle burst animation (`LikeBurstHost`).
  - Volume slider and Queue drawer toggle.
  - Hidden YouTube iframe running in background.
  - Full-screen expanded player overlay with history state (`window.history.pushState`) to support device back button navigation.

---

## 4. Design System & Tokens
- **Color Model:** Perceptually uniform OKLCH.
  - `--primary`: `oklch(0.79 0.135 78)` (Brass/Gold accent)
  - `--heart`: `oklch(0.70 0.17 22)` (Warm Red, matched in perceptual lightness to brass)
  - `--background`: `oklch(0.16 0.006 60)` (Warm deep brown-black)
  - `--sidebar`: `oklch(0.115 0.005 60)` (Darker rail for visual depth)
  - `--card`: `oklch(0.21 0.008 60)` (Elevated panel surface)
  - `--muted-foreground`: `oklch(0.72 0.012 70)` (Secondary label text)
  - `--border`: `oklch(1 0 0 / 9%)` (White translucent border)
- **Breakpoints:** Height-guarded media queries to prevent sideways mobile phones (e.g. 844x390) from incorrectly rendering tablet layouts:
  - `sm`: `@media (width >= 40rem) and (height >= 30rem)`
  - `md`: `@media (width >= 48rem) and (height >= 30rem)`
  - `lg`: `@media (width >= 64rem) and (height >= 30rem)`

---

## 5. PWA Implementation & Installation Behavior
1. **Web App Manifest (`/manifest.webmanifest` / `app/manifest.ts`):**
   - `name`: "Mehfil — Retro Bollywood Songs"
   - `short_name`: "Mehfil"
   - `start_url`: "/"
   - `scope`: "/"
   - `display`: "standalone"
   - `orientation`: "portrait"
   - `background_color`: "#1a1613"
   - `theme_color`: "#1a1613"
   - Icons: 192x192, 512x512 (any), 512x512 (maskable).
2. **Service Worker (`public/sw.js`):**
   - Registered at `/sw.js?v=<buildId>` with `{ updateViaCache: "none" }`.
   - Dynamic caching strategy:
     - `/_next/static/*`: Cache-first (immutable fingerprinted chunks).
     - Everything else (HTML, `/catalogue.json`, images): Network-first with offline cache fallback.
   - Versioned cache name: `mehfil-${VERSION}`.
   - Activation drops all previous version caches and claims clients.
   - Focus listener on window to call `registration.update()`.
   - Listens for `controllerchange` to perform clean single reload when updated.
3. **Installation UX:**
   - Global capture of `beforeinstallprompt` at script evaluation time (prevents missing prompt during hydration).
   - `InstallButton` rendered in navigation rail and mobile drawer.
   - Automatic `InstallCard` prompt appears 5 seconds after first audio playback / welcome dismissal.
   - Platform detection:
     - Chromium/Desktop/Android: Native browser `deferredPrompt.prompt()`.
     - iOS Safari: Custom modal with step-by-step instructions (Tap Share icon -> Add to Home Screen).
     - Standalone detection via `window.matchMedia("(display-mode: standalone)").matches` and `navigator.standalone`.
     - Hides install controls once installed (`appinstalled` event listener).

---

## 6. Technical Assumptions & Contracts
- Single static catalog file `web/public/catalogue.json` (~646 KB) holding all song records and facet indexes.
- All audio streams through standard YouTube IFrame Player API (`YT.Player`).
- Four `localStorage` keys used:
  1. `mehfil:backdrop:v1`
  2. `mehfil:notice-seen:v1`
  3. `mehfil:favourites:v1`
  4. `mehfil.installDismissed`
- No user accounts, cookies, or tracking IDs.

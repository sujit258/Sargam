# SARGAM System Architecture

## 1. High-Level Architecture
Sargam is built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. It features a persistent root layout audio engine that hosts an official embedded YouTube iframe player while pages navigate smoothly without interrupting playback.

```
[Browser Client (PWA)]
     │
     ├── Layout Layer (Persistent PlayerProvider, YouTube Iframe Host, Media Session)
     │       │
     │       └── AppFrame (Desktop Navigation Rail, Mobile Bottom Nav, Header)
     │               │
     │               ├── / (Discover Page: Aajcha Sargam, Eras, Marathi, Station Grid)
     │               ├── /songs (Virtualized Track List via react-virtuoso)
     │               ├── /favourites (Local Storage Favorites Collection)
     │               ├── /themes (Moving Ambient Backdrops)
     │               └── /[kind]/[slug] (Static Prerendered Taxonomy Collections)
     │
     └── Data Layer
             │
             ├── TanStack Query (Catalogue & Manifest In-Memory Caching)
             ├── Service Worker (sargam-v1 Cache-First Static, Network-First JSON)
             └── LocalStorage (sargam:favorites, sargam:history, sargam:preferences)
```

---

## 2. Audio Playback Mechanics
- **Zero Server Hosting:** No MP3 or audio binaries are hosted or served.
- **Embedded API:** Driven by YouTube IFrame Player API.
- **Background Audio & Lockscreen:** Powered by HTML5 Media Session API (`navigator.mediaSession`) transmitting artwork, track title, and playback handlers to OS notification centers and lock screens.
- **History Modal Stack:** Expanding the full-screen now-playing drawer pushes `{ sargamPlayer: true }` into `window.history`, allowing hardware back gestures to dismiss the drawer without leaving the site.

# Sargam PWA Guide & Architecture

## Overview
**Sargam — Retro Bollywood Melodies** is engineered as a standalone, production-ready Progressive Web Application (PWA). It delivers a native-like music listening experience on mobile (Android, iOS) and desktop (Windows, macOS, ChromeOS) devices without requiring an app store download.

---

## 1. Installation Across Platforms

### Android (Chromium: Chrome, Edge, Brave, Samsung Internet)
- **Mechanism**: The app listens for the browser's native `beforeinstallprompt` event via `web/components/install-prompt.tsx`.
- **Prompt Flow**: When eligible and not previously dismissed (stored in `localStorage['sargam.installDismissed']`), an elevated, ambient-styled bottom banner or install trigger card (`web/components/install-card.tsx`) is displayed.
- **Native Invocation**: Clicking **Install Sargam** triggers `promptEvent.prompt()`.
- **Completion Detection**: Once accepted, the browser fires the `appinstalled` event, updating application state, persisting installation acknowledgment, and hiding the prompt.
- **App Experience**: Installed to the Android app drawer and home screen, launching fullscreen in `display: standalone` mode with status bar color matched to `--background` (`#0f121a`).

### iOS (Safari on iPhone & iPad)
- **Constraint**: Apple Safari does not support the `beforeinstallprompt` API or programmatic install triggers.
- **Solution**: Sargam detects iOS Safari (via User-Agent and touch capability checks while verifying non-standalone mode `navigator.standalone !== true`).
- **Instructional Sheet**: When the user taps **Install Sargam**, an interactive, illustrated bottom sheet modal appears detailing the step-by-step procedure:
  1. Tap the Safari **Share** icon (box with upward arrow) in the browser toolbar.
  2. Scroll and select **Add to Home Screen**.
  3. Tap **Add** in the upper right corner.
- **Meta Configuration**:
  - `apple-mobile-web-app-capable: yes`
  - `apple-mobile-web-app-status-bar-style: black-translucent`
  - High-resolution `apple-touch-icon.png` (180x180) in `web/public/icons/`.

### Windows / macOS / Linux / ChromeOS (Desktop Chrome & Edge)
- **Mechanism**: Modern Chromium desktop browsers support native PWA installation.
- **Desktop Prompt**: The install icon / banner appears in the desktop sidebar when `beforeinstallprompt` is fired.
- **Window Frame**: Launches as an independent, frameless desktop window with customized title bar and Sargam window icon.

---

## 2. Web App Manifest

The manifest is generated dynamically via Next.js Metadata Route `web/app/manifest.ts` and served at `/manifest.webmanifest`:

```typescript
{
  name: "Sargam — Retro Bollywood Melodies",
  short_name: "Sargam",
  description: "Browse and play golden-era Hindi film music by singer, composer, lyricist, actor, film and mood. Over 3,900 songs across 66 stations.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "any",
  background_color: "#0f121a",
  theme_color: "#0f121a",
  categories: ["music", "entertainment"],
  icons: [
    { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}
```

---

## 3. Service Worker & Caching Strategy

The service worker is implemented in `web/public/sw.js` under the `sargam-${VERSION}` cache namespace.

### Caching Tiers:
1. **Static Immutable Assets (`/_next/static/*`, `/icons/*`, `/favicons/*`)**:
   - **Strategy**: Cache-First with indefinite lifetime.
   - Asset hashes prevent stale assets when new versions are published.
2. **Dynamic HTML & App Shell Routes (`/`, `/songs`, `/favourites`, `/themes`, `/curious/*`)**:
   - **Strategy**: Network-First with Cache Fallback.
   - Ensures users always receive the newest client bundle upon refresh, falling back to cached shell if offline.
3. **Catalogue Payload (`/catalogue.json`)**:
   - **Strategy**: Network-First with Stale-While-Revalidate pattern.
   - Fetches current catalogue updates without breaking offline playback of cached stations.
4. **YouTube Audio & Media Streams**:
   - Audio is streamed dynamically via YouTube iFrame API (`www.youtube-nocookie.com`). Media chunks are managed by YouTube's player and are exempt from standard service worker caching to prevent quota exhaustion and copyright violations.

---

## 4. Updates & Lifecycle

- **Registration**: Registered in `web/app/providers.tsx`.
- **Focus Updates**: When the user refocuses the application window or tab, the service worker checks `registration.update()` to pick up any new service worker revisions immediately.
- **Skip Waiting**: New service worker versions activate and take control of existing clients, pruning outdated `sargam-*` cache stores.

---

## 5. Deep Linking & Routing Support

All routes are fully linkable and survive direct browser navigation and PWA launching:
- `/songs` — Search and filter the complete catalogue of 3,916 songs
- `/favourites` — Local offline favourites collection
- `/themes` — Ambient backdrop selection
- `/singer/:slug` — Dedicated singer stations (e.g. `/singer/lata-mangeshkar`, `/singer/kishore-kumar`)
- `/composer/:slug` — Dedicated composer collections (e.g. `/composer/r-d-burman`)
- `/lyricist/:slug` — Dedicated lyricist stations (e.g. `/lyricist/sahil-ludhianvi`)
- `/curious/design` — Design system documentation
- `/curious/architecture` — Technical overview

---

## 6. Known PWA Limitations

1. **Audio Streaming Offline**: While song metadata, station definitions, and interface assets work offline, YouTube embedded audio requires an active internet connection to stream media bytes. An offline indicator banner (`OfflineNotice`) alerts the user when connectivity drops.
2. **iOS Background Playback**: iOS Safari restricts unmuted background audio unless controlled via the HTML5 Media Session API or active user touch invocation. Sargam configures `navigator.mediaSession` handlers (`play`, `pause`, `nexttrack`, `previoustrack`) in `web/lib/media-session.ts` to maximize iOS Lock Screen controllability.

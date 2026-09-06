# SARGAM Progressive Web Application (PWA) Guide

**Production Domain:** https://sargam.suvidhatools.in

---

## 1. Platform Installation Features

### Android (Chromium Browsers)
- Listens for `beforeinstallprompt` via `web/components/install-prompt.tsx`.
- Displays native install prompts triggered by custom elevated ambient cards.
- Tracks `appinstalled` to update UI and suppress repetitive install requests.

### iOS Safari
- Apple Safari lacks programmatic installation APIs.
- Sargam displays a custom instructional sheet guide (*Tap Share → Add to Home Screen → Add*).
- Fullscreen standalone execution enabled via `apple-mobile-web-app-capable: yes` and `apple-mobile-web-app-status-bar-style: black-translucent`.

### Desktop (Windows, macOS, ChromeOS)
- Native install action in sidebar and browser omnibox.
- Frameless standalone desktop window with Sargam window mark.

---

## 2. Service Worker Strategy (`web/public/sw.js`)
- Cache Namespace: `sargam-${VERSION}`
- Static fingerprinted assets (`/_next/static/*`): **Cache-First**
- Catalog (`/catalogue.json`): **Network-First** with stale fallback
- HTML documents: **Network-First** for immediate update pickup

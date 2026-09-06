# SARGAM — Agent Handoff Brief for `feature/sargam-transformation-v2`

**Date:** 2026-09-07  
**Branch:** `feature/sargam-transformation-v2`  
**Production:** https://sargam.suvidhatools.in  
**Repo:** https://github.com/sujit258/Sargam

---

## WHAT WAS ASKED

Transform the Sargam repository (Mehfil-derived) into a completely independent Indian music PWA:

- Completely redesign the UI from scratch (not a Mehfil reskin)
- Remove the permanent left sidebar — use compact top nav on desktop
- Use bottom navigation on mobile with persistent mini-player above it
- Artwork-first, editorial, archive-inspired design identity
- Language-first catalogue (Hindi + Marathi active, others future-ready)
- Preserve ALL existing Hindi catalogue (3,916 songs)
- Improve background playback / Media Session API
- Rewrite all Mehfil-derived documentation
- Python catalog engine transformed into Sargam Catalog Engine

---

## WHAT IS COMPLETE

### ✅ Catalogue & Data
- Hindi baseline: 3,916 songs, frozen in `data/catalogs/hindi/songs.json`
- Marathi: 100 songs in `data/catalogs/marathi/songs.json`
- 8 Marathi stations in `data/stations/marathi_stations.json`
- `/languages/marathi` page exists

### ✅ Background Playback
- `seekbackward` / `seekforward` Media Session handlers
- Absolute artwork URLs in MediaMetadata
- Position polling during BUFFERING (not just `playing===true`)
- Background nudge 2s after ENDED
- Documented in `docs/BACKGROUND_PLAYBACK.md`

### ✅ Infrastructure
- `web/lib/brand.ts` — Sargam brand config, storage keys
- `web/lib/media-session.ts` — complete Media Session API
- `web/lib/releases.ts` — Sargam release history
- `catalog/` — Python Sargam Catalog Engine
- Tests: 9/9 passing
- Build: clean (2,045 static pages)

### ✅ Docs
- `docs/ATTRIBUTION.md`
- `docs/BACKGROUND_PLAYBACK.md`
- `docs/SARGAM_TRANSFORMATION_AUDIT.md`
- `docs/catalog/SARGAM_MARATHI_CATALOG.md`

---

## WHAT IS PENDING (NEW AGENT MUST DO)

### 🔴 PRIORITY 1: Remove Sidebar, Redesign Layout

**File:** `web/components/app-frame.tsx` (501 lines)

Current: permanent left sidebar (Mehfil-pattern)
Required: compact top nav on desktop, bottom tabs on mobile

Desktop:
```
SARGAM    Discover  Explore  Languages  Stations    🔍  ☰
──────────────────────────────────────────────────────────
[full-width content]
──────────────────────────────────────────────────────────
[persistent player bar]
```

Mobile:
```
SARGAM                                            🔍
[content]
[mini-player: artwork | song | ▶ | ♡]
[Home | Explore | Search | Library]
```

### 🔴 PRIORITY 2: New Design System

**File:** `web/app/globals.css`

Replace amber/Mehfil palette with Sargam palette.
Add display/editorial serif font (Playfair Display or DM Serif Display) alongside Figtree.
Create new CSS custom property tokens.

### 🔴 PRIORITY 3: New Home Page

**File:** `web/app/page.tsx`

Remove marketing hero. Replace with editorial structure:
1. SARGAM — "THE MUSIC THAT STAYED" — editorial heading
2. FEATURED LISTENING — large artwork + song details
3. EXPLORE INDIA — language grid
4. GOLDEN ERAS — 1950s through 1990s
5. MARATHI SPOTLIGHT
6. RECENTLY PLAYED
7. STATIONS / SURPRISE ME

### 🟡 PRIORITY 4: Player Visual Update

**File:** `web/components/player-bar.tsx`

Functional code is correct. Update visual styling to match new design system.

### 🟡 PRIORITY 5: Clean Attribution References

- `pipeline/fetch_station_posters.py` line 23: Update User-Agent from `MehfilPersonalProject` to `SargamCatalogEngine`
- `web/app/about/page.tsx`: Review Mehfil mentions — keep legal attribution, remove product-language
- `web/app/curious/architecture/page.tsx`: Rewrite to describe Sargam architecture, not Mehfil's

### 🟢 PRIORITY 6: Quality Gates + Commit

```bash
npx tsc --noEmit        # 0 errors
npm run lint            # 0 errors
npm run build           # must succeed
npm test                # 9/9 pass
git add -A
git commit -m "feat: sargam independent UI/UX redesign"
git push origin feature/sargam-transformation-v2
```

---

## ACCEPTANCE TEST

| Question | Required Answer |
|---|---|
| Does Sargam look like Mehfil? | NO |
| Permanent sidebar on desktop? | NO |
| Bottom nav on mobile? | YES |
| Mini-player above bottom nav? | YES |
| Design is artwork-first? | YES |
| Hindi songs intact (3,916)? | YES |
| `npm run build` succeeds? | YES |
| All 9 tests pass? | YES |
| `npx tsc --noEmit` clean? | YES |

---

## KEY CONSTRAINTS

- Do NOT change HTML audio source strategy (YouTube IFrame stays)
- Do NOT renumber Hindi song IDs (1–3916)  
- Do NOT renumber Marathi IDs (`mar-xxx-nnn`)
- Do NOT wipe user favourites / history localStorage
- Do NOT fabricate song metadata or YouTube IDs
- Next.js 16.2.12 with Turbopack
- TypeScript strict mode
- Tailwind CSS

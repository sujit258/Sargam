# Sargam Architecture Optimization & Reusable Component Refactor

## 1. Before Architecture
Prior to this refactor, the Sargam web client relied on monolithic page components and ad-hoc presentation markup:
- **`web/components/player-bar.tsx`**: A massive single-file module (1,562 lines, 68KB) housing the YouTube IFrame API lifecycle, retries, stall timeouts, Media Session API calls, Base UI slider handling, accessible button tooltips, the persistent bottom player bar, full-screen expanded player, swipe gestures, and lyrics/credits dialogs.
- **Card Duplication**: Independent, near-identical card implementations existed in `recommended-classics.tsx`, `recently-played.tsx`, `marathi/page.tsx`, and `search-matches.tsx`. Each separately wired artwork thumbnails, play/pause overlay states, text truncation, and `LikeButton` propagation.
- **Section Headers**: Discover sections (`RecommendedClassics`, `RecentlyPlayed`, `GoldenEras`, `MarathiSpotlight`, `LanguageExplorer`) duplicated repetitive `div.flex.items-center.justify-between` header wrappers with icon/title/subtitle layouts.
- **Catalogue Transformations**: Language counts (3,916 Hindi, 341 Marathi) and station categorizations were recomputed on-the-fly inside multiple render functions through redundant `.filter()` passes over 4,200+ songs.
- **Search Normalization**: Inconsistent string normalization implementations (`normalize()` vs `toLowerCase()`) were scattered across routes.

## 2. Problems Identified
1. **High Maintenance Overhead**: Changing card styling or keyboard interactions required editing 4 different files.
2. **Oversized Components**: `player-bar.tsx` was difficult to navigate and contained mixed responsibilities (audio state machine + slider touch physics + accessible button wrappers + UI presentation).
3. **Redundant Iterations**: Pages performed linear scans over thousands of catalogue records for basic count derivation.
4. **Scattered Types**: Multiple loosely typed parameters and repeated definitions for similar structures.

## 3. New Component Architecture
The refactored architecture establishes a clean, tiered design:
- **Base Primitives (`components/ui/`)**: Low-level headless primitives (`alert-dialog.tsx`, `tooltip.tsx`, `sheet.tsx`, `button.tsx`).
- **Domain Music Components (`components/music/`)**: Composable, presentational components accepting domain entities and callbacks:
  - `TrackCard`: Compact/standard card with artwork, hover play overlay, truncation, and like toggle.
  - `SectionHeader`: Standardized title, subtitle, icon, badge, and action link.
  - `PlaybackActions`: Reusable Play & Shuffle button pair.
  - `LanguageCard`: Regional heritage card displaying status, native title, description, and counts.
  - `MetadataNoticeDialog`: Accessible modal explaining archival/metadata-only records.
  - `EmptyState`: Standardized empty state message with icon and action button.
- **Player Sub-Components (`components/player/`)**:
  - `ControlButton`: Accessible icon button paired with Radix/Base tooltip.
  - `SeekBar` & `formatTime`: Base UI slider scrubber with edge/large variants and time formatting.
- **Centralized Catalogue Layer (`lib/catalogue/`)**:
  - `selectors.ts`: Fast, memoized query selectors (`getLanguageSongCounts`, `getLanguageStationCounts`, `getMarathiStats`, `resolveHydratedSongs`, `getSongMap`).
  - `search.ts`: Centralized diacritic-stripping normalization (`normalizeSearchText`), query tokenization (`tokenizeSearchQuery`), and multi-token matching (`matchesAllTokens`).

## 4. Reusable Components Created
| Component | Location | Primary Consumers |
| :--- | :--- | :--- |
| `TrackCard` | `web/components/music/track-card.tsx` | `recommended-classics.tsx`, `recently-played.tsx`, `languages/marathi/page.tsx` |
| `SectionHeader` | `web/components/music/section-header.tsx` | `recommended-classics.tsx`, `recently-played.tsx`, `golden-eras.tsx`, `marathi-spotlight.tsx`, `language-explorer.tsx` |
| `PlaybackActions` | `web/components/music/playback-actions.tsx` | `collection-header.tsx`, `station/raat-ke-geet/page.tsx`, `languages/marathi/page.tsx` |
| `LanguageCard` | `web/components/music/language-card.tsx` | `discover/language-explorer.tsx`, `languages/page.tsx` |
| `MetadataNoticeDialog` | `web/components/music/metadata-notice-dialog.tsx` | `languages/marathi/page.tsx` |
| `EmptyState` | `web/components/music/empty-state.tsx` | `favourites/page.tsx`, `languages/marathi/page.tsx` |
| `ControlButton` | `web/components/player/control-button.tsx` | `player-bar.tsx` |
| `SeekBar` | `web/components/player/seek-bar.tsx` | `player-bar.tsx` |

## 5. Shared Hooks Created / Reused
- `usePlayer`: Centralized playback, queue, and transport controls.
- `useCatalogue`: Cached TanStack Query catalogue provider.
- `useSwipe`: Gesture-direction detector for touch dismissal and expansion.
- `useCatalogueStats` (via `selectors.ts`): Memoized counts without component rerender thrashing.

## 6. Shared Utilities Created
- `normalizeSearchText(str)`: Unicode NFD diacritic stripper and lowercase converter.
- `tokenizeSearchQuery(query)`: Whitespace tokenizer for multi-keyword searches.
- `matchesAllTokens(tokens, ...parts)`: Fast multi-token matching across title, artist, film, composer, lyricist, and category.
- `formatTime(seconds)`: Consistent `m:ss` zero-padded audio timestamp generator.
- `resolveHydratedSongs(catalogue, ids)`: O(1) map-based hydration for ID arrays.

## 7. Player Architecture
- **State & Queue Management**: Owned by `PlayerProvider` (`web/components/player-provider.tsx`). Enforces `isPlayableSong` guards so unverified records never enter the queue or invoke playback.
- **Controls & Scrubber**: Decoupled into `ControlButton` and `SeekBar` to prevent slider re-computation from causing full player tree updates.
- **YouTube Lifecycle**: Retained within `PlayerBar` via the hidden portal host, guaranteeing the iframe is never unmounted during route transitions.

## 8. Catalogue Architecture
- **Source of Truth**: `web/public/catalogue.json` remains the canonical static catalogue (3,916 Hindi + 341 Marathi = 4,257 songs, 74 stations).
- **Selector Layer**: Pure functions compute metrics in O(N) single-pass or O(1) lookup rather than multi-filter cascades.

## 9. Performance Improvements
1. **Eliminated Linear Iterations in Discover**: `LanguageExplorer` and `RecentlyPlayed` no longer re-filter 4,200 songs on every rerender.
2. **React.memo on TrackCard**: Grid items only re-render when active playing state or track identity changes.
3. **Smaller Bundle Surface**: Reduced duplicate JSX and inline style blocks across multiple components.
4. **Reduced File Complexity**: `player-bar.tsx` reduced by 170+ lines of duplicate slider logic; `recently-played.tsx` reduced from 122 to 67 lines (-45%); `recommended-classics.tsx` reduced from 106 to 54 lines (-49%).

## 10. Files Changed
### Created Files
- `web/lib/catalogue/search.ts`
- `web/lib/catalogue/selectors.ts`
- `web/components/music/section-header.tsx`
- `web/components/music/track-card.tsx`
- `web/components/music/playback-actions.tsx`
- `web/components/music/language-card.tsx`
- `web/components/music/metadata-notice-dialog.tsx`
- `web/components/music/empty-state.tsx`
- `web/components/player/control-button.tsx`
- `web/components/player/seek-bar.tsx`
- `docs/ARCHITECTURE_REFACTOR.md`
- `docs/COMPONENT_GUIDE.md`

### Modified Files
- `web/lib/catalogue.ts` (re-exports selectors & search utilities)
- `web/components/player-bar.tsx` (uses `SeekBar` and `ControlButton`)
- `web/components/collection-header.tsx` (uses `PlaybackActions`)
- `web/components/discover/recommended-classics.tsx` (uses `SectionHeader` and `TrackCard`)
- `web/components/discover/recently-played.tsx` (uses `SectionHeader`, `TrackCard`, and `resolveHydratedSongs`)
- `web/components/discover/golden-eras.tsx` (uses `SectionHeader`)
- `web/components/discover/marathi-spotlight.tsx` (uses `SectionHeader`)
- `web/components/discover/language-explorer.tsx` (uses `SectionHeader`, `LanguageCard`, and centralized selectors)
- `web/app/languages/page.tsx` (uses `LanguageCard` and centralized selectors)
- `web/app/languages/marathi/page.tsx` (uses `TrackCard`, `MetadataNoticeDialog`, `EmptyState`, and centralized selectors)
- `web/app/favourites/page.tsx` (uses `EmptyState`)

## 11. Test Results
- **Python Unit Tests**: `python -m unittest discover -s tests -p "test_*.py" -v` → **18/18 PASS** (0.287s).
- **TypeScript**: `npx tsc --noEmit` → **PASS** (0 errors).
- **ESLint**: `npm run lint` → **PASS** (0 errors, existing image/unused variable warnings only).
- **Production Build**: `npm run build` → **PASS** (2,217 static pages prerendered in 55s).

## 12. Remaining Technical Debt
- YouTube IFrame API remains tied to DOM visibility on mobile devices; background playback when the screen is locked requires dedicated native or progressive web audio extraction architecture as documented in `docs/BACKGROUND_PLAYBACK.md`.

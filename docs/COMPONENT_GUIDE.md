# Sargam Component Guide

This guide documents the reusable components introduced during the architecture optimization refactor. Use these components when extending or creating new features in Sargam.

---

## 1. `TrackCard` (`web/components/music/track-card.tsx`)

### Purpose
Renders a song card in grid layouts with artwork thumbnail, play/pause hover overlay, title, artist/film metadata, like toggle button, and keyboard accessibility.

### Props
```typescript
interface TrackCardProps {
  song: Song;
  isPlaying?: boolean;
  isCurrent?: boolean;
  onSelect: (song: Song) => void;
  subtitle?: string | null;
  secondaryText?: string | null;
  size?: "default" | "compact"; // compact is used in dense views (e.g. Recently Played)
  showLike?: boolean; // default: true
  className?: string;
}
```

### Example Usage
```tsx
import { TrackCard } from "@/components/music/track-card";

<TrackCard
  song={song}
  isPlaying={playing}
  isCurrent={currentTrack?.id === song.id}
  onSelect={(song) => {
    if (currentTrack?.id === song.id) toggle();
    else play(song);
  }}
  subtitle={song.artists.join(", ") || "Golden Era"}
  secondaryText={song.film || "Cinema Classic"}
/>
```

### Where It Is Used
- `web/components/discover/recommended-classics.tsx`
- `web/components/discover/recently-played.tsx`
- `web/app/languages/marathi/page.tsx`

### What Should NOT Be Placed Inside It
- Direct catalogue fetch calls (`useCatalogue`).
- Direct queue modification logic.
- Hardcoded page-specific routing logic.

---

## 2. `SectionHeader` (`web/components/music/section-header.tsx`)

### Purpose
Standardizes section title headers across the application with icon, title, optional badge, subtitle, and action link.

### Props
```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  badge?: React.ReactNode;
  action?: { label: string; href: string } | React.ReactNode;
  className?: string;
}
```

### Example Usage
```tsx
import { SectionHeader } from "@/components/music/section-header";
import { Disc } from "lucide-react";

<SectionHeader
  title="Recommended Classics"
  subtitle="Hallmark recordings that defined the golden age of Indian cinema."
  icon={Disc}
  iconClassName="text-primary"
  action={{ label: "View All", href: "/songs" }}
/>
```

### Where It Is Used
- `web/components/discover/recommended-classics.tsx`
- `web/components/discover/recently-played.tsx`
- `web/components/discover/golden-eras.tsx`
- `web/components/discover/marathi-spotlight.tsx`
- `web/components/discover/language-explorer.tsx`

### What Should NOT Be Placed Inside It
- Complex multi-control button rows (use separate action containers).
- Dynamic data state hooks.

---

## 3. `PlaybackActions` (`web/components/music/playback-actions.tsx`)

### Purpose
Standardized Play and Shuffle button pair for collection headers, station pages, and playlists.

### Props
```typescript
interface PlaybackActionsProps {
  onPlay: () => void;
  onShuffle: () => void;
  playLabel?: string;     // default: "Play"
  shuffleLabel?: string;  // default: "Shuffle"
  className?: string;
  disabled?: boolean;
}
```

### Example Usage
```tsx
import { PlaybackActions } from "@/components/music/playback-actions";

<PlaybackActions
  onPlay={() => playFirst(songs)}
  onShuffle={() => playRandom(songs)}
  className="mt-4 justify-center sm:justify-start"
/>
```

### Where It Is Used
- `web/components/collection-header.tsx`
- `web/app/station/raat-ke-geet/page.tsx`
- `web/app/languages/marathi/page.tsx`

### What Should NOT Be Placed Inside It
- Audio loading indicators (handled by the persistent player bar).
- Volume controls.

---

## 4. `LanguageCard` (`web/components/music/language-card.tsx`)

### Purpose
Displays regional language heritage cards with native script names, status badges (Active vs Upcoming), descriptions, and live song/station count tallies.

### Props
```typescript
interface LanguageCardProps {
  lang: LanguageMeta;
  songCount?: number | null;
  stationCount?: number | null;
  isSelected?: boolean;
  className?: string;
}
```

### Example Usage
```tsx
import { LanguageCard } from "@/components/music/language-card";

<LanguageCard
  lang={languageMeta}
  songCount={341}
  stationCount={8}
/>
```

### Where It Is Used
- `web/components/discover/language-explorer.tsx`
- `web/app/languages/page.tsx`

### What Should NOT Be Placed Inside It
- Direct audio playback triggers (languages are hubs that navigate to catalogue collections).

---

## 5. `MetadataNoticeDialog` (`web/components/music/metadata-notice-dialog.tsx`)

### Purpose
Accessible alert dialog explaining that a song's metadata is verified in the canonical catalogue while its audio stream is currently under verification.

### Props
```typescript
interface MetadataNoticeDialogProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

### Example Usage
```tsx
import { MetadataNoticeDialog } from "@/components/music/metadata-notice-dialog";

<MetadataNoticeDialog
  song={unverifiedSong}
  open={Boolean(unverifiedSong)}
  onOpenChange={(open) => !open && setUnverifiedSong(null)}
/>
```

### Where It Is Used
- `web/app/languages/marathi/page.tsx`
- Any future regional expansion page with archival records.

### What Should NOT Be Placed Inside It
- Form submissions or bug reports (use `ReportDialog` for reporting broken videos).

---

## 6. `EmptyState` (`web/components/music/empty-state.tsx`)

### Purpose
Consistent empty state message with optional icon, title, description, and action button/link.

### Props
```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}
```

### Example Usage
```tsx
import { EmptyState } from "@/components/music/empty-state";
import { Heart } from "lucide-react";

<EmptyState
  icon={Heart}
  message="Nothing here yet. Tap the heart beside any song and it will be waiting for you."
  action={{ label: "Browse all songs", href: "/songs" }}
/>
```

### Where It Is Used
- `web/app/favourites/page.tsx`
- `web/app/languages/marathi/page.tsx`

---

## 7. `SeekBar` & `formatTime` (`web/components/player/seek-bar.tsx`)

### Purpose
Touch-friendly audio progress and seeker bar built on Base UI Slider with dragging preview state, large/compact variants, and time formatting utility.

### Props
```typescript
interface SeekBarProps {
  value: number; // 0..1 fraction
  onCommit: (fraction: number) => void;
  disabled?: boolean;
  className?: string;
  large?: boolean;
  edge?: boolean; // Hairline edge mode for desktop top border
}
```

### Example Usage
```tsx
import { SeekBar, formatTime } from "@/components/player/seek-bar";

<SeekBar
  value={duration > 0 ? elapsed / duration : 0}
  onCommit={(fraction) => seek(fraction * duration)}
  edge
/>
```

### Where It Is Used
- `web/components/player-bar.tsx`

---

## 8. `ControlButton` (`web/components/player/control-button.tsx`)

### Purpose
Accessible icon button paired with Radix/Base UI Tooltip. Ensures screen reader labels and tooltips never drift.

### Props
```typescript
interface ControlButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  className: string;
  children: React.ReactNode;
}
```

### Where It Is Used
- `web/components/player-bar.tsx` (transport buttons, menu buttons, full-screen toggles).

# Background Audio Playback — Architecture & Platform Guide

## Overview

Sargam uses the **YouTube IFrame Player API** (`YT.Player`) for all audio playback. This is the most important fact for understanding background playback behaviour across every platform.

Audio is NOT delivered via:
- `HTMLAudioElement`
- `HTMLVideoElement` (controlled)
- `Web Audio API`
- A licensed audio CDN

It is delivered via a **YouTube IFrame embed** with the video visually hidden (positioned off-screen). The IFrame communicates via the `postMessage` channel through the `YT.PlayerState` callback.

---

## Architecture

```
RootLayout
 └── PlayerProvider (persistent across all route changes)
      └── PlayerBar (rendered in root layout via portal context)
           └── YT.Player (YouTube IFrame, portalled to <body>)
                ├── onStateChange → PLAYING / PAUSED / BUFFERING / ENDED
                ├── onError → retry / skip
                └── MediaSession API → OS lock screen + headset controls
```

The YouTube IFrame is **portalled to `<body>`** and lives permanently for the app lifetime. Route changes never destroy it. This is the correct architecture.

---

## Media Session API

Sargam declares a `navigator.mediaSession` on every track, which tells the OS:
- "This page is actively playing media — keep it running"
- What song is playing (title, artist, film, artwork)
- Play/Pause/Next/Previous/Seek controls for the lock screen

### Registered Handlers

| Action | Handler |
|---|---|
| `play` | `player.playVideo()` |
| `pause` | `player.pauseVideo()` |
| `nexttrack` | advance queue |
| `previoustrack` | step back in queue |
| `seekto` | `player.seekTo(seconds)` |
| `seekbackward` | `player.seekTo(currentTime - delta)` (10s default) |
| `seekforward` | `player.seekTo(currentTime + delta)` (10s default) |

`seekbackward` and `seekforward` handle Bluetooth headsets, car media units, and Android notification/lock-screen rewind and fast-forward buttons.

### Artwork

Artwork URLs are resolved to **absolute URLs** before being passed to `MediaMetadata`. The OS fetches artwork from outside the browser context — relative URLs like `/logo.png` would fail. Two sizes are provided:
- `480x360` — YouTube hq thumbnail
- `320x180` — YouTube mq thumbnail

---

## Background Playback: Platform Reality

> [!IMPORTANT]
> Because Sargam uses YouTube IFrame embeds, background playback behaviour is partially determined by YouTube's own player and the platform/OS — not exclusively by Sargam's code.

### Desktop (Chrome / Edge / Brave / Firefox)

| Scenario | Expected |
|---|---|
| Switch browser tab | ✅ Audio continues |
| Minimize browser window | ✅ Audio continues |
| Switch to another application | ✅ Audio continues |
| Lock screen (desktop) | ✅ Audio continues |
| OS media controls (Windows) | ✅ When Media Session is active |

Desktop browsers with an active `mediaSession` keep YouTube iframes alive in background tabs. This is **reliable** on all major desktop browsers.

### Android Chrome / Android PWA

| Scenario | Expected |
|---|---|
| App backgrounded (screen on) | ✅ Continues |
| Notification controls | ✅ Play/Pause/Next/Prev |
| Lock screen controls | ✅ When Media Session is active |
| Screen lock (mid-track) | ⚠️ Usually continues; OS may freeze JS on very low-end devices |
| Screen lock (track ends) | ⚠️ Track-advance JS runs in background; background nudge mitigates freezes |
| Switch to another app | ✅ Continues |

The `mediaSession` declaration is the primary signal Android uses to decide whether to keep the page alive. Without it, Android treats the page as a generic webpage and may freeze it after the screen locks.

A **background nudge** (2-second timer after `ENDED`) is implemented to recover from rare cases where the React re-render chain for next-track is throttled under Android's background CPU governor.

### iOS Safari / iOS PWA

| Scenario | Expected |
|---|---|
| Switch tabs | ❌ YouTube background blocked by iOS policy |
| Home screen | ❌ YouTube background blocked by iOS policy |
| Lock screen | ❌ YouTube background blocked by iOS policy |

iOS blocks background audio for cross-origin iframes by design. There is no workaround for this without using a licensed audio CDN (not YouTube).

> [!WARNING]
> If Sargam ever migrates away from YouTube to a licensed direct-audio CDN, replacing `YT.Player` with a persistent `HTMLAudioElement` would restore full background playback on iOS and further improve reliability everywhere else.

---

## Test Matrix

Use this checklist to verify background playback on every deploy.

### Desktop

| # | Test | Expected |
|---|---|---|
| 1 | Play song → Switch tab → Wait 2 min → Return | Audio played throughout |
| 2 | Play song → Minimize browser → Wait 2 min → Restore | Audio played throughout |
| 3 | Play song → Switch application → Wait 2 min → Return | Audio played throughout |
| 4 | Play song → Windows lock screen → Unlock | Audio resumed |
| 5 | OS media controls visible | Song title + artist shown |
| 6 | OS Previous/Next controls | Track changes correctly |
| 7 | Bluetooth headset Next/Prev buttons | Track changes correctly |
| 8 | Bluetooth headset rewind/forward | Seeks ±10s correctly |
| 9 | Play queue of 5 songs unattended | All 5 play in sequence |

### Android Chrome / PWA

| # | Test | Expected |
|---|---|---|
| 1 | Play → Lock screen → Notification controls visible | ✅ |
| 2 | Play → Lock screen → Press Next | Track changes |
| 3 | Play → Lock screen → Wait for track to end | Next track starts |
| 4 | Play → Switch app → Wait | Audio continues |
| 5 | Bluetooth headset connected → Next/Prev | Track changes |
| 6 | Bluetooth headset → Rewind/Forward | Seeks ±10s |
| 7 | Play queue of 5 songs → Lock screen | All 5 play in sequence |

### iOS (Document limitations)

| # | Test | Expected |
|---|---|---|
| 1 | Play → Lock screen | ❌ Audio stops (iOS blocks cross-origin iframes) |
| 2 | Play → Switch app | ❌ Audio stops |

---

## Why Audio Might Stop (Root Cause Guide)

| Symptom | Root Cause | Fix |
|---|---|---|
| Audio stops when tab is hidden on desktop | Code was calling `audio.pause()` on `visibilitychange` | Removed: no such code exists in Sargam |
| Audio stops between tracks on Android lock screen | Background JS throttle delays React re-render chain | Background nudge (2s playVideo() after ENDED) |
| Lock-screen scrubber freezes during buffering | Position polling was gated on `playing===true` | Fixed: polling now runs during `loading` too |
| No lock-screen artwork | `/logo.png` was a relative URL (OS can't fetch it) | Fixed: URLs resolved to absolute before `MediaMetadata` |
| Headset seek buttons ignored | `seekbackward`/`seekforward` handlers not registered | Fixed: both handlers now registered via `setHandlers()` |
| Audio stops on iOS | iOS blocks cross-origin iframe background audio | Platform limitation, no code fix |

---

## Future: Direct Audio CDN Migration Path

If Sargam migrates to a licensed direct-audio CDN, the recommended architecture is:

```typescript
// Persistent singleton, lives for the entire app lifetime
class SargamAudioEngine {
  private audio = new Audio();

  constructor() {
    this.audio.preload = "metadata";
  }

  load(src: string) {
    this.audio.src = src;
    this.audio.load();
  }

  play() { return this.audio.play(); }
  pause() { this.audio.pause(); }
  seek(seconds: number) { this.audio.currentTime = seconds; }
  setVolume(v: number) { this.audio.volume = v; }

  on(event: string, handler: EventListener) {
    this.audio.addEventListener(event, handler);
  }
}
```

`HTMLAudioElement` benefits over YouTube IFrame:
- Full background playback on iOS (no cross-origin restriction)
- Direct access to `waiting`, `canplay`, `playing`, `ended`, `error` events
- No polling needed — native time update events
- No YouTube API dependency
- Works in Web Workers for even more reliable background processing

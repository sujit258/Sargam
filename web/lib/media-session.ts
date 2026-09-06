/**
 * Declare what is playing to the operating system.
 *
 * Without this the phone has no idea the page is a music player. It sees a
 * cross-origin iframe making noise, shows YouTube's own generic notification if
 * anything, and — the part that matters here — feels free to freeze the page
 * once the screen locks. Our JavaScript is what advances the queue, so a frozen
 * page means the track ends and nothing follows it until the phone is woken.
 *
 * Declaring a media session is how a page says "I am playback, keep me
 * running". It is not a guarantee — the platform still decides — but it is the
 * signal the platform looks for, and it was absent.
 *
 * It also buys the lock screen and notification controls, which a music app is
 * expected to have: the title and artwork on the lock screen, and skip buttons
 * that reach us rather than the iframe.
 */

export type NowPlaying = {
  title: string;
  artist: string;
  album?: string;
  /** Absolute URL to artwork image. Relative URLs are resolved automatically. */
  artwork?: string;
};

type Handlers = {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek?: (seconds: number) => void;
  /** Called with a positive delta in seconds (e.g. 10s skip backward). */
  seekBackward?: (delta: number) => void;
  /** Called with a positive delta in seconds (e.g. 10s skip forward). */
  seekForward?: (delta: number) => void;
};

function available(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

// Separate from mediaSession itself, and constructing it is what would throw.
function canDescribe(): boolean {
  return available() && typeof MediaMetadata === "function";
}

/**
 * Resolve a potentially-relative artwork URL to an absolute one.
 *
 * The OS fetches artwork independently of the browser tab — it issues an HTTP
 * request from outside the page context. Relative URLs like "/logo.png" are
 * meaningless there; only absolute URLs with an origin work.
 */
function absoluteArtwork(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (typeof window === "undefined") return undefined;
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return undefined;
  }
}

/** What the lock screen shows. */
export function setNowPlaying(song: NowPlaying | null) {
  if (!canDescribe()) return;

  if (!song) {
    navigator.mediaSession.metadata = null;
    return;
  }

  const abs = absoluteArtwork(song.artwork);

  // Provide two sizes so the platform picks the most suitable one.
  // YouTube thumbnails are 480×360 (hq) and 320×180 (mq); both are 16:9
  // rather than square, and we declare their true size rather than lying about
  // having square artwork — a platform that trusts the declaration will
  // letterbox or crop against a shape the image does not have.
  const artworkEntries: MediaImage[] = abs
    ? [
        { src: abs, sizes: "480x360", type: "image/jpeg" },
        // mq variant: swap hqdefault → mqdefault in the URL when present.
        // Falls back to the same image on unrecognised URLs.
        {
          src: abs.replace("hqdefault", "mqdefault"),
          sizes: "320x180",
          type: "image/jpeg",
        },
      ]
    : [];

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: artworkEntries,
  });
}

/** Whether the OS should draw a play or a pause button. */
export function setPlaybackState(playing: boolean) {
  if (!available()) return;
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}

/**
 * How far through, so the lock screen can draw a progress bar.
 *
 * Guarded rather than trusted: setPositionState throws if duration is zero or
 * position runs past it, both of which happen briefly while a track is
 * loading, and an exception here would take the caller down with it.
 */
export function setPosition(elapsed: number, duration: number) {
  if (!available() || typeof navigator.mediaSession.setPositionState !== "function") {
    return;
  }
  // Both, not just duration. getCurrentTime() returns NaN before the player is
  // ready, and a NaN position is rejected the same way a zero duration is —
  // caught below, but caught means never updated rather than merely skipped.
  if (!Number.isFinite(duration) || duration <= 0) return;
  if (!Number.isFinite(elapsed)) return;

  try {
    navigator.mediaSession.setPositionState({
      duration,
      position: Math.min(Math.max(elapsed, 0), duration),
      playbackRate: 1,
    });
  } catch {
    // A rejected position is not worth interrupting playback over.
  }
}

/** Wire the OS controls to ours. Returns a teardown. */
export function setHandlers(handlers: Handlers): () => void {
  if (!available()) return () => {};

  const DEFAULT_SKIP_SECONDS = 10;

  const entries: [MediaSessionAction, MediaSessionActionHandler][] = [
    ["play", () => handlers.play()],
    ["pause", () => handlers.pause()],
    ["nexttrack", () => handlers.next()],
    ["previoustrack", () => handlers.previous()],
  ];

  if (handlers.seek) {
    entries.push([
      "seekto",
      (details) => {
        if (typeof details.seekTime === "number") handlers.seek!(details.seekTime);
      },
    ]);
  }

  // seekbackward / seekforward: used by Bluetooth headsets, car media systems,
  // and the Android notification / lock-screen rewind and fast-forward buttons.
  // Without these the spec says the platform should fall back to
  // previoustrack / nexttrack, but in practice many silently drop the event.
  entries.push([
    "seekbackward",
    (details) => {
      const delta = details.seekOffset ?? DEFAULT_SKIP_SECONDS;
      handlers.seekBackward?.(delta);
    },
  ]);

  entries.push([
    "seekforward",
    (details) => {
      const delta = details.seekOffset ?? DEFAULT_SKIP_SECONDS;
      handlers.seekForward?.(delta);
    },
  ]);

  for (const [action, handler] of entries) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Not every action is supported everywhere; an unsupported one throws
      // and the rest should still be registered.
    }
  }

  return () => {
    for (const [action] of entries) {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch {
        // Nothing to do if it was never accepted.
      }
    }
  };
}

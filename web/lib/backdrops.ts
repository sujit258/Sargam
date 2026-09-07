"use client";

import { useSyncExternalStore } from "react";

import { track } from "@/lib/analytics";

/**
 * Which animated backdrop the app is wearing.
 *
 * Same shape as lib/favourites.ts: localStorage is external state, so it is
 * read through useSyncExternalStore rather than a context, and the server
 * snapshot is what makes the server render coherent without a `mounted` flag.
 *
 * The server snapshot is "none" rather than the default, deliberately. Serving
 * the default would mean anyone who picked something else downloads a backdrop
 * they will not see before downloading the one they will. Rendering nothing
 * costs a beat with no backdrop, which the fade-in below turns into something
 * that reads as intentional rather than as a flash.
 */
import { brand } from "@/lib/brand";

const KEY = brand.storageKeys.backdrop;
const LEGACY_KEY = brand.storageKeys.legacy.backdrop;

export type Backdrop = {
  id: string;
  label: string;
  /** One line, shown under the label on the themes page. */
  note: string;
};

const DEFAULT_BACKDROP = "lofi";

/** Absence, chosen on purpose. Not every room wants weather in it. */
export const NO_BACKDROP = "none";

export const BACKDROPS: readonly Backdrop[] = [
  { id: "lofi", label: "Amber Studio", note: "Warm acoustic sanctuary amidst mountain reverie" },
  { id: "reading", label: "Midnight Riyaaz", note: "Quiet evening contemplation with handwritten notations" },
  { id: "meadow", label: "Monsoon Melody", note: "Open highland pastures bathed in contemplative daytime ragas" },
  { id: "flock", label: "Golden Horizon", note: "Dusk silhouettes across amber skies at evening transition" },
  { id: "stop-dusk", label: "Retro Cinema", note: "Cinematic streetlights under rich incandescent crimson glow" },
  { id: "stop-night", label: "Vintage Streetlamp", note: "Nocturnal quietude steeped in golden-era melodies" },
  { id: "porch", label: "Baithak Veranda", note: "Peaceful courtyard sanctuary for resting between melodies" },
];

const IDS = new Set<string>(BACKDROPS.map((b) => b.id));

export function backdropSrc(id: string) {
  return { video: `/backdrops/${id}.mp4`, poster: `/backdrops/${id}.jpg` };
}

const listeners = new Set<() => void>();
let chosen: string | null = null;

function read(): string {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        raw = legacy;
        try {
          localStorage.setItem(KEY, legacy);
        } catch {}
      }
    }
    // An unknown id means a theme that has since been removed, or a
    // hand-edited value. Fall back rather than requesting a file that is not
    // there and leaving the app with no backdrop and no explanation.
    if (raw === NO_BACKDROP) return NO_BACKDROP;
    return raw && IDS.has(raw) ? raw : DEFAULT_BACKDROP;
  } catch {
    return DEFAULT_BACKDROP;
  }
}

function current(): string {
  if (chosen === null) chosen = read();
  return chosen;
}

export function setBackdrop(id: string) {
  track("theme", { theme: id });
  chosen = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // Private mode, or a full disk. The choice still applies for this session.
  }
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY && event.key !== LEGACY_KEY) return;
  chosen = null;
  for (const listener of listeners) listener();
}

// Once, not reference-counted — see lib/favourites.ts for why. A listener
// attached only while something is subscribed leaves a window in which another
// tab's write is missed and never re-read.
if (typeof window !== "undefined") window.addEventListener("storage", onStorage);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBackdrop(): string {
  return useSyncExternalStore(subscribe, current, () => NO_BACKDROP);
}

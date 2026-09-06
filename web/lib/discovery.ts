/**
 * SARGAM Discovery Engine
 *
 * Provides deterministic daily recommendations (Aajcha Sargam),
 * weighted random discovery (Surprise Me), era filtering,
 * and recently-played history management.
 */

import { type Catalogue, type Song, hydrate } from "@/lib/catalogue";
import { brand } from "@/lib/brand";

const HISTORY_KEY = brand.storageKeys.history;
const MAX_HISTORY = 30;

/**
 * Deterministic Daily Classic: "Aajcha Sargam" (आजचा सरगम)
 *
 * Uses the current day-of-year to deterministically select an iconic classic
 * so all listeners worldwide receive the exact same song of the day without
 * requiring a centralized database.
 */
export function getAajchaSargam(catalogue: Catalogue): Song | null {
  if (!catalogue.songs.length) return null;

  // Filter for highest confidence classic tracks (confidence >= 0.95)
  const candidates = catalogue.songs.filter((s) => s.c >= 0.95);
  const pool = candidates.length > 0 ? candidates : catalogue.songs;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Deterministic index calculation
  const seed = now.getFullYear() * 1000 + dayOfYear;
  const index = Math.abs(seed) % pool.length;

  return hydrate(pool[index], catalogue.facets);
}

/**
 * Weighted Discovery: "Surprise Me"
 *
 * Selects a high-quality track across varied stations, avoiding the current song.
 */
export function getSurpriseSong(catalogue: Catalogue, currentSongId?: number): Song | null {
  if (!catalogue.songs.length) return null;

  const candidates = catalogue.songs.filter(
    (s) => s.c >= 0.92 && (!currentSongId || s.id !== currentSongId)
  );
  const pool = candidates.length > 0 ? candidates : catalogue.songs;
  const randomSong = pool[Math.floor(Math.random() * pool.length)];

  return hydrate(randomSong, catalogue.facets);
}

/**
 * Recently Played Management
 */
export function getRecentlyPlayed(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordPlayedSong(songId: number) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyPlayed().filter((id) => id !== songId);
    const updated = [songId, ...existing].slice(0, MAX_HISTORY);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Fail quietly if storage quota exceeded
  }
}

/**
 * Return a selection of 8 timeless hallmark classics from iconic artists.
 */
export function getRecommendedClassics(catalogue: Catalogue, limit = 8): Song[] {
  if (!catalogue.songs.length) return [];
  // Top confidence tracks
  const candidates = catalogue.songs.filter((s) => s.c >= 0.98);
  const pool = candidates.length >= limit ? candidates : catalogue.songs;

  // Stride through the pool to get diverse selections across artists
  const step = Math.max(1, Math.floor(pool.length / limit));
  const results: Song[] = [];

  for (let i = 0; i < pool.length && results.length < limit; i += step) {
    results.push(hydrate(pool[i], catalogue.facets));
  }

  return results;
}

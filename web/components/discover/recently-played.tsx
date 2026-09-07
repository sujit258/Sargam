"use client";

import { useEffect, useState } from "react";
import { History, Play, Pause } from "lucide-react";
import { type Catalogue, type Song, hydrate, artwork } from "@/lib/catalogue";
import { getRecentlyPlayed } from "@/lib/discovery";
import { usePlayer } from "@/components/player-provider";
import { LikeButton } from "@/components/like-button";

interface RecentlyPlayedProps {
  catalogue: Catalogue;
}

export function RecentlyPlayed({ catalogue }: RecentlyPlayedProps) {
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const { play, toggle, currentTrack, playing } = usePlayer();

  useEffect(() => {
    const timer = setTimeout(() => {
      const ids = getRecentlyPlayed();
      if (!ids.length) {
        setRecentSongs([]);
        return;
      }

      // Map stored IDs to actual songs in catalogue
      const songMap = new Map(catalogue.songs.map((s) => [s.id, s]));
      const matched: Song[] = [];

      for (const id of ids.slice(0, 6)) {
        const raw = songMap.get(id);
        if (raw) {
          matched.push(hydrate(raw, catalogue.facets));
        }
      }

      setRecentSongs(matched);
    }, 0);

    return () => clearTimeout(timer);
  }, [catalogue, currentTrack]);

  if (recentSongs.length === 0) return null;

  return (
    <section id="history" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            <h2 className="text-xl sm:text-2xl font-serif text-foreground">
              Recently Played
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick up where you left off on this device.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentSongs.map((song) => {
          const isPlaying = currentTrack?.id === song.id && playing;

          return (
            <div
              key={song.id}
              onClick={() => (currentTrack?.id === song.id ? toggle() : play(song))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (currentTrack?.id === song.id) toggle();
                  else play(song);
                }
              }}
              className="group relative flex items-center gap-3.5 rounded-xl border border-white/10 bg-card/30 p-2.5 backdrop-blur-sm transition duration-200 hover:border-primary/40 hover:bg-card/60 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg shadow bg-black/40">
                <img
                  src={artwork(song.video, "mq")}
                  alt={song.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 transition duration-200 ${
                    isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="size-5 text-primary fill-current" />
                  ) : (
                    <Play className="size-5 text-primary fill-current ml-0.5" />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition">
                  {song.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {song.artists.join(", ") || song.film}
                </p>
              </div>

              <div
                className="shrink-0 pr-1"
                onClick={(e) => e.stopPropagation()}
              >
                <LikeButton songId={song.id} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

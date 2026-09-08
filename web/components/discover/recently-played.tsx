"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { type Catalogue, type Song, resolveHydratedSongs } from "@/lib/catalogue";
import { getRecentlyPlayed } from "@/lib/discovery";
import { usePlayer } from "@/components/player-provider";
import { SectionHeader } from "@/components/music/section-header";
import { TrackCard } from "@/components/music/track-card";

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
      setRecentSongs(resolveHydratedSongs(catalogue, ids.slice(0, 6)));
    }, 0);

    return () => clearTimeout(timer);
  }, [catalogue, currentTrack]);

  if (recentSongs.length === 0) return null;

  const handleSelectSong = (song: Song) => {
    if (currentTrack?.id === song.id) {
      toggle();
    } else {
      play(song);
    }
  };

  return (
    <section id="history" className="mb-10">
      <SectionHeader
        title="Recently Played"
        subtitle="Pick up where you left off on this device."
        icon={History}
        iconClassName="text-primary"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentSongs.map((song) => (
          <TrackCard
            key={song.id}
            song={song}
            isPlaying={playing}
            isCurrent={currentTrack?.id === song.id}
            onSelect={handleSelectSong}
            subtitle={song.artists.join(", ") || song.film}
            size="compact"
          />
        ))}
      </div>
    </section>
  );
}

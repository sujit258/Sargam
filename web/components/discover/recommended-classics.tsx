"use client";

import { useMemo } from "react";
import { Disc } from "lucide-react";
import type { Catalogue, Song } from "@/lib/catalogue";
import { getRecommendedClassics } from "@/lib/discovery";
import { usePlayer } from "@/components/player-provider";
import { SectionHeader } from "@/components/music/section-header";
import { TrackCard } from "@/components/music/track-card";

interface RecommendedClassicsProps {
  catalogue: Catalogue;
}

export function RecommendedClassics({ catalogue }: RecommendedClassicsProps) {
  const { play, toggle, currentTrack, playing } = usePlayer();

  const classics = useMemo(() => {
    return getRecommendedClassics(catalogue, 6);
  }, [catalogue]);

  if (classics.length === 0) return null;

  const handleSelectSong = (song: Song) => {
    if (currentTrack?.id === song.id) {
      toggle();
    } else {
      play(song);
    }
  };

  return (
    <section className="mb-10">
      <SectionHeader
        title="Recommended Classics"
        subtitle="Hallmark recordings that defined the golden age of Indian cinema."
        icon={Disc}
        iconClassName="text-primary"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {classics.map((song) => (
          <TrackCard
            key={song.id}
            song={song}
            isPlaying={playing}
            isCurrent={currentTrack?.id === song.id}
            onSelect={handleSelectSong}
            secondaryText={song.film || "Cinema Classic"}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { Play, Pause, Disc } from "lucide-react";
import { type Catalogue, artwork } from "@/lib/catalogue";
import { getRecommendedClassics } from "@/lib/discovery";
import { usePlayer } from "@/components/player-provider";
import { LikeButton } from "@/components/like-button";

interface RecommendedClassicsProps {
  catalogue: Catalogue;
}

export function RecommendedClassics({ catalogue }: RecommendedClassicsProps) {
  const { play, toggle, currentTrack, playing } = usePlayer();

  const classics = useMemo(() => {
    return getRecommendedClassics(catalogue, 6);
  }, [catalogue]);

  if (classics.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Disc className="size-4 text-primary" />
            <h2 className="text-xl sm:text-2xl font-serif text-foreground">
              Recommended Classics
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hallmark recordings that defined the golden age of Indian cinema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {classics.map((song) => {
          const isPlaying = currentTrack?.id === song.id && playing;

          return (
            <div
              key={song.id}
              className="group relative flex items-center gap-3.5 rounded-xl border border-white/10 bg-card/40 p-3 backdrop-blur-sm transition duration-200 hover:border-primary/40 hover:bg-card/75"
            >
              {/* Artwork with play button overlay */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg shadow-md">
                <img
                  src={artwork(song.video, "mq")}
                  alt={song.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => (currentTrack?.id === song.id ? toggle() : play(song))}
                  aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200"
                >
                  {isPlaying ? (
                    <Pause className="size-6 text-primary fill-current" />
                  ) : (
                    <Play className="size-6 text-primary fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition">
                  {song.title}
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {song.artists.join(", ") || "Golden Era"}
                </p>
                <p className="text-[11px] text-muted-foreground/70 truncate">
                  {song.film || "Cinema Classic"}
                </p>
              </div>

              {/* Like action */}
              <div className="shrink-0 pr-1">
                <LikeButton songId={song.id} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { Disc, Play, Pause, Calendar, Award } from "lucide-react";
import { usePlayer } from "@/components/player-provider";
import { type Catalogue, artwork } from "@/lib/catalogue";
import { getAajchaSargam } from "@/lib/discovery";
import { LikeButton } from "@/components/like-button";

interface AajchaSargamProps {
  catalogue: Catalogue;
}

export function AajchaSargam({ catalogue }: AajchaSargamProps) {
  const { play, toggle, currentTrack, playing } = usePlayer();

  const dailySong = useMemo(() => {
    return getAajchaSargam(catalogue);
  }, [catalogue]);

  if (!dailySong) return null;

  const isCurrentPlaying = currentTrack?.id === dailySong.id && playing;

  const handlePlay = () => {
    if (currentTrack?.id === dailySong.id) {
      toggle();
    } else {
      play(dailySong);
    }
  };

  const todayDateString = new Date().toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-foreground">
              Aajcha Sargam
            </h2>
            <span className="text-xs font-serif text-primary/90 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              आजचा सरगम
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deterministic Song of the Day — identical for every listener worldwide.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
          <Calendar className="size-3.5 text-primary" />
          <span>{todayDateString}</span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-amber-950/20 via-card/70 to-card/50 p-5 sm:p-6 backdrop-blur-md transition hover:border-primary/40 shadow-xl">
        {/* Glow bloom */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-0 size-48 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Vinyl sleeve album artwork */}
          <div className="relative size-28 sm:size-36 shrink-0 overflow-hidden rounded-xl shadow-2xl border border-white/10 group-hover:scale-105 transition duration-300">
            <img
              src={artwork(dailySong.video, "hq")}
              alt={dailySong.title}
              className="size-full object-cover"
              loading="lazy"
            />
            {/* Spinning record motif in background */}
            <div
              aria-hidden
              className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${
                isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <Disc
                className={`size-10 text-primary ${
                  isCurrentPlaying ? "animate-spin" : ""
                }`}
              />
            </div>
          </div>

          {/* Song Metadata */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase text-primary">
              <Award className="size-3" />
              <span>Today&apos;s Masterpiece</span>
            </div>

            <h3 className="mt-1 text-xl sm:text-2xl font-serif text-foreground truncate">
              {dailySong.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-foreground/90">
              {dailySong.artists.join(", ") || "Vintage Classics"}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Film: <span className="text-foreground/80">{dailySong.film || "Original Soundtrack"}</span>
              {dailySong.composers.length > 0 && (
                <> · Music: <span className="text-foreground/80">{dailySong.composers.join(", ")}</span></>
              )}
            </p>

            {dailySong.stations.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-1.5">
                {dailySong.stations.slice(0, 3).map((station) => (
                  <span
                    key={station}
                    className="text-[10px] font-medium uppercase tracking-wider bg-white/[0.06] text-muted-foreground px-2 py-0.5 rounded"
                  >
                    {station}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Play & Favorite Actions */}
          <div className="flex sm:flex-col items-center gap-3 shrink-0">
            <button
              onClick={handlePlay}
              aria-label={isCurrentPlaying ? "Pause Aajcha Sargam" : "Play Aajcha Sargam"}
              className="grid size-12 sm:size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 active:scale-95"
            >
              {isCurrentPlaying ? (
                <Pause className="size-5 sm:size-6 fill-current" />
              ) : (
                <Play className="size-5 sm:size-6 fill-current ml-0.5" />
              )}
            </button>

            <div className="grid size-10 place-items-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] transition">
              <LikeButton songId={dailySong.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

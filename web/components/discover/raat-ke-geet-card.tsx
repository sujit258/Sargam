"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Moon, Play, Disc3, ArrowRight } from "lucide-react";
import { usePlayer } from "@/components/player-provider";
import { artwork, type Catalogue, type RawSong } from "@/lib/catalogue";
import { RAAT_KE_GEET } from "@/lib/collections/raat-ke-geet";

interface RaatKeGeetCardProps {
  catalogue: Catalogue;
}

export function RaatKeGeetCard({ catalogue }: RaatKeGeetCardProps) {
  const router = useRouter();
  const { playFirst, currentId, playing, setQueue } = usePlayer();

  const raatSongs = useMemo(() => {
    if (!catalogue) return [];
    const map = new Map<number | string, RawSong>(catalogue.songs.map((s) => [s.id, s]));
    return RAAT_KE_GEET.songIds
      .map((id) => map.get(id))
      .filter((s): s is RawSong => Boolean(s));
  }, [catalogue]);

  const isCurrentPlaying = useMemo(() => {
    if (!currentId) return false;
    return playing && RAAT_KE_GEET.songIds.includes(Number(currentId));
  }, [currentId, playing]);

  const sampleVideo = raatSongs[0]?.v || "msZxLO0NokY";

  const handleCardClick = () => {
    router.push(`/station/${RAAT_KE_GEET.id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (raatSongs.length > 0) {
      setQueue(raatSongs);
      playFirst(raatSongs);
    }
  };

  return (
    <section className="mb-10" aria-label="Raat Ke Geet Collection">
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-neutral-950 p-5 sm:p-6 backdrop-blur-md transition duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer"
      >
        {/* Ambient midnight moonlight glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-indigo-500/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -bottom-12 size-48 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Moonlit Vinyl artwork badge */}
          <div className="relative size-28 sm:size-36 shrink-0 overflow-hidden rounded-xl shadow-2xl border border-white/10 group-hover:scale-105 transition duration-300 bg-black/60">
            <img
              src={artwork(sampleVideo, "hq")}
              alt={RAAT_KE_GEET.title}
              className="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            {/* Midnight moon badge overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-200 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-500/20">
                <Moon className="size-3 text-amber-300" />
                <span>Midnight Calm</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono tracking-widest uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                <Moon className="size-3 fill-current text-amber-400" />
                <span>Curated Night Station</span>
              </span>
              <span className="text-xs font-serif text-amber-200/70">
                {RAAT_KE_GEET.nativeTitle}
              </span>
            </div>

            <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-foreground group-hover:text-amber-100 transition-colors">
              {RAAT_KE_GEET.title}
            </h3>

            <p className="mt-1 text-sm font-serif italic text-amber-200/90">
              {RAAT_KE_GEET.subtitle}
            </p>

            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
              {RAAT_KE_GEET.description}
            </p>

            {/* Journey preview badges */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[10px] bg-white/[0.06] text-foreground/80 px-2.5 py-0.5 rounded border border-white/10">
                49 Master Recordings
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-500/20">
                5-Stage Journey
              </span>
              <span className="text-[10px] text-muted-foreground hidden md:inline">
                Featuring: Chaudhvin Ka Chand, Yeh Raat Yeh Chandni, Lag Ja Gale, Kahin Door
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex sm:flex-col items-center gap-2.5 shrink-0">
            <button
              onClick={handlePlayClick}
              aria-label={isCurrentPlaying ? "Playing Raat Ke Geet" : "Play Raat Ke Geet"}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-semibold text-black shadow-lg shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
            >
              {isCurrentPlaying ? (
                <Disc3 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
              <span>{isCurrentPlaying ? "Playing" : "Play Station"}</span>
            </button>

            <span className="inline-flex items-center gap-1 text-xs text-amber-400 group-hover:translate-x-0.5 transition-transform">
              <span>View Tracklist</span>
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

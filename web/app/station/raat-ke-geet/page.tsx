"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Shuffle, Moon, Sparkles, Clock, Compass } from "lucide-react";
import { CatalogueGate } from "@/components/catalogue-gate";
import { useFrame } from "@/components/app-frame";
import { usePlayer } from "@/components/player-provider";
import { SongList } from "@/components/song-list";
import { artwork, type RawSong } from "@/lib/catalogue";
import { useCatalogue } from "@/lib/queries";
import { RAAT_KE_GEET } from "@/lib/collections/raat-ke-geet";

export default function RaatKeGeetStationPage() {
  const { data: catalogue, isLoading, isError, error } = useCatalogue();
  const { scrollEl } = useFrame();
  const { currentId, playing, playOrToggle, playFirst, playRandom, setQueue } = usePlayer();

  const raatSongs = useMemo<RawSong[]>(() => {
    if (!catalogue) return [];
    const map = new Map<number | string, RawSong>(catalogue.songs.map((s) => [s.id, s]));
    return RAAT_KE_GEET.songIds
      .map((id) => map.get(id))
      .filter((s): s is RawSong => Boolean(s));
  }, [catalogue]);

  // Set the player queue to this curated sequence
  useEffect(() => {
    if (raatSongs.length > 0) {
      setQueue(raatSongs);
    }
  }, [raatSongs, setQueue]);

  useEffect(() => {
    scrollEl?.scrollTo({ top: 0 });
  }, [scrollEl]);

  const sampleVideo = raatSongs[0]?.v || "msZxLO0NokY";

  return (
    <CatalogueGate isLoading={isLoading} isError={isError} error={error}>
      {catalogue && (
        <div className="space-y-6 max-w-5xl mx-auto pb-16">
          {/* Back navigation */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-xs text-foreground/80 transition hover:border-white/20 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Discover</span>
            </Link>
          </div>

          {/* Station Hero Header */}
          <header className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-neutral-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {/* Ambient moonlit halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-indigo-500/15 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 size-72 rounded-full bg-amber-500/10 blur-[100px]"
            />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Cover Artwork */}
              <div className="relative size-40 sm:size-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-white/15 bg-black/70">
                <img
                  src={artwork(sampleVideo, "hq")}
                  alt={RAAT_KE_GEET.title}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
                    <Moon className="size-3.5 fill-current text-amber-300" />
                    <span>Curated Night Station</span>
                  </div>
                </div>
              </div>

              {/* Station Details */}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    <Moon className="size-3 fill-current" />
                    <span>{RAAT_KE_GEET.mood}</span>
                  </span>
                  <span className="text-xs font-serif text-amber-200/80">
                    {RAAT_KE_GEET.nativeTitle}
                  </span>
                </div>

                <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">
                  {RAAT_KE_GEET.title}
                </h1>

                <p className="mt-1 text-sm sm:text-base font-serif italic text-amber-200/90">
                  {RAAT_KE_GEET.subtitle}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {RAAT_KE_GEET.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {RAAT_KE_GEET.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-mono tracking-wider bg-white/[0.05] text-muted-foreground px-2 py-0.5 rounded border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Transport Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => playFirst(raatSongs)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/30 transition hover:brightness-110 active:scale-95"
                  >
                    <Play className="size-4 fill-current" />
                    <span>Play Station</span>
                  </button>

                  <button
                    onClick={() => playRandom(raatSongs)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-white/10 active:scale-95"
                  >
                    <Shuffle className="size-4" />
                    <span>Shuffle</span>
                  </button>

                  <span className="text-xs text-muted-foreground ml-2 font-mono">
                    {raatSongs.length} Master Recordings
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* 5-Stage Listening Journey Guide */}
          <section className="rounded-2xl border border-white/10 bg-card/40 p-4 sm:p-5 backdrop-blur-sm">
            <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
              <Compass className="size-3.5" />
              <span>Sequenced Listening Journey</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              {RAAT_KE_GEET.stages.map((stage, idx) => (
                <div
                  key={stage.name}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex flex-col justify-between hover:border-amber-500/30 transition"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span className="font-mono text-amber-300/80">Part 0{idx + 1}</span>
                      <span>{stage.count} tracks</span>
                    </div>
                    <p className="font-medium text-foreground text-xs">{stage.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Track List */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-foreground">
                Tracklist ({raatSongs.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Original Vintage Soundtracks
              </span>
            </div>

            <SongList
              catalogue={catalogue}
              songs={raatSongs}
              filterKey="station/raat-ke-geet"
              currentId={currentId}
              playing={playing}
              scrollParent={scrollEl}
              onPlay={playOrToggle}
            />
          </section>
        </div>
      )}
    </CatalogueGate>
  );
}

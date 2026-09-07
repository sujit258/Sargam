"use client";

import { useEffect, useState } from "react";
import { Sparkles, Shuffle, Compass, Music2 } from "lucide-react";
import { usePlayer } from "@/components/player-provider";
import { type Catalogue } from "@/lib/catalogue";
import { getSurpriseSong } from "@/lib/discovery";
import { brand } from "@/lib/brand";

interface GreetingHeroProps {
  catalogue: Catalogue;
}

export function GreetingHero({ catalogue }: GreetingHeroProps) {
  const { play, playRandom, currentTrack } = usePlayer();
  const [greeting, setGreeting] = useState<string>("Namaste, Welcome to Sargam");

  useEffect(() => {
    const timer = setTimeout(() => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) {
        setGreeting("Subhodaya, Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Shubh Madhyahan, Good Afternoon");
      } else if (hour >= 17 && hour < 22) {
        setGreeting("Shubh Sandhya, Good Evening");
      } else {
        setGreeting("Late Night Melodies");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSurpriseMe = () => {
    const song = getSurpriseSong(catalogue, currentTrack?.id);
    if (song) {
      play(song);
    }
  };

  const handleShuffleAll = () => {
    playRandom(catalogue.songs);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card/80 via-card/40 to-background/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-8">
      {/* Decorative ambient lighting bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/15 blur-[90px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/3 size-64 rounded-full bg-teal-500/10 blur-[80px]"
      />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Compass className="size-3.5" />
            <span>The Music That Stayed · {brand.tagline}</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground">
            {greeting}
          </h1>

          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-muted-foreground/90 max-w-lg">
            Immerse yourself in timeless golden-era melodies. Browse curated stations,
            revisit defining musical decades, and explore our rich regional music heritage.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground/85">
            <span className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 font-medium">
              <Music2 className="size-3 text-primary" />
              {catalogue.songs.length.toLocaleString()} Master Recordings
            </span>
            <span className="rounded-md bg-white/[0.05] px-2.5 py-1 font-medium">
              {catalogue.facets.stations.length} Curated Stations
            </span>
            <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-primary/90 font-medium">
              Hindi & Marathi Archive
            </span>
          </div>
        </div>

        {/* Discovery Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={handleSurpriseMe}
            className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-95"
            title="Play a surprise golden-era classic"
          >
            <Sparkles className="size-4 transition-transform group-hover:rotate-12" />
            <span>Surprise Me</span>
          </button>

          <button
            onClick={handleShuffleAll}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-white/30 hover:bg-white/[0.12] active:scale-95"
            title="Shuffle the entire catalogue"
          >
            <Shuffle className="size-4 text-primary" />
            <span>Shuffle All</span>
          </button>
        </div>
      </div>
    </section>
  );
}

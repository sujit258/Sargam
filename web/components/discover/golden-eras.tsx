"use client";

import { Disc3, History, ArrowRight } from "lucide-react";
import { GOLDEN_ERAS, type GoldenEra } from "@/lib/types";
import { type Catalogue, filterSongs } from "@/lib/catalogue";
import { usePlayer } from "@/components/player-provider";
import { useRouter } from "next/navigation";
import { SectionHeader } from "@/components/music/section-header";

interface GoldenErasProps {
  catalogue: Catalogue;
}

export function GoldenEras({ catalogue }: GoldenErasProps) {
  const { playFirst } = usePlayer();
  const router = useRouter();

  const handlePlayEra = (era: GoldenEra) => {
    // Filter songs matching this era's moods or decade
    const matchingSongs = filterSongs(
      catalogue,
      { moods: new Set(era.moodIds) },
      ""
    );
    if (matchingSongs.length > 0) {
      playFirst(matchingSongs);
    } else {
      router.push("/songs");
    }
  };

  return (
    <section className="mb-10">
      <SectionHeader
        title="Golden Eras"
        subtitle="Journey through the four defining epochs of Indian cinematic sound."
        icon={History}
        iconClassName="text-amber-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GOLDEN_ERAS.map((era) => (
          <div
            key={era.id}
            onClick={() => handlePlayEra(era)}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b ${era.gradient} p-5 cursor-pointer transition duration-300 hover:border-primary/50 hover:scale-[1.02] shadow-xl flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
                  {era.id}
                </span>
                <span className="text-[11px] text-muted-foreground bg-white/[0.06] px-2 py-0.5 rounded">
                  {era.years}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-serif font-bold text-foreground group-hover:text-primary transition">
                {era.label}
              </h3>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {era.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-foreground/80">
              <span className="inline-flex items-center gap-1 text-primary group-hover:underline">
                <Disc3 className="size-3.5 transition-transform group-hover:rotate-90" />
                <span>Play Era Radio</span>
              </span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

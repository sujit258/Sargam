"use client";

import { useMemo } from "react";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import { useCatalogue } from "@/lib/queries";
import { getLanguageSongCounts, getLanguageStationCounts } from "@/lib/catalogue";
import { LanguageCard } from "@/components/music/language-card";

export default function LanguagesPage() {
  const { data: catalogue } = useCatalogue();

  const langCounts = useMemo(() => getLanguageSongCounts(catalogue), [catalogue]);
  const stationCounts = useMemo(() => getLanguageStationCounts(catalogue), [catalogue]);

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
          <Globe className="size-3.5" />
          <span>Multi-Language Music Heritage</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif tracking-tight text-foreground">
          Languages of Sargam
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Discover timeless Indian music across linguistic traditions. Browse our active Hindi and
          Marathi master catalogues or preview upcoming regional expansions.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const count =
            lang.id === "marathi"
              ? langCounts.marathi
              : lang.id === "hindi"
              ? langCounts.hindi
              : lang.songCount;

          const stationCount =
            lang.id === "marathi"
              ? stationCounts.marathi
              : lang.id === "hindi"
              ? stationCounts.hindi
              : lang.stationCount;

          return (
            <LanguageCard
              key={lang.id}
              lang={lang}
              songCount={count}
              stationCount={stationCount}
            />
          );
        })}
      </div>
    </div>
  );
}

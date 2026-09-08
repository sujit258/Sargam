"use client";

import { Globe } from "lucide-react";
import { useMemo } from "react";
import { useCatalogue } from "@/lib/queries";
import {
  getLanguageSongCounts,
  getLanguageStationCounts,
  type Catalogue,
} from "@/lib/catalogue";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import { SectionHeader } from "@/components/music/section-header";
import { LanguageCard } from "@/components/music/language-card";

interface LanguageExplorerProps {
  catalogue?: Catalogue;
  activeLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
}

export function LanguageExplorer({
  catalogue: passedCatalogue,
  activeLanguage = "hindi",
}: LanguageExplorerProps) {
  const { data: fetchedCatalogue } = useCatalogue();
  const catalogue = passedCatalogue ?? fetchedCatalogue;

  const langCounts = useMemo(() => getLanguageSongCounts(catalogue), [catalogue]);
  const stationCounts = useMemo(() => getLanguageStationCounts(catalogue), [catalogue]);

  return (
    <section id="languages" className="mb-10">
      <SectionHeader
        title="Explore Languages"
        subtitle="Discover timeless Indian music across linguistic heritages."
        icon={Globe}
        iconClassName="text-teal-400"
        action={{ label: "View All", href: "/languages" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
              isSelected={activeLanguage === lang.id}
            />
          );
        })}
      </div>
    </section>
  );
}

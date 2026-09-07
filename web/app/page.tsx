"use client";

import { useRouter } from "next/navigation";
import { CatalogueGate } from "@/components/catalogue-gate";
import { useFrame } from "@/components/app-frame";
import { usePlayer } from "@/components/player-provider";
import { filterSongs, type Catalogue } from "@/lib/catalogue";
import { collectionHref } from "@/lib/routes";
import { useCatalogue } from "@/lib/queries";

import { GreetingHero } from "@/components/discover/greeting-hero";
import { AajchaSargam } from "@/components/discover/aajcha-sargam";
import { RaatKeGeetCard } from "@/components/discover/raat-ke-geet-card";
import { LanguageExplorer } from "@/components/discover/language-explorer";
import { GoldenEras } from "@/components/discover/golden-eras";
import { MarathiSpotlight } from "@/components/discover/marathi-spotlight";
import { RecommendedClassics } from "@/components/discover/recommended-classics";
import { RecentlyPlayed } from "@/components/discover/recently-played";
import { BrowseGrid } from "@/components/browse-grid";

export default function DiscoverPage() {
  const { data: catalogue, isLoading, isError, error } = useCatalogue();
  const { scrollEl } = useFrame();
  const router = useRouter();
  const { playFirst } = usePlayer();

  return (
    <CatalogueGate isLoading={isLoading} isError={isError} error={error}>
      {catalogue && (
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* 1. Hero greeting & Quick actions */}
          <GreetingHero catalogue={catalogue} />

          {/* 2. Deterministic Daily Classic (Song of the Day) */}
          <AajchaSargam catalogue={catalogue} />

          {/* 3. Curated Late-Night Station: Raat Ke Geet */}
          <RaatKeGeetCard catalogue={catalogue} />

          {/* 4. Explore Languages */}
          <LanguageExplorer catalogue={catalogue} />

          {/* 4. Golden Eras (1950s - 1980s) */}
          <div id="eras">
            <GoldenEras catalogue={catalogue} />
          </div>

          {/* 5. Marathi Regional Spotlight */}
          <MarathiSpotlight />

          {/* 6. Recommended Classics */}
          <RecommendedClassics catalogue={catalogue} />

          {/* 7. Recently Played (from local storage) */}
          <RecentlyPlayed catalogue={catalogue} />

          {/* 8. Full Station & Artist Exploration Grid */}
          <section id="stations" className="pt-6 border-t border-white/[0.08]">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                Explore Stations & Artists
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse through {catalogue.facets.stations.length} curated stations, legendary vocalists, composers, lyricists, actors, and films.
              </p>
            </div>

            <BrowseGrid
              catalogue={catalogue}
              scrollParent={scrollEl}
              onPick={(facet, index) =>
                router.push(
                  collectionHref(
                    facet,
                    catalogue.facets[facet as keyof Catalogue["facets"]][index]
                  )
                )
              }
              onPlay={(facet, index) => {
                const label = catalogue.facets[facet as keyof Catalogue["facets"]][index];
                playFirst(filterSongs(catalogue, { [facet]: new Set([index]) }, ""));
                router.push(collectionHref(facet, label));
              }}
            />
          </section>
        </div>
      )}
    </CatalogueGate>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { CatalogueGate } from "@/components/catalogue-gate";
import { useFrame } from "@/components/app-frame";
import { usePlayer } from "@/components/player-provider";
import { filterSongs, type Catalogue } from "@/lib/catalogue";
import { collectionHref } from "@/lib/routes";
import { useCatalogue } from "@/lib/queries";
import { BrowseGrid } from "@/components/browse-grid";

export default function StationsPage() {
  const { data: catalogue, isLoading, isError, error } = useCatalogue();
  const { scrollEl } = useFrame();
  const router = useRouter();
  const { playFirst } = usePlayer();

  return (
    <CatalogueGate isLoading={isLoading} isError={isError} error={error}>
      {catalogue && (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
          <header className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Radio className="size-3.5" />
              <span>Curated Audio Stations & Artist Archives</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-serif tracking-tight text-foreground">
              Radio Stations & Archives
            </h1>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Explore {catalogue.facets.stations.length} handcrafted radio stations, legendary vocalists, composers, lyricists, actors, and films across Hindi and Marathi musical legacies.
            </p>
          </header>

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
        </div>
      )}
    </CatalogueGate>
  );
}

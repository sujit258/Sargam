"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Search, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { CatalogueGate } from "@/components/catalogue-gate";
import { FacetPanel } from "@/components/facet-panel";
import { useFrame } from "@/components/app-frame";
import { usePlayer } from "@/components/player-provider";
import { SongList } from "@/components/song-list";
import { facetCards, filterSongs, type Catalogue, type FacetCard } from "@/lib/catalogue";
import { useCatalogue, usePhotoManifest, useStationPosters } from "@/lib/queries";
import { SearchMatches } from "@/components/search-matches";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function SongsPage() {
  const { data: catalogue, isLoading, isError, error } = useCatalogue();
  const { scrollEl, query, setQuery } = useFrame();
  const [selected, setSelected] = useState<Record<string, Set<number>>>({});
  const { currentId, playing, playOrToggle, playFirst, playRandom, setQueue } = usePlayer();
  const { data: photos } = usePhotoManifest();
  const { data: posters } = useStationPosters();

  // Built once per catalogue, not per keystroke
  const cardsByFacet = useMemo<Record<string, FacetCard[]>>(() => {
    if (!catalogue) return {};
    const facets = ["stations", "artists", "composer", "lyricist", "actor", "films"];
    return Object.fromEntries(facets.map((f) => [f, facetCards(catalogue, f)]));
  }, [catalogue]);

  const results = useMemo(
    () => (catalogue ? filterSongs(catalogue, selected, query) : []),
    [catalogue, selected, query]
  );

  // The player advances through whatever this route is showing.
  useEffect(() => setQueue(results), [results, setQueue]);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        q: query.trim(),
        f: Object.entries(selected)
          .filter(([, s]) => s.size)
          .map(([k, s]) => [k, [...s].sort()])
          .sort(),
      }),
    [query, selected]
  );

  useEffect(() => {
    scrollEl?.scrollTo({ top: 0 });
  }, [filterKey, scrollEl]);

  const toggle = useCallback((facet: string, index: number) => {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facet] ?? []);
      if (set.has(index)) set.delete(index);
      else set.add(index);
      if (set.size === 0) delete next[facet];
      else next[facet] = set;
      return next;
    });
  }, []);

  const chips = useMemo(() => {
    if (!catalogue) return [];
    return Object.entries(selected).flatMap(([facet, set]) =>
      [...set].map((index) => ({
        facet,
        index,
        label: catalogue.facets[facet as keyof Catalogue["facets"]][index],
      }))
    );
  }, [catalogue, selected]);

  return (
    <CatalogueGate isLoading={isLoading} isError={isError} error={error}>
      {catalogue && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 pb-2 border-b border-white/[0.08]">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {query.trim() ? `Results for “${query}”` : "Explore Archive"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displaying {results.length.toLocaleString()} Master Recordings across Hindi &amp; Marathi
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger
                  render={
                    <button className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-white/[0.1] lg:hidden">
                      <SlidersHorizontal className="size-3.5 text-primary" />
                      <span>Filters</span>
                      {chips.length > 0 && (
                        <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-black">
                          {chips.length}
                        </span>
                      )}
                    </button>
                  }
                />
                <SheetContent side="left" className="flex w-80 flex-col overflow-hidden bg-card/95 p-0 backdrop-blur-xl border-r border-white/10">
                  <SheetTitle className="sr-only">Catalogue Filters</SheetTitle>
                  <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-foreground">Filters</span>
                    {chips.length > 0 && (
                      <button onClick={() => setSelected({})} className="text-xs text-primary underline">
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto scroll-slim p-2">
                    <FacetPanel
                      catalogue={catalogue}
                      results={results}
                      selected={selected}
                      onToggle={toggle}
                      onClear={() => setSelected({})}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {results.length > 0 && (
                <>
                  <button
                    onClick={() => playRandom(results)}
                    title="Shuffle"
                    aria-label="Shuffle results"
                    className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:bg-white/10 text-foreground"
                  >
                    <Shuffle className="size-4" />
                  </button>
                  <button
                    onClick={() => playFirst(results)}
                    title="Play all"
                    aria-label="Play results"
                    className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg transition hover:brightness-110 active:scale-95"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Play All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="relative block sm:hidden w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, films, composers…"
              className="h-9.5 w-full rounded-xl border border-white/10 bg-white/[0.06] pl-9.5 pr-8 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 py-1">
              <span className="text-[11px] text-muted-foreground mr-1">Active:</span>
              {chips.map((chip) => (
                <button
                  key={`${chip.facet}-${chip.index}`}
                  onClick={() => toggle(chip.facet, chip.index)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/25 px-2.5 py-1 text-xs text-primary transition hover:bg-primary/25"
                >
                  {chip.label}
                  <X className="size-3" />
                </button>
              ))}
              <button
                onClick={() => setSelected({})}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {query.trim() && (
            <SearchMatches
              catalogue={catalogue}
              cardsByFacet={cardsByFacet}
              query={query}
              photos={photos ?? null}
              posters={posters ?? null}
            />
          )}

          {/* Side-by-side layout on desktop: Filter sidebar on left, Songs on right */}
          <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-6 items-start pt-2">
            <aside className="hidden lg:block sticky top-20 rounded-2xl border border-white/10 bg-card/40 p-2 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] mb-1">
                <span className="font-serif text-sm font-semibold text-foreground">Archive Filters</span>
                {chips.length > 0 && (
                  <button onClick={() => setSelected({})} className="text-[11px] text-primary hover:underline">
                    Clear ({chips.length})
                  </button>
                )}
              </div>
              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto scroll-slim">
                <FacetPanel
                  catalogue={catalogue}
                  results={results}
                  selected={selected}
                  onToggle={toggle}
                  onClear={() => setSelected({})}
                />
              </div>
            </aside>

            <div className="min-w-0">
              {results.length === 0 ? (
                <div className="py-24 text-center space-y-2">
                  <p className="text-base font-serif text-foreground">No recordings match those criteria.</p>
                  <p className="text-xs text-muted-foreground">Try clearing selected filters or searching with a different term.</p>
                  <button
                    onClick={() => setSelected({})}
                    className="mt-4 inline-flex items-center rounded-full bg-primary/20 text-primary px-4 py-1.5 text-xs font-medium hover:bg-primary/30 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <SongList
                  catalogue={catalogue}
                  songs={results}
                  filterKey={filterKey}
                  currentId={currentId}
                  playing={playing}
                  scrollParent={scrollEl}
                  onPlay={playOrToggle}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </CatalogueGate>
  );
}

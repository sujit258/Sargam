"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/music/empty-state";
import { PlaybackActions } from "@/components/music/playback-actions";
import { resolveRawSongs } from "@/lib/catalogue";
import { CatalogueGate } from "@/components/catalogue-gate";
import { useFrame } from "@/components/app-frame";
import { usePlayer } from "@/components/player-provider";
import { SongList } from "@/components/song-list";
import { useFavouriteIds, useFavouritesRevision } from "@/lib/favourites";
import { useCatalogue } from "@/lib/queries";

export default function FavouritesPage() {
  const { data: catalogue, isLoading, isError, error } = useCatalogue();
  const { scrollEl } = useFrame();
  const { currentId, playing, playOrToggle, playFirst, playRandom, setQueue } = usePlayer();
  const ids = useFavouriteIds();
  const revision = useFavouritesRevision();

  // Newest first, resolved via memoized catalogue song lookup; missing IDs skipped safely
  const reversedIds = useMemo(() => [...ids].reverse(), [ids]);
  const results = useMemo(
    () => resolveRawSongs(catalogue, reversedIds),
    [catalogue, reversedIds]
  );

  // Only when there is something to play. An empty list would replace a queue
  // that is currently playing with nothing, and the player has no way back
  // from that — Next, Previous and auto-advance all stop for the session.
  // Someone landing on an empty /favourites has almost certainly got music
  // going from somewhere else, and it should keep going.
  useEffect(() => {
    if (results.length > 0) setQueue(results);
  }, [results, setQueue]);

  return (
    <CatalogueGate isLoading={isLoading} isError={isError} error={error}>
      {catalogue && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3 pb-4">
            <div className="min-w-0">
              <h2 className="truncate pt-1 text-2xl leading-tight">Your favourites</h2>
              <p className="text-xs text-muted-foreground">
                {results.length.toLocaleString()}{" "}
                {results.length === 1 ? "song" : "songs"} · kept on this device
              </p>
            </div>
            {results.length > 0 && (
              <PlaybackActions
                onPlay={() => playFirst(results)}
                onShuffle={() => playRandom(results)}
                reverseOrder
              />
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={Heart}
              message="Nothing here yet. Tap the heart beside any song and it will be waiting for you."
              action={{ label: "Browse all songs", href: "/songs" }}
            />
          ) : (
            <SongList
              catalogue={catalogue}
              songs={results}
              filterKey={`favourites:${revision}`}
              currentId={currentId}
              playing={playing}
              scrollParent={scrollEl}
              onPlay={playOrToggle}
            />
          )}
        </>
      )}
    </CatalogueGate>
  );
}

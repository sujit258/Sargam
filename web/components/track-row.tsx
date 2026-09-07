"use client";

import { Pause, Play } from "lucide-react";
import { artwork, type Song } from "@/lib/catalogue";
import { LikeButton } from "@/components/like-button";

/** Bars that animate only for the row currently playing. */
function NowPlayingBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-label="Playing">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-[3px] animate-pulse rounded-sm bg-primary"
          style={{ height: "100%", animationDelay: `${delay}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  );
}

export function TrackRow({
  song,
  index,
  active,
  playing,
  onPlay,
}: {
  song: Song;
  index: number;
  active: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  const isPlayable = song.sourceVerified !== false && Boolean(song.video);

  const handleRowClick = () => {
    if (isPlayable) {
      onPlay();
    }
  };

  return (
    <div
      onClick={handleRowClick}
      title={!isPlayable ? "Archival record · Playback stream pending verification" : undefined}
      className={`group grid grid-cols-[1.5rem_2.5rem_1fr_auto] items-center gap-2.5 rounded-md px-1 py-1.5 outline-none transition-colors sm:gap-3 sm:px-2 ${
        isPlayable ? "cursor-pointer hover:bg-white/[0.06] focus-visible:bg-white/[0.08]" : "cursor-default opacity-85 hover:bg-white/[0.03]"
      } ${
        active ? "bg-white/[0.07]" : ""
      }`}
    >
      <button
        type="button"
        disabled={!isPlayable}
        onClick={(e) => {
          e.stopPropagation();
          if (isPlayable) {
            onPlay();
          }
        }}
        aria-label={
          !isPlayable
            ? `Archival record: ${song.title} (playback pending verification)`
            : active && playing
            ? `Pause ${song.title}`
            : `Play ${song.title}`
        }
        className={`grid size-6 place-items-center text-xs tabular-nums text-muted-foreground ${
          !isPlayable ? "cursor-default" : ""
        }`}
      >
        {active && playing ? (
          <span className="group-hover:hidden">
            <NowPlayingBars />
          </span>
        ) : (
          <span className={isPlayable ? "group-hover:hidden" : ""}>{index + 1}</span>
        )}
        {isPlayable && (
          <span className="hidden group-hover:block">
            {active && playing ? (
              <Pause className="size-3.5 fill-current text-foreground" />
            ) : (
              <Play className="size-3.5 fill-current text-foreground" />
            )}
          </span>
        )}
      </button>

      <img
        src={artwork(song.video)}
        alt=""
        loading="lazy"
        className={`size-10 rounded object-cover ${!isPlayable ? "grayscale-[0.5] opacity-80" : ""}`}
      />

      <div className="min-w-0">
        <div
          className={`truncate text-sm ${active ? "font-medium text-primary" : "text-foreground"}`}
        >
          {song.title}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {song.artists.join(", ") || "Unknown artist"}
          {song.film ? ` · ${song.film}` : ""}
        </div>
      </div>

      <div className="flex items-center gap-3 pr-1">
        {song.moods.slice(0, 1).map((mood) => (
          <span
            key={mood}
            className="hidden rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground lg:inline"
          >
            {mood}
          </span>
        ))}
        {song.sourceVerified === false && (
          <span
            title="Metadata verified · Playback stream pending verification"
            className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400/90 sm:inline"
          >
            Metadata only
          </span>
        )}
        {song.confidence < 0.85 && song.sourceVerified !== false && (
          <span
            title="Matched on singer alone — may not be the catalogue recording"
            className="hidden size-1.5 rounded-full bg-primary/60 sm:block"
          />
        )}
        <LikeButton songId={song.id} size={15} className="size-7" />
      </div>
    </div>
  );
}

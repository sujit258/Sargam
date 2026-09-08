"use client";

import React, { memo } from "react";
import { Play, Pause } from "lucide-react";
import { artwork, type Song } from "@/lib/catalogue";
import { LikeButton } from "@/components/like-button";

export interface TrackCardProps {
  song: Song;
  isPlaying?: boolean;
  isCurrent?: boolean;
  onSelect: (song: Song) => void;
  subtitle?: string | null;
  secondaryText?: string | null;
  size?: "default" | "compact";
  showLike?: boolean;
  className?: string;
}

export const TrackCard = memo(function TrackCard({
  song,
  isPlaying = false,
  isCurrent = false,
  onSelect,
  subtitle,
  secondaryText,
  size = "default",
  showLike = true,
  className = "",
}: TrackCardProps) {
  const isPlayable = song.sourceVerified !== false && Boolean(song.video);
  const activePlaying = isCurrent && isPlaying;

  const imageSize = size === "compact" ? "size-14" : "size-16";
  const padding = size === "compact" ? "p-2.5" : "p-3";

  return (
    <div
      onClick={() => onSelect(song)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(song);
        }
      }}
      className={`group relative flex items-center gap-3.5 rounded-xl border border-white/10 bg-card/40 ${padding} backdrop-blur-sm transition duration-200 hover:border-primary/40 hover:bg-card/75 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary ${
        isCurrent ? "ring-1 ring-primary/40 bg-card/60" : ""
      } ${className}`}
    >
      {/* Artwork with play button overlay */}
      <div className={`relative ${imageSize} shrink-0 overflow-hidden rounded-lg shadow-md bg-black/40`}>
        <img
          src={artwork(song.video, "mq")}
          alt={song.title}
          className={`size-full object-cover ${!isPlayable ? "grayscale-[0.5] opacity-80" : ""}`}
          loading="lazy"
        />
        {isPlayable ? (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition duration-200 ${
              activePlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {activePlaying ? (
              <Pause className="size-6 text-primary fill-current" />
            ) : (
              <Play className="size-6 text-primary fill-current ml-0.5" />
            )}
          </div>
        ) : (
          <div
            title="Archival record · Playback pending verification"
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-80 text-[9px] font-mono text-amber-300"
          >
            Info
          </div>
        )}
      </div>

      {/* Title & Artist metadata */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4
            className={`text-sm font-medium truncate transition ${
              activePlaying
                ? "text-primary"
                : isPlayable
                ? "text-foreground group-hover:text-primary"
                : "text-foreground/80 group-hover:text-amber-200"
            }`}
          >
            {song.title}
          </h4>
          {!isPlayable && (
            <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">
              Metadata
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {subtitle ?? (song.artists.join(", ") || "Golden Era")}
        </p>
        {(secondaryText ?? song.film) && (
          <p className="text-[11px] text-muted-foreground/70 truncate">
            {secondaryText ?? song.film}
          </p>
        )}
      </div>

      {/* Like button */}
      {showLike && (
        <div
          className="shrink-0 pl-1"
          onClick={(e) => e.stopPropagation()}
        >
          <LikeButton songId={song.id} size={15} />
        </div>
      )}
    </div>
  );
});

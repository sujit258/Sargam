"use client";

import { Play, Shuffle } from "lucide-react";

export interface PlaybackActionsProps {
  onPlay: () => void;
  onShuffle: () => void;
  playLabel?: string;
  shuffleLabel?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  color?: "primary" | "amber";
  reverseOrder?: boolean;
}

export function PlaybackActions({
  onPlay,
  onShuffle,
  playLabel = "Play",
  shuffleLabel = "Shuffle",
  className = "",
  disabled = false,
  size = "md",
  color = "primary",
  reverseOrder = false,
}: PlaybackActionsProps) {
  const isSm = size === "sm";
  const isAmber = color === "amber";

  const playBtn = (
    <button
      key="play"
      type="button"
      disabled={disabled}
      onClick={onPlay}
      title={playLabel}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        isAmber
          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30 hover:brightness-110"
          : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
      } ${isSm ? "px-3.5 py-1.5 text-xs" : "px-5 py-2.5 text-xs sm:text-sm"}`}
    >
      <Play className={`${isSm ? "size-3.5" : "size-4"} fill-current`} />
      <span>{playLabel}</span>
    </button>
  );

  const shuffleBtn = (
    <button
      key="shuffle"
      type="button"
      disabled={disabled}
      onClick={onShuffle}
      title={shuffleLabel}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] font-medium text-foreground transition hover:bg-white/[0.12] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        isSm ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-xs sm:text-sm"
      }`}
    >
      <Shuffle className={isSm ? "size-3.5" : "size-4"} />
      <span>{shuffleLabel}</span>
    </button>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {reverseOrder ? [shuffleBtn, playBtn] : [playBtn, shuffleBtn]}
    </div>
  );
}

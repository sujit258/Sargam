"use client";

import { useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface SeekBarProps {
  value: number; // 0..1
  onCommit: (fraction: number) => void;
  disabled?: boolean;
  className?: string;
  large?: boolean;
  /** Hairline along the bar's top edge. Desktop only. */
  edge?: boolean;
}

export function SeekBar({
  value,
  onCommit,
  disabled,
  className = "",
  large = false,
  edge = false,
}: SeekBarProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(0);
  const shown = dragging ? preview : value;

  return (
    <SliderPrimitive.Root
      value={shown * 1000}
      min={0}
      max={1000}
      disabled={disabled}
      thumbAlignment="edge"
      onValueChange={(v) => {
        setDragging(true);
        setPreview((Array.isArray(v) ? v[0] : v) / 1000);
      }}
      onValueCommitted={(v) => {
        setDragging(false);
        onCommit((Array.isArray(v) ? v[0] : v) / 1000);
      }}
      className={className}
    >
      <SliderPrimitive.Control
        className={`group/scrub relative flex w-full cursor-pointer touch-none select-none items-center data-disabled:cursor-not-allowed data-disabled:opacity-50 ${
          edge ? "h-3" : large ? "h-9" : "h-8"
        }`}
      >
        <SliderPrimitive.Track
          className={`relative w-full grow overflow-hidden rounded-full transition-all ${
            edge
              ? "h-[3px] bg-white/15 group-hover/scrub:h-[5px]"
              : `bg-white/25 ${
                  large ? "h-2 group-hover/scrub:h-2.5" : "h-1.5 group-hover/scrub:h-2"
                }`
          }`}
        >
          <SliderPrimitive.Indicator
            className={`h-full rounded-full transition-colors ${
              edge ? "bg-primary" : "bg-foreground group-hover/scrub:bg-primary"
            }`}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={`block shrink-0 cursor-grab rounded-full shadow transition-opacity after:absolute after:-inset-3 active:cursor-grabbing ${
            edge
              ? "size-3 bg-primary opacity-0 group-hover/scrub:opacity-100"
              : `bg-foreground ${large ? "size-4" : "size-3.5"}`
          }`}
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

"use client";

import { Info } from "lucide-react";
import type { Song } from "@/lib/catalogue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface MetadataNoticeDialogProps {
  song: Song | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MetadataNoticeDialog({
  song,
  open,
  onOpenChange,
}: MetadataNoticeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border border-white/15 bg-card/95 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-lg text-foreground flex items-center gap-2">
            <Info className="size-5 text-amber-400 shrink-0" />
            <span>Playback Source Under Verification</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 space-y-2">
            <span className="block font-semibold text-foreground">
              “{song?.title}”
              {song?.artists && song.artists.length > 0 && (
                <span className="font-normal text-muted-foreground"> by {song.artists.join(", ")}</span>
              )}
            </span>
            <span className="block text-muted-foreground/90">
              This recording is documented as a canonical archival entry in the Sargam catalog.
            </span>
            <span className="block text-muted-foreground/80 bg-white/[0.04] p-3 rounded-lg border border-white/[0.06]">
              Sargam strictly streams verified audio from legitimate public archives. Official playback verification for this recording is currently in progress.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction className="bg-white/10 hover:bg-white/15 text-foreground text-xs rounded-full px-4 py-2 border border-white/10">
            Understood
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

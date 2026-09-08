import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { LanguageMeta } from "@/lib/types";

export interface LanguageCardProps {
  lang: LanguageMeta;
  songCount?: number | null;
  stationCount?: number | null;
  isSelected?: boolean;
  className?: string;
}

export function LanguageCard({
  lang,
  songCount,
  stationCount,
  isSelected = false,
  className = "",
}: LanguageCardProps) {
  const isAvailable = lang.status === "available";
  const href =
    lang.id === "marathi"
      ? "/languages/marathi"
      : lang.id === "hindi"
      ? "/songs"
      : "#";

  return (
    <Link
      href={isAvailable ? href : "#"}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition duration-200 ${
        isSelected
          ? "border-primary/60 ring-1 ring-primary/40 bg-card/80"
          : isAvailable
          ? "border-white/10 bg-card/40 hover:border-teal-500/40 hover:bg-card/75 shadow-md"
          : "border-white/[0.06] bg-white/[0.02] opacity-70 pointer-events-none"
      } ${className}`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition">
                {lang.name}
              </span>
              <span className="text-xs text-muted-foreground font-serif">
                {lang.nativeName}
              </span>
            </div>
          </div>

          <div className="shrink-0 ml-2">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                <Clock className="size-3" />
                <span>Upcoming</span>
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {lang.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        {isAvailable ? (
          <>
            <span className="font-mono text-muted-foreground text-[11px]">
              {songCount !== undefined && songCount !== null
                ? `${songCount.toLocaleString()} Songs · ${stationCount ?? 8} Stations`
                : "Loading…"}
            </span>
            <span className="flex items-center gap-1 text-primary font-medium text-xs group-hover:translate-x-0.5 transition">
              Explore <ArrowRight className="size-3" />
            </span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground/60 italic">
            In development for future release
          </span>
        )}
      </div>
    </Link>
  );
}

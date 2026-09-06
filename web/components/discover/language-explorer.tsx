"use client";

import { Globe, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/types";

interface LanguageExplorerProps {
  activeLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
}

export function LanguageExplorer({
  activeLanguage = "hindi",
  onSelectLanguage,
}: LanguageExplorerProps) {
  return (
    <section id="languages" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-teal-400" />
            <h2 className="text-xl sm:text-2xl font-serif text-foreground">
              Explore Languages
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover timeless Indian music across linguistic heritages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = activeLanguage === lang.id;
          const isAvailable = lang.status === "available";

          return (
            <div
              key={lang.id}
              onClick={() => isAvailable && onSelectLanguage?.(lang.id)}
              className={`group relative overflow-hidden rounded-xl border p-4 transition duration-200 ${
                isSelected
                  ? "border-primary/60 bg-primary/[0.08] shadow-lg shadow-primary/10"
                  : isAvailable
                  ? "border-white/10 bg-card/40 hover:border-white/25 hover:bg-card/70 cursor-pointer"
                  : "border-white/[0.06] bg-white/[0.02] opacity-70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif font-bold text-foreground">
                      {lang.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-serif">
                      {lang.nativeName}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {lang.description}
                  </p>
                </div>

                <div className="shrink-0 ml-2">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-2.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-full">
                      <Clock className="size-2.5" />
                      Upcoming
                    </span>
                  )}
                </div>
              </div>

              {isAvailable && lang.songCount && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{lang.songCount.toLocaleString()} Songs · {lang.stationCount} Stations</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

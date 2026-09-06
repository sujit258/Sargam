"use client";

import Link from "next/link";
import { Globe, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/types";

export default function LanguagesPage() {
  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
          <Globe className="size-3.5" />
          <span>Multi-Language Music Heritage</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-serif tracking-tight text-foreground">
          Languages of Sargam
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Discover timeless Indian music across linguistic traditions. Browse our active Hindi and
          Marathi master catalogues or preview upcoming regional expansions.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isAvailable = lang.status === "available";
          const href =
            lang.id === "marathi"
              ? "/languages/marathi"
              : lang.id === "hindi"
              ? "/songs"
              : "#";

          return (
            <Link
              key={lang.id}
              href={href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition duration-200 ${
                isAvailable
                  ? "border-white/10 bg-card/40 hover:border-teal-500/40 hover:bg-card/75"
                  : "border-white/[0.06] bg-white/[0.02] opacity-70 pointer-events-none"
              }`}
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
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
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
              </div>

              {isAvailable && (
                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {lang.id === "marathi"
                      ? "100 Songs · 8 Stations"
                      : "3,916 Songs · 66 Stations"}
                  </span>
                  <div className="flex items-center gap-1 font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

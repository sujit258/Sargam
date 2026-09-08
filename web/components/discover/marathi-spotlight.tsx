import Link from "next/link";
import { Feather, Sparkles, Music } from "lucide-react";
import { MARATHI_SPOTLIGHT } from "@/lib/types";
import { SectionHeader } from "@/components/music/section-header";

export function MarathiSpotlight() {
  return (
    <section className="mb-10">
      <SectionHeader
        title="Marathi Spotlight"
        subtitle="Celebrating Maharashtra's rich traditions of Bhavgeet, Natya Sangeet, and classic cinema."
        icon={Feather}
        iconClassName="text-teal-400"
        badge={
          <span className="text-xs font-serif text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
            मराठी विशेष
          </span>
        }
        action={{ label: "Explore All", href: "/languages/marathi" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MARATHI_SPOTLIGHT.map((item) => {
          const catSlug =
            item.category === "Bhavgeet"
              ? "bhavageet"
              : item.category === "Natya Sangeet"
              ? "natya-sangeet"
              : item.category === "Marathi Cinema"
              ? "marathi-film"
              : item.category === "Lavani"
              ? "lavani"
              : "all";

          return (
            <Link
              key={item.id}
              href={`/languages/marathi?category=${catSlug}`}
              className="group relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-b from-teal-950/25 via-card/60 to-card/40 p-5 backdrop-blur-sm transition duration-300 hover:border-teal-500/40 hover:scale-[1.01] shadow-lg flex flex-col justify-between"
            >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <Sparkles className="size-3 text-teal-400/80" />
              </div>

              <h3 className="mt-3 text-base font-serif font-bold text-foreground group-hover:text-teal-200 transition">
                {item.title}
              </h3>

              <p className="mt-1.5 text-xs text-foreground/80 font-medium">
                {item.artist}
              </p>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.sampleTrackTitle && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-teal-300">
                <Music className="size-3 shrink-0" />
                <span className="truncate italic">Featured: {item.sampleTrackTitle}</span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Radio,
  Shuffle,
  Music2,
  Sparkles,
  Play,
  Pause,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCatalogue } from "@/lib/queries";
import { usePlayer } from "@/components/player-provider";
import { hydrate, artwork, type Song, type RawSong } from "@/lib/catalogue";
import { LikeButton } from "@/components/like-button";

type CategoryTab =
  | "all"
  | "marathi-classics"
  | "bhavageet"
  | "natya-sangeet"
  | "lavani"
  | "marathi-bhakti"
  | "gavlani"
  | "folk"
  | "marathi-film"
  | "romantic"
  | "devotional"
  | "patriotic";

const CATEGORY_LABELS: { id: CategoryTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marathi-classics", label: "Classics" },
  { id: "bhavageet", label: "Bhavageet" },
  { id: "natya-sangeet", label: "Natya Sangeet" },
  { id: "lavani", label: "Lavani" },
  { id: "marathi-bhakti", label: "Bhakti" },
  { id: "gavlani", label: "Gavlani" },
  { id: "folk", label: "Folk" },
  { id: "marathi-film", label: "Film" },
  { id: "romantic", label: "Romantic" },
  { id: "devotional", label: "Devotional" },
  { id: "patriotic", label: "Patriotic" },
];

const MARATHI_STATIONS_INFO = [
  { name: "Marathi Classics", slug: "marathi-classics", desc: "Hallmark recordings from legends" },
  { name: "Marathi Bhavageet", slug: "marathi-bhavageet", desc: "Poetic melodies of longing & nature" },
  { name: "Natya Sangeet", slug: "natya-sangeet", desc: "Musical theatre stage classics" },
  { name: "Lavani", slug: "lavani", desc: "Vibrant rhythms & dholki beats" },
  { name: "Marathi Bhakti", slug: "marathi-bhakti", desc: "Devotional hymns to Vitthal & Ganesh" },
  { name: "Gavlani", slug: "gavlani", desc: "Krishna folk narratives & playful tales" },
  { name: "Marathi Folk", slug: "marathi-folk", desc: "Koli geet, Gondhal & Powada" },
  { name: "Marathi Romance", slug: "marathi-romance", desc: "Tender duets & cinematic romance" },
];

export default function MarathiLanguagePage() {
  const { data: catalogue, isLoading } = useCatalogue();
  const { play, toggle, currentTrack, playing, playRandom } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract Marathi songs from catalogue
  const marathiSongs = useMemo(() => {
    if (!catalogue) return [];
    return catalogue.songs
      .filter((s) => s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-")))
      .map((s) => hydrate(s, catalogue.facets));
  }, [catalogue]);

  // Verified playable vs metadata only
  const stats = useMemo(() => {
    const verified = marathiSongs.filter((s) => s.sourceVerified).length;
    return {
      total: marathiSongs.length,
      verified,
      unresolved: marathiSongs.length - verified,
    };
  }, [marathiSongs]);

  // Dynamic category counts from actual catalogue
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: marathiSongs.length };
    for (const song of marathiSongs) {
      if (song.categories) {
        for (const cat of song.categories) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      }
    }
    return counts;
  }, [marathiSongs]);

  // Filter songs based on category and search
  const filteredSongs = useMemo(() => {
    return marathiSongs.filter((s) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (!s.categories || !s.categories.includes(selectedCategory)) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = s.title.toLowerCase().includes(q);
        const inArtist = s.artists.some((a) => a.toLowerCase().includes(q));
        const inFilm = s.film ? s.film.toLowerCase().includes(q) : false;
        const inCat = s.categories ? s.categories.some((c) => c.toLowerCase().includes(q)) : false;
        if (!inTitle && !inArtist && !inFilm && !inCat) return false;
      }
      return true;
    });
  }, [marathiSongs, selectedCategory, searchQuery]);

  const handleShuffleMarathi = () => {
    if (!catalogue) return;
    const playableRaw = catalogue.songs.filter(
      (s) =>
        (s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-"))) &&
        Boolean(s.v)
    );
    if (playableRaw.length > 0) {
      playRandom(playableRaw);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <header className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/40 via-card/70 to-background/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-teal-500/15 blur-[95px]"
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
            <Globe className="size-3.5" />
            <span>Sargam Regional Expansion · First-Class Catalogue</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-serif tracking-tight text-foreground">
            Marathi Sangeet (मराठी संगीत)
          </h1>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            Explore the rich literary and musical traditions of Maharashtra: intimate Bhavageet,
            dramatic Natya Sangeet, electrifying Lavani, soulful Vitthal Bhakti, and iconic
            cinema classics.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-foreground">
              <Music2 className="size-3.5 text-teal-400" />
              {stats.total} Canonical Metadata Entries
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 font-mono text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              {stats.verified} Verified Playable Tracks
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 font-mono text-amber-300">
              <Clock className="size-3.5" />
              {stats.unresolved} Source Under Resolution
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShuffleMarathi}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-95"
            >
              <Shuffle className="size-4" />
              <span>Shuffle Verified Marathi</span>
            </button>
            <Link
              href="/station/marathi-classics"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-white/30 hover:bg-white/[0.12]"
            >
              <Radio className="size-4 text-teal-400" />
              <span>Explore Marathi Stations</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 8 Curated Marathi Stations Carousel/Grid */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-teal-400" />
            <h2 className="text-lg font-serif text-foreground">Curated Marathi Stations</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MARATHI_STATIONS_INFO.map((st) => (
            <Link
              key={st.slug}
              href={`/station/${st.slug}`}
              className="group rounded-xl border border-white/10 bg-card/40 p-3.5 backdrop-blur-sm transition duration-200 hover:border-teal-500/50 hover:bg-card/75"
            >
              <h3 className="text-xs sm:text-sm font-medium text-foreground group-hover:text-teal-300 transition">
                {st.name}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                {st.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Tabs & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_LABELS.map((tab) => {
              const count = categoryCounts[tab.id] ?? 0;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(isSelected ? "all" : tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? "bg-teal-500 text-black font-semibold shadow"
                      : "bg-white/[0.06] text-muted-foreground hover:bg-white/[0.10] hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none ${
                      isSelected
                        ? "bg-black/20 text-black font-bold"
                        : "bg-white/10 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Marathi songs, singers..."
              className="w-full rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-teal-500/60"
            />
          </div>
        </div>

        {/* Informative source clarification banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-white/[0.07] bg-card/30 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="size-4 shrink-0 text-teal-400" />
            <span>
              Displaying {filteredSongs.length} songs. Verified tracks stream instantly; metadata-only
              entries document authentic discography while official streams undergo embed
              verification.
            </span>
          </div>
          {(selectedCategory !== "all" || searchQuery.trim().length > 0) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-xs text-teal-400 hover:text-teal-300 underline shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Songs Grid / Track List */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading Marathi catalogue...
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No Marathi songs found matching the selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredSongs.map((song: Song) => {
              const isPlaying = currentTrack?.id === song.id && playing;
              const isVerified = Boolean(song.sourceVerified && song.video);

              return (
                <div
                  key={song.id}
                  className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-card/40 p-2.5 backdrop-blur-sm transition duration-200 hover:border-teal-500/40 hover:bg-card/70"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg shadow-md bg-black/40">
                    <img
                      src={artwork(song.video, "mq")}
                      alt={song.title}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    {isVerified ? (
                      <button
                        onClick={() => (currentTrack?.id === song.id ? toggle() : play(song))}
                        aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition duration-200"
                      >
                        {isPlaying ? (
                          <Pause className="size-5 text-primary fill-current" />
                        ) : (
                          <Play className="size-5 text-primary fill-current ml-0.5" />
                        )}
                      </button>
                    ) : (
                      <div
                        title="Source pending verification"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-60 text-[9px] font-mono text-muted-foreground"
                      >
                        Info
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-teal-300 transition">
                        {song.title}
                      </h4>
                      {!isVerified && (
                        <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">
                          Metadata
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artists.join(", ") || "Traditional"}
                      {song.film ? ` · ${song.film}` : ""}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
                      {song.composers && song.composers.length > 0 && (
                        <span>Comp: {song.composers[0]}</span>
                      )}
                      {song.lyricists && song.lyricists.length > 0 && (
                        <span>· Lyrics: {song.lyricists[0]}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 pr-1 flex items-center gap-1.5">
                    <LikeButton songId={song.id} size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

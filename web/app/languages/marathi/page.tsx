"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Globe,
  Radio,
  Shuffle,
  Music2,
  Play,
  Pause,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCatalogue } from "@/lib/queries";
import { usePlayer } from "@/components/player-provider";
import { hydrate, artwork, type Song } from "@/lib/catalogue";
import { LikeButton } from "@/components/like-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function normalize(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function MarathiContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryTab | null;

  const { data: catalogue, isLoading } = useCatalogue();
  const { play, toggle, currentTrack, playing, playRandom, setQueue } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [extraLimit, setExtraLimit] = useState(0);
  const [unverifiedSongNotice, setUnverifiedSongNotice] = useState<Song | null>(null);

  // Active category derived from user selection or URL query param
  const activeCategory: CategoryTab =
    selectedCategory ??
    (categoryParam && CATEGORY_LABELS.some((c) => c.id === categoryParam)
      ? categoryParam
      : "all");

  const displayCount = 60 + extraLimit;

  // Extract Marathi songs from catalogue
  const marathiSongs = useMemo(() => {
    if (!catalogue) return [];
    return catalogue.songs
      .filter((s) => s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-")))
      .map((s) => hydrate(s, catalogue.facets));
  }, [catalogue]);

  // Verified playable vs metadata only stats
  const stats = useMemo(() => {
    const verified = marathiSongs.filter((s) => s.sourceVerified && Boolean(s.video)).length;
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
    const normQ = normalize(searchQuery).trim();
    const tokens = normQ ? normQ.split(/\s+/).filter(Boolean) : [];

    return marathiSongs.filter((s) => {
      // Category filter
      if (activeCategory !== "all") {
        if (!s.categories || !s.categories.includes(activeCategory)) {
          return false;
        }
      }
      // Search filter
      if (tokens.length > 0) {
        const parts: string[] = [s.title];
        if (s.artists) parts.push(...s.artists);
        if (s.film) parts.push(s.film);
        if (s.composers) parts.push(...s.composers);
        if (s.lyricists) parts.push(...s.lyricists);
        if (s.categories) parts.push(...s.categories);
        const blob = normalize(parts.join(" "));
        return tokens.every((tok) => blob.includes(tok));
      }
      return true;
    });
  }, [marathiSongs, activeCategory, searchQuery]);

  // Playable verified tracks for queue
  const playableRaw = useMemo(() => {
    if (!catalogue) return [];
    return catalogue.songs.filter(
      (s) =>
        (s.lang === "marathi" || (typeof s.id === "string" && s.id.startsWith("mar-"))) &&
        Boolean(s.v)
    );
  }, [catalogue]);

  const handleShuffleMarathi = () => {
    if (playableRaw.length > 0) {
      playRandom(playableRaw);
    }
  };

  const handleCardClick = (song: Song) => {
    const isVerified = Boolean(song.sourceVerified && song.video);
    if (isVerified) {
      if (currentTrack?.id === song.id) {
        toggle();
      } else {
        setQueue(playableRaw);
        play(song);
      }
    } else {
      setUnverifiedSongNotice(song);
    }
  };

  const visibleSongs = filteredSongs.slice(0, displayCount);

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
        </div>

        {/* Quick Shuffle Action */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-white/[0.08]">
          <button
            onClick={handleShuffleMarathi}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <Shuffle className="size-3.5" />
            <span>Shuffle Verified Marathi ({stats.verified})</span>
          </button>
        </div>
      </header>

      {/* Dedicated Radio Stations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                Marathi Radio Stations
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              8 curated stations organized around regional genres and traditions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MARATHI_STATIONS_INFO.map((station) => (
            <Link
              key={station.slug}
              href={`/station/${station.slug}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-card/40 p-4 transition duration-200 hover:border-teal-500/40 hover:bg-card/70"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300">
                  Station
                </span>
                <Radio className="size-3.5 text-teal-400/70" />
              </div>
              <h3 className="mt-2 text-sm font-serif font-bold text-foreground group-hover:text-primary transition">
                {station.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {station.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Catalogue Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-foreground flex items-center gap-2">
              <span>Marathi Master Catalogue</span>
              <span className="text-xs font-mono text-muted-foreground font-normal">
                ({filteredSongs.length} of {stats.total} songs)
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filter by traditional categories or search for specific artists, poets, and ragas.
            </p>
          </div>

          {/* In-page search input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExtraLimit(0);
              }}
              placeholder="Search songs, singers, films..."
              className="w-full rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setExtraLimit(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORY_LABELS.map((tab) => {
            const isSelected = activeCategory === tab.id;
            const count = categoryCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setExtraLimit(0);
                }}
                className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-teal-500 text-black font-semibold shadow-md shadow-teal-500/20"
                    : "bg-white/[0.06] text-foreground/80 hover:bg-white/[0.12]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected
                      ? "bg-black/20 text-black font-bold"
                      : "bg-white/[0.08] text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {visibleSongs.map((song: Song) => {
                const isPlaying = currentTrack?.id === song.id && playing;
                const isVerified = Boolean(song.sourceVerified && song.video);

                return (
                  <div
                    key={song.id}
                    onClick={() => handleCardClick(song)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(song);
                      }
                    }}
                    className={`group relative flex items-center gap-3 rounded-xl border p-2.5 backdrop-blur-sm transition duration-200 cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50 ${
                      isVerified
                        ? "border-white/10 bg-card/40 hover:border-teal-500/40 hover:bg-card/70"
                        : "border-white/[0.06] bg-card/20 hover:border-amber-500/30 hover:bg-card/40"
                    }`}
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg shadow-md bg-black/40">
                      <img
                        src={artwork(song.video, "mq")}
                        alt={song.title}
                        className={`size-full object-cover ${!isVerified ? "grayscale-[0.4] opacity-75" : ""}`}
                        loading="lazy"
                      />
                      {isVerified ? (
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition duration-200 ${
                            isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="size-5 text-primary fill-current" />
                          ) : (
                            <Play className="size-5 text-primary fill-current ml-0.5" />
                          )}
                        </div>
                      ) : (
                        <div
                          title="Source pending verification"
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-70 text-[9px] font-mono text-amber-300"
                        >
                          Info
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium truncate transition ${
                          isVerified ? "text-foreground group-hover:text-teal-300" : "text-foreground/80 group-hover:text-amber-200"
                        }`}>
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

                    <div
                      className="shrink-0 pr-1 flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LikeButton songId={song.id} size={15} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progressive Reveal Button */}
            {filteredSongs.length > displayCount && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setExtraLimit((prev) => prev + 60)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-2 text-xs font-medium text-foreground hover:border-teal-500/30 hover:bg-white/[0.1] transition cursor-pointer"
                >
                  Show More ({filteredSongs.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Informative Dialog for Metadata-only Songs */}
      <AlertDialog
        open={Boolean(unverifiedSongNotice)}
        onOpenChange={(open) => !open && setUnverifiedSongNotice(null)}
      >
        <AlertDialogContent className="max-w-md border border-white/15 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg text-foreground flex items-center gap-2">
              <Info className="size-5 text-amber-400 shrink-0" />
              <span>Playback Source Under Verification</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 space-y-2">
              <span className="block font-semibold text-foreground">
                “{unverifiedSongNotice?.title}”
                {unverifiedSongNotice?.artists && unverifiedSongNotice.artists.length > 0 && (
                  <span className="font-normal text-muted-foreground"> by {unverifiedSongNotice.artists.join(", ")}</span>
                )}
              </span>
              <span className="block text-muted-foreground/90">
                This recording is documented as a canonical archival entry in the Sargam Marathi catalog.
              </span>
              <span className="block text-muted-foreground/80 bg-white/[0.04] p-3 rounded-lg border border-white/[0.06]">
                Sargam strictly streams verified audio from legitimate public archives. Official playback verification for this recording is currently in progress.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setUnverifiedSongNotice(null)}
              className="rounded-full bg-primary text-primary-foreground font-semibold px-5 py-2 text-xs hover:brightness-110"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function MarathiLanguagePage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading Marathi catalogue...
        </div>
      }
    >
      <MarathiContent />
    </Suspense>
  );
}

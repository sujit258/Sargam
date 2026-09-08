"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Code2,
  ScrollText,
  Disc3,
  Heart,
  Info,
  Menu,
  Palette,
  Search,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InstallButton } from "@/components/install-prompt";
import { InstallCard } from "@/components/install-card";
import { LikeBurstHost } from "@/components/like-burst";
import { NoticeDialog } from "@/components/notice-dialog";
import { MobileNav } from "@/components/mobile-nav";
import { track } from "@/lib/analytics";
import { portrait } from "@/lib/catalogue";
import { usePlayer, usePlayerBar } from "@/components/player-provider";
import { useCatalogue, usePhotoManifest } from "@/lib/queries";
import { brand } from "@/lib/brand";

type Frame = {
  /** Scroll container the virtualised lists measure against. */
  scrollEl: HTMLElement | null;
  /** Portal target for the current route's filter panel (if any). */
  filterSlot: HTMLElement | null;
  query: string;
  setQuery: (value: string) => void;
};

const FrameContext = createContext<Frame | null>(null);

export function useFrame() {
  const context = useContext(FrameContext);
  if (!context) throw new Error("useFrame must be used inside AppFrame");
  return context;
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { data: catalogue } = useCatalogue();
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);
  const [filterSlot, setFilterSlot] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const playerBar = usePlayerBar();
  const { playRandom } = usePlayer();
  const { data: photos } = usePhotoManifest();

  const faces = useMemo(
    () =>
      ["Lata Mangeshkar", "Kishore Kumar", "Mohammed Rafi"]
        .map((name) => ({ name, src: portrait(name, photos ?? null) }))
        .filter((face): face is { name: string; src: string } => Boolean(face.src)),
    [photos]
  );

  const navClass = (active: boolean) =>
    `relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
      active
        ? "bg-primary/20 text-primary font-semibold shadow-sm"
        : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
    }`;

  const navLinks = [
    { href: "/", label: "Discover", active: pathname === "/" },
    { href: "/songs", label: "Explore", active: pathname === "/songs" },
    { href: "/stations", label: "Stations", active: pathname.startsWith("/station") || pathname === "/stations" },
    { href: "/favourites", label: "Library", active: pathname === "/favourites" },
  ];

  return (
    <FrameContext.Provider value={{ scrollEl, filterSlot, query, setQuery }}>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
        {/* Compact Top Navigation (Desktop & Mobile header) */}
        <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.08] bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative size-9 overflow-hidden rounded-xl bg-card shadow-md ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt={brand.shortName}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors">
                  SARGAM
                </span>
                <span className="hidden text-[10px] font-sans tracking-wide text-muted-foreground sm:block">
                  Retro Indian Melodies
                </span>
              </div>
            </Link>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Desktop Navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={navClass(link.active)}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Search, Surprise, Favourites, Themes, Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input (Desktop/Tablet) */}
            <div className="relative hidden w-44 sm:block md:w-60 lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  if (!query.trim() && e.target.value.trim()) track("search");
                  setQuery(e.target.value);
                  if (pathname !== "/songs" && e.target.value) {
                    router.push("/songs");
                  }
                }}
                placeholder="Search songs, singers…"
                className="h-8.5 w-full rounded-full border border-white/10 bg-white/[0.06] pl-8.5 pr-8 text-xs text-foreground outline-none transition placeholder:text-muted-foreground/60 hover:border-white/20 hover:bg-white/[0.09] focus:border-primary/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 grid size-4 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Quick Surprise Button */}
            {catalogue && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => playRandom(catalogue.songs)}
                      className="group hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/60 hover:bg-primary/20 sm:inline-flex"
                    >
                      <Disc3 className="size-3.5 shrink-0 transition-transform duration-700 ease-out group-hover:rotate-[360deg]" />
                      <span>Surprise</span>
                      {faces.length > 0 && (
                        <span className="flex shrink-0 -space-x-1.5 ml-1">
                          {faces.map((face) => (
                            <img
                              key={face.name}
                              src={face.src}
                              alt=""
                              className="size-4 rounded-full object-cover ring-1 ring-card"
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  }
                />
                <TooltipContent>Play something at random</TooltipContent>
              </Tooltip>
            )}

            {/* Favourites Shortcut */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    href="/favourites"
                    aria-label="Your favourites"
                    className={`grid size-8.5 place-items-center rounded-full border transition ${
                      pathname === "/favourites"
                        ? "border-heart/40 bg-heart/15 text-heart"
                        : "border-white/10 bg-white/[0.06] text-heart/80 hover:border-heart/30 hover:bg-heart/10 hover:text-heart"
                    }`}
                  >
                    <Heart className="size-4" />
                  </Link>
                }
              />
              <TooltipContent>Favourites</TooltipContent>
            </Tooltip>

            {/* Themes Shortcut */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    href="/themes"
                    aria-label="Backdrop themes"
                    className={`hidden size-8.5 place-items-center rounded-full border transition sm:grid ${
                      pathname === "/themes"
                        ? "border-primary/30 bg-primary/15 text-primary"
                        : "border-white/10 bg-white/[0.06] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Palette className="size-4" />
                  </Link>
                }
              />
              <TooltipContent>Themes</TooltipContent>
            </Tooltip>

            {/* Overflow Menu Drawer */}
            <Sheet key={pathname}>
              <SheetTrigger
                render={
                  <button
                    title="Menu"
                    aria-label="Menu"
                    className="grid size-8.5 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-muted-foreground transition hover:text-foreground hover:bg-white/[0.1]"
                  >
                    <Menu className="size-4" />
                  </button>
                }
              />
              <SheetContent
                side="right"
                className="flex w-72 flex-col overflow-hidden bg-card/95 p-0 backdrop-blur-xl border-l border-white/10"
              >
                <SheetTitle className="sr-only">Sargam Menu</SheetTitle>

                {/* Drawer Header */}
                <div className="p-5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Sargam" className="size-8 rounded-lg shadow" />
                    <div>
                      <span className="block font-serif text-lg font-bold text-foreground">SARGAM</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {catalogue ? `${catalogue.songs.length.toLocaleString()} Master Recordings` : brand.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation Links inside Drawer */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scroll-slim">
                  <div className="space-y-1">
                    <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                      Navigation
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                            link.active
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
                      Preferences & Archive
                    </span>
                    <div className="mt-1 space-y-0.5">
                      <Link
                        href="/themes"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition"
                      >
                        <Palette className="size-4 text-amber-400" />
                        <span>Backdrop Themes</span>
                      </Link>
                      <Link
                        href="/releases"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition"
                      >
                        <ScrollText className="size-4 text-teal-400" />
                        <span>Release Notes</span>
                      </Link>
                      <Link
                        href="/curious/design"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition"
                      >
                        <Code2 className="size-4 text-blue-400" />
                        <span>For the Curious</span>
                      </Link>
                      <Link
                        href="/about"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition"
                      >
                        <Info className="size-4 text-purple-400" />
                        <span>About &amp; Credits</span>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2">
                    <InstallButton />
                  </div>
                </div>

                {/* Footer Attribution */}
                <div className="border-t border-white/[0.08] p-4 text-[10px] text-muted-foreground/70 space-y-1 bg-black/20">
                  <p>Music streams via YouTube embed verification.</p>
                  <p>
                    Inspired by{" "}
                    <a
                      href={brand.credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground transition"
                    >
                      {brand.credit.inspiredBy}
                    </a>
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content Area (Spacious, full width on desktop, no sidebar rail) */}
        <main
          ref={setScrollEl}
          className="scroll-slim min-h-0 flex-1 overflow-y-auto w-full"
        >
          <div className="mx-auto max-w-7xl px-4 pt-4 pb-36 sm:px-6 sm:pt-6 sm:pb-28 lg:px-8 lg:pb-24 w-full">
            {children}
          </div>
        </main>

        {/* Persistent Player Bar */}
        {playerBar}

        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>

      {/* Overlays mounted once */}
      <LikeBurstHost />
      <InstallCard />
      <NoticeDialog />
    </FrameContext.Provider>
  );
}

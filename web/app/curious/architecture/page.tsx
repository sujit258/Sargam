import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Code, Key, Panel } from "@/components/curious-bits";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "How Sargam is engineered — an independent client-first music discovery PWA, " +
    "versioned multi-language catalog engine, and zero-storage audio streaming.",
};

const REPO = brand.repoUrl;

export default function ArchitecturePage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-serif leading-tight">Architecture</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Sargam is an offline-capable, serverless Progressive Web Application (PWA)
          built for discovery and continuous playback of golden-era Indian music.
          It separates <Key>runtime application delivery</Key> from the <Key>offline data pipeline</Key>,
          hosting zero copyrighted audio while enabling instant, sub-millisecond search across thousands of songs.
        </p>
      </header>

      {/* High-level system topology */}
      <Section title="System Topology">
        <Panel className="p-5">
          <div className="font-mono text-xs text-foreground/90 space-y-1 leading-relaxed">
            <p>Listener / Device (PWA Standalone Shell)</p>
            <p className="text-primary font-bold">  ↓</p>
            <p>Next.js 16 Client Shell (Static Prerendered + TanStack Query)</p>
            <p className="text-primary font-bold">  ↓</p>
            <p>Discovery Layer (Aajcha Sargam, Eras, Marathi Spotlight, Facets)</p>
            <p className="text-primary font-bold">  ↓</p>
            <p>Sargam Versioned Catalog (Indexed Compact JSON, Append-Only Ledger)</p>
            <p className="text-primary font-bold">  ↓</p>
            <p>Unified PlayerProvider (Root Layout Sibling + Media Session API)</p>
            <p className="text-primary font-bold">  ↓</p>
            <p className="text-muted-foreground">Authorized Playback Stream (Official YouTube Iframe API)</p>
          </div>
        </Panel>
      </Section>

      <Section title="Runtime Specifications">
        <Facts
          rows={[
            ["Catalog Size", "3,916 songs in an indexed 632 KB JSON payload"],
            ["Languages", "Multi-language architecture (Hindi Foundation & Marathi Spotlight)"],
            ["Stations & Facets", "66 stations, 415 artists, 1,379 films, 23 composers, 12 lyricists"],
            ["Web Stack", "Next.js 16 (App Router), React 19, Tailwind CSS v4, Base UI"],
            ["Audio Engine", "YouTube IFrame Player API with persistent root layout host"],
            ["Client Storage", "Four privacy-focused localStorage keys (sargam namespace with legacy migration)"],
          ]}
        />
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
          The catalog is downloaded once and cached by TanStack React Query and the Service Worker.
          Because track lists are virtualized via <code className="font-mono text-xs">react-virtuoso</code>,
          rendering thousands of songs consumes minimal DOM memory, delivering 60 FPS scrolling on mobile hardware.
        </p>
      </Section>

      <Section title="The Player Lives Above the Pages">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Playback runs inside an official YouTube embedded iframe. Because <Key>an iframe cannot survive being unmounted</Key>,
          the player lives in the root layout (<code className="font-mono text-xs">web/app/layout.tsx</code>) as a sibling
          to the application frame rather than a child of any individual route.
          Navigating between Discover, Stations, Languages, or Search never re-mounts the player or interrupts audio.
        </p>
        <Code caption="web/app/layout.tsx — Persistent player layout architecture">
{`<Providers>            // TanStack Query + Service Worker lifecycle
  <PlayerProvider>      // Manages iframe instance, queue, shuffle, & media session
    <AppFrame>
      {children}        // ← Navigation remounts this container only
    </AppFrame>
    <OfflineNotice />
  </PlayerProvider>
</Providers>`}
        </Code>
      </Section>

      <Section title="Sargam Catalog Engine (Python Pipeline)">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          A dedicated Python data pipeline in <code className="font-mono text-xs">catalog/</code> handles discography ingestion,
          normalization, entity resolution, and verification before data reaches users.
        </p>
        <ol className="mt-4 space-y-2.5">
          {[
            ["Ingestion", "Normalizes discographies, trims audio rip artifacts, and canonicalizes metadata."],
            ["Append-Only Ledger", "Guarantees permanent song IDs in data/song_ids.json so updates never break saved playlists."],
            ["Entity Enrichment", "Resolves artists, eras (1950s–1980s), and regional taxonomies (Bhavgeet, Natya Sangeet)."],
            ["Embed Verification", "Every YouTube link is verified against YouTube's oEmbed endpoint to guarantee playback."],
            ["Publishing", "Emits indexed, versioned JSON (v1.0.0 Hindi, v1.1.0 Marathi) for production web delivery."],
          ].map(([step, body], index) => (
            <li key={step} className="flex gap-3 rounded-lg border border-white/[0.07] bg-card/40 p-4">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{step}</span>
                <span className="mt-1 block max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Storage & Transparent Migration">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Sargam operates with zero server-side authentication. User state is stored locally under the
          <code className="font-mono text-xs"> sargam: </code> namespace:
        </p>
        <ul className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
          <li>• <span className="text-foreground">sargam:favorites</span> — Saved song IDs</li>
          <li>• <span className="text-foreground">sargam:history</span> — Recently played track IDs</li>
          <li>• <span className="text-foreground">sargam:backdrop</span> — Selected ambient backdrop theme</li>
          <li>• <span className="text-foreground">sargam.installDismissed</span> — PWA install banner preference</li>
        </ul>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Transparent migration automatically detects and converts legacy keys upon application boot, ensuring listeners
          never lose their liked songs or custom backdrops.
        </p>
      </Section>

      <Section title="Open Source & Attribution">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Sargam was inspired by the open-source architecture of Mehfil by Shashwat Tripathi.
          Complete upstream attribution, artist photograph provenance from Wikimedia Commons, and station artwork credits
          are documented in our <Link href="/about" className="text-primary hover:underline">About page</Link> and repository documentation.
        </p>
        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Sargam on GitHub
          <ArrowUpRight className="size-4" />
        </a>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-serif leading-snug">{title}</h2>
      {children}
    </section>
  );
}

function Facts({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.07] bg-card/40">
      {rows.map(([term, detail]) => (
        <div key={term} className="flex flex-col gap-1 p-3 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-sm font-medium text-foreground sm:w-36">{term}</dt>
          <dd className="min-w-0 text-sm leading-relaxed text-muted-foreground">
            {detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

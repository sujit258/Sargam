# Sargam — Retro Bollywood Melodies

*Golden Era Hindi Classics*

An independent, production-ready Progressive Web Application (PWA) for browsing and playing golden-era Hindi film music by singer, composer, lyricist, actor, film, station, and mood.

Inspired by [Mehfil](https://mehfil.shashwa7.in/) by Shashwat Rastogi. Built and customized as Sargam by our team with a distinctive **Deep Obsidian Velvet & Radiant Luminous Amber** design aesthetic, enhanced PWA installation flows, and centralized brand architecture.

> **Legal Disclaimer:** No audio is hosted, stored, or redistributed. Playback streams exclusively through YouTube's official embedded player. Song metadata is factual catalogue information compiled from publicly available songlists.

## Documentation
- [PWA Guide & Installation (PWA.md)](file:///f:/Mahfil/PWA.md)
- [System Architecture (ARCHITECTURE.md)](file:///f:/Mahfil/ARCHITECTURE.md)

## How it works

Saregama publish the Carvaan Gold songlist as a public PDF. That PDF is parsed
into a catalogue, each song is matched to an official YouTube upload, every
match is verified as actually embeddable, and the result is exported as a static
JSON the web app reads.

```
songlist.pdf → parse → enrich → resolve → verify → export → web app
```

### The station trick

Song entries credit only singers. But the 66 stations imply the other roles: a
song under `GULZAR` was written by him, under `R.D. BURMAN` composed by him,
under `REKHA` picturised on her. That back-fills roles the per-song data never
contains — 2,671 songs gain a composer, 2,535 a lyricist, 997 an actor.

## Pipeline

Each stage is independently runnable, idempotent, and resumable. All state lives
in one SQLite file; every write is an UPSERT and no stage deletes resolved rows,
so an interrupted run only ever loses the in-flight batch.

Song ids come from `data/song_ids.json`, a committed ledger keyed by title and
film. They are append-only: a new song takes the next free number and no
existing song ever moves. This matters because `resolutions` maps `song_id` to a
video and nothing rewrites it when songs are re-parsed — ids that shifted would
leave every row holding the previous song's video under the next song's name,
silently. Ingest and export both refuse to run if the ids in hand disagree with
the ledger, and `check_ids.py` verifies the four files that hold ids still
agree.

```bash
# 1. Parse the songlist PDF (column-aware: naive extraction bleeds columns)
pdftotext -bbox-layout songlist.pdf full.xml
python3 pipeline/parse_songlist.py full.xml data/songs.json

# 2. Load catalogue + station role taxonomy into SQLite (refuses ids that
#    disagree with the ledger, since this is where they enter the database)
python3 -c "import sys; sys.path.insert(0,'pipeline'); import store; \
  store.ingest_catalogue(store.connect('data/carvaan.db'), \
  'data/songs.json','data/stations.json')"

# 3. Resolve YouTube ids — three sources, cheapest first
python3 pipeline/import_labnol.py <labnol_dir> data/carvaan.db   # community data
python3 pipeline/harvest_youtube.py data/carvaan.db              # channel listings
python3 pipeline/match_videos.py data/carvaan.db
python3 pipeline/search_youtube.py data/carvaan.db               # per-song search

# 4. Verify every id is actually playable in an iframe
python3 pipeline/verify_embeddable.py data/carvaan.db

# 5. Portraits from Wikidata / Wikimedia Commons
python3 pipeline/fetch_artist_photos.py data/carvaan.db web/public/artists

# 6. Export the static catalogue the app reads (same refusal: what ships here
#    reaches devices that cannot be corrected afterwards)
python3 pipeline/export_catalogue.py data/carvaan.db web/public/catalogue.json

# 7. Confirm the ledger, the parse, the database and the published catalogue
#    still agree about what each id means. Drift between them has no symptom
#    other than songs playing the wrong recording, so this is the only check.
python3 pipeline/check_ids.py

# Durability tests
python3 pipeline/test_resume.py
```

## Web app

```bash
cd web && npm install && npm run dev
```

Next.js 16, React 19, Tailwind v4, shadcn/ui (Base UI). Fully static — no
backend, no accounts. Cover art comes from YouTube stills, so no images are
stored for songs.

## Design notes

**A wrong link is worse than a missing one.** A wrong id plays the wrong song
while looking correct. So a title match alone is never enough — the film name or
a credited singer must independently corroborate it, and covers, recreations and
compilations are rejected outright. Coverage was deliberately traded for
precision: an early matcher accepting title-only matches produced ~380 wrong
songs and was scrapped.

**Matched ≠ playable.** Community data from 2017-18 matched 1,871 songs, but
only 52% were still embeddable. Every id is verified against YouTube's oEmbed
endpoint; failures are demoted back to the queue rather than deleted, and dead
ids are remembered so later runs never rediscover them.

**Identity is verified, not assumed.** A name search returns the wrong person
happily. Portraits are accepted only when Wikidata confirms a human (`P31=Q5`)
with a musical occupation (`P106`); otherwise the card falls back to song art.

### Known limits

- **~30% of the catalogue has no playable link.** Obscure titles and
  instrumentals largely aren't on YouTube in embeddable form.
- **Matches at 0.82 confidence (singer-only) are ~1 in 6 questionable.** They
  are flagged in the UI rather than hidden. This needs human ears, not a better
  heuristic.
- **Region restrictions aren't detected.** A video can be embeddable and still
  fail to play in a given country.
- The parsed catalogue holds 4,310 songs against a marketing figure of 5,000 —
  the PDF is *Songlist 1.0* and the shipped device likely carries more.

## Attribution

Artist portraits come from Wikimedia Commons under open licences (CC BY,
CC BY-SA, GODL-India). Per-image licence, author and source URL are recorded in
`web/public/artists/manifest.json`.

Song metadata is factual catalogue data from Saregama's own published songlist.
Playback is via YouTube's official embed player; no audio is downloaded, hosted
or redistributed.

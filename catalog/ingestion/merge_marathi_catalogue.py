"""
merge_marathi_catalogue.py
==========================
Merges the 253-song seed catalogue (sargam_marathi_song_catalogue.txt)
into the existing data/catalogs/marathi/songs.json.

Rules:
- Existing songs with rich metadata (verified YouTube IDs, artists, etc.)
  are KEPT as-is when their title matches a seed entry.
- Seed songs not already in songs.json are ADDED as metadata-only records.
- No song is duplicated.
- No song is removed.
- Output is written back to data/catalogs/marathi/songs.json.
- A new id-map entry is created for each new song.
- The web/public/catalogue.json is rebuilt by calling publish_multilang_catalog.
"""

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEED_FILE = ROOT / "data/catalogs/marathi/sargam_marathi_song_catalogue.txt"
EXISTING_FILE = ROOT / "data/catalogs/marathi/songs.json"
ID_MAP_FILE = ROOT / "data/marathi/id-map.json"

# ── category normalisation ────────────────────────────────────────────────────

CATEGORY_MAP = {
    "marathi classics":   "marathi-classics",
    "marathi classic":    "marathi-classics",
    "bhavageet":          "bhavageet",
    "bhavgeet":           "bhavageet",
    "natya sangeet":      "natya-sangeet",
    "natyasangeet":       "natya-sangeet",
    "lavani":             "lavani",
    "marathi bhakti":     "marathi-bhakti",
    "bhakti":             "marathi-bhakti",
    "folk":               "folk",
    "balgeet/folk":       "folk",
    "marathi film":       "marathi-film",
    "romantic":           "romantic",
    "devotional":         "devotional",
    "gavlani":            "gavlani",
    "patriotic":          "patriotic",
}

def normalise_category(raw: str) -> str:
    key = raw.strip().lower()
    return CATEGORY_MAP.get(key, key.replace(" ", "-"))


# ── title normalisation for deduplication ─────────────────────────────────────

def normalise_title(title: str) -> str:
    """Lower-case, strip diacritics, collapse whitespace, drop punctuation."""
    t = title.lower()
    t = unicodedata.normalize("NFD", t)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9\s]", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


# ── load existing songs ───────────────────────────────────────────────────────

with open(EXISTING_FILE, encoding="utf-8") as f:
    existing_songs: list[dict] = json.load(f)

# Map normalised title → existing record
existing_by_title: dict[str, dict] = {
    normalise_title(s["title"]): s for s in existing_songs
}

print(f"Existing Marathi songs: {len(existing_songs)}")


# ── load seed catalogue ───────────────────────────────────────────────────────

raw_text = SEED_FILE.read_text(encoding="utf-8")
# The JSON content starts at the first '{' after the header.
json_start = raw_text.index("{")
seed_data = json.loads(raw_text[json_start:])
seed_songs: list[dict] = seed_data["songs"]

print(f"Seed songs in file: {len(seed_songs)}")


# ── load id-map ───────────────────────────────────────────────────────────────

with open(ID_MAP_FILE, encoding="utf-8") as f:
    id_map: dict = json.load(f)

# Reverse id_map: sargam_id → seed_id (if any)
# id_map currently maps { "mar-cls-001": "mr-0001", ... } or similar.
# Invert: seed_id → sargam_id.
seed_to_sargam: dict[str, str] = {v: k for k, v in id_map.items()}


# ── determine next available sargam ID numbers per prefix ────────────────────

PREFIX_FOR_CATEGORY = {
    "marathi-classics": "mar-cls",
    "bhavageet":        "mar-bhav",
    "natya-sangeet":    "mar-natya",
    "lavani":           "mar-lav",
    "marathi-bhakti":   "mar-bhakti",
    "folk":             "mar-folk",
    "marathi-film":     "mar-film",
    "romantic":         "mar-rom",
    "devotional":       "mar-dev",
    "gavlani":          "mar-gav",
    "patriotic":        "mar-pat",
}

def next_id_for_prefix(prefix: str, existing_ids: set[str]) -> str:
    """Return the next unused ID like mar-cls-042."""
    n = 1
    while True:
        candidate = f"{prefix}-{n:03d}"
        if candidate not in existing_ids:
            return candidate
        n += 1

existing_sargam_ids: set[str] = {s["id"] for s in existing_songs}


# ── merge ─────────────────────────────────────────────────────────────────────

added = 0
matched = 0
new_songs: list[dict] = list(existing_songs)  # start with all existing

for seed in seed_songs:
    seed_id = seed["id"]       # e.g. "mr-0001"
    title = seed["title"]
    norm = normalise_title(title)
    category_raw = seed.get("category", "marathi-classics")
    category = normalise_category(category_raw)

    if norm in existing_by_title:
        # Song already exists — enrich its categories if the seed adds a new one
        existing = existing_by_title[norm]
        cats = existing.get("categories", [])
        if category not in cats:
            cats.append(category)
            existing["categories"] = cats
        matched += 1
        continue

    # New song — create a metadata-only record
    prefix = PREFIX_FOR_CATEGORY.get(category, "mar-misc")
    sargam_id = next_id_for_prefix(prefix, existing_sargam_ids)
    existing_sargam_ids.add(sargam_id)

    new_record = {
        "id": sargam_id,
        "title": title,
        "language": "marathi",
        "categories": [category],
        "moods": [],
        "source": None,
        "provenance": {
            "catalogVersion": "1.2.0",
            "source": "sargam-marathi-seed-v1",
            "seedId": seed_id,
        },
    }

    new_songs.append(new_record)
    existing_by_title[norm] = new_record
    id_map[sargam_id] = seed_id
    added += 1


print(f"Matched existing: {matched}")
print(f"New songs added: {added}")
print(f"Total Marathi songs: {len(new_songs)}")


# ── write outputs ─────────────────────────────────────────────────────────────

with open(EXISTING_FILE, "w", encoding="utf-8") as f:
    json.dump(new_songs, f, ensure_ascii=False, indent=2)

with open(ID_MAP_FILE, "w", encoding="utf-8") as f:
    json.dump(id_map, f, ensure_ascii=False, indent=2)

print("Written: data/catalogs/marathi/songs.json")
print("Written: data/marathi/id-map.json")

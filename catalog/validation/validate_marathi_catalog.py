"""Validate Marathi music catalogue for Sargam (v1.1.0).

Strictly enforces:
1. Every Marathi song has language == 'marathi'
2. Every ID starts with 'mar-'
3. IDs are globally unique
4. Titles are non-empty strings
5. No duplicate normalized titles
6. Categories belong to the controlled taxonomy
7. Moods belong to the controlled taxonomy
8. Source objects are verified or explicitly marked unverified (no fabrication)
9. Provenance metadata exists
10. Baseline Hindi songs count is exactly 3,916 (preservation check)
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from catalog.validation.youtube_sources import validate_discovery, suspicious_id

CONTROLLED_CATEGORIES = {
    "marathi-classics",
    "marathi-film",
    "bhavageet",
    "natya-sangeet",
    "lavani",
    "marathi-bhakti",
    "folk",
    "romantic",
    "devotional",
    "gavlani",
    "powada",
    "gondhal",
    "bharud",
    "koli-geet",
    "dhangari",
    "traditional",
    "patriotic",
}

CONTROLLED_MOODS = {
    "romantic",
    "peaceful",
    "nostalgic",
    "devotional",
    "festive",
    "energetic",
    "melancholic",
    "spiritual",
    "joyful",
    "playful",
    "poetic"
}


def validate_marathi():
    marathi_path = "data/catalogs/marathi/songs.json"
    catalog_path = "web/public/catalogue.json"

    print(f"[*] Validating Marathi catalog: {marathi_path}")
    with open(marathi_path, "r", encoding="utf-8") as f:
        songs = json.load(f)

    seen_ids = set()
    seen_titles = set()
    verified_count = 0
    unresolved_count = 0

    for i, s in enumerate(songs):
        sid = s.get("id")
        title = s.get("title")
        lang = s.get("language")

        # 1. language == marathi
        assert lang == "marathi", f"Song {i} ({title}) has invalid language: {lang}"

        # 2. ID starts with mar-
        assert sid and sid.startswith("mar-"), f"Song {i} ({title}) has invalid ID: {sid}"

        # 3. IDs are globally unique
        assert sid not in seen_ids, f"Duplicate ID detected: {sid}"
        seen_ids.add(sid)

        # 4. Title is non-empty string
        assert title and isinstance(title, str) and title.strip(), f"Empty title at index {i}"

        # 5. No duplicate normalized titles
        norm_title = title.lower().strip()
        assert norm_title not in seen_titles, f"Duplicate normalized title: {title}"
        seen_titles.add(norm_title)

        # 6. Controlled categories
        cats = s.get("categories", [])
        assert len(cats) > 0, f"Song {sid} has no categories"
        for c in cats:
            assert c in CONTROLLED_CATEGORIES, f"Song {sid} has unknown category: {c}"

        # 7. Controlled moods
        moods = s.get("moods", [])
        for m in moods:
            assert m in CONTROLLED_MOODS, f"Song {sid} has unknown mood: {m}"

        # 8. Source verification check
        source = s.get("source")
        if source and source.get("id"):
            assert not suspicious_id(source["id"]), f"Suspicious source for {sid}"
        if source and source.get("verified"):
            verified_count += 1
            assert source.get("id"), f"Song {sid} marked verified without YouTube ID"
        else:
            unresolved_count += 1

        # 9. Provenance exists
        prov = s.get("provenance")
        assert prov and prov.get("catalogVersion") in {"1.1.0", "1.2.0", "1.3.0"}, f"Missing or invalid provenance for {sid}"

    print(f"[+] Total Marathi Songs: {len(songs)}")
    print(f"[+] Verified Playable: {verified_count}")
    print(f"[+] Unresolved / Metadata-only: {unresolved_count}")
    evidence = json.loads(Path('data/catalogs/marathi/watch_evidence.json').read_text(encoding='utf-8'))
    validate_discovery([s for s in songs if (s.get('source') or {}).get('verified')], evidence)

    # 10. Baseline Hindi songs preservation check
    print(f"[*] Validating published catalogue preservation: {catalog_path}")
    with open(catalog_path, "r", encoding="utf-8") as f:
        cat = json.load(f)

    all_songs = cat["songs"]
    hindi_songs = [s for s in all_songs if s.get("lang") == "hindi" or isinstance(s["id"], int)]
    marathi_pub = [s for s in all_songs if s.get("lang") == "marathi" or str(s["id"]).startswith("mar-")]

    assert len(hindi_songs) == 3916, f"Hindi songs count altered! Found {len(hindi_songs)}, expected 3916"
    assert len(marathi_pub) == len(songs), f"Marathi published count mismatch: {len(marathi_pub)} vs {len(songs)}"
    assert len(all_songs) == 3916 + len(songs), f"Total catalogue size unexpected: {len(all_songs)}"
    assert len(cat["facets"]["stations"]) == 66 + 8, f"Unexpected station count: {len(cat['facets']['stations'])}"

    print(f"[+] Preserved Hindi Songs: {len(hindi_songs)}")
    print(f"[+] Published Marathi Songs: {len(marathi_pub)}")
    print(f"[+] Total Stations: {len(cat['facets']['stations'])} (66 Hindi + 8 Marathi)")
    print("[SUCCESS] All Marathi catalog validation rules passed 100%!")


if __name__ == "__main__":
    validate_marathi()

"""Sargam Catalog Engine: Catalog Integrity Validation

Verifies song counts, facet indices, non-empty fields, and detects duplicate IDs.
"""

import json
import sys
from pathlib import Path


def validate_catalog_file(catalog_path: Path) -> bool:
    print(f"[*] Validating Sargam catalog: {catalog_path}")
    if not catalog_path.exists():
        print(f"[-] Error: File not found: {catalog_path}")
        return False

    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    songs = data.get("songs", [])
    facets = data.get("facets", {})
    station_meta = data.get("stationMeta", {})

    print(f"[+] Total Songs: {len(songs)}")
    print(f"[+] Facet Keys: {list(facets.keys())}")
    print(f"[+] Stations in facets: {len(facets.get('stations', []))}")
    print(f"[+] StationMeta entries: {len(station_meta)}")

    # 1. Check duplicate IDs
    ids = [s.get("id") for s in songs]
    unique_ids = set(ids)
    if len(ids) != len(unique_ids):
        print(f"[-] Error: Found {len(ids) - len(unique_ids)} duplicate song IDs!")
        return False

    # 2. Check for missing titles or videos
    missing_title = [s for s in songs if not s.get("t")]
    missing_video = [s for s in songs if not s.get("v")]
    if missing_title:
        print(f"[-] Error: {len(missing_title)} songs missing title!")
        return False
    if missing_video:
        print(f"[-] Error: {len(missing_video)} songs missing video ID!")
        return False

    # 3. Check facet bounds
    films_len = len(facets.get("films", []))
    artists_len = len(facets.get("artists", []))
    stations_len = len(facets.get("stations", []))

    for idx, s in enumerate(songs):
        f_idx = s.get("f")
        if f_idx is not None and (f_idx < 0 or f_idx >= films_len):
            print(f"[-] Out-of-bounds film index {f_idx} at song index {idx}")
            return False
        for a_idx in s.get("a", []):
            if a_idx < 0 or a_idx >= artists_len:
                print(f"[-] Out-of-bounds artist index {a_idx} at song index {idx}")
                return False
        for s_idx in s.get("s", []):
            if s_idx < 0 or s_idx >= stations_len:
                print(f"[-] Out-of-bounds station index {s_idx} at song index {idx}")
                return False

    print("[SUCCESS] Sargam catalog is 100% valid and verified.")
    return True


if __name__ == "__main__":
    target = Path("web/public/catalogue.json")
    if len(sys.argv) > 1:
        target = Path(sys.argv[1])
    success = validate_catalog_file(target)
    sys.exit(0 if success else 1)

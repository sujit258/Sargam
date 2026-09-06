"""Sargam Catalog Engine: Duplicate Detection Module
"""

import json
from pathlib import Path
from collections import defaultdict


def check_duplicates(catalog_path: Path):
    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    songs = data.get("songs", [])
    seen_keys = defaultdict(list)

    for idx, s in enumerate(songs):
        title = (s.get("t") or "").strip().lower()
        film = s.get("f")
        key = f"{title}::film_{film}"
        seen_keys[key].append(s.get("id"))

    duplicates = {k: v for k, v in seen_keys.items() if len(v) > 1}
    print(f"[*] Evaluated {len(songs)} songs. Found {len(duplicates)} duplicate title+film pairs.")
    return duplicates


if __name__ == "__main__":
    check_duplicates(Path("web/public/catalogue.json"))

"""Sargam Catalog Engine: Search & Facet Index Generator

Precomputes tokenized indices for instant sub-millisecond client filtering.
"""

import json
from pathlib import Path


def generate_search_index(catalog_path: Path, output_path: Path):
    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    songs = data.get("songs", [])
    facets = data.get("facets", {})
    films = facets.get("films", [])
    artists = facets.get("artists", [])

    index = []
    for s in songs:
        film_title = films[s["f"]] if s["f"] is not None and s["f"] < len(films) else ""
        artist_names = [artists[a] for a in s.get("a", []) if a < len(artists)]
        index.append({
            "id": s["id"],
            "title": s["t"],
            "film": film_title,
            "artists": artist_names,
            "video": s["v"],
        })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(index, f, separators=(",", ":"))

    print(f"[+] Generated search index with {len(index)} entries -> {output_path}")


if __name__ == "__main__":
    src = Path("web/public/catalogue.json")
    out = Path("data/search_index.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    generate_search_index(src, out)

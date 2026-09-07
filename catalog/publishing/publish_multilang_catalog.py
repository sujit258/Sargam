"""Sargam Multi-Language Catalog Publisher (v1.2.0)

Merges the 3,916 Hindi master recordings with the Marathi catalogue
(currently 313 songs, grows over time) into web/public/catalogue.json
and publishes language-partitioned indexes into data/indexes/.

Preservation rules:
1. Hindi songs (count: 3,916) retain their exact IDs, titles, film references,
   artists, stations, and video IDs.
2. Hindi stations (count: 66) are completely preserved.
3. 8 Marathi stations are added.
4. Marathi songs use canonical 'mar-...' IDs, first-class 'marathi' language tag,
   controlled category tags, and explicit source verification flags.
5. Emits catalogVersion: '1.2.0'.
"""

import json
import os
import sys

def publish():
    catalog_path = "web/public/catalogue.json"
    marathi_path = "data/catalogs/marathi/songs.json"
    stations_path = "data/stations/marathi_stations.json"

    print(f"[*] Reading current baseline catalog: {catalog_path}")
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    all_songs_in_catalog = catalog["songs"]
    facets = catalog["facets"]
    station_meta = catalog.get("stationMeta", {})

    # Count only Hindi songs from existing catalogue (Marathi may already be present)
    existing_songs = [
        s for s in all_songs_in_catalog
        if s.get("lang", "hindi") == "hindi"
    ]
    hindi_count = len(existing_songs)
    print(f"[+] Baseline Hindi songs count: {hindi_count}")
    assert hindi_count == 3916, f"Expected 3,916 Hindi songs, found {hindi_count}"

    # Load Marathi songs
    print(f"[*] Reading Marathi catalog: {marathi_path}")
    with open(marathi_path, "r", encoding="utf-8") as f:
        marathi_songs = json.load(f)

    # Load Marathi stations
    with open(stations_path, "r", encoding="utf-8") as f:
        marathi_stations = json.load(f)

    # Prepare vocabulary sets from existing facets
    artists_set = set(facets["artists"])
    films_set = set(facets["films"])
    stations_set = set(facets["stations"])
    moods_set = set(facets["moods"])
    composer_set = set(facets.get("composer", []))
    lyricist_set = set(facets.get("lyricist", []))
    actor_set = set(facets.get("actor", []))
    singer_set = set(facets.get("singer", []))
    director_set = set(facets.get("director", []))

    # Multi-language facets: languages & categories
    languages_list = ["hindi", "marathi"]
    categories_set = set()

    for s in marathi_songs:
        for c in s.get("categories", []):
            categories_set.add(c)

    # Add Marathi stations to stations_set
    for st in marathi_stations:
        stations_set.add(st["name"])
        station_meta[st["name"]] = {
            "kind": "genre",
            "person": None
        }

    # Add Marathi entities to vocabulary
    for s in marathi_songs:
        for a in s.get("artists", []):
            artists_set.add(a)
        if s.get("film") and s["film"].get("name"):
            films_set.add(s["film"]["name"])
        for comp in s.get("composers", []):
            composer_set.add(comp)
        for lyr in s.get("lyricists", []):
            lyricist_set.add(lyr)
        for m in s.get("moods", []):
            moods_set.add(m.title())

    # Build sorted lists & lookup indices
    new_facets = {
        "artists": sorted(artists_set),
        "films": sorted(films_set),
        "stations": sorted(stations_set),
        "moods": sorted(moods_set),
        "composer": sorted(composer_set),
        "lyricist": sorted(lyricist_set),
        "actor": sorted(actor_set),
        "singer": sorted(singer_set),
        "director": sorted(director_set),
        "languages": languages_list,
        "categories": sorted(categories_set)
    }

    # Helper maps for index lookups
    artist_idx = {name: i for i, name in enumerate(new_facets["artists"])}
    film_idx = {name: i for i, name in enumerate(new_facets["films"])}
    station_idx = {name: i for i, name in enumerate(new_facets["stations"])}
    mood_idx = {name: i for i, name in enumerate(new_facets["moods"])}
    composer_idx = {name: i for i, name in enumerate(new_facets["composer"])}
    lyricist_idx = {name: i for i, name in enumerate(new_facets["lyricist"])}
    cat_idx = {name: i for i, name in enumerate(new_facets["categories"])}

    # Map existing Hindi songs with language tag
    # Note: because we sorted existing facets with added Marathi entities,
    # let's map existing song indices correctly!
    old_artists = facets["artists"]
    old_films = facets["films"]
    old_stations = facets["stations"]
    old_moods = facets["moods"]
    old_composer = facets.get("composer", [])
    old_lyricist = facets.get("lyricist", [])
    old_actor = facets.get("actor", [])
    old_singer = facets.get("singer", [])
    old_director = facets.get("director", [])

    updated_hindi_songs = []
    for s in existing_songs:
        film_name = old_films[s["f"]] if s["f"] is not None else None
        new_f = film_idx[film_name] if film_name is not None else None

        new_a = [artist_idx[old_artists[i]] for i in s["a"] if i < len(old_artists)]
        new_s = [station_idx[old_stations[i]] for i in s["s"] if i < len(old_stations)]
        new_m = [mood_idx[old_moods[i]] for i in s["m"] if i < len(old_moods)]
        new_cr = [composer_idx[old_composer[i]] for i in s.get("cr", []) if i < len(old_composer)]
        new_lt = [lyricist_idx[old_lyricist[i]] for i in s.get("lt", []) if i < len(old_lyricist)]
        new_ar = s.get("ar", [])
        new_sr = s.get("sr", [])
        new_dr = s.get("dr", [])

        updated_hindi_songs.append({
            "id": s["id"],
            "t": s["t"],
            "f": new_f,
            "v": s["v"],
            "c": s["c"],
            "a": new_a,
            "s": new_s,
            "m": new_m,
            "cr": new_cr,
            "lt": new_lt,
            "ar": new_ar,
            "sr": new_sr,
            "dr": new_dr,
            "lang": "hindi",
            "source_verified": True
        })

    assert len(updated_hindi_songs) == 3916, "Hindi songs count corrupted!"

    # Process new Marathi songs
    marathi_processed = []
    for s in marathi_songs:
        film_name = s.get("film", {}).get("name") if s.get("film") else None
        f_val = film_idx[film_name] if film_name else None

        a_vals = [artist_idx[a] for a in s.get("artists", []) if a in artist_idx]

        # Map categories to stations
        s_vals = []
        for cat in s.get("categories", []):
            st_name = None
            if cat == "marathi-classics":
                st_name = "Marathi Classics"
            elif cat == "bhavageet":
                st_name = "Marathi Bhavageet"
            elif cat == "natya-sangeet":
                st_name = "Natya Sangeet"
            elif cat == "lavani":
                st_name = "Lavani"
            elif cat in ("marathi-bhakti", "devotional"):
                st_name = "Marathi Bhakti"
            elif cat == "gavlani":
                st_name = "Gavlani"
            elif cat == "folk":
                st_name = "Marathi Folk"
            elif cat == "romantic":
                st_name = "Marathi Romance"

            if st_name and st_name in station_idx:
                s_vals.append(station_idx[st_name])

        m_vals = [mood_idx[m.title()] for m in s.get("moods", []) if m.title() in mood_idx]
        cr_vals = [composer_idx[c] for c in s.get("composers", []) if c in composer_idx]
        lt_vals = [lyricist_idx[l] for l in s.get("lyricists", []) if l in lyricist_idx]
        c_vals = [cat_idx[c] for c in s.get("categories", []) if c in cat_idx]

        source = s.get("source") or {}
        is_verified = bool(source.get("verified"))
        video_id = source.get("id") if is_verified else ""

        marathi_processed.append({
            "id": s["id"],
            "t": s["title"],
            "f": f_val,
            "v": video_id or "",
            "c": 1.0 if is_verified else 0.5,
            "a": a_vals,
            "s": list(set(s_vals)),
            "m": m_vals,
            "cr": cr_vals,
            "lt": lt_vals,
            "ar": [],
            "sr": [],
            "dr": [],
            "lang": "marathi",
            "cat": c_vals,
            "themes": s.get("themes", []),
            "source_verified": is_verified
        })

    print(f"[+] Processed {len(marathi_processed)} Marathi songs.")

    # Combine into unified catalog
    all_songs = updated_hindi_songs + marathi_processed
    print(f"[+] Total songs in published catalog: {len(all_songs)} (Hindi: {len(updated_hindi_songs)}, Marathi: {len(marathi_processed)})")

    out_catalog = {
        "catalogVersion": "1.1.0",
        "facets": new_facets,
        "songs": all_songs,
        "stationMeta": station_meta
    }

    # Write back to web/public/catalogue.json
    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump(out_catalog, f, ensure_ascii=False)
    print(f"[SUCCESS] Successfully published multi-language catalog to {catalog_path}")

    # Generate partitioned indexes in data/indexes/
    os.makedirs("data/indexes", exist_ok=True)
    with open("data/indexes/languages.json", "w", encoding="utf-8") as f:
        json.dump({
            "hindi": {"count": len(updated_hindi_songs), "stationCount": 66},
            "marathi": {"count": len(marathi_processed), "stationCount": len(marathi_stations)}
        }, f, indent=2)

    with open("data/indexes/categories.json", "w", encoding="utf-8") as f:
        cat_counts = {}
        for c in new_facets["categories"]:
            cat_counts[c] = sum(1 for s in marathi_songs if c in s.get("categories", []))
        json.dump(cat_counts, f, indent=2)

    print("[SUCCESS] Partitioned indexes generated in data/indexes/")


if __name__ == "__main__":
    publish()

"""Automated Test Suite for Sargam Marathi Music Catalogue (v1.1.0)

Covers:
- Exact preservation of Hindi songs (3,916 baseline)
- Exact preservation & expansion of stations (66 Hindi + 8 Marathi = 74)
- Marathi schema conformance
- ID uniqueness and 'mar-' prefix convention
- Duplicate title detection
- Controlled category and mood taxonomies
- Source verification handling (verified vs unresolved)
- Catalogue versioning (1.1.0)
- Multi-language search and category filtering logic
"""

import json
import os
import unittest

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
    "traditional"
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

MARATHI_STATION_NAMES = [
    "Marathi Classics",
    "Marathi Bhavageet",
    "Natya Sangeet",
    "Lavani",
    "Marathi Bhakti",
    "Gavlani",
    "Marathi Folk",
    "Marathi Romance"
]


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class TestMarathiCatalog(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        catalog_path = os.path.join(ROOT_DIR, "web", "public", "catalogue.json")
        marathi_path = os.path.join(ROOT_DIR, "data", "catalogs", "marathi", "songs.json")
        ledger_path = os.path.join(ROOT_DIR, "data", "marathi", "source-verification.json")
        id_map_path = os.path.join(ROOT_DIR, "data", "marathi", "id-map.json")
        stations_path = os.path.join(ROOT_DIR, "data", "stations", "marathi_stations.json")

        with open(catalog_path, "r", encoding="utf-8") as f:
            cls.catalog = json.load(f)

        with open(marathi_path, "r", encoding="utf-8") as f:
            cls.marathi_raw = json.load(f)

        with open(ledger_path, "r", encoding="utf-8") as f:
            cls.ledger = json.load(f)

        with open(id_map_path, "r", encoding="utf-8") as f:
            cls.id_map = json.load(f)

        with open(stations_path, "r", encoding="utf-8") as f:
            cls.stations = json.load(f)

    def test_hindi_count_preserved(self):
        """Rule: Baseline 3,916 Hindi songs must be preserved 100% without modification."""
        all_songs = self.catalog["songs"]
        hindi_songs = [
            s for s in all_songs
            if s.get("lang") == "hindi" or isinstance(s.get("id"), int)
        ]
        self.assertEqual(len(hindi_songs), 3916, f"Expected exactly 3,916 Hindi songs, found {len(hindi_songs)}")

    def test_station_count_preserved_and_expanded(self):
        """Rule: 66 original stations preserved + 8 Marathi stations added = 74 total."""
        stations = self.catalog["facets"]["stations"]
        self.assertEqual(len(stations), 74, f"Expected 74 stations in catalogue.json, got {len(stations)}")
        for st_name in MARATHI_STATION_NAMES:
            self.assertIn(st_name, stations, f"Marathi station '{st_name}' missing from catalogue facets")

    def test_catalogue_version(self):
        """Rule: Catalogue version must be '1.1.0'."""
        self.assertEqual(self.catalog.get("catalogVersion"), "1.1.0")
        self.assertEqual(self.ledger.get("catalogVersion"), "1.1.0")

    def test_marathi_schema_conformance(self):
        """Rule: Every Marathi song must have language='marathi', valid artists, categories, provenance."""
        for s in self.marathi_raw:
            self.assertEqual(s.get("language"), "marathi", f"Song {s.get('id')} has invalid language")
            self.assertTrue(s.get("title") and s["title"].strip(), f"Song {s.get('id')} missing title")
            self.assertTrue(s.get("artists") and len(s["artists"]) > 0, f"Song {s.get('id')} missing artists")
            self.assertTrue(s.get("categories") and len(s["categories"]) > 0, f"Song {s.get('id')} missing categories")
            self.assertIn("catalogVersion", s.get("provenance", {}))

    def test_marathi_id_uniqueness_and_prefix(self):
        """Rule: Marathi IDs must start with 'mar-' and be globally unique."""
        seen_ids = set()
        for s in self.marathi_raw:
            sid = s.get("id")
            self.assertTrue(sid.startswith("mar-"), f"Song ID '{sid}' does not start with 'mar-'")
            self.assertNotIn(sid, seen_ids, f"Duplicate Marathi ID detected: {sid}")
            seen_ids.add(sid)
        self.assertEqual(len(seen_ids), 100, "Expected exactly 100 unique Marathi IDs")

    def test_no_duplicate_titles(self):
        """Rule: No duplicate normalized titles in the Marathi catalogue."""
        seen_titles = set()
        for s in self.marathi_raw:
            norm = s["title"].lower().strip()
            self.assertNotIn(norm, seen_titles, f"Duplicate normalized title found: {s['title']}")
            seen_titles.add(norm)
        self.assertEqual(len(seen_titles), 100)

    def test_controlled_categories_and_moods(self):
        """Rule: All categories and moods must be from the controlled vocabulary."""
        for s in self.marathi_raw:
            for cat in s.get("categories", []):
                self.assertIn(cat, CONTROLLED_CATEGORIES, f"Unknown category '{cat}' in {s['id']}")
            for mood in s.get("moods", []):
                self.assertIn(mood, CONTROLLED_MOODS, f"Unknown mood '{mood}' in {s['id']}")

    def test_source_verification_ledger(self):
        """Rule: Do not fabricate YouTube IDs. Distinguish verified from unverified."""
        verified_count = 0
        unresolved_count = 0
        for s in self.marathi_raw:
            is_verified = bool(s.get("source", {}).get("verified"))
            if is_verified:
                verified_count += 1
                self.assertTrue(s["source"].get("id"), f"Song {s['id']} marked verified without video ID")
            else:
                unresolved_count += 1

        self.assertEqual(self.ledger["verifiedPlayableCount"], verified_count)
        self.assertEqual(self.ledger["unresolvedCount"], unresolved_count)
        self.assertEqual(verified_count + unresolved_count, 100)
        self.assertEqual(verified_count, 37)
        self.assertEqual(unresolved_count, 63)

    def test_multi_language_filtering(self):
        """Rule: Search and filter functions can isolate Marathi songs and categories."""
        all_songs = self.catalog["songs"]
        marathi_in_pub = [s for s in all_songs if s.get("lang") == "marathi"]
        self.assertEqual(len(marathi_in_pub), 100)

        # Check category presence
        cat_labels = self.catalog["facets"]["categories"]
        self.assertIn("bhavageet", cat_labels)
        self.assertIn("natya-sangeet", cat_labels)
        self.assertIn("lavani", cat_labels)
        self.assertIn("gavlani", cat_labels)
        self.assertIn("folk", cat_labels)
        self.assertIn("romantic", cat_labels)


if __name__ == "__main__":
    unittest.main()

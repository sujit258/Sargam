import copy
import json
from pathlib import Path
import unittest

from catalog.ingestion.import_marathi import digest, merge
from catalog.publishing.publish_multilang_catalog import build
from catalog.validation.youtube_sources import suspicious_id, validate_discovery

ROOT = Path(__file__).resolve().parents[1]


def read(name):
    return json.loads((ROOT / name).read_text(encoding='utf-8'))


class MarathiExpansionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.songs = read('data/catalogs/marathi/songs.json')
        cls.discovery = read('data/catalogs/marathi/discovery.json')
        cls.evidence = read('data/catalogs/marathi/watch_evidence.json')
        cls.report = read('data/catalogs/marathi/removal_report.json')
        cls.catalog = read('web/public/catalogue.json')
        cls.stations = read('data/stations/marathi_stations.json')

    def test_placeholder_and_malformed_ids(self):
        for value in ['', None, 'bad', 'a1B2c3D4eF5', 'b2C3d4E5fG6', 'd4E5f6G7hI8', 'h4I5j6K7lL8', 'abcdefghijk']:
            self.assertIsNotNone(suspicious_id(value), value)
        self.assertIsNone(suspicious_id('Ift2EvKopvc'))

    def test_every_playable_has_watch_evidence(self):
        playable = [s for s in self.songs if (s.get('source') or {}).get('verified')]
        validate_discovery(playable, self.evidence)
        for song in self.songs:
            video = (song.get('source') or {}).get('id')
            if video:
                self.assertIsNone(suspicious_id(video))

    def test_search_match_alone_cannot_verify(self):
        video = self.discovery[0]['source']['id']
        for field, value in [('status', 'LOGIN_REQUIRED'), ('playableInEmbed', False), ('returnedVideoId', 'unrelated'), ('channelId', 'unrelated')]:
            evidence = copy.deepcopy(self.evidence)
            evidence[video][field] = value
            with self.assertRaises(ValueError):
                validate_discovery(self.discovery, evidence)

    def test_compilation_and_duplicate_recording_rejected(self):
        evidence = copy.deepcopy(self.evidence)
        evidence[self.discovery[0]['source']['id']]['title'] = 'Marathi Jukebox'
        with self.assertRaises(ValueError):
            validate_discovery(self.discovery, evidence)
        duplicate = copy.deepcopy(self.discovery[0])
        duplicate.update(id='mar-duplicate', title='Different song')
        with self.assertRaises(ValueError):
            validate_discovery(self.discovery + [duplicate], self.evidence)

    def test_at_least_100_new_songs_not_repaired_seed_rows(self):
        baseline = set(self.report['baselineIds'])
        new = [s for s in self.discovery if s['id'] not in baseline]
        self.assertGreaterEqual(len(new), 100)
        self.assertEqual(len(self.songs), self.report['baselineCount'] - len(self.report['removals']) + len(new))

    def test_hindi_rows_facets_and_station_metadata_unchanged(self):
        hindi = [s for s in self.catalog['songs'] if s.get('lang', 'hindi') == 'hindi']
        self.assertEqual(digest(hindi), self.report['hindiSha256'])
        for facet, values in self.report['existingFacets'].items():
            self.assertEqual(self.catalog['facets'][facet][:len(values)], values)
        self.assertEqual(digest(self.catalog.get('stationMeta', {})), self.report['stationMetaSha256'])

    def test_import_and_publication_are_idempotent(self):
        self.assertEqual(merge(self.songs, self.discovery, self.report), self.songs)
        self.assertEqual(build(self.catalog, self.songs, self.stations), self.catalog)

    def test_removals_have_original_metadata_and_exclude_uncertain_checks(self):
        active = {s['id'] for s in self.songs}
        for entry in self.report['removals']:
            self.assertNotIn(entry['id'], active)
            self.assertEqual(entry['originalRecord']['source']['id'], entry['youtubeId'])
            self.assertIn(entry['reason'], {'sequential_placeholder_id', 'placeholder_id', 'empty_or_malformed_id', 'watch_page_video_unavailable'})
        for entry in self.report['retainedUnresolved']:
            self.assertIn(entry['id'], active)

    def test_publication_and_all_marathi_collections(self):
        rows = {s['id']: s for s in self.catalog['songs']}
        station_names = self.catalog['facets']['stations']
        for song in self.discovery:
            published = rows[song['id']]
            self.assertEqual(published['v'], song['source']['id'])
            self.assertTrue(published['source_verified'])
        for song in self.songs:
            if song['status'] != 'playable':
                self.assertEqual(rows[song['id']]['v'], '')
        for station in self.stations:
            index = station_names.index(station['name'])
            self.assertTrue(any(index in s['s'] and s.get('v') for s in rows.values()), station['name'])


if __name__ == '__main__':
    unittest.main()

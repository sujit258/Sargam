"""Repeatable Marathi publication with append-only facets and untouched Hindi rows."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from catalog.validation.youtube_sources import validate_discovery


def build(catalog, songs, stations):
    result = json.loads(json.dumps(catalog))
    facets = result['facets']

    def index(facet, value):
        values = facets.setdefault(facet, [])
        if value not in values:
            values.append(value)
        return values.index(value)

    for language in ('hindi', 'marathi'):
        index('languages', language)
    for station in stations:
        index('stations', station['name'])
        result.setdefault('stationMeta', {}).setdefault(station['name'], {'kind': 'genre', 'person': None})

    preserved = [s for s in catalog['songs'] if s.get('lang') != 'marathi' and not str(s['id']).startswith('mar-')]
    result['songs'] = list(preserved)
    for song in songs:
        source = song.get('source') or {}
        verified = bool(source.get('verified') and source.get('id'))
        film = (song.get('film') or {}).get('name')
        cats = song.get('categories', [])
        result['songs'].append({
            'id': song['id'], 't': song['title'], 'f': index('films', film) if film else None,
            'v': source['id'] if verified else '', 'c': 1.0 if verified else 0.0,
            'a': [index('artists', a) for a in song.get('artists', [])],
            's': [index('stations', st['name']) for st in stations if set(cats).intersection(st['filters']['categories'])],
            'm': [index('moods', m.title()) for m in song.get('moods', [])],
            'cr': [index('composer', c) for c in song.get('composers', [])],
            'lt': [index('lyricist', l) for l in song.get('lyricists', [])],
            'ar': [], 'sr': [], 'dr': [], 'lang': 'marathi',
            'cat': [index('categories', c) for c in cats], 'themes': song.get('themes', []),
            'source_verified': verified,
        })
    result['catalogVersion'] = '1.3.0'
    assert result['songs'][:len(preserved)] == preserved
    for name, values in catalog['facets'].items():
        assert facets[name][:len(values)] == values
    return result


def publish():
    path = ROOT / 'web/public/catalogue.json'
    catalog = json.loads(path.read_text(encoding='utf-8'))
    songs = json.loads((ROOT / 'data/catalogs/marathi/songs.json').read_text(encoding='utf-8'))
    evidence = json.loads((ROOT / 'data/catalogs/marathi/watch_evidence.json').read_text(encoding='utf-8'))
    validate_discovery([s for s in songs if (s.get('source') or {}).get('verified')], evidence)
    stations = json.loads((ROOT / 'data/stations/marathi_stations.json').read_text(encoding='utf-8'))
    result = build(catalog, songs, stations)
    path.write_text(json.dumps(result, ensure_ascii=False), encoding='utf-8')
    index_dir = ROOT / 'data/indexes'
    languages_path = index_dir / 'languages.json'
    languages = json.loads(languages_path.read_text(encoding='utf-8'))
    languages['marathi'] = {'count': len(songs), 'stationCount': len(stations)}
    languages_path.write_text(json.dumps(languages, indent=2) + '\n', encoding='utf-8')
    counts = {cat: sum(cat in s['categories'] for s in songs) for cat in result['facets']['categories']}
    (index_dir / 'categories.json').write_text(json.dumps(counts, indent=2) + '\n', encoding='utf-8')
    print(f'Published {len(songs)} Marathi songs; preserved other rows and existing facet indices.')


if __name__ == '__main__':
    publish()

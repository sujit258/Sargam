"""Audit, validate and import reviewed Marathi discoveries.

Run --audit first to persist the removal report BEFORE --apply changes songs.
Reimports are idempotent; only explicitly reviewed identities are updated.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from catalog.validation.youtube_sources import suspicious_id, title_key, validate_discovery
from catalog.publishing.publish_multilang_catalog import publish

DIR = ROOT / 'data/catalogs/marathi'


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()


def audit():
    report_path = DIR / 'removal_report.json'
    if report_path.exists():
        raise ValueError('Removal report already exists; preserve the original audit trail.')
    songs, discovery, evidence = read(DIR / 'songs.json'), read(DIR / 'discovery.json'), read(DIR / 'watch_evidence.json')
    validate_discovery(discovery, evidence)
    replacements = {s['id'] for s in discovery}
    removals = []
    unresolved = []
    for song in songs:
        video = (song.get('source') or {}).get('id')
        if not video or song['id'] in replacements:
            continue
        proof = evidence.get(video, {})
        reason = suspicious_id(video)
        if not reason and proof.get('status') == 'ERROR' and proof.get('reason') == 'This video is unavailable':
            reason = 'watch_page_video_unavailable'
        if reason:
            removals.append({'id': song['id'], 'youtubeId': video, 'reason': reason, 'originalRecord': song})
        else:
            unresolved.append({'id': song['id'], 'youtubeId': video, 'status': proof.get('status', 'NOT_CHECKED'), 'action': 'retain_metadata_and_candidate_source_without_playable_claim'})
    catalog = read(ROOT / 'web/public/catalogue.json')
    hindi = [s for s in catalog['songs'] if s.get('lang', 'hindi') == 'hindi']
    write(report_path, {'baselineCount': len(songs), 'baselineSha256': digest(songs),
                       'baselineIds': [s['id'] for s in songs], 'hindiCount': len(hindi), 'hindiSha256': digest(hindi),
                       'existingFacets': catalog['facets'], 'stationMetaSha256': digest(catalog.get('stationMeta', {})),
                       'removals': removals, 'retainedUnresolved': unresolved,
                       'policy': 'Remove only proven unavailable or structurally invalid/placeholder sources; archive full original records. Keep metadata-only records and spelling variants. Repair reviewed existing IDs before considering removal.'})
    print(f'Audit saved before deletion: baseline={len(songs)}, confirmed removals={len(removals)}')


def merge(songs, discovery, report):
    removals = {s['id']: s for s in report['removals']}
    incoming = {s['id']: s for s in discovery}
    result = []
    for original in songs:
        sid = original['id']
        if sid in removals and sid not in incoming:
            if (original.get('source') or {}).get('id') != removals[sid]['youtubeId']:
                raise ValueError(f'Removal source changed since audit: {sid}')
            continue
        song = dict(original)
        if sid in incoming:
            update = incoming.pop(sid)
            # Preserve known legacy metadata when discovery leaves it unknown.
            song.update({key: value for key, value in update.items() if value is not None and value != []})
            song.pop('replacesExistingId', None)
        else:
            source = dict(song.get('source') or {})
            # Preserve previously reviewed imports even when a later batch is
            # supplied as a subset. The publisher revalidates saved evidence.
            source['verified'] = bool(source.get('verified') and song.get('review') and source.get('checkedAt'))
            song['source'] = source if source.get('id') else None
            song['status'] = 'playable' if source['verified'] else 'metadata-only'
        result.append(song)
    for song in incoming.values():
        if song.get('replacesExistingId'):
            raise ValueError(f'Reviewed existing identity missing: {song["id"]}')
        result.append({key: value for key, value in song.items() if key != 'replacesExistingId'})
    ids = [s['id'] for s in result]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate catalogue identity')
    titles = [title_key(s['title']) for s in result]
    if len(titles) != len(set(titles)):
        raise ValueError('Duplicate normalized catalogue title')
    return result


def apply():
    report = read(DIR / 'removal_report.json')
    songs, discovery, evidence = read(DIR / 'songs.json'), read(DIR / 'discovery.json'), read(DIR / 'watch_evidence.json')
    validate_discovery(discovery, evidence)
    baseline_ids = set(report['baselineIds'])
    for song in discovery:
        if song.get('replacesExistingId') and song['id'] not in baseline_ids:
            raise ValueError('Replacement not in audited baseline')
    catalog = read(ROOT / 'web/public/catalogue.json')
    hindi = [s for s in catalog['songs'] if s.get('lang', 'hindi') == 'hindi']
    if digest(hindi) != report['hindiSha256']:
        raise ValueError('Hindi baseline changed since audit; refusing to publish')
    hindi_videos = {s['v'] for s in hindi if s.get('v')}
    if any(s['source']['id'] in hindi_videos for s in discovery):
        raise ValueError('Marathi source duplicates a Hindi recording')
    merged = merge(songs, discovery, report)
    write(DIR / 'songs.json', merged)
    verified = [s for s in merged if (s.get('source') or {}).get('verified')]
    ledger = {'catalogVersion': '1.3.0', 'totalEntries': len(merged), 'verifiedPlayableCount': len(verified),
              'unresolvedCount': len(merged)-len(verified), 'sources': {s['id']: {'title': s['title'], 'status': s['status'],
              'id': (s.get('source') or {}).get('id'), 'checkedAt': (s.get('source') or {}).get('checkedAt')} for s in merged}}
    write(ROOT / 'data/marathi/source-verification.json', ledger)
    id_path = ROOT / 'data/marathi/id-map.json'
    id_map = read(id_path)
    id_map.update({s['title']: s['id'] for s in merged})
    write(id_path, id_map)
    publish()
    stations = read(ROOT / 'data/stations/marathi_stations.json')
    write(DIR / 'collections.json', [dict(station, songIds=[s['id'] for s in verified
          if set(s['categories']).intersection(station['filters']['categories'])]) for station in stations])
    with (DIR / 'discovery_report.csv').open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=['id','title','artist','category','year','youtube_id','channel','verification_status','notes'])
        writer.writeheader()
        for s in discovery:
            writer.writerow({'id': s['id'], 'title': s['title'], 'artist': '; '.join(s['artists']), 'category': '; '.join(s['categories']),
                             'year': s.get('year'), 'youtube_id': s['source']['id'], 'channel': s['source']['channel'],
                             'verification_status': 'WATCH_OK_EMBED_ALLOWED', 'notes': ('Existing identity repaired. ' if s['id'] in baseline_ids else 'New song. ') + s['review']['notes']})
    new_count = sum(s['id'] not in baseline_ids for s in merged)
    summary = {'before': report['baselineCount'], 'removed': len(report['removals']), 'added': new_count,
               'repaired': sum(s['id'] in baseline_ids for s in discovery), 'final': len(merged), 'playable': len(verified),
               'metadataOnly': len(merged)-len(verified), 'categories': {c: sum(c in s['categories'] for s in merged) for c in sorted({c for s in merged for c in s['categories']})}}
    write(DIR / 'expansion_summary.json', summary)
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--audit', action='store_true')
    group.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    audit() if args.audit else apply()

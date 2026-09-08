"""Read-only YouTube discovery and watch-page checks; never downloads media.

Stores resumable evidence separately from the catalogue. Search results are
candidates only: publication requires a reviewed single-song identity and an
OK, embeddable response from the actual watch page.
"""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sqlite3
import time
import urllib.request
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / 'data/catalogs/marathi/watch_evidence.json'
REJECT = re.compile(r'jukebox|juke box|full album|compilation|mashup|making of|teaser|trailer|non.?stop|dj mix|lofi|medley', re.I)


def request(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9'})
    return urllib.request.urlopen(req, timeout=30).read().decode('utf-8')


def extract(page, variable):
    match = re.search(r'(?:var\s+)?' + variable + r'\s*=\s*', page)
    if not match:
        raise ValueError('Missing ' + variable)
    return json.JSONDecoder().raw_decode(page[match.end():])[0]


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def search(query):
    page = request('https://www.youtube.com/results?search_query=' + quote(query))
    data = extract(page, 'ytInitialData')
    return list(dict.fromkeys(v['videoRenderer']['videoId'] for v in walk(data) if 'videoRenderer' in v))[:15]


def check(video_id):
    result = {'videoId': video_id, 'url': 'https://www.youtube.com/watch?v=' + video_id,
              'checkedAt': datetime.now(timezone.utc).isoformat()}
    try:
        player = extract(request(result['url']), 'ytInitialPlayerResponse')
        details = player.get('videoDetails', {})
        status = player.get('playabilityStatus', {})
        result.update(status=status.get('status'), reason=status.get('reason'),
                      playableInEmbed=status.get('playableInEmbed', False),
                      returnedVideoId=details.get('videoId'), title=details.get('title'),
                      channel=details.get('author'), channelId=details.get('channelId'),
                      duration=int(details.get('lengthSeconds') or 0),
                      description=details.get('shortDescription', ''),
                      isLive=details.get('isLiveContent', False))
    except Exception as exc:
        result.update(status='INCONCLUSIVE', reason=str(exc))
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--baseline', action='store_true')
    parser.add_argument('--harvest', action='store_true')
    parser.add_argument('--query', action='append', default=[])
    parser.add_argument('--limit', type=int, default=40)
    parser.add_argument('--retry-inconclusive', action='store_true')
    args = parser.parse_args()
    ids = []
    if args.baseline:
        ids += [s['source']['id'] for s in json.loads((ROOT / 'data/catalogs/marathi/songs.json').read_text(encoding='utf-8')) if (s.get('source') or {}).get('id')]
    if args.harvest:
        conn = sqlite3.connect('file:' + (ROOT / 'data/carvaan.db').as_posix() + '?mode=ro', uri=True)
        ids += [v for v, t in conn.execute("SELECT video_id,title FROM videos WHERE channel_id='saregama_marathi' AND duration BETWEEN 120 AND 650") if not REJECT.search(t)]
        conn.close()
    for query in args.query:
        found = search(query)
        print(query, len(found), flush=True)
        ids += found
        time.sleep(2)
    evidence = json.loads(EVIDENCE.read_text(encoding='utf-8')) if EVIDENCE.exists() else {}
    pending = sorted(v for v in set(ids) if v not in evidence or
                     (args.retry_inconclusive and evidence[v].get('status') == 'INCONCLUSIVE'))[:args.limit]
    print('Watch pages to check:', len(pending), flush=True)
    for i, video in enumerate(pending, 1):
        value = check(video)
        evidence[video] = value
        temporary = EVIDENCE.with_suffix('.tmp')
        temporary.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        temporary.replace(EVIDENCE)
        print('Checked', i, '/', len(pending), flush=True)
        if '429' in str(value.get('reason')):
            print('Rate limited; stopped. Retry later, never classify throttling as an unavailable video.')
            break
        time.sleep(2)


if __name__ == '__main__':
    main()

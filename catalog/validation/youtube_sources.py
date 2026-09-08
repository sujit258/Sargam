"""Conservative validation for Marathi playback sources and saved evidence."""
import re
import unicodedata

VIDEO_ID = re.compile(r'^[A-Za-z0-9_-]{11}$')
COMPILATION = re.compile(r'jukebox|juke box|compilation|full album|mashup|medley|non.?stop|making of|teaser|trailer', re.I)


def title_key(title):
    text = unicodedata.normalize('NFKC', title).casefold()
    return ''.join(c for c in text if c.isalnum())


def suspicious_id(value):
    if not isinstance(value, str) or not VIDEO_ID.fullmatch(value):
        return 'empty_or_malformed_id'
    if len(set(value.casefold())) < 4 or value.casefold() in {'abcdefghijk', '12345678901', 'placeholder'}:
        return 'placeholder_id'
    # Seed placeholders alternate incrementing letters and digits, with a few
    # transcription errors. Real IDs do not follow both sequences together.
    if sum(c.isalpha() for c in value) == 6 and sum(c.isdigit() for c in value) == 5:
        letters = [ord(c.lower()) - 97 for c in value if c.isalpha()]
        digits = [int(c) for c in value if c.isdigit()]
        letter_steps = sum((b-a) % 26 == 1 for a,b in zip(letters, letters[1:]))
        digit_steps = sum((b-a) % 10 == 1 for a,b in zip(digits, digits[1:]))
        if letter_steps >= 4 and digit_steps >= 3:
            return 'sequential_placeholder_id'
    return None


def validate_discovery(records, evidence):
    seen_ids, seen_titles, seen_videos = set(), set(), set()
    for song in records:
        sid = song['id']
        source = song['source']
        video = source['id']
        key = title_key(song['title'])
        if not sid.startswith('mar-') or sid in seen_ids or key in seen_titles or video in seen_videos:
            raise ValueError(f'Duplicate or invalid song identity: {sid}')
        if song.get('language') != 'marathi' or not song.get('artists') or not song.get('categories'):
            raise ValueError(f'Missing Marathi metadata: {sid}')
        if suspicious_id(video):
            raise ValueError(f'Invalid video for {sid}: {video}')
        proof = evidence.get(video, {})
        if not (proof.get('status') == 'OK' and proof.get('playableInEmbed') is True
                and proof.get('returnedVideoId') == video and proof.get('checkedAt')
                and proof.get('channelId') == source.get('channelId')
                and proof.get('channel') == source.get('channel')
                and 90 <= proof.get('duration', 0) <= 900 and not proof.get('isLive')):
            raise ValueError(f'Missing successful watch-page evidence: {sid}')
        if COMPILATION.search(proof.get('title', '')):
            raise ValueError(f'Non-individual video: {sid}')
        review = song.get('review', {})
        if not review.get('individualSong') or not review.get('creditsChecked') or review.get('videoTitle') != proof.get('title'):
            raise ValueError(f'Missing individual song/credit review: {sid}')
        seen_ids.add(sid); seen_titles.add(key); seen_videos.add(video)

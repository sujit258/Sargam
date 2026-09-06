"""Sargam Catalog Engine: Metadata Normalization Module

Cleans titles, films, and artist credits into canonical, searchable strings.
"""

import re
import unicodedata
from typing import Dict, Any


def strip_accents(text: str) -> str:
    """Strip combining diacritics while preserving standard latin characters."""
    if not text:
        return ""
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def clean_title(title: str) -> str:
    """Normalize song title by stripping extraneous subtitles and noisy tokens."""
    if not title:
        return ""
    cleaned = strip_accents(title).strip()
    # Remove trailing track numbers or parenthesis with extra data like '(Happy)' or '(Sad)'
    cleaned = re.sub(r"\s+", " ", cleaned)
    # Remove common audio rip indicators
    cleaned = re.sub(r"(?i)\b(hq|hd|remastered|original soundtrack|ost)\b", "", cleaned)
    cleaned = re.sub(r"[\(\[\{].*?[\)\]\}]", "", cleaned).strip()
    return cleaned.title()


def clean_film(film: str) -> str:
    """Normalize film name."""
    if not film:
        return ""
    cleaned = strip_accents(film).strip()
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.title()


def normalize_song_record(raw: Dict[str, Any], language: str = "hindi") -> Dict[str, Any]:
    """Return a normalized song record adhering to Sargam catalog conventions."""
    return {
        "id": raw.get("id"),
        "title": clean_title(raw.get("title") or raw.get("t") or ""),
        "film": clean_film(raw.get("film") or ""),
        "language": language,
        "artists": [strip_accents(a).strip().title() for a in raw.get("artists", []) if a],
        "video": raw.get("video") or raw.get("v") or "",
        "confidence": float(raw.get("confidence") or raw.get("c") or 0.9),
    }

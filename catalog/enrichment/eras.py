"""Sargam Catalog Engine: Era Classification Module

Categorizes songs into defined Golden Era periods.
"""

from typing import Optional, List

ERAS = {
    "1950s": {"name": "Black & White Melody", "start": 1950, "end": 1959},
    "1960s": {"name": "Golden Dawn", "start": 1960, "end": 1969},
    "1970s": {"name": "Technicolor Harmony", "start": 1970, "end": 1979},
    "1980s": {"name": "Retro Melancholy & Rhythm", "start": 1980, "end": 1989},
}


def classify_era(year: Optional[int]) -> List[str]:
    """Return matching era keys for a given release year."""
    if not year:
        return []
    matched = []
    for era_key, meta in ERAS.items():
        if meta["start"] <= year <= meta["end"]:
            matched.append(era_key)
    return matched

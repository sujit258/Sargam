# Sargam Catalog Engine

The **Sargam Catalog Engine** is the offline Python data-pipeline that normalizes, enriches, validates, and publishes versioned music metadata for the Sargam Progressive Web Application.

---

## 1. Pipeline Architecture

```
[Raw Sources] (Hindi / Marathi / Regional)
     ↓
[Ingestion] (import_catalog.py → normalize_metadata.py → deduplicate.py)
     ↓
[Enrichment] (artists.py, films.py, genres.py, eras.py, moods.py)
     ↓
[Validation] (validate_schema.py, validate_catalog.py, validate_duplicates.py)
     ↓
[Matching] (video_sources.py — YouTube verification & embeddability testing)
     ↓
[Publishing] (build_catalog.py → generate_indexes.py → versioned JSON export)
```

---

## 2. Directory Layout

- **`sources/`**: Input raw records partitioned by musical language (`hindi/`, `marathi/`, `regional/`).
- **`ingestion/`**: Parses raw songlists, strips artifacts, normalizes diacritics, and deduplicates identical records.
- **`enrichment/`**: Maps artist entities, film release dates, era classifications (1950s–1980s), and mood taxonomies.
- **`matching/`**: Resolves embeddable YouTube video streams with strict confidence scoring.
- **`validation/`**: Enforces schema contracts, prevents ID drift against append-only ledgers, and checks for duplicates.
- **`publishing/`**: Bundles compact index-based JSON for the client web app (`catalogue.json`).

---

## 3. Catalog Versioning Strategy

- **`v1.0.0`**: Golden Era Hindi Foundation (3,916 verified songs, 66 stations).
- **`v1.1.0`**: Regional Marathi Expansion (Bhavgeet, Natya Sangeet, and Marathi cinema classics).
- **`v1.2.0`**: Extended metadata attributes (film release years, ragas, lyrical themes).
- **`v2.0.0`**: Pan-Indian regional collections (Bengali, Punjabi, Tamil, Telugu).

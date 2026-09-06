# SARGAM Python Catalog Pipeline Reference

Detailed guide for running and extending the Python catalog processing engine in `catalog/`.

---

## 1. Pipeline Commands

### Ingestion & Normalization
```bash
python catalog/ingestion/normalize_metadata.py
```

### Validation & Duplicate Checks
```bash
python catalog/validation/validate_catalog.py web/public/catalogue.json
python catalog/validation/validate_duplicates.py
```

### Search Index Pre-Generation
```bash
python catalog/publishing/generate_indexes.py
```

---

## 2. Integrity Safeguards
- **Ledger Invariance:** Any new song must be appended to `data/song_ids.json`. Existing IDs must never be rewritten.
- **YouTube Validation:** Unembeddable videos are demoted rather than published, ensuring listeners never encounter broken black screens.

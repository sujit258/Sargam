# Sargam Catalog Ingestion Pipeline

The Sargam Catalog Engine pipeline automates the transformation of raw discographies into verifiable, embeddable, and compact production datasets.

---

## Pipeline Execution Stages

```
Stage 1: Ingestion
  ├── Parse raw text, PDF, and database sources
  ├── Clean track noise, subtitles, and formatting artifacts
  └── Deduplicate identical tracks

Stage 2: Entity Enrichment
  ├── Normalize artist identities
  ├── Categorize release eras (1950s, 1960s, 1970s, 1980s)
  └── Map station associations

Stage 3: Verification & Embeddability Matching
  ├── Query YouTube Data & oEmbed APIs
  ├── Reject unofficial bootlegs and low-fidelity rips
  └── Verify that embed permissions allow web iframe playback

Stage 4: Validation & Ledger Locking
  ├── Check against append-only song ID ledger
  └── Enforce zero duplicate IDs

Stage 5: Publishing
  └── Export indexed, compressed JSON to `web/public/catalogue.json`
```

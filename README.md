# SARGAM — Retro Bollywood Melodies

*Golden Era Hindi Classics & Regional Masterpieces*

**Production:** [https://sargam.suvidhatools.in](https://sargam.suvidhatools.in)  
**Repository:** [https://github.com/sujit258/Sargam](https://github.com/sujit258/Sargam)  

Sargam is an independent, production-grade Progressive Web Application (PWA) dedicated to the preservation, discovery, and continuous playback of golden-era Indian film music (1950s–1980s) and regional masterworks (starting with Marathi).

---

## Key Highlights

- **3,916 Verified Recordings:** 100% embed-verified golden-era tracks mapped across 66 stations.
- **Deep Obsidian Velvet & Radiant Amber:** A bespoke design system built in perceptual OKLCH color space for visual warmth and contrast (>16:1 text contrast ratio).
- **Aajcha Sargam (आजचा सरगम):** Deterministic daily classic recommendation synchronized identically across all listeners worldwide without server tracking.
- **Multi-Language Architecture:** First-class regional support for Marathi (Bhavgeet, Natya Sangeet, Golden Marathi Cinema, and Bhakti), with roadmaps for Bengali, Punjabi, Tamil, and Telugu.
- **Sargam Catalog Engine:** Modular Python data pipeline in `catalog/` for ingestion, normalization, entity enrichment, YouTube verification, and versioned JSON publishing.
- **Full PWA Capabilities:** Offline-capable caching, installable on Android, iOS Safari, and Desktop Chromium.
- **Privacy by Default:** Zero tracking cookies, zero accounts, and on-device `localStorage` for favorites and playback history.

---

## Documentation Index

- [Product Specification (`docs/SARGAM_PRODUCT.md`)](file:///f:/Mahfil/docs/SARGAM_PRODUCT.md)
- [System Architecture (`docs/SARGAM_ARCHITECTURE.md`)](file:///f:/Mahfil/docs/SARGAM_ARCHITECTURE.md)
- [Design System & Palette (`docs/SARGAM_DESIGN_SYSTEM.md`)](file:///f:/Mahfil/docs/SARGAM_DESIGN_SYSTEM.md)
- [Catalogue & Taxonomy Guide (`docs/SARGAM_CATALOG.md`)](file:///f:/Mahfil/docs/SARGAM_CATALOG.md)
- [Sargam Python Catalog Pipeline (`docs/SARGAM_CATALOG_PIPELINE.md`)](file:///f:/Mahfil/docs/SARGAM_CATALOG_PIPELINE.md)
- [Marathi Regional Music Architecture (`docs/SARGAM_MARATHI.md`)](file:///f:/Mahfil/docs/SARGAM_MARATHI.md)
- [Progressive Web App Guide (`docs/SARGAM_PWA.md`)](file:///f:/Mahfil/docs/SARGAM_PWA.md)
- [Catalog Baseline Integrity Report (`docs/catalog/SARGAM_CATALOG_BASELINE.md`)](file:///f:/Mahfil/docs/catalog/SARGAM_CATALOG_BASELINE.md)
- [Open Source Attribution & Legal Disclaimer (`docs/ATTRIBUTION.md`)](file:///f:/Mahfil/docs/ATTRIBUTION.md)

---

## Development & Local Execution

### Web Application
```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:3000` to launch the application.

### Catalog Engine
```bash
# Validate catalog integrity
python catalog/validation/validate_catalog.py web/public/catalogue.json

# Precompute search indices
python catalog/publishing/generate_indexes.py
```

---

## Legal & Audio Disclaimer

No audio files are stored, uploaded, or redistributed by Sargam. Playback streams exclusively through YouTube's official embedded player (`www.youtube-nocookie.com`). Song titles, film names, and performer credits are factual historical metadata. Recordings, compositions, and lyrics remain the property of their respective copyright owners.

# Sargam Marathi Music Catalogue (v1.1.0)

> "Sargam's first regional music catalogue."

This document defines the architecture, taxonomy, source verification standards, and operational workflows for the Marathi music catalogue in **SARGAM — Retro Bollywood & Regional Melodies**.

---

## 1. Why Marathi?

Marathi music possesses one of India's richest literary and melodic traditions. Spanning dramatic stage semi-classical works (*Natya Sangeet*), delicate personal poetry set to classical ragas (*Bhavageet*), high-energy traditional dance rhythms (*Lavani*), and centuries of devotional saint poetry (*Vitthal Bhakti*, *Abhang*, and *Gavlani*), Marathi music is the natural first regional expansion for Sargam.

Unlike mere regional playlists or shallow language filters, Marathi in Sargam is engineered as a **first-class catalogue** with dedicated taxonomies, deterministic IDs, verified provenance, and specialized discovery stations.

---

## 2. Taxonomy & Controlled Categories

The Marathi catalogue uses a controlled taxonomy where songs are tagged rather than duplicated across categories.

### Primary Categories
| Category ID | Name | Description |
| :--- | :--- | :--- |
| `marathi-classics` | Marathi Classics | Hallmark master recordings defining Maharashtra's golden musical era. |
| `marathi-film` | Marathi Film Classics | Timeless cinematic songs from Prabhat films to golden-era cinema. |
| `bhavageet` | Bhavageet | Intimate lyrical poetry of nature, longing, rain, and romance. |
| `natya-sangeet` | Natya Sangeet | Dramatic semi-classical compositions from Marathi musical theatre (*Sangeet Natak*). |
| `lavani` | Lavani | Vibrant folk and theatrical dance music driven by traditional dholki rhythms. |
| `marathi-bhakti` | Marathi Bhakti | Divine Abhangs, saint poetry, and Aarti compositions. |
| `gavlani` | Gavlani | Folk and devotional narratives of Radha, Krishna, gopis, and the flute in Gokul. |
| `folk` | Marathi Folk | Rustic indigenous musical forms of Maharashtra. |
| `romantic` | Marathi Romance | Tender duets and expressions of love and companionship. |
| `devotional` | Devotional | Spiritual invocations across deities and saint traditions. |

### Folk Subcategories (Tags)
- `powada`: Heroic historical ballads celebrating Maratha history.
- `gondhal`: Ritualistic dramatic performance invocations.
- `bharud`: Allegorical folk theatre and social awakening hymns.
- `koli-geet`: Coastal fisherfolk anthems with driving oceanic meters.
- `dhangari`: Pastoral shepherds' devotional songs honoring Khandoba and Biroba.
- `traditional`: Age-old rural melodies passed through oral traditions.

### Devotional Themes
`vitthal` · `krishna` · `ganesh` · `shiva` · `devi` · `datta` · `ram` · `saints`

### Controlled Moods
`romantic` · `peaceful` · `nostalgic` · `devotional` · `festive` · `energetic` · `melancholic` · `spiritual` · `joyful` · `playful` · `poetic`

---

## 3. Sargam ID Convention

Sargam assigns permanent, deterministic catalogue IDs to Marathi songs:

$$\text{Format: } \texttt{mar-\{category\}-\{number\}}$$

### Canonical ID Examples
- `mar-cls-001`: *Shukratara Mand Vara* (Arun Date, Sudha Malhotra)
- `mar-bhav-001`: *Bhatukalichya Khelamadhali* (Arun Date)
- `mar-natya-001`: *De Hata Sharanagata* (Balgandharva)
- `mar-lav-001`: *Sundara Manamadhye Bharli* (Sulochana Chavhan)
- `mar-bhakti-001`: *Tuj Magato Mi Aata* (Lata Mangeshkar)
- `mar-gav-001`: *Dharila Pandharicha Chor* (Pt. Bhimsen Joshi)
- `mar-folk-001`: *Ye Go Ye Ye Maina* (Vitthal Umap)
- `mar-rom-001`: *Mala Ved Lagale Premache* (Swapnil Bandodkar, Ketaki Mategaonkar)

### Overlap Handling & Canonical ID Map
Songs frequently span multiple genres. For instance, *Shukratara Mand Vara* is simultaneously a **Classic**, a **Bhavageet**, and a **Romantic** ballad.

To prevent fragmentation:
1. Every song is assigned **ONE permanent canonical ID**.
2. Additional categories and moods are added as array elements in `categories` and `moods`.
3. The mapping is persisted in [`data/marathi/id-map.json`](file:///f:/Mahfil/data/marathi/id-map.json) so future imports never generate duplicate records.

---

## 4. Metadata Schema & Provenance

```typescript
interface MarathiSong {
  id: string;                         // e.g. "mar-cls-001"
  title: string;                      // Canonical English transliteration
  language: "marathi";                // First-class language identifier
  year?: number;                      // Recording or release year
  film?: {
    name: string;
    year?: number;
  };
  artists: string[];                  // Vocalists / performers
  composers?: string[];               // Music directors / composers
  lyricists?: string[];               // Poets / lyricists
  categories: string[];               // From controlled category taxonomy
  moods?: string[];                   // From controlled mood taxonomy
  themes?: string[];                  // e.g. ["krishna", "vitthal"]
  source: {
    type: "youtube";
    id: string | null;                // YouTube video ID or null if unverified
    verified: boolean;                // Strict verification flag
  };
  provenance: {
    catalogVersion: "1.1.0";
    source: "sargam-marathi-archives";
  };
}
```

---

## 5. Playback Sources & Zero-Fabrication Guarantee

Sargam strictly adheres to ethical catalogue curation:
1. **Never fabricate YouTube IDs:** If an official or embeddable source cannot be verified, `source.id` remains `null` and `source.verified` is `false`.
2. **Never host copyrighted audio:** All streaming occurs client-side via authorized YouTube IFrame player embeds.
3. **Verification Ledger:** [`data/marathi/source-verification.json`](file:///f:/Mahfil/data/marathi/source-verification.json) tracks verification status:
   - Total Entries: 100
   - Verified Playable: 37
   - Unresolved / Metadata-only: 63
4. **Graceful UI Handling:** The player and track rows clearly distinguish verified playable tracks from metadata-only entries with appropriate badges and non-blocking notices.

---

## 6. Curated Marathi Stations

Eight specialized Marathi stations are integrated into Sargam's dynamic collection router:

1. **`station-marathi-classics`** (*Marathi Classics*): Hallmark master recordings.
2. **`station-marathi-bhavg`** (*Marathi Bhavageet*): Intimate poetic expressions.
3. **`station-marathi-natya`** (*Natya Sangeet*): Stage theatre semi-classical classics.
4. **`station-marathi-lavani`** (*Lavani*): High-energy dholki dance rhythms.
5. **`station-marathi-bhakti`** (*Marathi Bhakti*): Devotional Abhangs and hymns.
6. **`station-marathi-gavlani`** (*Gavlani*): Krishna and Gopi folklore melodies.
7. **`station-marathi-folk`** (*Marathi Folk*): Rustic regional traditions.
8. **`station-marathi-romantic`** (*Marathi Romance*): Timeless romance and duets.

Stations are defined in [`data/stations/marathi_stations.json`](file:///f:/Mahfil/data/stations/marathi_stations.json) and query catalogue records dynamically via category rules rather than duplicating song entries.

---

## 7. How to Add a New Marathi Song

1. Open [`data/catalogs/marathi/songs.json`](file:///f:/Mahfil/data/catalogs/marathi/songs.json).
2. Check [`data/marathi/id-map.json`](file:///f:/Mahfil/data/marathi/id-map.json) to verify the song does not already exist under another category.
3. Determine the canonical category prefix (e.g. `mar-bhav-` for Bhavageet).
4. Assign the next sequential ID.
5. Populate verified metadata:
   - `artists`, `composers`, `lyricists`
   - `categories` (from controlled taxonomy)
   - `moods` (from controlled taxonomy)
   - `year`, `film` (if applicable)
6. If an embeddable YouTube source is verified, set:
   ```json
   "source": { "type": "youtube", "id": "<verified-video-id>", "verified": true }
   ```
   Otherwise:
   ```json
   "source": { "type": "youtube", "id": null, "verified": false }
   ```
7. Run the publisher:
   ```bash
   python catalog/publishing/publish_multilang_catalog.py
   ```
8. Run validation:
   ```bash
   python catalog/validation/validate_marathi_catalog.py
   ```

---

## 8. How to Validate the Catalogue

Run the complete validation and test suite:

```bash
# 1. Marathi catalogue integrity check
python catalog/validation/validate_marathi_catalog.py

# 2. Complete catalogue schema check
python catalog/validation/validate_catalog.py web/public/catalogue.json

# 3. Automated unit tests
npm test
```

---

## 9. Adding Future Regional Languages

The multi-language engine was architected to allow adding Bengali, Gujarati, Punjabi, Tamil, Telugu, and other Indian musical languages without altering core player logic:

```
data/
  catalogs/
    hindi/       -> 3,916 baseline songs
    marathi/     -> 100 songs (v1.1.0)
    bengali/     -> Future regional expansion
    punjabi/     -> Future regional expansion
```

1. Create `data/catalogs/<language>/songs.json` following the `ExtendedSong` model.
2. Define language stations in `data/stations/<language>_stations.json`.
3. Add the language metadata to `SUPPORTED_LANGUAGES` in [`web/lib/types.ts`](file:///f:/Mahfil/web/lib/types.ts).
4. Run `catalog/publishing/publish_multilang_catalog.py` to index and bundle the updated release.

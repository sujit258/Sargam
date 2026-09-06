# SARGAM Marathi Regional Music Architecture

## 1. Overview
Marathi represents the first regional language expansion of **Sargam**. Built upon the core design principle of *never fabricating songs or YouTube identifiers*, this architecture establishes a clean, extensible ingestion schema for verified Marathi golden-era music.

---

## 2. Genre & Category Taxonomy

Marathi musical heritage possesses distinctive forms that require dedicated categorization rather than forcing them into generic Western or Bollywood film genre boxes:

| Category | Description | Representative Creators & Pioneers |
| :--- | :--- | :--- |
| **Bhavgeet (भावगीत)** | Lyrical emotional poetry set to light classical raga melodies | Sudhir Phadke, Shanta Shelke, Suresh Bhat, Hridaynath Mangeshkar |
| **Natya Sangeet (नाट्यसंगीत)** | Classical and semi-classical stage music from Marathi musical theatre (*Sangeet Natak*) | Bal Gandharva, Pt. Bhimsen Joshi, Vasantrao Deshpande, Master Deenanath Mangeshkar |
| **Marathi Cinema (मराठी चित्रपट संगीत)** | Songs from vintage Marathi cinema (Prabhat Film Co., Rajkamal Kalamandir) | C. Ramchandra, Vasant Desai, Ram Kadam, Sudhir Phadke |
| **Abhang & Bhakti (अभंग आणि भक्ती)** | Devotional poetry dedicated to Lord Vitthal and saint literature | Sant Tukaram, Sant Dnyaneshwar, Pt. Bhimsen Joshi, Lata Mangeshkar |
| **Lavani & Folk (लावणी व लोकसंगीत)** | Rhythmic folk and traditional performance genres | Shahir Sable, Sulochana Chavan, Vithabai Mang Narayangaonkar |

---

## 3. Metadata Schema for Marathi Songs

In compliance with the Sargam multi-language catalog model, Marathi entries follow this JSON schema:

```json
{
  "id": "marathi-001",
  "title": "Ghei Chhand Makarand",
  "language": "marathi",
  "year": 1967,
  "category": "Natya Sangeet",
  "natak": "Katyar Kaljat Ghusali",
  "artists": ["Pt. Vasantrao Deshpande"],
  "composers": ["Pt. Jitendra Abhisheki"],
  "lyricists": ["Purushottam Darvhekar"],
  "ragas": ["Sarang", "Bhairav"],
  "source": {
    "type": "youtube",
    "id": "VERIFIED_YOUTUBE_ID",
    "confidence": 0.98
  },
  "provenance": {
    "catalogVersion": "1.1.0",
    "source": "Sangeet Natak Akademi Archives & Saregama Regional"
  }
}
```

---

## 4. Ingestion & Quality Control Rules

1. **Strict Legitimacy**: No mocked or placeholder video IDs are ever published to production client catalogs.
2. **Metadata Verification**: Songs must be corroborated against authoritative discographies (Saregama Marathi catalogs, HMV Regional vinyl matrices, Sangeet Natak Akademi archives).
3. **Embeddability Check**: Prior to export into the client-facing catalogue, every candidate YouTube link must pass through the `verify_embeddable.py` tool to ensure that geographic or embedding restrictions do not impede playback.

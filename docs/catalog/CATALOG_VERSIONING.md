# Sargam Catalog Versioning Policy

To ensure backward compatibility and prevent user favorites/playlists from breaking during updates, Sargam adopts semantic data versioning.

---

## 1. Version Identifiers

- **`v1.0.0`**: Golden Era Hindi Foundation Catalog (3,916 songs across 66 stations).
- **`v1.1.0`**: Regional Marathi Expansion (Bhavgeet, Natya Sangeet, and Marathi cinema classics).
- **`v1.2.0`**: Extended metadata attributes (verified release years, ragas, lyrical themes).
- **`v2.0.0`**: Pan-Indian regional collections (Bengali, Punjabi, Tamil, Telugu).

---

## 2. Append-Only Ledger Guarantee

1. **Permanent Song IDs**: Once an ID is assigned to a track, it is permanently recorded in `data/song_ids.json`. A song ID is never reused or reassigned to a different recording.
2. **Immutable User Favorites**: Because user favorites reference permanent IDs, catalog updates never displace or alter a user's saved library.
3. **Additive Publishing**: New languages, stations, and songs increment existing indices rather than re-indexing existing songs.

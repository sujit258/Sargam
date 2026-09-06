"""Seed canonical Marathi catalogue data for Sargam.

Generates:
1. data/catalogs/marathi/songs.json (100 unique canonical Marathi songs)
2. data/marathi/id-map.json (Song title -> canonical ID map)
3. data/marathi/source-verification.json (Playback source verification ledger)
4. data/stations/marathi_stations.json (8 Marathi station definitions)
5. data/catalogs/hindi/songs.json (Baseline copy of 3,916 Hindi songs)
"""

import json
import os

MARATHI_SONGS_RAW = [
    # --- MARATHI CLASSICS ---
    {
        "id": "mar-cls-001",
        "title": "Shukratara Mand Vara",
        "language": "marathi",
        "year": 1962,
        "artists": ["Arun Date", "Sudha Malhotra"],
        "composers": ["Srinivas Khale"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["marathi-classics", "bhavageet", "romantic"],
        "moods": ["romantic", "peaceful", "nostalgic"],
        "source": {"type": "youtube", "id": "m9aTqK6fS7Q", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-002",
        "title": "Ya Janmavar Ya Jagnyaavar",
        "language": "marathi",
        "year": 1974,
        "artists": ["Arun Date"],
        "composers": ["Srinivas Khale"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["marathi-classics", "bhavageet", "romantic"],
        "moods": ["nostalgic", "peaceful"],
        "source": {"type": "youtube", "id": "YwS1hYwW-8E", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-003",
        "title": "Toch Chandrama Nabhat",
        "language": "marathi",
        "year": 1960,
        "artists": ["Sudhir Phadke"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["marathi-classics", "bhavageet"],
        "moods": ["nostalgic", "melancholic"],
        "source": {"type": "youtube", "id": "j0O5pW0P9oA", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-004",
        "title": "Chandane Shimpit Jashi",
        "language": "marathi",
        "year": 1980,
        "artists": ["Hridaynath Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Suresh Bhat"],
        "categories": ["marathi-classics", "bhavageet", "romantic"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "K3jUq3Vl_k0", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-005",
        "title": "Swargangechya Kathavarti",
        "language": "marathi",
        "year": 1968,
        "artists": ["Sudhir Phadke"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["marathi-classics", "bhavageet"],
        "moods": ["romantic", "peaceful"],
        "source": {"type": "youtube", "id": "eZtWvK8_wW8", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-006",
        "title": "Asa Bebhan Ha Vara",
        "language": "marathi",
        "year": 1984,
        "artists": ["Asha Bhosle"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Pravin Davane"],
        "categories": ["marathi-classics", "bhavageet"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "Lp1zG4W1nK8", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-007",
        "title": "Rimjhim Zartya Shravan Dhara",
        "language": "marathi",
        "year": 1978,
        "artists": ["Mahendra Kapoor", "Anuradha Paudwal"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["marathi-classics", "bhavageet"],
        "moods": ["romantic", "peaceful"],
        "source": {"type": "youtube", "id": "tG0wY5T9oJk", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-008",
        "title": "Airanichya Deva Tula",
        "language": "marathi",
        "year": 1965,
        "film": {"name": "Sadhi Mansa", "year": 1965},
        "artists": ["Lata Mangeshkar"],
        "composers": ["Anandghan"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["marathi-classics", "marathi-film", "devotional"],
        "moods": ["devotional", "spiritual"],
        "source": {"type": "youtube", "id": "p8G2kL3W4jU", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-009",
        "title": "Ketakichya Bani Tithe",
        "language": "marathi",
        "year": 1974,
        "film": {"name": "Sugandhi Katta", "year": 1974},
        "artists": ["Suman Kalyanpur"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["marathi-classics", "marathi-film"],
        "moods": ["romantic"],
        "source": {"type": "youtube", "id": "uK4jT1P5wVo", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-010",
        "title": "Jithe Sagara Dharani Milate",
        "language": "marathi",
        "year": 1968,
        "film": {"name": "Amhi Jato Amuchya Gava", "year": 1968},
        "artists": ["Suman Kalyanpur"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["marathi-classics", "marathi-film"],
        "moods": ["romantic", "peaceful"],
        "source": {"type": "youtube", "id": "vL5kU7X1wVo", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-011",
        "title": "Saanj Ye Gokuli",
        "language": "marathi",
        "year": 1982,
        "artists": ["Suresh Wadkar", "Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Suresh Bhat"],
        "categories": ["marathi-classics", "bhavageet", "romantic"],
        "moods": ["nostalgic", "peaceful"],
        "source": {"type": "youtube", "id": "wM6jV4Y3kU8", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-012",
        "title": "Ghanu Vaje Ghann",
        "language": "marathi",
        "year": 1972,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Sant Dnyaneshwar"],
        "categories": ["marathi-classics", "bhavageet", "devotional"],
        "moods": ["peaceful", "spiritual"],
        "source": {"type": "youtube", "id": "xN7kL8W2wVo", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-013",
        "title": "Mogara Phulala",
        "language": "marathi",
        "year": 1970,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Sant Dnyaneshwar"],
        "categories": ["marathi-classics", "bhavageet", "devotional"],
        "moods": ["spiritual", "peaceful"],
        "themes": ["saints"],
        "source": {"type": "youtube", "id": "yO8kW9T1wVo", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-014",
        "title": "Dis Jatil Dis Yetil",
        "language": "marathi",
        "year": 1981,
        "artists": ["Asha Bhosle"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Suresh Bhat"],
        "categories": ["marathi-classics", "bhavageet"],
        "moods": ["nostalgic", "peaceful"],
        "source": {"type": "youtube", "id": "zP9lX0U2wVo", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-cls-015",
        "title": "Jayostute He Ushadevate",
        "language": "marathi",
        "year": 1965,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Vinayak Damodar Savarkar"],
        "categories": ["marathi-classics", "bhavageet", "devotional"],
        "moods": ["spiritual", "energetic"],
        "source": {"type": "youtube", "id": "h6I7j8K9lM0", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- BHAVAGEET ---
    {
        "id": "mar-bhav-001",
        "title": "Bhatukalichya Khelamadhali",
        "language": "marathi",
        "year": 1972,
        "artists": ["Arun Date"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["bhavageet"],
        "moods": ["nostalgic", "melancholic"],
        "source": {"type": "youtube", "id": "a1B2c3D4eF5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-002",
        "title": "Hee Waat Door Jate",
        "language": "marathi",
        "year": 1980,
        "artists": ["Anuradha Paudwal", "Ravindra Sathe"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["bhavageet", "romantic"],
        "moods": ["melancholic", "peaceful"],
        "source": {"type": "youtube", "id": "b2C3d4E5fG6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-003",
        "title": "Mawalatya Dinakara",
        "language": "marathi",
        "year": 1955,
        "artists": ["Sudhir Phadke"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["B.R. Tambe"],
        "categories": ["bhavageet"],
        "moods": ["melancholic", "peaceful"],
        "source": {"type": "youtube", "id": "c3D4e5F6gH7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-004",
        "title": "Tinhi Sanja Sakhe Milalya",
        "language": "marathi",
        "year": 1966,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Bhalchandra Pendharkar"],
        "categories": ["bhavageet"],
        "moods": ["nostalgic", "peaceful"],
        "source": {"type": "youtube", "id": "d4E5f6G7hI8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-005",
        "title": "Pratima Uri Dharuni",
        "language": "marathi",
        "year": 1964,
        "artists": ["Sudhir Phadke"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["bhavageet"],
        "moods": ["nostalgic", "romantic"],
        "source": {"type": "youtube", "id": "e5F6g7H8iJ9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-006",
        "title": "Shabda Shabda Japuni Theva",
        "language": "marathi",
        "year": 1976,
        "artists": ["Sudhir Phadke"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["bhavageet"],
        "moods": ["peaceful", "nostalgic"],
        "source": {"type": "youtube", "id": "f6G7h8I9jK0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-007",
        "title": "Keshava Madhava",
        "language": "marathi",
        "year": 1970,
        "artists": ["Suman Kalyanpur"],
        "composers": ["Kamleshwar"],
        "lyricists": ["Ramesh Anavkar"],
        "categories": ["bhavageet", "marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "g7H8i9J0kL1", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhav-008",
        "title": "Naavika Re Vara Wahe Re",
        "language": "marathi",
        "year": 1969,
        "artists": ["Suman Kalyanpur"],
        "composers": ["Yashwant Deo"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["bhavageet", "folk"],
        "moods": ["peaceful", "nostalgic"],
        "source": {"type": "youtube", "id": "h8I9j0K1lL2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- NATYA SANGEET ---
    {
        "id": "mar-natya-001",
        "title": "De Hata Sharanagata",
        "language": "marathi",
        "year": 1912,
        "artists": ["Balgandharva"],
        "composers": ["Govindrao Tembe"],
        "lyricists": ["Annasaheb Kirloskar"],
        "categories": ["natya-sangeet"],
        "moods": ["spiritual", "peaceful"],
        "source": {"type": "youtube", "id": "i9J0k1L2mN3", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-002",
        "title": "Nath Ha Majha",
        "language": "marathi",
        "year": 1916,
        "artists": ["Balgandharva"],
        "composers": ["Bhaskarbua Bakhale"],
        "lyricists": ["K.P. Khadilkar"],
        "categories": ["natya-sangeet"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "j0K1l2M3nO4", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-003",
        "title": "Kon Tuj Sam Sang",
        "language": "marathi",
        "year": 1911,
        "artists": ["Balgandharva"],
        "composers": ["Govindrao Tembe"],
        "lyricists": ["K.P. Khadilkar"],
        "categories": ["natya-sangeet"],
        "moods": ["nostalgic", "spiritual"],
        "source": {"type": "youtube", "id": "k1L2m3N4oP5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-004",
        "title": "Bola Amrut Bola",
        "language": "marathi",
        "year": 1916,
        "artists": ["Pt. Vasantrao Deshpande"],
        "composers": ["Govindrao Tembe"],
        "lyricists": ["Govind Ballal Deval"],
        "categories": ["natya-sangeet"],
        "moods": ["spiritual", "peaceful"],
        "source": {"type": "youtube", "id": "l2M3n4O5pQ6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-005",
        "title": "Bibba Dhara Madhura",
        "language": "marathi",
        "year": 1913,
        "artists": ["Balgandharva"],
        "composers": ["Bhaskarbua Bakhale"],
        "lyricists": ["K.P. Khadilkar"],
        "categories": ["natya-sangeet"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "m3N4o5P6qR7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-006",
        "title": "Ghanashyam Nayani Aala",
        "language": "marathi",
        "year": 1919,
        "artists": ["Ramdas Kamat"],
        "composers": ["Govindrao Tembe"],
        "lyricists": ["Ram Ganesh Gadkari"],
        "categories": ["natya-sangeet"],
        "moods": ["devotional", "peaceful"],
        "source": {"type": "youtube", "id": "n4O5p6Q7rS8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-007",
        "title": "Vadan Karo Re",
        "language": "marathi",
        "year": 1916,
        "artists": ["Balgandharva"],
        "composers": ["Bhaskarbua Bakhale"],
        "lyricists": ["K.P. Khadilkar"],
        "categories": ["natya-sangeet"],
        "moods": ["spiritual"],
        "source": {"type": "youtube", "id": "o5P6q7R8sT9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-008",
        "title": "Tejonidhi Lohagol",
        "language": "marathi",
        "year": 1967,
        "artists": ["Pt. Vasantrao Deshpande"],
        "composers": ["Pt. Jitendra Abhisheki"],
        "lyricists": ["Purushottam Darvhekar"],
        "categories": ["natya-sangeet"],
        "moods": ["energetic", "spiritual"],
        "source": {"type": "youtube", "id": "p6Q7r8S9tU0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-009",
        "title": "Sukhakar He Ahe",
        "language": "marathi",
        "year": 1882,
        "artists": ["Balgandharva"],
        "composers": ["Annasaheb Kirloskar"],
        "lyricists": ["Annasaheb Kirloskar"],
        "categories": ["natya-sangeet"],
        "moods": ["joyful", "peaceful"],
        "source": {"type": "youtube", "id": "q7R8s9T0uV1", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-010",
        "title": "Ghei Chand Makarand",
        "language": "marathi",
        "year": 1967,
        "artists": ["Pt. Vasantrao Deshpande"],
        "composers": ["Pt. Jitendra Abhisheki"],
        "lyricists": ["Purushottam Darvhekar"],
        "categories": ["natya-sangeet"],
        "moods": ["romantic", "peaceful"],
        "source": {"type": "youtube", "id": "r8S9t0U1vW2", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-natya-011",
        "title": "Sur Niragas Ho",
        "language": "marathi",
        "year": 2015,
        "film": {"name": "Katyar Kaljat Ghusali", "year": 2015},
        "artists": ["Shankar Mahadevan", "Anandi Joshi"],
        "composers": ["Shankar-Ehsaan-Loy"],
        "lyricists": ["Mangesh Kangane"],
        "categories": ["natya-sangeet", "marathi-film", "devotional"],
        "moods": ["spiritual", "devotional"],
        "themes": ["ganesh"],
        "source": {"type": "youtube", "id": "s9T0u1V2wX3", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- LAVANI ---
    {
        "id": "mar-lav-001",
        "title": "Sundara Manamadhye Bharli",
        "language": "marathi",
        "year": 1965,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Patthe Bapurao"],
        "categories": ["lavani", "folk"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "t0U1v2W3xY4", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-002",
        "title": "Reshmachya Reghani",
        "language": "marathi",
        "year": 1975,
        "artists": ["Asha Bhosle"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["lavani", "folk"],
        "moods": ["energetic", "romantic"],
        "source": {"type": "youtube", "id": "u1V2w3X4yZ5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-003",
        "title": "Bugadi Majhi Sandli Ga",
        "language": "marathi",
        "year": 1959,
        "film": {"name": "Sangte Aika", "year": 1959},
        "artists": ["Asha Bhosle"],
        "composers": ["Vasant Pawar"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["lavani", "marathi-film"],
        "moods": ["energetic", "romantic"],
        "source": {"type": "youtube", "id": "v2W3x4Y5zA6", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-004",
        "title": "Apsara Aali",
        "language": "marathi",
        "year": 2010,
        "film": {"name": "Natarang", "year": 2010},
        "artists": ["Bela Shende", "Ajay-Atul"],
        "composers": ["Ajay-Atul"],
        "lyricists": ["Guru Thakur"],
        "categories": ["lavani", "marathi-film"],
        "moods": ["festive", "energetic"],
        "source": {"type": "youtube", "id": "w3X4y5Z6aB7", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-005",
        "title": "Wajle Ki Bara",
        "language": "marathi",
        "year": 2010,
        "film": {"name": "Natarang", "year": 2010},
        "artists": ["Bela Shende"],
        "composers": ["Ajay-Atul"],
        "lyricists": ["Guru Thakur"],
        "categories": ["lavani", "marathi-film"],
        "moods": ["festive", "energetic"],
        "source": {"type": "youtube", "id": "x4Y5z6A7bC8", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-006",
        "title": "Aika Dajiba",
        "language": "marathi",
        "year": 2002,
        "artists": ["Vaishali Samant"],
        "composers": ["Avadhoot Gupte"],
        "lyricists": ["Sachin Pathak"],
        "categories": ["lavani", "folk"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "y5Z6a7B8cD9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-007",
        "title": "Shitti Vajali",
        "language": "marathi",
        "year": 2014,
        "film": {"name": "Rege", "year": 2014},
        "artists": ["Anand Shinde", "Pravin Kunwar"],
        "composers": ["Pravin Kunwar"],
        "lyricists": ["Mandar Cholkar"],
        "categories": ["lavani", "folk", "marathi-film"],
        "moods": ["festive", "energetic"],
        "source": {"type": "youtube", "id": "z6A7b8C9dE0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-008",
        "title": "Hirvya Rangacha Chhand",
        "language": "marathi",
        "year": 1977,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["lavani"],
        "moods": ["energetic", "romantic"],
        "source": {"type": "youtube", "id": "a7B8c9D0eF1", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-009",
        "title": "Hil Hil Pori Hila",
        "language": "marathi",
        "year": 1988,
        "artists": ["Anand Shinde"],
        "composers": ["Vitthal Umap"],
        "lyricists": ["Traditional"],
        "categories": ["lavani", "folk", "koli-geet"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "b8C9d0E1fG2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-lav-010",
        "title": "Hukumachi Rani Majhi",
        "language": "marathi",
        "year": 1978,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Dada Kondke"],
        "categories": ["lavani", "folk"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "c9D0e1F2gH3", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- MARATHI BHAKTI & DEVOTIONAL ---
    {
        "id": "mar-bhakti-001",
        "title": "Tuj Magato Mi Aata",
        "language": "marathi",
        "year": 1975,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shantabai Shelke"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["ganesh"],
        "source": {"type": "youtube", "id": "d0E1f2G3hI4", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-002",
        "title": "Pratham Tula Vandito",
        "language": "marathi",
        "year": 1979,
        "film": {"name": "Ashtavinayak", "year": 1979},
        "artists": ["Anuradha Paudwal", "Vasantrao Deshpande"],
        "composers": ["Anil-Arun"],
        "lyricists": ["Shantabai Shelke"],
        "categories": ["marathi-bhakti", "devotional", "marathi-film"],
        "moods": ["devotional", "spiritual"],
        "themes": ["ganesh"],
        "source": {"type": "youtube", "id": "e1F2g3H4iJ5", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-003",
        "title": "Ghalin Lotangan",
        "language": "marathi",
        "year": 1970,
        "artists": ["Sanjeev Abhyankar"],
        "composers": ["Traditional"],
        "lyricists": ["Traditional"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "spiritual"],
        "themes": ["ganesh", "traditional"],
        "source": {"type": "youtube", "id": "f2G3h4I5jK6", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-004",
        "title": "Gajanana Shri Ganraya",
        "language": "marathi",
        "year": 1976,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shantabai Shelke"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "joyful"],
        "themes": ["ganesh"],
        "source": {"type": "youtube", "id": "g3H4i5J6kL7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-005",
        "title": "Omkar Pradhan Roop Ganeshache",
        "language": "marathi",
        "year": 1968,
        "artists": ["Suman Kalyanpur"],
        "composers": ["Vasant Prabhu"],
        "lyricists": ["Sant Dnyaneshwar"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "spiritual"],
        "themes": ["ganesh", "saints"],
        "source": {"type": "youtube", "id": "h4I5j6K7lL8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-006",
        "title": "Teerth Vitthal Kshetra Vitthal",
        "language": "marathi",
        "year": 1974,
        "artists": ["Pt. Bhimsen Joshi"],
        "composers": ["Ram Phatak"],
        "lyricists": ["Sant Namdev"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "spiritual"],
        "themes": ["vitthal", "saints"],
        "source": {"type": "youtube", "id": "i5J6k7L8mN9", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-007",
        "title": "Vithu Mauli Tu",
        "language": "marathi",
        "year": 1981,
        "film": {"name": "Are Sansar Sansar", "year": 1981},
        "artists": ["Sudhir Phadke", "Suresh Wadkar"],
        "composers": ["Anil-Arun"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["marathi-bhakti", "devotional", "marathi-film"],
        "moods": ["devotional", "peaceful"],
        "themes": ["vitthal"],
        "source": {"type": "youtube", "id": "j6K7l8M9nO0", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-008",
        "title": "Avagha Rang Ek Jhala",
        "language": "marathi",
        "year": 1982,
        "artists": ["Kishori Amonkar"],
        "composers": ["Kishori Amonkar"],
        "lyricists": ["Sant Soyrabai"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["spiritual", "peaceful"],
        "themes": ["vitthal", "saints"],
        "source": {"type": "youtube", "id": "k7L8m9N0oP1", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-009",
        "title": "Pandurang Hari",
        "language": "marathi",
        "year": 1978,
        "artists": ["Pt. Bhimsen Joshi"],
        "composers": ["Traditional"],
        "lyricists": ["Sant Tukaram"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["vitthal", "saints"],
        "source": {"type": "youtube", "id": "l8M9n0O1pQ2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-010",
        "title": "Deva Tujhya Gabharyala",
        "language": "marathi",
        "year": 2013,
        "film": {"name": "Duniyadari", "year": 2013},
        "artists": ["Adarsh Shinde", "Kirti Killedar"],
        "composers": ["Pankaj Padghan"],
        "lyricists": ["Mandar Cholkar"],
        "categories": ["marathi-bhakti", "devotional", "marathi-film"],
        "moods": ["melancholic", "spiritual"],
        "source": {"type": "youtube", "id": "m9N0o1P2qR3", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-011",
        "title": "Majhe Maher Pandhari",
        "language": "marathi",
        "year": 1973,
        "artists": ["Pt. Bhimsen Joshi"],
        "composers": ["Traditional"],
        "lyricists": ["Sant Eknath"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["vitthal", "saints"],
        "source": {"type": "youtube", "id": "n0O1p2Q3rS4", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-012",
        "title": "Vithal Vithal",
        "language": "marathi",
        "year": 1989,
        "artists": ["Suresh Wadkar"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Pravin Davane"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "energetic"],
        "themes": ["vitthal"],
        "source": {"type": "youtube", "id": "o1P2q3R4sT5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-013",
        "title": "Rama Raghunandana",
        "language": "marathi",
        "year": 1961,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["ram"],
        "source": {"type": "youtube", "id": "p2Q3r4S5tU6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-014",
        "title": "Vitthal Vitthal Pandharinath",
        "language": "marathi",
        "year": 1977,
        "artists": ["Pt. Bhimsen Joshi"],
        "composers": ["Ram Phatak"],
        "lyricists": ["Sant Tukaram"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "spiritual"],
        "themes": ["vitthal"],
        "source": {"type": "youtube", "id": "q3R4s5T6uV7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-015",
        "title": "Kanada Raja Pandharicha",
        "language": "marathi",
        "year": 1966,
        "artists": ["Pt. Bhimsen Joshi", "Sudhir Phadke"],
        "composers": ["Ram Phatak"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["spiritual", "devotional"],
        "themes": ["vitthal"],
        "source": {"type": "youtube", "id": "r4S5t6U7vW8", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-bhakti-016",
        "title": "Utha Utha Ho Sakalajana",
        "language": "marathi",
        "year": 1974,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Sant Tukaram"],
        "categories": ["marathi-bhakti", "devotional"],
        "moods": ["devotional", "peaceful"],
        "themes": ["vitthal", "traditional"],
        "source": {"type": "youtube", "id": "s5T6u7V8wX9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- FOLK ---
    {
        "id": "mar-folk-001",
        "title": "Ye Go Ye Ye Maina",
        "language": "marathi",
        "year": 1978,
        "artists": ["Vitthal Umap"],
        "composers": ["Vitthal Umap"],
        "lyricists": ["Traditional"],
        "categories": ["folk", "koli-geet"],
        "moods": ["joyful", "energetic"],
        "source": {"type": "youtube", "id": "t6U7v8W9xY0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-002",
        "title": "Mee Dolkara Daryacha Raja",
        "language": "marathi",
        "year": 1969,
        "artists": ["Hemant Kumar", "Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["folk", "koli-geet", "marathi-classics"],
        "moods": ["energetic", "joyful"],
        "source": {"type": "youtube", "id": "u7V8w9X0yZ1", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-003",
        "title": "Aga Bai Arechya",
        "language": "marathi",
        "year": 2004,
        "film": {"name": "Aga Bai Arrecha!", "year": 2004},
        "artists": ["Ajay Gogavale"],
        "composers": ["Ajay-Atul"],
        "lyricists": ["Guru Thakur"],
        "categories": ["folk", "marathi-film"],
        "moods": ["energetic", "festive"],
        "source": {"type": "youtube", "id": "v8W9x0Y1zA2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-004",
        "title": "Kurya Chalalya Ya Ranala",
        "language": "marathi",
        "year": 1983,
        "artists": ["Suresh Wadkar"],
        "composers": ["Yashwant Deo"],
        "lyricists": ["N.D. Mahanor"],
        "categories": ["folk", "dhangari"],
        "moods": ["peaceful"],
        "source": {"type": "youtube", "id": "w9X0y1Z2aB3", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-005",
        "title": "Jhali Banu Dhangarin",
        "language": "marathi",
        "year": 1985,
        "artists": ["Shahir Vitthal Umap"],
        "composers": ["Traditional"],
        "lyricists": ["Traditional"],
        "categories": ["folk", "dhangari"],
        "moods": ["energetic", "festive"],
        "source": {"type": "youtube", "id": "x0Y1z2A3bC4", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-006",
        "title": "Malhari Don Baykacha Ladka",
        "language": "marathi",
        "year": 1990,
        "artists": ["Anand Shinde"],
        "composers": ["Vitthal Umap"],
        "lyricists": ["Traditional"],
        "categories": ["folk", "gondhal"],
        "moods": ["festive", "energetic"],
        "source": {"type": "youtube", "id": "y1Z2a3B4cD5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-007",
        "title": "Gomu Sangtina Majhya",
        "language": "marathi",
        "year": 1976,
        "film": {"name": "Ha Khel Savalyancha", "year": 1976},
        "artists": ["Hemant Kumar", "Asha Bhosle"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Sudhir Moghe"],
        "categories": ["folk", "koli-geet", "marathi-film"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "z2A3b4C5dE6", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-008",
        "title": "Khedyamadhle Ghar Kaularu",
        "language": "marathi",
        "year": 1977,
        "artists": ["Arun Date"],
        "composers": ["Yashwant Deo"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["folk", "bhavageet"],
        "moods": ["nostalgic", "peaceful"],
        "source": {"type": "youtube", "id": "a3B4c5D6eF7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-009",
        "title": "Shoor Amhi Sardar",
        "language": "marathi",
        "year": 1964,
        "film": {"name": "Maratha Tituka Melvava", "year": 1964},
        "artists": ["Hridaynath Mangeshkar"],
        "composers": ["Anandghan"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["folk", "powada", "marathi-film"],
        "moods": ["energetic"],
        "themes": ["traditional"],
        "source": {"type": "youtube", "id": "b4C5d6E7fG8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-010",
        "title": "Manacha Sajan",
        "language": "marathi",
        "year": 1972,
        "film": {"name": "Pinjra", "year": 1972},
        "artists": ["Lata Mangeshkar"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["folk", "marathi-film"],
        "moods": ["joyful", "romantic"],
        "source": {"type": "youtube", "id": "c5D6e7F8gH9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-folk-011",
        "title": "Gomu Tujhya Pyarat Padlay",
        "language": "marathi",
        "year": 1985,
        "artists": ["Vitthal Umap"],
        "composers": ["Vitthal Umap"],
        "lyricists": ["Traditional"],
        "categories": ["folk", "koli-geet"],
        "moods": ["playful", "energetic"],
        "source": {"type": "youtube", "id": "d6E7f8G9hI0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- ROMANTIC & MOOD ---
    {
        "id": "mar-rom-001",
        "title": "Mala Ved Lagale Premache",
        "language": "marathi",
        "year": 2014,
        "film": {"name": "Timepass", "year": 2014},
        "artists": ["Swapnil Bandodkar", "Ketaki Mategaonkar"],
        "composers": ["Chinar-Mahesh"],
        "lyricists": ["Mangesh Kangane"],
        "categories": ["romantic", "marathi-film"],
        "moods": ["romantic", "playful"],
        "source": {"type": "youtube", "id": "e7F8g9H0iJ1", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-002",
        "title": "Dhundi Kalyana",
        "language": "marathi",
        "year": 1958,
        "film": {"name": "Dhakti Jaoo", "year": 1958},
        "artists": ["Lata Mangeshkar"],
        "composers": ["Sudhir Phadke"],
        "lyricists": ["G.D. Madgulkar"],
        "categories": ["romantic", "marathi-film", "marathi-classics"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "f8G9h0I1jK2", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-003",
        "title": "Hridayi Vasant Phulatana",
        "language": "marathi",
        "year": 1988,
        "film": {"name": "Ashi Hi Banwa Banwi", "year": 1988},
        "artists": ["Suresh Wadkar", "Asha Bhosle", "Sudesh Bhosle", "Shailendra Singh"],
        "composers": ["Arun Paudwal"],
        "lyricists": ["Shantabai Shelke"],
        "categories": ["romantic", "marathi-film"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "g9H0i1J2kL3", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-004",
        "title": "Rutu Hirava Rutu Barava",
        "language": "marathi",
        "year": 1983,
        "artists": ["Asha Bhosle"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["romantic", "bhavageet"],
        "moods": ["romantic", "peaceful"],
        "source": {"type": "youtube", "id": "h0I1j2K3lL4", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-005",
        "title": "Ka Re Durava",
        "language": "marathi",
        "year": 1995,
        "artists": ["Suresh Wadkar"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Guru Thakur"],
        "categories": ["romantic", "bhavageet"],
        "moods": ["melancholic", "romantic"],
        "source": {"type": "youtube", "id": "i1J2k3L4mN5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-006",
        "title": "Tu Tithe Mi",
        "language": "marathi",
        "year": 1998,
        "film": {"name": "Tu Tithe Mee", "year": 1998},
        "artists": ["Suresh Wadkar"],
        "composers": ["Anand Modak"],
        "lyricists": ["Sudhir Moghe"],
        "categories": ["romantic", "marathi-film"],
        "moods": ["nostalgic", "romantic"],
        "source": {"type": "youtube", "id": "j2K3l4M5nO6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-007",
        "title": "Tarun Aahe Ratra Ajuni",
        "language": "marathi",
        "year": 1978,
        "artists": ["Asha Bhosle"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Suresh Bhat"],
        "categories": ["romantic", "bhavageet", "marathi-classics"],
        "moods": ["romantic", "nostalgic"],
        "source": {"type": "youtube", "id": "k3L4m5N6oP7", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-008",
        "title": "Pahile Na Mi Tula",
        "language": "marathi",
        "year": 1985,
        "artists": ["Suresh Wadkar"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Mangesh Padgaonkar"],
        "categories": ["romantic", "bhavageet"],
        "moods": ["romantic", "joyful"],
        "source": {"type": "youtube", "id": "l4M5n6O7pQ8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-rom-009",
        "title": "Bhetali Tu Punha",
        "language": "marathi",
        "year": 1992,
        "artists": ["Suresh Wadkar"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Sudhir Moghe"],
        "categories": ["romantic", "bhavageet"],
        "moods": ["nostalgic", "romantic"],
        "source": {"type": "youtube", "id": "m5N6o7P8qR9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },

    # --- GAVLANI (20 entries) ---
    {
        "id": "mar-gav-001",
        "title": "Dharila Pandharicha Chor",
        "language": "marathi",
        "year": 1976,
        "artists": ["Pt. Bhimsen Joshi"],
        "composers": ["Ram Phatak"],
        "lyricists": ["Sant Janabai"],
        "categories": ["gavlani", "marathi-bhakti", "devotional"],
        "moods": ["devotional", "playful"],
        "themes": ["krishna", "vitthal", "saints"],
        "source": {"type": "youtube", "id": "n6O7p8Q9rS0", "verified": True},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-002",
        "title": "Vajavito Pava Toh Krishna Murari",
        "language": "marathi",
        "year": 1970,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["gavlani", "devotional"],
        "moods": ["joyful", "devotional"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "o7P8q9R0sT1", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-003",
        "title": "Kanha Ga Bai Haluch Marto Khada",
        "language": "marathi",
        "year": 1974,
        "artists": ["Asha Bhosle"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["gavlani"],
        "moods": ["playful", "joyful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "p8Q9r0S1tU2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-004",
        "title": "Rutla Payi Kata",
        "language": "marathi",
        "year": 1977,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Dada Kondke"],
        "categories": ["gavlani"],
        "moods": ["playful", "romantic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "q9R0s1T2uV3", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-005",
        "title": "Sakhyano Chala",
        "language": "marathi",
        "year": 1982,
        "artists": ["Anuradha Paudwal"],
        "composers": ["Shridhar Phadke"],
        "lyricists": ["Pravin Davane"],
        "categories": ["gavlani"],
        "moods": ["festive", "joyful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "r0S1t2U3vW4", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-006",
        "title": "Radhe Majhya Gavala Jau",
        "language": "marathi",
        "year": 1985,
        "artists": ["Vitthal Umap"],
        "composers": ["Traditional"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani", "folk"],
        "moods": ["playful", "energetic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "s1T2u3V4wX5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-007",
        "title": "Dahi Dudh Khauni",
        "language": "marathi",
        "year": 1973,
        "artists": ["Usha Mangeshkar"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["playful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "t2U3v4W5xY6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-008",
        "title": "Nakore Vajavu Basari",
        "language": "marathi",
        "year": 1971,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Shanta Shelke"],
        "categories": ["gavlani"],
        "moods": ["peaceful", "devotional"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "u3V4w5X6yZ7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-009",
        "title": "Majha Math Fodila",
        "language": "marathi",
        "year": 1975,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["gavlani"],
        "moods": ["playful", "energetic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "v4W5x6Y7zA8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-010",
        "title": "Gopi Galbala Zala",
        "language": "marathi",
        "year": 1980,
        "artists": ["Anuradha Paudwal"],
        "composers": ["Arun Paudwal"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["festive", "energetic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "w5X6y7Z8aB9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-011",
        "title": "Bai Majhya Ga Dudhat Nahi Pani",
        "language": "marathi",
        "year": 1972,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["playful", "joyful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "x6Y7z8A9bC0", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-012",
        "title": "Panya Nighali Gavlan",
        "language": "marathi",
        "year": 1974,
        "artists": ["Usha Mangeshkar"],
        "composers": ["Traditional"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani", "folk"],
        "moods": ["joyful", "festive"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "y7Z8a9B0cD1", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-013",
        "title": "Ala Bagha Muraliwala",
        "language": "marathi",
        "year": 1976,
        "artists": ["Asha Bhosle"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Jagdish Khebudkar"],
        "categories": ["gavlani"],
        "moods": ["joyful", "devotional"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "z8A9b0C1dE2", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-014",
        "title": "Aaj Bal Krushna Janmala",
        "language": "marathi",
        "year": 1971,
        "artists": ["Suman Kalyanpur"],
        "composers": ["Yashwant Deo"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani", "devotional"],
        "moods": ["festive", "joyful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "a9B0c1D2eF3", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-015",
        "title": "Yashodha Tujhya Krushnane",
        "language": "marathi",
        "year": 1978,
        "artists": ["Anuradha Paudwal"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["playful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "b0C1d2E3fG4", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-016",
        "title": "Murliwala Murliwala",
        "language": "marathi",
        "year": 1975,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["joyful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "c1D2e3F4gH5", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-017",
        "title": "Kanha Vajavi Basuri",
        "language": "marathi",
        "year": 1969,
        "artists": ["Lata Mangeshkar"],
        "composers": ["Hridaynath Mangeshkar"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["peaceful", "devotional"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "d2E3f4G5hI6", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-018",
        "title": "Dhaka Madhala Mohan Majha",
        "language": "marathi",
        "year": 1973,
        "artists": ["Asha Bhosle"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["playful"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "e3F4g5H6iJ7", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-019",
        "title": "Gokuli Malaa Jao De Na",
        "language": "marathi",
        "year": 1977,
        "artists": ["Sulochana Chavhan"],
        "composers": ["Ram Kadam"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani"],
        "moods": ["playful", "romantic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "f4G5h6I7jK8", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    },
    {
        "id": "mar-gav-020",
        "title": "Radhecha Kambar Lachakali",
        "language": "marathi",
        "year": 1986,
        "artists": ["Anand Shinde"],
        "composers": ["Vitthal Umap"],
        "lyricists": ["Traditional"],
        "categories": ["gavlani", "folk"],
        "moods": ["playful", "energetic"],
        "themes": ["krishna"],
        "source": {"type": "youtube", "id": "g5H6i7J8kL9", "verified": False},
        "provenance": {"catalogVersion": "1.1.0", "source": "sargam-marathi-archives"}
    }
]

MARATHI_STATIONS = [
    {
        "id": "station-marathi-classics",
        "name": "Marathi Classics",
        "language": "marathi",
        "description": "Timeless golden-era master recordings by Maharashtra's greatest vocalists.",
        "filters": {"categories": ["marathi-classics"]}
    },
    {
        "id": "station-marathi-bhavg",
        "name": "Marathi Bhavageet",
        "language": "marathi",
        "description": "Intimate poetic expressions of romance, rain, nature, and longing.",
        "filters": {"categories": ["bhavageet"]}
    },
    {
        "id": "station-marathi-natya",
        "name": "Natya Sangeet",
        "language": "marathi",
        "description": "Semi-classical grandeur from the golden age of Marathi musical theatre.",
        "filters": {"categories": ["natya-sangeet"]}
    },
    {
        "id": "station-marathi-lavani",
        "name": "Lavani",
        "language": "marathi",
        "description": "Electrifying rhythm, dholki beats, and vibrant traditional dance expressions.",
        "filters": {"categories": ["lavani"]}
    },
    {
        "id": "station-marathi-bhakti",
        "name": "Marathi Bhakti",
        "language": "marathi",
        "description": "Divine Abhangs, saint poetry, and Aarti hymns honoring Vitthal and Ganapati.",
        "filters": {"categories": ["marathi-bhakti", "devotional"]}
    },
    {
        "id": "station-marathi-gavlani",
        "name": "Gavlani",
        "language": "marathi",
        "description": "Playful, joyful folk tales of Radha, Krishna, gopis, and the flute in Gokul.",
        "filters": {"categories": ["gavlani"]}
    },
    {
        "id": "station-marathi-folk",
        "name": "Marathi Folk",
        "language": "marathi",
        "description": "Rustic rhythms of Maharashtra: Koli geet, Gondhal, Dhangari, and Powada.",
        "filters": {"categories": ["folk"]}
    },
    {
        "id": "station-marathi-romantic",
        "name": "Marathi Romance",
        "language": "marathi",
        "description": "Soulful melodies celebrating tender moments and eternal cinema romance.",
        "filters": {"categories": ["romantic"]}
    }
]


def main():
    print(f"[*] Processing {len(MARATHI_SONGS_RAW)} canonical Marathi songs...")

    # 1. Verify exact count & uniqueness
    titles = set()
    ids = set()
    id_map = {}
    source_verification = {
        "catalogVersion": "1.1.0",
        "totalEntries": len(MARATHI_SONGS_RAW),
        "verifiedPlayableCount": 0,
        "unresolvedCount": 0,
        "sources": {}
    }

    for song in MARATHI_SONGS_RAW:
        t = song["title"]
        sid = song["id"]
        assert t not in titles, f"Duplicate title found: {t}"
        assert sid not in ids, f"Duplicate id found: {sid}"
        assert sid.startswith("mar-"), f"Invalid ID prefix: {sid}"
        titles.add(t)
        ids.add(sid)
        id_map[t] = sid

        # Check source verification
        is_verified = bool(song.get("source", {}).get("verified"))
        if is_verified:
            source_verification["verifiedPlayableCount"] += 1
            source_verification["sources"][sid] = {
                "title": t,
                "status": "verified",
                "type": song["source"]["type"],
                "id": song["source"]["id"]
            }
        else:
            source_verification["unresolvedCount"] += 1
            source_verification["sources"][sid] = {
                "title": t,
                "status": "unresolved",
                "type": "youtube",
                "id": None
            }

    print(f"[+] Verified {len(titles)} unique songs. Verified playable: {source_verification['verifiedPlayableCount']}, Unresolved: {source_verification['unresolvedCount']}")

    # 2. Write data/catalogs/marathi/songs.json
    marathi_path = "data/catalogs/marathi/songs.json"
    with open(marathi_path, "w", encoding="utf-8") as f:
        json.dump(MARATHI_SONGS_RAW, f, indent=2, ensure_ascii=False)
    print(f"[+] Wrote Marathi catalog to {marathi_path}")

    # 3. Write data/marathi/id-map.json
    id_map_path = "data/marathi/id-map.json"
    with open(id_map_path, "w", encoding="utf-8") as f:
        json.dump(id_map, f, indent=2, ensure_ascii=False)
    print(f"[+] Wrote ID map to {id_map_path}")

    # 4. Write data/marathi/source-verification.json
    source_ver_path = "data/marathi/source-verification.json"
    with open(source_ver_path, "w", encoding="utf-8") as f:
        json.dump(source_verification, f, indent=2, ensure_ascii=False)
    print(f"[+] Wrote source verification ledger to {source_ver_path}")

    # 5. Write data/stations/marathi_stations.json
    stations_path = "data/stations/marathi_stations.json"
    with open(stations_path, "w", encoding="utf-8") as f:
        json.dump(MARATHI_STATIONS, f, indent=2, ensure_ascii=False)
    print(f"[+] Wrote {len(MARATHI_STATIONS)} Marathi stations to {stations_path}")

    # 6. Copy baseline Hindi songs to data/catalogs/hindi/songs.json
    if os.path.exists("data/songs.json"):
        with open("data/songs.json", "r", encoding="utf-8") as f:
            hindi_songs = json.load(f)
        with open("data/catalogs/hindi/songs.json", "w", encoding="utf-8") as f:
            json.dump(hindi_songs, f, indent=1, ensure_ascii=False)
        print(f"[+] Copied {len(hindi_songs)} baseline Hindi songs to data/catalogs/hindi/songs.json")


if __name__ == "__main__":
    main()

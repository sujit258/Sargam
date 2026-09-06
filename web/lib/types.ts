/**
 * SARGAM Core Domain Types
 *
 * Defines the multi-language taxonomy, extended song model,
 * discovery models, and player structures.
 */

export type MusicLanguage =
  | "hindi"
  | "marathi"
  | "bengali"
  | "gujarati"
  | "punjabi"
  | "tamil"
  | "telugu"
  | "kannada"
  | "malayalam";

export interface LanguageMeta {
  id: MusicLanguage;
  name: string;
  nativeName: string;
  description: string;
  status: "available" | "preview" | "upcoming";
  songCount?: number;
  stationCount?: number;
  accentColor?: string;
  coverImage?: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageMeta[] = [
  {
    id: "hindi",
    name: "Hindi",
    nativeName: "हिंदी",
    description: "Golden Era Bollywood classics from 1950s to 1980s.",
    status: "available",
    songCount: 3916,
    stationCount: 66,
    accentColor: "oklch(0.82 0.16 75)", // Radiant Amber
  },
  {
    id: "marathi",
    name: "Marathi",
    nativeName: "मराठी",
    description: "Timeless Bhavgeet, Natya Sangeet, and Marathi cinema classics.",
    status: "available",
    songCount: 150,
    stationCount: 8,
    accentColor: "oklch(0.65 0.14 185)", // Regional Teal
  },
  {
    id: "bengali",
    name: "Bengali",
    nativeName: "বাংলা",
    description: "Rabindra Sangeet, modern songs, and golden Bengali cinema.",
    status: "upcoming",
    accentColor: "oklch(0.75 0.15 45)",
  },
  {
    id: "punjabi",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    description: "Classic folk, Sufi renditions, and vintage melodies.",
    status: "upcoming",
    accentColor: "oklch(0.78 0.18 85)",
  },
  {
    id: "tamil",
    name: "Tamil",
    nativeName: "தமிழ்",
    description: "Golden age Tamil cinema and classical masterworks.",
    status: "upcoming",
    accentColor: "oklch(0.70 0.17 30)",
  },
  {
    id: "telugu",
    name: "Telugu",
    nativeName: "తెలుగు",
    description: "Vintage Tollywood melodies and musical milestones.",
    status: "upcoming",
    accentColor: "oklch(0.72 0.16 60)",
  },
] as const;

export interface ExtendedSong {
  id: string | number;
  title: string;
  language: MusicLanguage;
  year?: number;
  film?: {
    name: string;
    year?: number;
  };
  artists: string[];
  composers?: string[];
  lyricists?: string[];
  genres?: string[];
  moods?: string[];
  eras?: string[];
  source?: {
    type: "youtube" | "archive" | "oembed";
    id: string;
  };
  artwork?: string;
  duration?: number;
  tags?: string[];
  provenance?: {
    catalogVersion: string;
    source: string;
  };
}

export interface GoldenEra {
  id: string;
  label: string;
  years: string;
  description: string;
  coverImage?: string;
  gradient: string;
  moodIds: number[];
}

export const GOLDEN_ERAS: readonly GoldenEra[] = [
  {
    id: "1950s",
    label: "Black & White Melody",
    years: "1950 – 1959",
    description: "Soulful acoustic arrangements, poetic Urdu-Hindi ghazals, and early cinematic romance.",
    gradient: "from-amber-900/40 via-amber-950/20 to-neutral-950",
    moodIds: [1, 2, 7],
  },
  {
    id: "1960s",
    label: "Golden Dawn",
    years: "1960 – 1969",
    description: "Orchestral summits of Shankar-Jaikishan, Naushad, Madan Mohan, and O.P. Nayyar.",
    gradient: "from-rose-950/40 via-amber-950/20 to-neutral-950",
    moodIds: [0, 4, 11],
  },
  {
    id: "1970s",
    label: "Technicolor Harmony",
    years: "1970 – 1979",
    description: "R.D. Burman grooves, Kishore-Lata peak duets, vibrant jazz-bossa influences.",
    gradient: "from-orange-950/40 via-amber-950/20 to-neutral-950",
    moodIds: [0, 5, 8],
  },
  {
    id: "1980s",
    label: "Retro Melancholy & Rhythm",
    years: "1980 – 1989",
    description: "Synthesizer ballads, soulful ghazals of Jagjit Singh, and disco-era anthems.",
    gradient: "from-teal-950/40 via-slate-950/20 to-neutral-950",
    moodIds: [3, 9, 10],
  },
] as const;

export interface MarathiSpotlightItem {
  id: string;
  title: string;
  category: "Bhavgeet" | "Natya Sangeet" | "Marathi Cinema" | "Lavani" | "Bhakti";
  artist: string;
  composer?: string;
  description: string;
  sampleTrackTitle?: string;
}

export const MARATHI_SPOTLIGHT: readonly MarathiSpotlightItem[] = [
  {
    id: "bhavgeet-roots",
    title: "Timeless Bhavgeet",
    category: "Bhavgeet",
    artist: "Sudhir Phadke, Lata Mangeshkar, Suresh Wadkar",
    composer: "Hridaynath Mangeshkar, Shanta Shelke",
    description: "Intimate poetic expressions of nature, nostalgia, and yearning set to exquisite classical ragas.",
    sampleTrackTitle: "Dolaanchya Panyaat",
  },
  {
    id: "natya-sangeet-grandeur",
    title: "Natya Sangeet Classics",
    category: "Natya Sangeet",
    artist: "Pt. Bhimsen Joshi, Vasantrao Deshpande",
    composer: "Bal Gandharva Traditions",
    description: "Dramatic semi-classical musical theatre compositions that defined Maharashtra's stage legacy.",
    sampleTrackTitle: "Ghei Chhand Makarand",
  },
  {
    id: "marathi-cinema-golden",
    title: "Golden Marathi Cinema",
    category: "Marathi Cinema",
    artist: "Asha Bhosle, Sudhir Phadke, Mahendra Kapoor",
    composer: "C. Ramchandra, Ram Kadam",
    description: "Classic songs from the golden age of Prabhat Film Company and rural drama masterworks.",
    sampleTrackTitle: "Airanichya Deva Tula",
  },
  {
    id: "abhang-bhakti",
    title: "Vitthal Bhakti & Abhang",
    category: "Bhakti",
    artist: "Pt. Bhimsen Joshi, Lata Mangeshkar",
    composer: "Sant Dnyaneshwar, Sant Tukaram",
    description: "Divine, soul-stirring hymns traversing the Pandharpur pilgrimage and saint poetry.",
    sampleTrackTitle: "Majhe Maher Pandhari",
  },
] as const;

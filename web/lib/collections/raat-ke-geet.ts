/**
 * Raat Ke Geet (रात के गीत)
 * Soft Bollywood melodies for quiet nights
 *
 * Curated late-night music collection sequenced as a 5-stage evening journey:
 * 1. Evening Transition (1-8): Dusk settling, sunset, winding down
 * 2. Soft Nostalgia (9-17): Golden memories, mellow acoustic rhythms
 * 3. Romantic Calm (18-29): Intimate night serenades, moonlit duets
 * 4. Deep Late-Night Mood (30-39): Contemplative, profound, solitary night thoughts
 * 5. Gentle Closing Tracks (40-49): Whisper-soft lullabies, peaceful sleep
 */

export interface RaatKeGeetTrackMeta {
  id: number;
  title: string;
  film: string;
  artists: string;
  stage: "Evening Transition" | "Soft Nostalgia" | "Romantic Calm" | "Deep Late-Night" | "Gentle Closing";
}

export interface SargamCollection {
  id: string;
  title: string;
  nativeTitle: string;
  subtitle: string;
  description: string;
  tags: string[];
  mood: string;
  songIds: number[];
  stages: {
    name: string;
    description: string;
    count: number;
  }[];
}

export const RAAT_KE_GEET: SargamCollection = {
  id: "raat-ke-geet",
  title: "Raat Ke Geet",
  nativeTitle: "रात के गीत",
  subtitle: "Soft Bollywood melodies for quiet nights",
  description:
    "A handpicked collection of mellow Bollywood melodies for slow evenings, quiet thoughts and peaceful nights.",
  tags: ["night", "unwind", "calm", "romantic", "nostalgic", "bollywood"],
  mood: "Late Night",
  stages: [
    {
      name: "Evening Transition",
      description: "Dusk settling and the slow unwinding of the day",
      count: 8,
    },
    {
      name: "Soft Nostalgia",
      description: "Golden memories and gentle acoustic rhythms",
      count: 9,
    },
    {
      name: "Romantic Calm",
      description: "Intimate night serenades and moonlit duets",
      count: 12,
    },
    {
      name: "Deep Late-Night Mood",
      description: "Contemplative, profound, and solitary night melodies",
      count: 10,
    },
    {
      name: "Gentle Closing",
      description: "Whisper-soft ballads and quiet lullabies for peaceful rest",
      count: 10,
    },
  ],
  songIds: [
    // 1. Evening Transition (Tracks 1 - 8)
    1960, // Kahin Door Jab Din Dhal (Anand)
    4068, // Woh Sham Kuchh Ajeeb Thi (Khamoshi)
    121,  // Aanewala Pal Janewala Hai (Golmaal)
    904,  // Deewana Hua Badal (Kashmir Ki Kali)
    3601, // Suno Kaho Suna (Aap Ki Kasam)
    3286, // Rimjhim Gire Sawan (Manzil)
    858,  // Chura Liya Hai Tumne Jo (Yaadon Ki Baaraat)
    1016, // Dil Ka Bhanwar Kare Pukar (Tere Ghar Ke Samne)

    // 2. Soft Nostalgia (Tracks 9 - 17)
    2729, // Musafir Hoon Yaron (Parichay)
    4290, // Zindagi Kaisi Hai Paheli (Anand)
    4292, // Zindagi Ke Safar Mein (Aap Ki Kasam)
    3162, // Raat Kali Ek Khwab Mein Aai (Buddha Mil Gaya)
    2152, // Kora Kagaz Tha Yeh Mann (Aradhana)
    3861, // Tum Aa Gaye Ho Noor Aa Gaya (Aandhi)
    3690, // Tere Bina Zindagi Se (Aandhi)
    1120, // Do Lafzon Ki Hai Dil Ki (The Great Gambler)
    2892, // O Mere Dil Ke Chain (Mere Jeevan Saathi)

    // 3. Romantic Calm (Tracks 18 - 29)
    783,  // Chaudhvin Ka Chand Ho (Chaudhvin Ka Chand)
    4210, // Yeh Raat Bheegi Bheegi (Chori Chori)
    104,  // Aaja Sanam Madhur Chandni (Chori Chori)
    916,  // Dekha Ek Khwab (Silsila)
    3243, // Rajnigandha Phool Tumhare (Rajnigandha)
    3717, // Tere Mere Milan Ki (Abhimaan)
    233,  // Abhi Na Jao Chhod Kar (Hum Dono)
    154,  // Aap Ki Nazron Ne Samjha (Anpadh)
    771,  // Chandan Sa Badan (Saraswatichandra)
    3103, // Pyar Hua Iqrar Hua (Shree 420)
    964,  // Dheere Dheere Chal Chand (Love Marriage)
    1833, // Jhilmil Sitaron Ka Angan (Jeevan Mrityu)

    // 4. Deep Late-Night Mood (Tracks 30 - 39)
    4213, // Yeh Raat Yeh Chandni (Jaal)
    828,  // Chingari Koi Bhadke (Amar Prem)
    2924, // O Saathi Re (Muqaddar Ka Sikandar)
    3858, // Tujhse Naraz Nahin Zindagi (Masoom)
    2506, // Mera Kuchh Samaan (Ijaazat)
    855,  // Chupke Chupke Raat Din (Ghazal Ka Safar)
    3879, // Tum Itna Jo Muskura Rahe Ho (Arth)
    2027, // Karoge Yaad To (Bazaar)
    1963, // Kahin Karti Hogi Woh Mera (Phir Kab Milogi)
    3297, // Roop Tera Mastana (Aradhana)

    // 5. Gentle Closing Tracks (Tracks 40 - 49)
    2203, // Lag Ja Gale Se Phir (Woh Kaun Thi)
    3910, // Tum Pukar Lo Tumhara (Khamoshi)
    4039, // Waqt Ne Kiya Kya Haseen (Kaagaz Ke Phool)
    1593, // Humne Dekhi Hai Un Ankhon (Khamoshi)
    2518, // Mera Saaya Saath Hoga (Mera Saaya)
    2163, // Kuchh Dil Ne Kaha Kuchh (Anupama)
    584,  // Beeti Na Bitai Raina (Parichay)
    745,  // Chand Akela Jaye Sakhi Ri (Alaap)
    95,   // Aaja Piya Tohe Pyar Doon (Baharon Ke Sapne)
    1783, // Jane Woh Kaise Log The (Pyaasa)
  ],
};

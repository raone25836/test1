/**
 * Centralized Birthday Experience Configuration for Lalee Patle
 * Edit this file to customize the content, dates, letters, cards, and photos.
 */

export interface BirthdayLetter {
  title: string;
  salutation: string;
  paragraphs: string[];
  signOff: string;
  senderName: string;
  audioTrackTitle: string;
}

export interface AppreciationCard {
  id: string;
  title: string;
  hinglishQuote: string;
  englishSubtext: string;
  category: 'friendship' | 'vibes' | 'growth' | 'strength';
  emoji: string;
  accentColor: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  illustrationType: 'starlight' | 'chai' | 'sunset' | 'books' | 'bloom' | 'laughter';
  alt: string;
  realPhotoUrl?: string; // Optional real photo override path
  yearTag: string;
}

export interface PrivateMemory {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  tags: string[];
}

export interface BirthdayConfig {
  recipientName: string;
  nickname: string;
  birthDay: number;
  birthMonth: number;
  timezone: string;
  headline: string;
  subheadline: string;
  letter: BirthdayLetter;
  appreciationCards: AppreciationCard[];
  gallery: GalleryItem[];
  defaultMemories: PrivateMemory[];
  theme: {
    blushPink: string;
    softLavender: string;
    warmIvory: string;
    midnightNavy: string;
    roseAccent: string;
    champagneGold: string;
  };
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  recipientName: "Lalee Patle",
  nickname: "Lalee",
  birthDay: 23,
  birthMonth: 11,
  timezone: "Asia/Kolkata",
  headline: "To Lalee, Wishing You Magic Today & Always",
  subheadline: "A gentle celebration of an incredible best friend who brings warmth, laughter, and genuine goodness wherever she goes.",
  
  letter: {
    title: "A Heartfelt Letter For My Best Friend",
    salutation: "Dearest Lalee,",
    paragraphs: [
      "Happy Birthday! Har saal ek din aisa aata hai jab hum ruk kar un logon ko celebrate karte hain jo hamari life ko sach mein behtar aur peaceful banate hain. Aur mere liye, wo insaan hamesha tu rahi hai.",
      "Teri friendship meri life ka ek aisa constant hai jisne bina shor machaye hamesha support diya hai. Chahe kitni bhi random batein ho, silly jokes ho, ya serious life decisions — tera presence hamesha ek reassuring comfort deta hai. Kabhi kabhi lagta hai sab kuch tezi se badal raha hai, par teri genuine nature aur warmth hamesha waisi hi rehti hai.",
      "Mujhe teri jo baat sabse zyada admire karne layak lagti hai, wo hai tera calm confidence aur tera honest nazariya. Tu jaisi hai, waisi hi bina kisi show-off ke rehti hai — aur aaj ke time mein itna real hona sach mein rare hai.",
      "Is naye saal mein, meri dil se dua hai ki tujhe wo har cheez mile jiske liye tu quietly mehnat karti hai. I wish you sound peace of mind, strong health, unstoppable confidence, and boundless happiness. May every small effort turn into meaningful success, and may every morning bring a fresh sense of excitement and clarity.",
      "Hamesha aisi hi muskurati rehna, apni pace pe aage badhna, aur khud par vishwas rakhna. You deserve the very best this world has to offer.",
    ],
    signOff: "Always cheering for you,",
    senderName: "Your Best Friend",
    audioTrackTitle: "Dreamy Celestial Melody",
  },

  appreciationCards: [
    {
      id: "card-1",
      title: "Genuinely Special",
      hinglishQuote: "Teri friendship meri life ka ek genuinely special aur peaceful part hai.",
      englishSubtext: "Your genuine nature is a rare gift that makes everyone around you feel valued.",
      category: "friendship",
      emoji: "✨",
      accentColor: "#F6C8D5",
    },
    {
      id: "card-2",
      title: "Peace & Grounding",
      hinglishQuote: "Chahe kitni bhi chaos ho, tere saath baat karke sab grounded aur clear lagne lagta hai.",
      englishSubtext: "A true friend whose calm presence turns overwhelming days into peaceful moments.",
      category: "vibes",
      emoji: "🌙",
      accentColor: "#DCD3FA",
    },
    {
      id: "card-3",
      title: "Individuality",
      hinglishQuote: "Tu hamesha apni individuality aur quiet confidence ke saath aage badhti rahe.",
      englishSubtext: "Never dim your spark. Your authenticity is your greatest superpower.",
      category: "strength",
      emoji: "🌸",
      accentColor: "#D88BA5",
    },
    {
      id: "card-4",
      title: "Brightest Energy",
      hinglishQuote: "Tera smile aur sense of humor kisi bhi gloomy situation ko light-hearted bana deta hai.",
      englishSubtext: "Thank you for the spontaneous laughter and easy conversations.",
      category: "vibes",
      emoji: "☀️",
      accentColor: "#D9BD83",
    },
    {
      id: "card-5",
      title: "Growth & Dreams",
      hinglishQuote: "I hope tera aane wala year new opportunities, wisdom aur achievements se bhara ho.",
      englishSubtext: "May every goal you set this year unlock doors you didn't even know existed.",
      category: "growth",
      emoji: "🚀",
      accentColor: "#F6C8D5",
    },
    {
      id: "card-6",
      title: "The Best Listener",
      hinglishQuote: "Bina kisi judgement ke sunna aur samjhna — ye quality har kisi mein nahi hoti.",
      englishSubtext: "Knowing you have my back without needing a thousand words means everything.",
      category: "friendship",
      emoji: "🤍",
      accentColor: "#DCD3FA",
    },
    {
      id: "card-7",
      title: "Resilience",
      hinglishQuote: "Mushkil dino mein bhi tu jis patience ke saath handle karti hai, that is truly inspiring.",
      englishSubtext: "Your silent grace through tough times is a quiet masterclass in dignity.",
      category: "strength",
      emoji: "🛡️",
      accentColor: "#D88BA5",
    },
    {
      id: "card-8",
      title: "Celebration",
      hinglishQuote: "Aaj ka din sirf tera hai — treat yourself, celebrate fully aur khul kar khush rehna!",
      englishSubtext: "Eat the sweetest cake, make the grandest wish, and enjoy every second.",
      category: "growth",
      emoji: "🎂",
      accentColor: "#D9BD83",
    },
  ],

  gallery: [
    {
      id: "photo-1",
      title: "Under The Starlight Sky",
      caption: "A peaceful evening under a canopy of stars — representing the calm conversations and shared dreams.",
      illustrationType: "starlight",
      alt: "Dreamy night sky with glowing stars and crescent moon illustration",
      yearTag: "Dreamy Moment",
    },
    {
      id: "photo-2",
      title: "Chai & Endless Conversations",
      caption: "Steaming cups of tea and unending talks about life, aspirations, and silly theories.",
      illustrationType: "chai",
      alt: "Warm teacup illustration with gentle steam and cosy ambience",
      yearTag: "Comfort Vibes",
    },
    {
      id: "photo-3",
      title: "Golden Hour Glow",
      caption: "Gentle golden light hitting the horizon, reminding us that every day has quiet beauty.",
      illustrationType: "sunset",
      alt: "Gentle pastel sunset illustration with soft rose and gold clouds",
      yearTag: "Golden Glow",
    },
    {
      id: "photo-4",
      title: "Quiet Ambition & Learning",
      caption: "Focusing on personal growth, reading, and quietly building an inspiring future.",
      illustrationType: "books",
      alt: "Stack of books and delicate wild flowers illustration",
      yearTag: "Growth",
    },
    {
      id: "photo-5",
      title: "Blossoming Confidence",
      caption: "Soft flower petals opening up, just like the effortless confidence you carry each day.",
      illustrationType: "bloom",
      alt: "Pastel botanical bloom illustration with rose and lavender hues",
      yearTag: "Grace",
    },
    {
      id: "photo-6",
      title: "Pure Joy & Warmth",
      caption: "The spontaneous giggles and inside jokes that turn ordinary days into memories.",
      illustrationType: "laughter",
      alt: "Whimsical sparkles and glowing lanterns illustration",
      yearTag: "Joy",
    },
  ],

  defaultMemories: [
    {
      id: "mem-1",
      title: "The Unwavering Support Pact",
      date: "Forever & Always",
      category: "Promise",
      content: "Ek simple reminder: chahe life kitni bhi busy ho ya distances kitne bhi ho, tu jab bhi call karegi, I will always be there to listen, laugh, and back you up 100%.",
      tags: ["friendship", "promise", "bestfriend"],
    },
    {
      id: "mem-2",
      title: "Quiet Victories You Overlooked",
      date: "Reflections",
      category: "Appreciation",
      content: "Kabhi kabhi hum khud ki progress notice nahi karte, par maine dekha hai tune pichle saalo mein kitna gracefully tough phases ko face kiya hai. Be very proud of who you are.",
      tags: ["growth", "pride", "resilience"],
    },
    {
      id: "mem-3",
      title: "Future Travel & Bucket List Wish",
      date: "Upcoming Adventures",
      category: "Dreams",
      content: "Ek lambi trip pending hai! Someday to the mountains or a quiet seaside where we can sit with tea, enjoy the cold breeze, and talk for hours without looking at any clock.",
      tags: ["travel", "bucketlist", "future"],
    },
  ],

  theme: {
    blushPink: "#F6C8D5",
    softLavender: "#DCD3FA",
    warmIvory: "#FFF8F0",
    midnightNavy: "#171A35",
    roseAccent: "#D88BA5",
    champagneGold: "#D9BD83",
  },
};

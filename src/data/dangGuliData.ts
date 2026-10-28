export interface DangStick {
  id: string;
  nameBn: string;
  nameEn: string;
  woodType: string;
  power: number; // 50 - 120
  sweetSpotWindow: number; // 0.8 - 1.4 multiplier
  description: string;
  unlockCost: number; // in kaathi
  badge: string;
  color: string;
  accentColor: string;
}

export interface GuliType {
  id: string;
  nameBn: string;
  nameEn: string;
  description: string;
  weight: number; // 0.8 - 1.3
  aerodynamics: number; // 0.8 - 1.3
  bounce: number; // 0.7 - 1.4
  scoreMultiplier: number;
  unlockCost: number;
  badge: string;
  color: string;
}

export const DANG_STICKS: DangStick[] = [
  {
    id: "bamboo",
    nameBn: "বাঁশের কঞ্চি",
    nameEn: "Bamboo Twig",
    woodType: "দেশি বাঁশঝাড়ের কঞ্চি",
    power: 70,
    sweetSpotWindow: 1.3, // easy timing
    description: "গ্রামের বাড়ির পেছনের বাঁশঝাড় থেকে কাটা তাজা কঞ্চি। হালকা ও দ্রুত সুইং, শুরু করার জন্য দারুণ!",
    unlockCost: 0,
    badge: "শুরুর হাতিয়ার",
    color: "#84cc16",
    accentColor: "#4d7c0f",
  },
  {
    id: "kadam",
    nameBn: "পাকা কদম ডাল",
    nameEn: "Kadam Branch",
    woodType: "পাকা কদম গাছ",
    power: 85,
    sweetSpotWindow: 1.15,
    description: "নরম কিন্তু টানটান আঁশের ডাল। চমৎকার ব্যালেন্স এবং শটে ভালো ফ্লাইট পাওয়া যায়।",
    unlockCost: 350,
    badge: "পুকুরপাড়ের স্পেশাল",
    color: "#f59e0b",
    accentColor: "#b45309",
  },
  {
    id: "mehogani",
    nameBn: "মেহগনি কাঠের ডাং",
    nameEn: "Mahogany Bat",
    woodType: "পাকা লাল মেহগনি",
    power: 105,
    sweetSpotWindow: 1.0,
    description: "সুতার শক্ত বাঁধন দেওয়া খাঁটি মেহগনি লাঠি। ভারী শট, একবার লাগলে সরিষা ক্ষেত পার!",
    unlockCost: 900,
    badge: "বটতলার পাওয়ারহিটার",
    color: "#b91c1c",
    accentColor: "#7f1d1d",
  },
  {
    id: "babla",
    nameBn: "রাজকীয় বাবলা কাঠের ডাং",
    nameEn: "Royal Babla Stick",
    woodType: "কঠিন বাবলা কাঠ",
    power: 125,
    sweetSpotWindow: 0.9, // tighter timing, immense power
    description: "গ্রামের সবচেয়ে শক্ত ও টেকসই কাঠ। কিংবদন্তি শটের সাথে আকাশে সোনালী আলোর ঝিলিক!",
    unlockCost: 2000,
    badge: "ইউনিয়ন চ্যাম্পিয়ন",
    color: "#d97706",
    accentColor: "#92400e",
  },
];

export const GULI_TYPES: GuliType[] = [
  {
    id: "shimul",
    nameBn: "শিমুল কাঠের নরম গুলি",
    nameEn: "Shimul Wood Guli",
    description: "হালকা তুলার মতো শিমুল কাঠ। বাতাসে ভেসে বেশি দূর যেতে ভালোবাসে।",
    weight: 0.85,
    aerodynamics: 1.25,
    bounce: 0.85,
    scoreMultiplier: 1.0,
    unlockCost: 0,
    badge: "হালকা পালক",
    color: "#e2e8f0",
  },
  {
    id: "mehogani_guli",
    nameBn: "চোখা মেহগনি গুলি",
    nameEn: "Sharp Mahogany Guli",
    description: "দুই মাথায় ধারালো চোখা। বাতাসের বুক চিরে বুলেটের গতিতে সোজা ছুটে চলে।",
    weight: 1.0,
    aerodynamics: 1.1,
    bounce: 1.1,
    scoreMultiplier: 1.2,
    unlockCost: 450,
    badge: "বুলেট স্পিড",
    color: "#9a3412",
  },
  {
    id: "tetul",
    nameBn: "তেঁতুল কাঠের শক্ত গুট্টি",
    nameEn: "Hard Tamarind Guli",
    description: "প্রচণ্ড ভারী ও পাথরের মতো শক্ত কাঠ। মাটিতে ড্রপ খেয়ে লাফিয়ে লাফিয়ে অনেক দূর যায়!",
    weight: 1.2,
    aerodynamics: 0.95,
    bounce: 1.45,
    scoreMultiplier: 1.5,
    unlockCost: 1200,
    badge: "সুপার বাউন্সার",
    color: "#78350f",
  },
  {
    id: "golden_guli",
    nameBn: "ম্যাজিক সোনালী গুট্টি",
    nameEn: "Golden 90s Guli",
    description: "নব্বইয়ের দশকের রূপালী-সোনালী রাংতায় মোড়ানো বিশেষ গুলি। প্রতিটি বাড়ি দ্বিগুণ কাঠি এনে দেয়!",
    weight: 1.05,
    aerodynamics: 1.3,
    bounce: 1.3,
    scoreMultiplier: 2.0,
    unlockCost: 2500,
    badge: "নস্টালজিক গোল্ড",
    color: "#eab308",
  },
];

export interface VillageFielder {
  id: string;
  nameBn: string;
  nameEn: string;
  avatar: string;
  positionX: number; // distance in kaathi where they stand
  catchRadius: number; // catching hit-box
  catchChance: number; // 0.0 - 1.0
  taunt: string;
  cheer: string;
}

export const VILLAGE_FIELDERS: VillageFielder[] = [
  {
    id: "kashem",
    nameBn: "দৌড়বাজ কাশেম",
    nameEn: "Runner Kashem",
    avatar: "🏃‍♂️",
    positionX: 85,
    catchRadius: 22,
    catchChance: 0.35,
    taunt: "এই কাশেমের হাত থেকে গুলি ফস্কানো অসম্ভব!",
    cheer: "ধুর ছাই! মাথার ওপর দিয়ে চলে গেল!",
  },
  {
    id: "boltu",
    nameBn: "ভোলাভালা বল্টু",
    nameEn: "Butterfingers Boltu",
    avatar: "🧒",
    positionX: 160,
    catchRadius: 28,
    catchChance: 0.18, // drops often!
    taunt: "আমি ধরছি! আমি ধরছি... আরে গেল কই?!",
    cheer: "উফ হাত ফস্কে পড়ে গেল রে ভাই!",
  },
  {
    id: "sentu",
    nameBn: "লম্বা সেন্টু",
    nameEn: "Tall Sentu",
    avatar: "🧍‍♂️",
    positionX: 240,
    catchRadius: 32,
    catchChance: 0.4,
    taunt: "বাঁশঝাড়ের সামনে আমি একাই দেয়াল!",
    cheer: "কী গায়ের জোর রে বাপু! রকেটের মতো ছুটলো!",
  },
];

export const NOSTALGIC_COMMENTARY = {
  perfectHit: [
    "ঠাস্! কী মারলি রে ভাই! পুরা ইউনিয়ন পরিষদ কাঁপিয়ে দিলি!",
    "অসাধারণ সুইট-স্পট শট! গুলি একদম মেঘের দেশে!",
    "বটগাছ পার! সরিষা ক্ষেত পার! একেই বলে নব্বইয়ের খাঁটি বাড়ি!",
    "আরে আরে! সেন্টু লাফিয়েও নাগাল পেল না! ছক্কা!",
  ],
  goodHit: [
    "সুন্দর টোকা দিয়ে নিখুঁত উড়াল! অনেক দূর যাচ্ছে গুলি!",
    "বাতাস অনুকূলে আছে! চমৎকার ট্র্যাজেক্টরি!",
    "গ্রামের পোলাপান হাঁ করে তাকিয়ে দেখছে শটের বহর!",
  ],
  weakHit: [
    "একটু আর্লি লেগে গেল! তাও মাটির উপর দিয়ে গড়িয়ে যাচ্ছে।",
    "মিস হয়েও বেঁচে গেল! কাঠি মেপে কিছু পয়েন্ট তো আসবেই!",
    "ডাংয়ের গোড়ায় লেগেছে, তবে মাটি কামড়ে ভালো দূরত্ব পাবে!",
  ],
  whiff: [
    "ইশশ! বাতাস কেটে বের হয়ে গেল ডাং! ফসকে গেল!",
    "টাইমিং ভুল! পোলাপান হাসাহাসি শুরু করে দিল রে!",
    "ধুলো উড়িয়ে মিস! পরের বলে সজোরে চোখ রাখিস!",
  ],
  caught: [
    "হায় হায়! কাশেম উড়ন্ত ডাইভ দিয়ে লুফে নিল!",
    "ক্যাচ আউট রে ভাই! এবারের ইনিংস এখানেই শেষ!",
    "ফিল্ডারের সোজা হাতে দিয়ে দিলি! ব্যাস, শূন্য পয়েন্ট!",
  ],
  bounceTinRoof: [
    "টিনের চালে ঢিল পড়ার মতো বিকট ঠনঠন আওয়াজ! চাচী বের হয়ে বকা দিচ্ছে!",
    "টিনের চালে ড্রপ খেয়ে গুলি আরও ৫০ কাঠি এগিয়ে গেল!",
  ],
  bouncePond: [
    "পুকুরের পানিতে ব্যাঙের মতো স্কিম করে লাফিয়ে উঠল!",
    "শাপলা পাতার ওপর দিয়ে বাউন্স! দুর্দান্ত জলকৌশল!",
  ],
  milestones: [
    { distance: 50, title: "মাঠ পার!", subtitle: "স্কুল মাঠের সীমানা ছাড়াল" },
    { distance: 100, title: "সরিষা ক্ষেত পেরিয়ে!", subtitle: "হলুদ ফুলের ঢেউয়ে হারাল গুলি" },
    { distance: 200, title: "বাঁশঝাড় ও বটগাছ পার!", subtitle: "গ্রামের সীমানা কেঁপে উঠল" },
    { distance: 350, title: "ইউনিয়ন পরিষদের মেঠো পথ!", subtitle: "ঐতিহাসিক মহা-শট!" },
    { distance: 500, title: "নব্বইয়ের অমর কিংবদন্তি!", subtitle: "গ্রামের ইতিহাসের সর্বকালের সেরা বাড়ি!" },
  ],
};

// Traditional counting chants in rural Bengal
export const KAATHI_CHANTS = [
  "এক (Ek)",
  "দুই (Dui)",
  "তিন (Tin)",
  "চার (Char)",
  "পাঁচ (Panch)",
  "কাঠি (Kaathi)",
  "মাছ (Maachh)",
  "ঝিক (Jhik)",
  "টিন (Tin)",
  "দশ (Dosh)",
];

export const NOSTALGIC_RULES_LORE = {
  titleBn: "ডাংগুলি খেলার নিয়ম ও নব্বইয়ের স্মৃতি",
  titleEn: "Rules & 90s Village Heritage of Dang Guli",
  intro:
    "নব্বইয়ের দশকে গ্রামীণ বাংলায় বিকেল মানেই ছিল মেঠো পথ আর ধুলোবালির মাঠে ডাংগুলির তুমুল উত্তেজনা। কাঠমিস্ত্রির দোকান থেকে চেয়ে আনা শক্ত কাঠের চোখা টুকরো দিয়ে বানানো হতো 'গুলি', আর গাছের ডাল কেটে তৈরি হতো 'ডাং'।",
  steps: [
    {
      num: "১",
      title: "ঘোপ কাটা ও গুলি বসানো (The Ghop)",
      text: "মাটিতে প্রায় এক বিঘত লম্বা একটা গর্ত বা ঘোপ খোঁড়া হয়। তার ওপর গুলিটি আড়াআড়ি বা কাত করে বসানো থাকে।",
    },
    {
      num: "২",
      title: "টুপ বা টোকা দেওয়া (The Tip)",
      text: "ডাংয়ের এক মাথা দিয়ে গুলির চোখা অংশে আলতো বা সূক্ষ্মভাবে খোঁচা দিলে গুলি শূন্যে চক্রাকারে লাফিয়ে ওঠে।",
    },
    {
      num: "৩",
      title: "উড়ন্ত গুলিতে বাড়ি মারা (The Whack)",
      text: "গুলি যখন শূন্যে বুক সমান উচ্চতায় ভাসছে, ঠিক সেই মুহূর্তে চোখের পলকে ডাং দিয়ে সজোরে আঘাত করতে হয়। নিখুঁত সুইট-স্পটে লাগলে শব্দ হয় 'ঠাস্!' আর গুলি ছুটে যায় শত কাঠি দূরে।",
    },
    {
      num: "৪",
      title: "ফিল্ডিং ও ক্যাচ আউট (Fielding)",
      text: "বিপক্ষ দলের খেলোয়াড়রা (কাশেম, বল্টু, সেন্টুরা) মাঠে দাঁড়িয়ে থাকে। গুলি মাটিতে পড়ার আগে শূন্যে লুফে নিতে পারলে ব্যাটার আউট!",
    },
    {
      num: "৫",
      title: "কাঠি মেপে রান গণনা (Measuring in Kaathi)",
      text: "গুলি যেখানে গিয়ে থামে, ঘোপ থেকে সেই পর্যন্ত ডাং লাঠিটি দিয়ে মেপে মেপে সংখ্যা গোনা হয়— 'এক, দুই, তিন, চার, কাঠি, মাছ, ঝিক...'। যত কাঠি, তত পয়েন্ট!",
    },
  ],
  slangs: [
    { word: "ঘোপ (Ghop)", meaning: "মাটিতে খোঁড়া ছোট গর্ত" },
    { word: "কাঠি (Kaathi)", meaning: "ডাং লাঠির মাপ (১ কাঠি = ১ ডাং দৈর্ঘ্য)" },
    { word: "৪ কাঠি (Char Kaathi)", meaning: "নব্বইয়ের গ্রামীণ নিয়মে বৈধ বাড়ির ন্যূনতম মাপ। ৪ কাঠি পার না হলে শট ব্যর্থ বা খসানি গণ্য হতো!" },
    { word: "চুট / বাড়ি (Chut / Baari)", meaning: "সজোরে ডাং দিয়ে গুলির ওপর আঘাত" },
    { word: "ঝিক (Jhik)", meaning: "ঐতিহ্যবাহী গণনার বিশেষ সংখ্যা" },
    { word: "টুপ (Tup)", meaning: "গুলি শূন্যে তোলার প্রাথমিক আলতো আঘাত" },
  ],
};


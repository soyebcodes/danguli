import { type RouteOption } from "@/data/routes";

export const refusalExcuses = [
  "পাহাড়তলী যাইতাম না, ভাই! গ্যারেজের ভেতর ঠেকাইয়া দিছি।",
  "গ্যারেজে জমা দেয়ার টাইম হইয়া গ্যাছে, এখন বাহিরে যামু না!",
  "আজকে রোদে চামচা খাইছে, তোরে কইতেও পারি না।",
  "বাজারের গাড়ি রিজার্ভ, সবার আগে কাঁচা পাটাতনই লাগে।",
  "চালক বদলে গেছে, নতুন মামার নেশা নাই, দুঃখিত।",
  "এই স্ট্রিটে পানি উঠছে, রিকশা নামাইতে বেজায় কষ্ট হয়।",
  "আমার পায়ে ব্যথা, আজকে পা ছিল না — পরে আসবো, ঠিক আছে?",
  "মামু, আজকে ট্যাক্সি চাপে, রিকশা নাকি খালি ফাঁকা পোদডা!",
] as const;

const routeSpecificExcuses: Record<RouteOption, string[]> = {
  "Farmgate → Dhanmondi 27": [
    "ফার্মগেটে আজকে গাড়ি কম, সোনার দাম না, তাই ভিজিটর ভিন্ডো বন্ধ।",
    "ফার্মগেটের ব্যস্ততা দেখে রিকশা কইছে, আজ ওলাইতে পারমু না, ভাই।",
  ],
  "GEC → 2 No. Gate": [
    "জিসি সি-র দিকেই রোদে চামচা, তাই আজকে ২ নং গেটের পথে মাইরি নাই।",
    "এখানে জামার ভীড়, রিকশা হাতে বাঁচে না, দোস্ত, পরে আসি।",
  ],
  "Mirpur 10 → Gulshan 2": [
    "মিরপুরের রোডে আজকে রাস্তা বেহাল, তাই Gulshan-এর পথে নিড়ানি লাগে না।",
    "মিরপুর ১০ থেকে Gulshan ২-এর ভিড়ে রিকশা নৌকা বোধ হয়, আজ নাই।",
  ],
  "Badda → Uttara": [
    "বাড্দা ছুটছে, উত্তরায় প্রবেশে কষ্ট, তাই আজ ঘুরে আসি।",
    "এখানে সারি লম্বা, তাই দেরি হলে লুঙ্গি খানা দাগায় না।",
  ],
  "Khulna → Jessore": [
    "খুলনা মাঠে গাড়ি নাই, জেসোরের দিকে ফাঁকা নট, তাই আজ বের হইতে পারি না।",
    "দীর্ঘ পথে পা ঝাঁপায়, তাই এখন রিকশা কিল্লা ফেলে দে।",
  ],
  "Motijheel → Rampura": [
    "মোটিজেহেলের দাপট দেখে রিকশা শিরদাঁড়া নড়াইয়া দেয়, তাই আজ না।",
    "কোম্পানির শিফট শেষেRampura-র রাস্তা খালি নাই, সেজন্য করুণা নাই।",
  ],
};

export type RefusalExcuse = (typeof refusalExcuses)[number];

export function getRandomExcuseForRoute(route: RouteOption): string {
  const routeBank = routeSpecificExcuses[route] ?? refusalExcuses;
  const pickFromRoute = routeBank[Math.floor(Math.random() * routeBank.length)];

  if (pickFromRoute) {
    return pickFromRoute;
  }

  return refusalExcuses[Math.floor(Math.random() * refusalExcuses.length)];
}

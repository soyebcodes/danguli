import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ডাংগুলি ১৯৯০ | Dang Guli 1990 - 90s Village Childhood Game",
    template: "%s | ডাংগুলি ১৯৯০",
  },
  description:
    "নব্বইয়ের দশকের খাঁটি গ্রামীণ বাংলার ডাংগুলি খেলা। টুপ মারো, সজোরে বাড়ি হাঁকাও আর সরিষা ক্ষেত ছাড়িয়ে কাঠি মেপে রেকর্ড গড়ো!",
  applicationName: "Dang Guli 1990",
  keywords: [
    "dang guli",
    "ডাংগুলি",
    "bangladeshi 90s game",
    "village childhood games",
    "nostalgic bangla game",
    "guli danda",
  ],
  openGraph: {
    title: "ডাংগুলি ১৯৯০: গ্রামীণ স্মৃতি",
    description:
      "নব্বইয়ের দশকের নস্টালজিক গ্রামীণ খেলা— টুপ মেরে শূন্যে ভাসাও, সজোরে বাড়ি দিয়ে বটগাছ ও সরিষা ক্ষেত পার করো!",
    type: "website",
    siteName: "Dang Guli 1990",
  },
  twitter: {
    card: "summary_large_image",
    title: "ডাংগুলি ১৯৯০: গ্রামীণ স্মৃতি",
    description:
      "নব্বইয়ের দশকের খাঁটি গ্রামীণ বাংলার ডাংগুলি খেলা।",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

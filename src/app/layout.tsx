import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Amader Rickshaw Mama",
    template: "%s | Amader Rickshaw Mama",
  },
  description:
    "A cinematic Bangladeshi rickshaw refusal simulator with lane chaos, fare battles, and street-level strategy.",
  applicationName: "Amader Rickshaw Mama",
  keywords: [
    "rickshaw game",
    "Bangladesh",
    "refusal simulator",
    "street strategy",
    "interactive fiction",
  ],
  openGraph: {
    title: "Amader Rickshaw Mama",
    description:
      "A polished, atmospheric refusal simulator about surviving the chaos of Dhaka traffic.",
    type: "website",
    siteName: "Amader Rickshaw Mama",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amader Rickshaw Mama",
    description:
      "A high-energy Bangladeshi rickshaw refusal simulator with style, crowd pressure, and route strategy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

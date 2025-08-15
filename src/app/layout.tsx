import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://animegachapulse.com'),
  title: {
    default: "Anime Gacha Pulse - L'actualité des jeux Gacha par des passionnés",
    template: "%s | Anime Gacha Pulse"
  },
  description: "Anime Gacha Pulse est LE site d'actualités pour les fans de jeux Gacha. Guides experts, tier lists, événements et dernières news sur Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !",
  keywords: [
    "gacha", "jeux gacha", "genshin impact", "honkai star rail", "fire emblem heroes",
    "arknights", "blue archive", "epic seven", "actualités gaming", "guides jeux",
    "tier list", "événements gacha", "bannières", "pulls", "héros"
  ],
  authors: [{ name: "Équipe Anime Gacha Pulse" }],
  creator: "Anime Gacha Pulse",
  publisher: "Anime Gacha Pulse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://animegachapulse.com",
    siteName: "Anime Gacha Pulse",
    title: "Anime Gacha Pulse - L'actualité des jeux Gacha par des passionnés",
    description: "Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris. Par des fans, pour les fans.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anime Gacha Pulse - Actualités jeux Gacha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Gacha Pulse - L'actualité des jeux Gacha",
    description: "Guides experts, tier lists et actualités sur tous vos jeux Gacha favoris",
    images: ["/og-image.jpg"],
    creator: "@animegachapulse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSans3.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

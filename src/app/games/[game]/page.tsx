import { Metadata } from "next"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { GameHeader } from "@/components/games/GameHeader"
import { getArticlesByGame } from "@/lib/data-access"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load du composant lourd
const GameTabs = dynamic(
  () => import("@/components/games/GameTabs").then(mod => ({ default: mod.GameTabs })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-8 mt-2">
        <Skeleton className="h-10 w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }
)

interface GamePageProps {
  params: Promise<{ game: string }>
}

// Données des jeux supportés
const gamesData = {
  "genshin-impact": {
    name: "Genshin Impact",
    description: "RPG open-world avec système gacha développé par miHoYo",
    genre: "Action RPG",
    platform: "Mobile, PC, PlayStation",
    developer: "miHoYo",
    releaseDate: "2020",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600",
    logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=100",
    isPopular: true,
    tags: ["Gacha", "Open World", "Anime", "Co-op"],
    officialSite: "https://genshin.hoyoverse.com",
    wiki: "https://genshin-impact.fandom.com"
  },
  "honkai-star-rail": {
    name: "Honkai Star Rail",
    description: "RPG au tour par tour spatial avec système gacha",
    genre: "Turn-based RPG",
    platform: "Mobile, PC",
    developer: "miHoYo",
    releaseDate: "2023",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=600",
    logoUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=100",
    isPopular: true,
    tags: ["Gacha", "Turn-based", "Sci-Fi", "Story-rich"],
    officialSite: "https://hsr.hoyoverse.com",
    wiki: "https://honkai-star-rail.fandom.com"
  },
  "bleach-soul-resonance": {
    name: "Bleach Soul Resonance",
    description: "Action RPG basé sur l'anime Bleach",
    genre: "Action RPG",
    platform: "Mobile",
    developer: "KLab",
    releaseDate: "2024",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600",
    logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=100",
    isPopular: false,
    tags: ["Gacha", "Anime", "Action", "PvP"],
    officialSite: "#",
    wiki: "#"
  },
  "fire-emblem-heroes": {
    name: "Fire Emblem Heroes",
    description: "Stratégie tactique mobile",
    genre: "Tactical RPG",
    platform: "Mobile",
    developer: "Nintendo",
    releaseDate: "2017",
    imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600",
    logoUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=100",
    isPopular: true,
    tags: ["Gacha", "Strategy", "Nintendo", "Tactical"],
    officialSite: "https://fire-emblem-heroes.com",
    wiki: "https://feheroes.fandom.com"
  },
  "arknights": {
    name: "Arknights",
    description: "Tower defense stratégique",
    genre: "Tower Defense",
    platform: "Mobile, PC",
    developer: "Hypergryph",
    releaseDate: "2019",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600",
    logoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=100",
    isPopular: true,
    tags: ["Gacha", "Tower Defense", "Strategy", "Anime"],
    officialSite: "https://www.arknights.global",
    wiki: "https://arknights.fandom.com"
  }
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { game: gameSlug } = await params
  const gameData = gamesData[gameSlug as keyof typeof gamesData]
  
  if (!gameData) {
    return {
      title: "Jeu non trouvé",
      description: "Le jeu demandé n'existe pas."
    }
  }

  return {
    title: `${gameData.name} - Actualités et Guides | GachaActu`,
    description: `Découvrez toutes les actualités, guides et tier lists de ${gameData.name}. ${gameData.description}`,
    openGraph: {
      title: `${gameData.name} - GachaActu`,
      description: gameData.description,
      type: "website",
      images: gameData.imageUrl ? [{ url: gameData.imageUrl }] : [],
    },
    keywords: [gameData.name, ...gameData.tags, "actualités", "guides", "tier list"].join(", "),
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { game: gameSlug } = await params
  const gameData = gamesData[gameSlug as keyof typeof gamesData]
  
  if (!gameData) {
    notFound()
  }

  // Récupération des articles pour ce jeu avec cache optimisé
  const gameArticles = await getArticlesByGame(gameData.name, 20)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": gameData.name,
    "description": gameData.description,
    "genre": gameData.genre,
    "gamePlatform": gameData.platform,
    "publisher": {
      "@type": "Organization",
      "name": gameData.developer
    },
    "datePublished": gameData.releaseDate,
    "image": gameData.imageUrl,
    "url": `https://gachaactu.com/games/${gameSlug}`,
    "aggregateRating": gameData.isPopular ? {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "bestRating": "5",
      "ratingCount": "1000"
    } : undefined
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GameHeader game={gameData} />
      <GameTabs game={gameData} articles={gameArticles} />
    </>
  )
}

// Générer les pages statiques pour les jeux principaux
export async function generateStaticParams() {
  return Object.keys(gamesData).map((gameSlug) => ({
    game: gameSlug,
  }))
}
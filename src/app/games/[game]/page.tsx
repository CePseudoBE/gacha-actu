import { Metadata } from "next"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { GameHeader } from "@/components/games/GameHeader"
import { getArticlesByGame, getGameBySlug } from "@/lib/data-access"
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

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { game: gameSlug } = await params
  const gameData = await getGameBySlug(gameSlug)
  
  if (!gameData) {
    return {
      title: "Jeu non trouvé",
      description: "Le jeu demandé n'existe pas."
    }
  }

  return {
    title: `${gameData.name} - Actualités et Guides | Anime Gacha Pulse`,
    description: `Découvrez toutes les actualités, guides et tier lists de ${gameData.name}. ${gameData.description}`,
    openGraph: {
      title: `${gameData.name} - Anime Gacha Pulse`,
      description: gameData.description,
      type: "website",
      images: gameData.imageUrl ? [{ url: gameData.imageUrl }] : [],
    },
    keywords: [gameData.name, ...gameData.tags, "actualités", "guides", "tier list"].join(", "),
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { game: gameSlug } = await params
  const gameData = await getGameBySlug(gameSlug)
  
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
    "gamePlatform": gameData.platforms?.map(p => p.name).join(", ") || "",
    "publisher": {
      "@type": "Organization",
      "name": gameData.developer
    },
    "datePublished": gameData.releaseDate,
    "image": gameData.imageUrl,
    "url": `https://animegachapulse.com/games/${gameSlug}`,
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

// Générer les pages statiques pour tous les jeux en base
export async function generateStaticParams() {
  const { prisma } = await import('@/lib/prisma')
  
  const games = await prisma.game.findMany({
    select: { slug: true }
  })
  
  return games.map((game) => ({
    game: game.slug,
  }))
}
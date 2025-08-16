import { Metadata } from "next"
import { Suspense } from "react"
import { GameGrid } from "@/components/games/GameGrid"
import { GameFilters } from "@/components/games/GameFilters"
import { JsonLdScript } from "@/components/seo/JsonLdScript"

export const metadata: Metadata = {
  title: "Tous les jeux Gacha - Anime Gacha Pulse",
  description: "Découvrez notre collection complète de jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes, Arknights et bien plus encore.",
  openGraph: {
    title: "Tous les jeux Gacha - Anime Gacha Pulse",
    description: "Collection complète des meilleurs jeux Gacha avec guides, actualités et tier lists",
    type: "website",
  },
  keywords: [
    "jeux gacha", "genshin impact", "honkai star rail", "fire emblem heroes", 
    "arknights", "blue archive", "epic seven", "gacha games", "mobile games"
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Jeux Gacha - Anime Gacha Pulse",
  "description": "Collection complète des meilleurs jeux Gacha avec guides, actualités et analyses",
  "url": "https://animegachapulse.com/games",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Jeux Gacha",
    "description": "Liste des jeux Gacha couverts par Anime Gacha Pulse"
  }
}

export default function GamesPage() {
  return (
    <>
      <JsonLdScript data={jsonLd} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tous les <span className="text-primary">jeux Gacha</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection complète de jeux Gacha avec guides experts, 
            actualités et analyses détaillées
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-16 bg-card rounded-lg animate-pulse" />}>
            <GameFilters />
          </Suspense>
        </div>

        {/* Games Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        }>
          <GameGrid />
        </Suspense>
      </div>
    </>
  )
}
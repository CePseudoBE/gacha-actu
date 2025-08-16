import { Metadata } from "next"
import { Suspense } from "react"
import { GuideGrid } from "@/components/guides/GuideGrid"
import { GuideFilters } from "@/components/guides/GuideFilters"
import { JsonLdScript } from "@/components/seo/JsonLdScript"

export const metadata: Metadata = {
  title: "Guides et Builds - Anime Gacha Pulse",
  description: "Découvrez nos guides experts pour tous les jeux Gacha : builds optimaux, stratégies avancées, guides débutants et tier lists détaillées.",
  openGraph: {
    title: "Guides et Builds - Anime Gacha Pulse",
    description: "Collection complète de guides experts pour tous les jeux Gacha populaires",
    type: "website",
  },
  keywords: [
    "guides gacha", "builds", "stratégies", "tier list", "guides débutants",
    "genshin impact guides", "honkai star rail guides", "fire emblem heroes guides"
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Guides Gacha - Anime Gacha Pulse",
  "description": "Collection complète de guides experts et stratégies pour tous les jeux Gacha populaires",
  "url": "https://animegachapulse.com/guides",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Guides Gacha",
    "description": "Guides experts, builds optimaux et stratégies avancées"
  }
}

export default function GuidesPage() {
  return (
    <>
      <JsonLdScript data={jsonLd} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Guides</span> & Stratégies
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Maîtrisez vos jeux Gacha favoris grâce à nos guides experts : 
            builds optimaux, stratégies avancées et conseils de pros
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-20 bg-card rounded-lg animate-pulse" />}>
            <GuideFilters />
          </Suspense>
        </div>

        {/* Guides Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        }>
          <GuideGrid />
        </Suspense>
      </div>
    </>
  )
}
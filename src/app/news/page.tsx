import { Metadata } from "next"
import { TrendingUp, Calendar } from "lucide-react"
import { ArticlesFilter } from "@/components/ArticlesFilter"
import { getAllArticles, getAllGames } from "@/lib/data-access"

// Force cette page à être rendue dynamiquement (pas de génération statique)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Actualités - Toutes les news des jeux Gacha",
  description: "Découvrez toutes les actualités, mises à jour et événements des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et bien plus !",
  openGraph: {
    title: "Actualités Gacha - Anime Gacha Pulse",
    description: "Toutes les dernières news de l'univers Gacha en un seul endroit.",
    type: "website",
  },
}

export default async function ActualitesPage() {
  // Récupération optimisée avec cache
  const { articles: allArticles } = await getAllArticles({}, undefined, 1, 50)
  const games = await getAllGames()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Actualités Gacha",
    "description": "Toutes les actualités des jeux Gacha",
    "url": "https://animegachapulse.com/news",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allArticles.length,
      "itemListElement": allArticles.map((article, index) => ({
        "@type": "Article",
        "position": index + 1,
        "name": article.title,
        "description": article.summary,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "datePublished": article.publishedAt,
        "about": {
          "@type": "VideoGame",
          "name": article.game
        }
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Mise à jour en temps réel
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Toutes nos actualités
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Découvrez les dernières nouvelles, guides experts et analyses approfondies 
              de l&#39;univers des jeux Gacha. Par des passionnés, pour les passionnés.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{allArticles.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{games.length - 1} jeux couverts</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>Mis à jour quotidiennement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles with Filters */}
      <ArticlesFilter articles={allArticles} games={games} />
    </>
  )
}
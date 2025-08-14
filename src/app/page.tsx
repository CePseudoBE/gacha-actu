import { HeroSection } from "@/components/home/HeroSection"
import { ArticlesCarousel } from "@/components/home/ArticlesCarousel"
import { Metadata } from "next"
import { getPopularArticles } from "@/lib/data-access"

export const metadata: Metadata = {
  title: "Accueil - Actualités et guides des jeux Gacha",
  description: "Découvrez les dernières actualités, guides experts et tier lists des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !",
  openGraph: {
    title: "GachaActu - Toute l'actualité des jeux Gacha",
    description: "Derniers guides, tier lists et événements de l'univers Gacha. Par des passionnés, pour les passionnés.",
    type: "website",
  },
}

export default async function Home() {
  // Récupération des articles populaires avec cache optimisé
  const popularArticles = await getPopularArticles(6)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GachaActu",
    "description": "Le site d'actualités spécialisé dans les jeux Gacha",
    "url": "https://gachaactu.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gachaactu.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "GachaActu"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "GachaActu"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <HeroSection />

      {/* Articles Carousel */}
      <ArticlesCarousel 
        articles={popularArticles} 
        title="Dernières actualités"
        subtitle="Restez informé des dernières nouveautés, mises à jour et événements de l'univers Gacha"
      />

    </>
  )
}

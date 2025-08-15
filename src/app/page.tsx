import { HeroSection } from "@/components/home/HeroSection"
import { ArticlesCarousel } from "@/components/home/ArticlesCarousel"
import { JsonLdScript } from "@/components/seo/JsonLdScript"
import { Metadata } from "next"
import { getPopularArticles } from "@/lib/data-access"
import { homePageSeo } from "@/config/seo"

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

  return (
    <>
      <JsonLdScript data={homePageSeo.jsonLd} />
      
      <HeroSection />

      <ArticlesCarousel 
        articles={popularArticles} 
        title="Dernières actualités"
        subtitle="Restez informé des dernières nouveautés, mises à jour et événements de l'univers Gacha"
      />
    </>
  )
}

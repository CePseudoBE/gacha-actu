import { HeroSection } from "@/components/home/HeroSection"
import { ArticlesCarousel } from "@/components/home/ArticlesCarousel"
import { YouTubeCarousel } from "@/components/home/YouTubeCarousel"
import { SocialSection } from "@/components/social/TwitterTimeline"
import { JsonLdScript } from "@/components/seo/JsonLdScript"
import { Metadata } from "next"
import { getPopularArticles } from "@/lib/data-access"
// import { getRecentVideos } from "@/lib/youtube-data"
import { homePageSeo } from "@/config/seo"

export const metadata: Metadata = {
  title: "Accueil - Actualités et guides des jeux Gacha",
  description: "Découvrez les dernières actualités, guides experts et tier lists des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et plus encore !",
  openGraph: {
    title: "Anime Gacha Pulse - Toute l'actualité des jeux Gacha",
    description: "Derniers guides, tier lists et événements de l'univers Gacha. Par des passionnés, pour les passionnés.",
    type: "website",
  },
}

async function getYouTubeVideos() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/youtube-videos`)
    if (!response.ok) return []
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Erreur lors du chargement des vidéos YouTube:', error)
    return []
  }
}

export default async function Home() {
  // Récupération des données avec cache optimisé
  const popularArticles = await getPopularArticles(6)
  const youtubeVideos = await getYouTubeVideos()

  return (
    <>
      <JsonLdScript data={homePageSeo.jsonLd} />
      
      <HeroSection />

      <ArticlesCarousel 
        articles={popularArticles} 
        title="Dernières actualités"
        subtitle="Restez informé des dernières nouveautés, mises à jour et événements de l'univers Gacha"
      />

      {youtubeVideos.length > 0 && (
        <YouTubeCarousel 
          videos={youtubeVideos}
          title="Vidéos de la Communauté"
        />
      )}

      {/* Section Réseaux Sociaux */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <SocialSection 
              twitterUsername="votrecompte" // À remplacer par votre nom d'utilisateur Twitter/X
              discordInvite="https://discord.gg/votreinvite" // Optionnel : lien Discord
              customMessage="Rejoignez notre communauté de passionnés de jeux Gacha !"
            />
          </div>
        </div>
      </section>
    </>
  )
}

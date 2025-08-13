import { ArticleCard } from "@/components/ArticleCard"
import { HeroSection } from "@/components/home/HeroSection"

const mockArticles = [
  {
    title: "Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3",
    summary: "La bannière de re-run de Raiden Shogun arrive avec de nouveaux personnages 4 étoiles. Découvrez les détails et les conseils pour optimiser vos tirages.",
    author: "Alex Gacha",
    publishedAt: "13 août 2025",
    game: "Genshin Impact",
    slug: "raiden-shogun-banniere-5-3",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop"
  },
  {
    title: "Honkai Star Rail : Guide complet de Firefly",
    summary: "Tout ce qu'il faut savoir sur Firefly, le nouveau personnage DPS Feu. Build, équipes recommandées et stratégies de combat.",
    author: "Marie HSR",
    publishedAt: "12 août 2025", 
    game: "Honkai Star Rail",
    slug: "guide-firefly-honkai-star-rail",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=200&fit=crop"
  },
  {
    title: "Fire Emblem Heroes : Événement Fallen Heroes",
    summary: "Un nouvel événement avec des héros corrompus fait son apparition. Découvrez les nouveaux personnages et les récompenses à obtenir.",
    author: "Thomas FEH",
    publishedAt: "11 août 2025",
    game: "Fire Emblem Heroes", 
    slug: "evenement-fallen-heroes-feh",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop"
  },
  {
    title: "Arknights : Tier List des Opérateurs après la mise à jour 15.0",
    summary: "Notre tier list mise à jour avec les derniers opérateurs et les changements d'équilibrage. Qui sont les meilleurs picks actuellement ?",
    author: "Sophie AK",
    publishedAt: "10 août 2025",
    game: "Arknights",
    slug: "tier-list-operateurs-arknights-15-0",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop"
  },
  {
    title: "Blue Archive : Nouveau raid contre Binah",
    summary: "Un raid de difficulté extrême fait son apparition. Découvrez les meilleures équipes et stratégies pour vaincre ce boss redoutable.",
    author: "Kevin BA",
    publishedAt: "9 août 2025",
    game: "Blue Archive",
    slug: "raid-binah-blue-archive",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=200&fit=crop"
  },
  {
    title: "Epic Seven : Guide du nouveau héros Belian ML",
    summary: "La version Moonlight de Belian arrive bientôt ! Analyse de ses compétences, builds recommandés et impact sur la méta PvP.",
    author: "Lucas E7",
    publishedAt: "8 août 2025",
    game: "Epic Seven",
    slug: "guide-belian-ml-epic-seven",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop"
  }
]

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* News Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dernières actualités</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Restez informé des dernières nouveautés, mises à jour et événements de l'univers Gacha
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

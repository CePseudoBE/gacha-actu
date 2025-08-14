import { Metadata } from "next"
import { TrendingUp, Calendar } from "lucide-react"
import { ArticlesFilter } from "@/components/ArticlesFilter"

export const metadata: Metadata = {
  title: "Actualités - Toutes les news des jeux Gacha",
  description: "Découvrez toutes les actualités, mises à jour et événements des meilleurs jeux Gacha : Genshin Impact, Honkai Star Rail, Fire Emblem Heroes et bien plus !",
  openGraph: {
    title: "Actualités Gacha - GachaActu",
    description: "Toutes les dernières news de l'univers Gacha en un seul endroit.",
    type: "website",
  },
}

const allArticles = [
  {
    title: "Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3",
    summary: "La bannière de re-run de Raiden Shogun arrive avec de nouveaux personnages 4 étoiles. Découvrez les détails et les conseils pour optimiser vos tirages.",
    author: "Alex Gacha",
    publishedAt: "13 août 2025",
    game: "Genshin Impact",
    slug: "raiden-shogun-banniere-5-3",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400"
  },
  {
    title: "Honkai Star Rail : Guide complet de Firefly",
    summary: "Tout ce qu'il faut savoir sur Firefly, le nouveau personnage DPS Feu. Build, équipes recommandées et stratégies de combat.",
    author: "Marie HSR",
    publishedAt: "12 août 2025", 
    game: "Honkai Star Rail",
    slug: "guide-firefly-honkai-star-rail",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400"
  },
  {
    title: "Fire Emblem Heroes : Événement Fallen Heroes",
    summary: "Un nouvel événement avec des héros corrompus fait son apparition. Découvrez les nouveaux personnages et les récompenses à obtenir.",
    author: "Thomas FEH",
    publishedAt: "11 août 2025",
    game: "Fire Emblem Heroes", 
    slug: "evenement-fallen-heroes-feh",
    imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400"
  },
  {
    title: "Arknights : Tier List des Opérateurs après la mise à jour 15.0",
    summary: "Notre tier list mise à jour avec les derniers opérateurs et les changements d'équilibrage. Qui sont les meilleurs picks actuellement ?",
    author: "Sophie AK",
    publishedAt: "10 août 2025",
    game: "Arknights",
    slug: "tier-list-operateurs-arknights-15-0",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400"
  },
  {
    title: "Blue Archive : Nouveau raid contre Binah",
    summary: "Un raid de difficulté extrême fait son apparition. Découvrez les meilleures équipes et stratégies pour vaincre ce boss redoutable.",
    author: "Kevin BA",
    publishedAt: "9 août 2025",
    game: "Blue Archive",
    slug: "raid-binah-blue-archive",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400"
  },
  {
    title: "Epic Seven : Guide du nouveau héros Belian ML",
    summary: "La version Moonlight de Belian arrive bientôt ! Analyse de ses compétences, builds recommandés et impact sur la méta PvP.",
    author: "Lucas E7",
    publishedAt: "8 août 2025",
    game: "Epic Seven",
    slug: "guide-belian-ml-epic-seven",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400"
  },
  {
    title: "Bleach Soul Resonance : Event Thousand-Year Blood War",
    summary: "Un événement majeur célébrant l'arc final de Bleach avec de nouveaux personnages et des récompenses exclusives.",
    author: "Sarah BSR",
    publishedAt: "7 août 2025",
    game: "Bleach Soul Resonance",
    slug: "event-thousand-year-blood-war-bsr",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400"
  },
  {
    title: "Seven Deadly Sins Origins : Nouveau système de PvP en Temps Réel",
    summary: "Affrontez d'autres joueurs en temps réel avec le nouveau mode PvP synchronisé. Découvrez les mécaniques et stratégies.",
    author: "Alex Gacha",
    publishedAt: "6 août 2025",
    game: "Seven Deadly Sins Origins",
    slug: "pvp-temps-reel-7ds-origins",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&h=400"
  },
  {
    title: "Fate/Grand Order : Événement Summer 2025 arrive",
    summary: "L'événement estival tant attendu débarque avec de nouveaux servants en maillot de bain et des quêtes exclusives.",
    author: "Julie FGO",
    publishedAt: "5 août 2025",
    game: "Fate/Grand Order",
    slug: "summer-event-2025-fgo",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400"
  },
  {
    title: "Dragon Ball Legends : Nouveau tag 'Universe 6' et Kefla Legendary",
    summary: "Une nouvelle transformation pour Kefla et l'introduction du tag Universe 6 qui bouleverse la méta PvP.",
    author: "Marcus DBL",
    publishedAt: "4 août 2025",
    game: "Dragon Ball Legends",
    slug: "kefla-legendary-universe-6-dbl",
    imageUrl: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=400"
  },
  {
    title: "Punishing Gray Raven : Patch 'Crimson Weave' disponible",
    summary: "Le nouveau patch apporte Lucia : Crimson Weave, de nouveaux modes de jeu et des améliorations graphiques.",
    author: "Nina PGR",
    publishedAt: "3 août 2025",
    game: "Punishing Gray Raven",
    slug: "lucia-crimson-weave-patch-pgr",
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400"
  },
  {
    title: "Granblue Fantasy : Nouveau raid Proud+ Lucilius",
    summary: "Un défi ultime pour les joueurs expérimentés avec des mécaniques inédites et des récompenses prestigieuses.",
    author: "Takeshi GBF",
    publishedAt: "2 août 2025",
    game: "Granblue Fantasy",
    slug: "raid-proud-lucilius-gbf",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=400"
  }
]

const games = [
  "Tous les jeux",
  "Genshin Impact",
  "Honkai Star Rail", 
  "Fire Emblem Heroes",
  "Arknights",
  "Blue Archive",
  "Epic Seven",
  "Bleach Soul Resonance",
  "Seven Deadly Sins Origins",
  "Fate/Grand Order",
  "Dragon Ball Legends",
  "Punishing Gray Raven",
  "Granblue Fantasy"
]

export default function ActualitesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Actualités Gacha",
    "description": "Toutes les actualités des jeux Gacha",
    "url": "https://gachaactu.com/actualites",
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
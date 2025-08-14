import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Trophy, Users, Calendar } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tier Lists - Classements des meilleurs personnages",
  description: "Découvrez nos tier lists expertes pour tous vos jeux Gacha favoris : personnages, armes et builds optimaux.",
  openGraph: {
    title: "Tier Lists GachaActu - Classements experts",
    description: "Tier lists mises à jour régulièrement par nos experts pour optimiser vos équipes.",
    type: "website",
  },
}

const gamesWithTierLists = [
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    description: "RPG open-world avec système gacha",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
    tierListsCount: 3,
    lastUpdated: "14 août 2025",
    categories: ["Personnages", "Armes", "Artéfacts"],
    isPopular: true
  },
  {
    name: "Honkai Star Rail",
    slug: "honkai-star-rail", 
    description: "RPG au tour par tour spatial",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
    tierListsCount: 2,
    lastUpdated: "13 août 2025",
    categories: ["Personnages", "Cônes de Lumière"],
    isPopular: true
  },
  {
    name: "Fire Emblem Heroes",
    slug: "fire-emblem-heroes",
    description: "Stratégie tactique mobile",
    imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop",
    tierListsCount: 2,
    lastUpdated: "12 août 2025",
    categories: ["Héros", "Compétences"],
    isPopular: false
  },
  {
    name: "Seven Deadly Sins Origins",
    slug: "seven-deadly-sins-origins",
    description: "RPG d'action basé sur l'anime",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
    tierListsCount: 1,
    lastUpdated: "10 août 2025",
    categories: ["Personnages"],
    isPopular: false
  },
  {
    name: "Bleach Soul Resonance",
    slug: "bleach-soul-resonance",
    description: "Action RPG de l'univers Bleach",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    tierListsCount: 1,
    lastUpdated: "9 août 2025",
    categories: ["Soul Reapers"],
    isPopular: false
  },
  {
    name: "Arknights",
    slug: "arknights",
    description: "Tower defense avec éléments RPG",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop",
    tierListsCount: 2,
    lastUpdated: "8 août 2025",
    categories: ["Opérateurs", "Modules"],
    isPopular: false
  }
]

export default function TierListsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Tier Lists par Jeux
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sélectionnez votre jeu pour découvrir nos tier lists expertes et optimiser vos équipes.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gamesWithTierLists.map((game) => (
            <Link key={game.slug} href={`/tier-lists/${game.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 h-full">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <Image
                    src={game.imageUrl}
                    alt={`Tier lists pour ${game.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {game.isPopular && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        Populaire
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {game.name}
                  </CardTitle>
                  <CardDescription>
                    {game.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{game.tierListsCount} tier list{game.tierListsCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{game.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {game.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
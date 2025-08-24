import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { DeleteGameButton } from "@/components/admin/DeleteGameButton"

// Force cette page à être rendue dynamiquement (pas de génération statique)
export const dynamic = 'force-dynamic'

type GameWithCounts = {
  id: string
  name: string
  slug: string
  description: string | null
  genre: string | null
  developer: string | null
  releaseDate: string | null
  imageUrl: string | null
  logoUrl: string | null
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    articles: number
    guides: number
  }
  platforms: {
    platform: {
      id: string
      name: string
    }
  }[]
}

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          articles: true,
          guides: true
        }
      },
      platforms: {
        include: {
          platform: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Jeux</h1>
          <p className="text-muted-foreground">Gérez la base de données des jeux Gacha</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">Retour</Button>
          </Link>
          <Link href="/admin/games/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un jeu
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un jeu..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des jeux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game: GameWithCounts) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {game.developer} • {game.genre}
                  </CardDescription>
                </div>
                {game.imageUrl && (
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden ml-4">
                    <Image
                      src={game.imageUrl}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistiques */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Articles:</span>
                <span className="font-medium">{game._count.articles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Guides:</span>
                <span className="font-medium">{game._count.guides}</span>
              </div>
              
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {game.isPopular && (
                  <Badge variant="secondary">Populaire</Badge>
                )}
                {game.platforms?.map((gamePlatform: {platform: {id: string, name: string}}) => (
                  <Badge key={gamePlatform.platform.id} variant="outline">
                    {gamePlatform.platform.name}
                  </Badge>
                ))}
                {(!game.platforms || game.platforms.length === 0) && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Aucune plateforme
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/admin/games/edit/${game.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </Link>
                <DeleteGameButton 
                  gameId={game.id} 
                  gameName={game.name}
                  hasContent={game._count.articles > 0 || game._count.guides > 0}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Aucun jeu trouvé</p>
          <Link href="/admin/games/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter le premier jeu
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
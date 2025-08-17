import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({
    include: {
      game: {
        select: {
          name: true,
          imageUrl: true
        }
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Guides</h1>
          <p className="text-muted-foreground">Créez et gérez les guides pour les joueurs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">Retour</Button>
          </Link>
          <Link href="/admin/guides/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un guide
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un guide..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Card key={guide.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                {guide.imageUrl && (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={guide.imageUrl}
                      alt={guide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {guide.game.name} • {guide.author}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {guide.summary}
              </p>

              {/* Métadonnées */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulté:</span>
                <Badge variant={
                  guide.difficulty === 'BEGINNER' ? 'secondary' :
                  guide.difficulty === 'INTERMEDIATE' ? 'default' : 'destructive'
                }>
                  {guide.difficulty === 'BEGINNER' ? 'Débutant' :
                   guide.difficulty === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                </Badge>
              </div>

              {guide.readingTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Temps de lecture:</span>
                  <span className="font-medium">{guide.readingTime} min</span>
                </div>
              )}

              {/* Tags */}
              {guide.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {guide.tags.slice(0, 3).map((tagRel) => (
                    <Badge key={tagRel.tag.name} variant="outline" className="text-xs">
                      {tagRel.tag.name}
                    </Badge>
                  ))}
                  {guide.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{guide.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/guides/${guide.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/admin/guides/edit/${guide.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {guides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Aucun guide trouvé</p>
          <Link href="/admin/guides/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer le premier guide
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
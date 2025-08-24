import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2 } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Force cette page à être rendue dynamiquement (pas de génération statique)
export const dynamic = 'force-dynamic'

type TagWithCounts = {
  id: string
  name: string
  slug: string
  createdAt: Date
  _count: {
    articles: number
    guides: number
  }
}

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          articles: true,
          guides: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Tags</h1>
          <p className="text-muted-foreground">Organisez et gérez les tags du site</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">Retour</Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un tag..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tags.map((tag: TagWithCounts) => (
          <Card key={tag.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{tag.name}</CardTitle>
              <CardDescription className="text-xs">
                /{tag.slug}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Statistiques */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Articles:</span>
                  <span className="font-medium">{tag._count.articles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guides:</span>
                  <span className="font-medium">{tag._count.guides}</span>
                </div>
              </div>

              {/* Total utilisations */}
              <div className="flex justify-center">
                <Badge variant="secondary">
                  {tag._count.articles + tag._count.guides} utilisations
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  disabled={tag._count.articles > 0 || tag._count.guides > 0}
                  title={tag._count.articles > 0 || tag._count.guides > 0 ? "Impossible de supprimer un tag utilisé" : "Supprimer le tag"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Aucun tag trouvé</p>
          <p className="text-sm text-muted-foreground">
            Les tags sont créés automatiquement lors de la création d&apos;articles ou de guides
          </p>
        </div>
      )}

      {/* Statistiques */}
      {tags.length > 0 && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{tags.length}</div>
                  <p className="text-sm text-muted-foreground">Tags total</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {tags.filter((tag: TagWithCounts) => tag._count.articles > 0 || tag._count.guides > 0).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Tags utilisés</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {tags.reduce((acc: number, tag: TagWithCounts) => acc + tag._count.articles + tag._count.guides, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Utilisations totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case 'NEWS': return 'Actualité'
      case 'GUIDE': return 'Guide'
      case 'TIER_LIST': return 'Tier List'
      case 'EVENT': return 'Événement'
      default: return 'Autre'
    }
  }

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'NEWS': return 'bg-blue-100 text-blue-800'
      case 'GUIDE': return 'bg-green-100 text-green-800'
      case 'TIER_LIST': return 'bg-purple-100 text-purple-800'
      case 'EVENT': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Articles</h1>
          <p className="text-muted-foreground">Créez et gérez les actualités du site</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">Retour</Button>
          </Link>
          <Link href="/admin/articles/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un article
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un article..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Liste des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                {article.imageUrl && (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {article.game.name} • {article.author}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.summary}
              </p>

              {/* Métadonnées */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Publié le:</span>
                  <span className="font-medium">{formatDate(article.publishedAt)}</span>
                </div>

                {article.readingTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lecture:</span>
                    <span className="font-medium">{article.readingTime} min</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {article.category && (
                  <Badge className={getCategoryColor(article.category)}>
                    {getCategoryLabel(article.category)}
                  </Badge>
                )}
                {article.isPopular && (
                  <Badge variant="secondary">Populaire</Badge>
                )}
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {article.tags.slice(0, 3).map((tagRel) => (
                    <Badge key={tagRel.tag.name} variant="outline" className="text-xs">
                      {tagRel.tag.name}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/article/${article.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                </Link>
                <Link href={`/admin/articles/edit/${article.id}`}>
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

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Aucun article trouvé</p>
          <Link href="/admin/articles/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer le premier article
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
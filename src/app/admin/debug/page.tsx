import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function DebugPage() {
  // Récupérer tous les données de la base
  const [games, articles, guides, tags] = await Promise.all([
    prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.article.findMany({
      include: { game: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.guide.findMany({
      include: { game: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
            guides: true
          }
        }
      },
      orderBy: { name: 'asc' },
      take: 20
    })
  ])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="w-8 h-8" />
            Debug Base de Données
          </h1>
          <p className="text-muted-foreground">Vérification des données sauvegardées</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jeux */}
        <Card>
          <CardHeader>
            <CardTitle>Jeux ({games.length})</CardTitle>
            <CardDescription>Derniers jeux ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            {games.length > 0 ? (
              <div className="space-y-4">
                {games.map((game) => (
                  <div key={game.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{game.name}</h3>
                      {game.isPopular && <Badge variant="secondary">Populaire</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Slug:</span> {game.slug}</p>
                      <p><span className="font-medium">Genre:</span> {game.genre || 'Non défini'}</p>
                      <p><span className="font-medium">Plateformes:</span> {'Non disponible (nouvelle structure)'}</p>
                      <p><span className="font-medium">Développeur:</span> {game.developer || 'Non défini'}</p>
                      <p><span className="font-medium">Créé:</span> {formatDate(game.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun jeu trouvé</p>
            )}
          </CardContent>
        </Card>

        {/* Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Articles ({articles.length})</CardTitle>
            <CardDescription>Derniers articles ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                      {article.isPopular && <Badge variant="secondary">Populaire</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Slug:</span> {article.slug}</p>
                      <p><span className="font-medium">Jeu:</span> {article.game.name}</p>
                      <p><span className="font-medium">Auteur:</span> {article.author}</p>
                      <p><span className="font-medium">Catégorie:</span> {article.category}</p>
                      <p><span className="font-medium">Créé:</span> {formatDate(article.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun article trouvé</p>
            )}
          </CardContent>
        </Card>

        {/* Guides */}
        <Card>
          <CardHeader>
            <CardTitle>Guides ({guides.length})</CardTitle>
            <CardDescription>Derniers guides ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            {guides.length > 0 ? (
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div key={guide.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold line-clamp-1">{guide.title}</h3>
                      <Badge variant={
                        guide.difficulty === 'BEGINNER' ? 'secondary' :
                        guide.difficulty === 'INTERMEDIATE' ? 'default' : 'destructive'
                      }>
                        {guide.difficulty === 'BEGINNER' ? 'Débutant' :
                         guide.difficulty === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Slug:</span> {guide.slug}</p>
                      <p><span className="font-medium">Jeu:</span> {guide.game.name}</p>
                      <p><span className="font-medium">Auteur:</span> {guide.author}</p>
                      <p><span className="font-medium">Créé:</span> {formatDate(guide.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun guide trouvé</p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags ({tags.length})</CardTitle>
            <CardDescription>Tags disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div>
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({tag.slug})</span>
                    </div>
                    <Badge variant="outline">
                      {tag._count.articles + tag._count.guides} utilisations
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun tag trouvé</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques globales */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{games.length}</div>
              <p className="text-sm text-muted-foreground">Jeux</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-sm text-muted-foreground">Articles</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{guides.length}</div>
              <p className="text-sm text-muted-foreground">Guides</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{tags.length}</div>
              <p className="text-sm text-muted-foreground">Tags</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GamepadIcon, BookOpenIcon, NewspaperIcon, BarChart3Icon, TrendingUpIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Force cette page à être rendue dynamiquement (pas de génération statique)
export const dynamic = 'force-dynamic'

type RecentActivityItem = {
  id: string
  title: string
  author: string
  createdAt: Date
  game: {
    name: string
  }
}

export default async function AdminDashboard() {
  // Récupérer les statistiques
  const [
    totalArticles,
    totalGuides,
    totalGames,
    popularArticles,
    recentActivity
  ] = await Promise.all([
    prisma.article.count(),
    prisma.guide.count(),
    prisma.game.count(),
    prisma.article.count({ where: { isPopular: true } }),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        game: { select: { name: true } }
      }
    })
  ])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre site d&apos;actualités Gacha</p>
      </div>

      {/* Statistiques en header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {popularArticles} populaires
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guides</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuides}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jeux</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGames}</div>
            <p className="text-xs text-muted-foreground">
              Référencés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles + totalGuides}</div>
            <p className="text-xs text-muted-foreground">
              Contenus publiés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions rapides */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gestion des Articles */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <NewspaperIcon className="h-5 w-5 text-green-500" />
                    Articles
                  </CardTitle>
                  <CardDescription>
                    Créer et modifier les actualités
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/articles/add">
                    <Button className="w-full">
                      Créer un article
                    </Button>
                  </Link>
                  <Link href="/admin/articles">
                    <Button className="w-full" variant="outline">
                      Gérer les articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Gestion des Guides */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5 text-purple-500" />
                    Guides
                  </CardTitle>
                  <CardDescription>
                    Rédiger des guides pour les joueurs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/guides/add">
                    <Button className="w-full">
                      Créer un guide
                    </Button>
                  </Link>
                  <Link href="/admin/guides">
                    <Button className="w-full" variant="outline">
                      Gérer les guides
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Gestion des Jeux */}
              <Card className="hover:shadow-lg transition-shadow md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GamepadIcon className="h-5 w-5 text-blue-500" />
                    Jeux
                  </CardTitle>
                  <CardDescription>
                    Gérer la base de données des jeux Gacha
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Link href="/admin/games/add" className="flex-1">
                    <Button className="w-full">
                      Ajouter un jeu
                    </Button>
                  </Link>
                  <Link href="/admin/games" className="flex-1">
                    <Button className="w-full" variant="outline">
                      Gérer les jeux
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-orange-500" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Derniers contenus publiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item: RecentActivityItem) => (
                  <div key={item.id} className="flex flex-col space-y-1">
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.game.name}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
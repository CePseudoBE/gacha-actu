"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleCard } from "@/components/ArticleCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Newspaper, 
  BookOpen, 
  Calendar, 
  Users, 
  Trophy,
  ExternalLink,
  Clock,
  TrendingUp,
  Calculator
} from "lucide-react"
import { Article } from "@/types/article"
import Link from "next/link"

interface GameData {
  name: string
  description: string
  genre: string
  platform: string
  developer: string
  releaseDate: string
  imageUrl: string
  logoUrl: string
  isPopular: boolean
  tags: string[]
  officialSite: string
  wiki: string
}

interface GameTabsProps {
  game: GameData
  articles: Article[]
}

export function GameTabs({ game, articles }: GameTabsProps) {
  // Filtrer les articles par catégorie
  const newsArticles = articles.filter(article => 
    article.category === 'news' || article.category === 'event'
  )
  const guideArticles = articles.filter(article => 
    article.category === 'guide' || article.category === 'tier-list'
  )

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <Tabs defaultValue="news" className="space-y-8">
        <TabsList className="w-full h-auto p-1 flex flex-wrap sm:flex-nowrap sm:justify-center gap-1 sm:gap-0">
          <TabsTrigger 
            value="news" 
            className="flex items-center justify-center gap-1 text-xs sm:text-sm h-9 w-[calc(50%-2px)] sm:w-auto sm:flex-1"
          >
            <Newspaper className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">News</span>
            <span className="hidden sm:inline">Actualités</span>
          </TabsTrigger>
          <TabsTrigger 
            value="guides" 
            className="flex items-center justify-center gap-1 text-xs sm:text-sm h-9 w-[calc(50%-2px)] sm:w-auto sm:flex-1"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Guides</span>
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="flex items-center justify-center gap-1 text-xs sm:text-sm h-9 w-[calc(50%-2px)] sm:w-auto sm:flex-1"
          >
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Events</span>
            <span className="hidden sm:inline">Événements</span>
          </TabsTrigger>
          <TabsTrigger 
            value="community" 
            className="flex items-center justify-center gap-1 text-xs sm:text-sm h-9 w-[calc(50%-2px)] sm:w-auto sm:flex-1"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Forum</span>
            <span className="hidden sm:inline">Communauté</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <TabsContent value="news" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <h2 className="text-xl md:text-2xl font-bold">Dernières actualités</h2>
                <Badge variant="secondary">
                  {newsArticles.length} article{newsArticles.length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              {newsArticles.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  {newsArticles.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune actualité récente</h3>
                    <p className="text-muted-foreground">
                      Les dernières news de {game.name} apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <h2 className="text-xl md:text-2xl font-bold">Guides et tier lists</h2>
                <Badge variant="secondary">
                  {guideArticles.length} guide{guideArticles.length > 1 ? 's' : ''}
                </Badge>
              </div>
              
              {guideArticles.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  {guideArticles.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun guide disponible</h3>
                    <p className="text-muted-foreground mb-4">
                      Les guides pour {game.name} seront publiés prochainement.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/guides">
                        Voir tous les guides
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Événements en cours</h2>
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun événement en cours</h3>
                  <p className="text-muted-foreground">
                    Les événements de {game.name} seront affichés ici.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Communauté & Ressources</h2>
              
              {/* Ressources officielles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Site officiel
                    </CardTitle>
                    <CardDescription>
                      Site officiel de {game.name} avec les dernières news
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link href={game.officialSite} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visiter le site
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Wiki
                    </CardTitle>
                    <CardDescription>
                      Base de données complète et guides communautaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={game.wiki} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Consulter le wiki
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Communauté Anime Gacha Pulse */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Communauté Anime Gacha Pulse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rejoignez notre communauté pour discuter de {game.name}, partager vos stratégies et poser vos questions !
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button className="w-full" asChild>
                    <Link href="https://discord.gg/animegachapulse" target="_blank" rel="noopener noreferrer">
                      <Users className="w-4 h-4 mr-2" />
                      Discord
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Nous contacter
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
            {/* Stats du jeu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Articles publiés</div>
                  <div className="text-2xl font-bold">{articles.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Dernière mise à jour</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3" />
                    {articles[0]?.publishedAt || "Jamais"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liens rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Liens utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={game.officialSite} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Site officiel
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={game.wiki} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Wiki
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tier List
                </Button>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/guides">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Tous les guides
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/news">
                    <Newspaper className="w-4 h-4 mr-2" />
                    Toutes les actualités
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/tier-lists">
                    <Trophy className="w-4 h-4 mr-2" />
                    Tier Lists
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
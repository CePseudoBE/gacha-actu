"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Calendar, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArticleCard } from "@/components/ArticleCard"
import { Article } from "@/types/article"

interface ArticlesFilterProps {
  articles: Article[]
  games: string[]
}

export function ArticlesFilter({ articles, games }: ArticlesFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGame, setSelectedGame] = useState("Tous les jeux")
  const [sortBy, setSortBy] = useState("recent")

  // Parse dates for sorting
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split(" ")
    const monthMap: Record<string, number> = {
      "janvier": 0, "février": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
      "juillet": 6, "août": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11
    }
    return new Date(parseInt(year), monthMap[month] || 7, parseInt(day))
  }

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.game.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query)
      )
    }

    // Filter by game
    if (selectedGame !== "Tous les jeux") {
      filtered = filtered.filter(article => article.game === selectedGame)
    }

    // Sort articles
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime()
        case "oldest":
          return parseDate(a.publishedAt).getTime() - parseDate(b.publishedAt).getTime()
        case "popular":
          // Mock popularity based on title length (just for demo)
          return a.title.length - b.title.length
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return sorted
  }, [articles, searchQuery, selectedGame, sortBy])

  const handleReset = () => {
    setSearchQuery("")
    setSelectedGame("Tous les jeux")
    setSortBy("recent")
  }

  const hasActiveFilters = searchQuery.trim() !== "" || selectedGame !== "Tous les jeux" || sortBy !== "recent"

  return (
    <div>
      {/* Filters Section */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher un article, jeu, auteur..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game} value={game}>
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                  <SelectItem value="popular">Populaire</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Results info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedArticles.length === articles.length ? (
                `${articles.length} article${articles.length > 1 ? 's' : ''}`
              ) : (
                `${filteredAndSortedArticles.length} résultat${filteredAndSortedArticles.length > 1 ? 's' : ''} sur ${articles.length} article${articles.length > 1 ? 's' : ''}`
              )}
              {selectedGame !== "Tous les jeux" && (
                <span> • Filtré par {selectedGame}</span>
              )}
              {searchQuery.trim() && (
                <span> • Recherche: &quot;{searchQuery}&quot;</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {filteredAndSortedArticles.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedArticles.map((article, index) => (
                  <ArticleCard key={`${article.slug}-${index}`} {...article} />
                ))}
              </div>

              {/* Load More - only show if we have results */}
              {filteredAndSortedArticles.length >= 8 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="px-8">
                    Charger plus d&#39;articles
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            // No results state
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou explorez d&apos;autres catégories.
                </p>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
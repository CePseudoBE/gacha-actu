"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { GameCard } from "./GameCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Game {
  id: string
  name: string
  slug: string
  description: string
  genre: string
  platform: string
  developer: string
  releaseDate: string
  imageUrl: string
  logoUrl: string
  isPopular: boolean
  officialSite: string
  wiki: string
  articlesCount: number
  guidesCount: number
  tags: string[]
}

interface ApiResponse {
  games: Game[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function GameGrid() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const searchParams = useSearchParams()
  const genre = searchParams.get('genre')
  const popular = searchParams.get('popular')

  const fetchGames = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })

      if (genre) params.set('genre', genre)
      if (popular) params.set('popular', popular)

      const response = await fetch(`/api/games?${params}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des jeux')
      }

      const data: ApiResponse = await response.json()
      
      if (append) {
        setGames(prev => [...prev, ...data.games])
      } else {
        setGames(data.games)
      }
      
      setPagination(data.pagination)
      setError(null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [genre, popular])

  // Recharger lors des changements de filtres
  useEffect(() => {
    fetchGames(1, false)
  }, [fetchGames])

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      fetchGames(pagination.page + 1, true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchGames(1, false)} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Aucun jeu trouvé</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Load More Button */}
      {pagination?.hasNextPage && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            size="lg"
            variant="outline"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Chargement...
              </>
            ) : (
              `Charger plus (${pagination.total - games.length} restants)`
            )}
          </Button>
        </div>
      )}

      {/* Results info */}
      {pagination && (
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Affichage de {games.length} sur {pagination.total} jeux
        </div>
      )}
    </>
  )
}
"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { GuideCard } from "./GuideCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Guide {
  id: string
  title: string
  summary: string
  author: string
  publishedAt: string
  slug: string
  imageUrl?: string
  readingTime?: number
  difficulty: string
  guideType: string
  isPopular: boolean
  viewCount: number
  game: string
  gameSlug: string
  tags: string[]
  sectionsCount: number
}

interface ApiResponse {
  guides: Guide[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function GuideGrid() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const searchParams = useSearchParams()
  const game = searchParams.get('game') // slug du jeu
  const guideType = searchParams.get('guideType')
  const difficulty = searchParams.get('difficulty')
  const popular = searchParams.get('popular')

  const fetchGuides = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      })

      if (game) params.set('game', game)
      if (guideType) params.set('guideType', guideType)
      if (difficulty) params.set('difficulty', difficulty)
      if (popular) params.set('popular', popular)

      const response = await fetch(`/api/guides?${params}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des guides')
      }

      const data: ApiResponse = await response.json()
      
      if (append) {
        setGuides(prev => [...prev, ...data.guides])
      } else {
        setGuides(data.guides)
      }
      
      setPagination(data.pagination)
      setError(null)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [game, guideType, difficulty, popular])

  // Recharger lors des changements de filtres
  useEffect(() => {
    fetchGuides(1, false)
  }, [fetchGuides])

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      fetchGuides(pagination.page + 1, true)
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
        <Button onClick={() => fetchGuides(1, false)} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Aucun guide trouvé</p>
        <p className="text-sm text-muted-foreground mt-2">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
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
              `Charger plus (${pagination.total - guides.length} restants)`
            )}
          </Button>
        </div>
      )}

      {/* Results info */}
      {pagination && (
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Affichage de {guides.length} sur {pagination.total} guides
        </div>
      )}
    </>
  )
}
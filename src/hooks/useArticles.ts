import { useState, useEffect, useCallback } from 'react'
import { Article, ArticleFilters, ArticleSortOptions, PaginatedArticles } from '@/types/article'
import { getAllArticles, getPopularArticles, getArticlesByGame } from '@/lib/data-access'

interface UseArticlesOptions {
  initialFilters?: ArticleFilters
  initialSort?: ArticleSortOptions
  initialPage?: number
  limit?: number
}

interface UseArticlesReturn {
  articles: Article[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    total: number
    hasNext: boolean
    hasPrevious: boolean
  }
  filters: ArticleFilters
  sort: ArticleSortOptions
  setFilters: (filters: ArticleFilters) => void
  setSort: (sort: ArticleSortOptions) => void
  setPage: (page: number) => void
  refetch: () => void
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesReturn {
  const {
    initialFilters = {},
    initialSort = { field: 'publishedAt', order: 'desc' },
    initialPage = 1,
    limit = 10
  } = options

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ArticleFilters>(initialFilters)
  const [sort, setSort] = useState<ArticleSortOptions>(initialSort)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  })

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result: PaginatedArticles = await getAllArticles(filters, sort, currentPage, limit)
      setArticles(result.articles)
      setPagination({
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: result.hasNext,
        hasPrevious: result.hasPrevious
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [filters, sort, currentPage, limit])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleSetPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSetFilters = useCallback((newFilters: ArticleFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handleSetSort = useCallback((newSort: ArticleSortOptions) => {
    setSort(newSort)
    setCurrentPage(1) // Reset to first page when sort changes
  }, [])

  return {
    articles,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages: pagination.totalPages,
      total: pagination.total,
      hasNext: pagination.hasNext,
      hasPrevious: pagination.hasPrevious
    },
    filters,
    sort,
    setFilters: handleSetFilters,
    setSort: handleSetSort,
    setPage: handleSetPage,
    refetch: fetchArticles
  }
}

interface UsePopularArticlesReturn {
  articles: Article[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePopularArticles(limit = 5): UsePopularArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPopularArticles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getPopularArticles(limit)
      setArticles(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchPopularArticles()
  }, [fetchPopularArticles])

  return {
    articles,
    loading,
    error,
    refetch: fetchPopularArticles
  }
}

interface UseGameArticlesReturn {
  articles: Article[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGameArticles(game: string, limit = 10): UseGameArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGameArticles = useCallback(async () => {
    if (!game) return

    setLoading(true)
    setError(null)

    try {
      const result = await getArticlesByGame(game, limit)
      setArticles(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [game, limit])

  useEffect(() => {
    fetchGameArticles()
  }, [fetchGameArticles])

  return {
    articles,
    loading,
    error,
    refetch: fetchGameArticles
  }
}
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Article, ArticleWithContent, ArticleFilters, ArticleSortOptions, PaginatedArticles } from '@/types/article'

// Re-export des fonctions de articles.ts pour compatibilité
import { 
  getAllArticles as _getAllArticles,
  getArticleBySlug as _getArticleBySlug,
  getPopularArticles as _getPopularArticles,
  getArticlesByGame as _getArticlesByGame,
  getRelatedArticles as _getRelatedArticles,
  getAllGames as _getAllGames,
  getAllAuthors as _getAllAuthors,
  getAllTags as _getAllTags
} from './articles'

// Configuration du cache
const CACHE_DURATION = {
  ARTICLES: 300,      // 5 minutes
  POPULAR: 600,       // 10 minutes  
  GAMES: 3600,        // 1 heure
  STATIC: 86400       // 24 heures
}

// Cache tags pour la revalidation
const CACHE_TAGS = {
  ARTICLES: 'articles',
  POPULAR: 'popular-articles',
  GAMES: 'games',
  AUTHORS: 'authors',
  TAGS: 'tags'
}

/**
 * Couche d'accès aux données optimisée pour Next.js
 * Cette couche sera facilement remplaçable par des appels DB
 */

// Articles avec pagination et filtres
export const getAllArticles = unstable_cache(
  async (
    filters?: ArticleFilters,
    sort?: ArticleSortOptions,
    page = 1,
    limit = 10
  ): Promise<PaginatedArticles> => {
    return await _getAllArticles(filters, sort, page, limit)
  },
  ['all-articles'],
  { 
    revalidate: CACHE_DURATION.ARTICLES,
    tags: [CACHE_TAGS.ARTICLES]
  }
)

// Article individuel avec cache permanent (change rarement)
export const getArticleBySlug = cache(
  async (slug: string): Promise<ArticleWithContent | null> => {
    return await _getArticleBySlug(slug)
  }
)

// Articles populaires avec cache étendu
export const getPopularArticles = unstable_cache(
  async (limit = 5): Promise<Article[]> => {
    return await _getPopularArticles(limit)
  },
  ['popular-articles'],
  { 
    revalidate: CACHE_DURATION.POPULAR,
    tags: [CACHE_TAGS.POPULAR]
  }
)

// Articles par jeu avec cache par paramètres
export const getArticlesByGame = unstable_cache(
  async (game: string, limit = 10): Promise<Article[]> => {
    return await _getArticlesByGame(game, limit)
  },
  ['articles-by-game'],
  { 
    revalidate: CACHE_DURATION.ARTICLES,
    tags: [CACHE_TAGS.ARTICLES]
  }
)

// Articles liés
export const getRelatedArticles = cache(
  async (slug: string, limit = 4): Promise<Article[]> => {
    return await _getRelatedArticles(slug, limit)
  }
)

// Métadonnées avec cache long (changent rarement)
export const getAllGames = unstable_cache(
  async (): Promise<string[]> => {
    return _getAllGames()
  },
  ['all-games'],
  { 
    revalidate: CACHE_DURATION.GAMES,
    tags: [CACHE_TAGS.GAMES]
  }
)

export const getAllAuthors = unstable_cache(
  async (): Promise<string[]> => {
    return _getAllAuthors()
  },
  ['all-authors'],
  { 
    revalidate: CACHE_DURATION.STATIC,
    tags: [CACHE_TAGS.AUTHORS]
  }
)

export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    return _getAllTags()
  },
  ['all-tags'],
  { 
    revalidate: CACHE_DURATION.STATIC,
    tags: [CACHE_TAGS.TAGS]
  }
)

/**
 * Fonctions utilitaires pour la gestion du cache
 */

// Revalidation du cache (utile quand on ajoutera des articles)
export async function revalidateArticles() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag(CACHE_TAGS.ARTICLES)
  revalidateTag(CACHE_TAGS.POPULAR)
}

export async function revalidateGames() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag(CACHE_TAGS.GAMES)
}

export async function revalidateAll() {
  const { revalidateTag } = await import('next/cache')
  Object.values(CACHE_TAGS).forEach(tag => revalidateTag(tag))
}

/**
 * Interface pour la future migration DB
 * Quand on passera à une DB, on remplacera juste les implémentations ci-dessus
 */

// Exemple de ce que ça pourrait donner avec Prisma/Drizzle :
/*
export const getAllArticles = unstable_cache(
  async (filters, sort, page, limit) => {
    const db = await getDatabase()
    
    let query = db.select().from(articles)
    
    if (filters?.game) {
      query = query.where(eq(articles.game, filters.game))
    }
    
    if (sort?.field === 'publishedAt') {
      query = query.orderBy(
        sort.order === 'desc' 
          ? desc(articles.publishedAt) 
          : asc(articles.publishedAt)
      )
    }
    
    const results = await query
      .limit(limit)
      .offset((page - 1) * limit)
    
    return {
      articles: results,
      total: await db.select({ count: count() }).from(articles),
      page,
      limit,
      hasNext: results.length === limit,
      hasPrevious: page > 1
    }
  },
  ['all-articles'],
  { revalidate: CACHE_DURATION.ARTICLES }
)
*/
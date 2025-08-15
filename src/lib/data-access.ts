import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Article, ArticleWithContent, ArticleFilters, ArticleSortOptions, PaginatedArticles } from '@/types/article'
import { prisma } from './prisma'
import { Prisma, ArticleCategory } from '@prisma/client'

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
 * Utilitaires pour parser les dates françaises
 */
function _parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(" ")
  const monthMap: Record<string, number> = {
    "janvier": 0, "février": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
    "juillet": 6, "août": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11
  }
  return new Date(parseInt(year), monthMap[month] || 7, parseInt(day))
}

/**
 * Types Prisma pour une meilleure sécurité TypeScript
 * Note: Prisma retourne les DateTime comme Date objects
 */
type _PrismaArticleWithRelations = {
  id: string
  title: string
  summary: string
  author: string
  publishedAt: Date
  slug: string
  imageUrl: string | null
  content: string
  metaDescription: string | null
  readingTime: number | null
  category: string | null
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
  game: { name: string }
  tags: { tag: { name: string } }[]
  seoKeywords?: { keyword: { keyword: string } }[]
}

/**
 * Conversion des données Prisma vers types Article
 */
function prismaToArticle(prismaArticle: Prisma.ArticleGetPayload<{include: {game: true, tags: {include: {tag: true}}}}>): Article {
  // Conversion robuste des dates
  const publishedAt = prismaArticle.publishedAt instanceof Date 
    ? prismaArticle.publishedAt 
    : new Date(prismaArticle.publishedAt)
    
  const createdAt = prismaArticle.createdAt instanceof Date
    ? prismaArticle.createdAt
    : new Date(prismaArticle.createdAt)
    
  const updatedAt = prismaArticle.updatedAt instanceof Date
    ? prismaArticle.updatedAt
    : new Date(prismaArticle.updatedAt)

  return {
    title: prismaArticle.title,
    summary: prismaArticle.summary,
    author: prismaArticle.author,
    publishedAt: formatDateToFrench(publishedAt),
    game: prismaArticle.game.name,
    slug: prismaArticle.slug,
    imageUrl: prismaArticle.imageUrl || undefined,
    tags: prismaArticle.tags?.map((at) => at.tag.name) || [],
    readingTime: prismaArticle.readingTime || undefined,
    category: mapPrismaCategoryToType(prismaArticle.category),
    isPopular: prismaArticle.isPopular,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  }
}

function prismaToArticleWithContent(prismaArticle: Prisma.ArticleGetPayload<{include: {game: true, tags: {include: {tag: true}}, seoKeywords: {include: {keyword: true}}}}>): ArticleWithContent {
  return {
    ...prismaToArticle(prismaArticle),
    content: prismaArticle.content,
    metaDescription: prismaArticle.metaDescription || undefined,
    seoKeywords: prismaArticle.seoKeywords?.map((ask) => ask.keyword.keyword) || []
  }
}

/**
 * Utilitaires de conversion
 */
function formatDateToFrench(date: Date): string {
  const monthNames = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

function mapPrismaCategoryToType(category: string | null): 'news' | 'guide' | 'tier-list' | 'event' | undefined {
  if (!category) return undefined
  switch (category) {
    case 'NEWS': return 'news'
    case 'GUIDE': return 'guide' 
    case 'TIER_LIST': return 'tier-list'
    case 'EVENT': return 'event'
    default: return undefined
  }
}

function mapTypeCategoryToPrisma(category: string): ArticleCategory {
  switch (category) {
    case 'news': return ArticleCategory.NEWS
    case 'guide': return ArticleCategory.GUIDE
    case 'tier-list': return ArticleCategory.TIER_LIST
    case 'event': return ArticleCategory.EVENT
    default: return ArticleCategory.NEWS
  }
}

/**
 * Couche d'accès aux données avec Prisma + Next.js cache
 */

// Articles avec pagination et filtres
export const getAllArticles = unstable_cache(
  async (
    filters?: ArticleFilters,
    sort?: ArticleSortOptions,
    page = 1,
    limit = 10
  ): Promise<PaginatedArticles> => {
    // Construction typée des filtres WHERE
    const where: Prisma.ArticleWhereInput = {}
    
    // Filtres
    if (filters?.game && filters.game !== "Tous les jeux") {
      where.game = { name: filters.game }
    }
    if (filters?.category) {
      where.category = mapTypeCategoryToPrisma(filters.category)
    }
    if (filters?.author) {
      where.author = { contains: filters.author }
    }
    if (filters?.search) {
      // SQLite n'a pas mode: 'insensitive', on simule avec LOWER()
      const query = filters.search.toLowerCase()
      where.OR = [
        { title: { contains: query } },
        { summary: { contains: query } },
        { content: { contains: query } }
      ]
    }
    if (filters?.tags?.length) {
      where.tags = {
        some: {
          tag: {
            name: { in: filters.tags }
          }
        }
      }
    }

    // Tri typé
    let orderBy: Prisma.ArticleOrderByWithRelationInput | Prisma.ArticleOrderByWithRelationInput[] = { publishedAt: 'desc' } // Par défaut
    
    if (sort) {
      switch (sort.field) {
        case 'title':
          orderBy = { title: sort.order }
          break
        case 'author':
          orderBy = { author: sort.order }
          break
        case 'popularity':
          orderBy = [{ isPopular: 'desc' }, { readingTime: 'desc' }]
          break
        case 'publishedAt':
        default:
          orderBy = { publishedAt: sort?.order || 'desc' }
      }
    }

    // Requête avec pagination
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          game: true,
          tags: {
            include: { tag: true }
          }
        }
      }),
      prisma.article.count({ where })
    ])

    return {
      articles: articles.map(prismaToArticle),
      total,
      page,
      limit,
      hasNext: (page * limit) < total,
      hasPrevious: page > 1
    }
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
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        game: true,
        tags: {
          include: { tag: true }
        },
        seoKeywords: {
          include: { keyword: true }
        }
      }
    })

    return article ? prismaToArticleWithContent(article) : null
  }
)

// Articles populaires avec cache étendu
export const getPopularArticles = unstable_cache(
  async (limit = 5): Promise<Article[]> => {
    const articles = await prisma.article.findMany({
      where: { isPopular: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        game: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    return articles.map(prismaToArticle)
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
    const articles = await prisma.article.findMany({
      where: { 
        game: { name: game } 
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        game: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    return articles.map(prismaToArticle)
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
    // D'abord récupérer l'article actuel
    const currentArticle = await prisma.article.findUnique({
      where: { slug },
      include: { 
        game: true,
        tags: { include: { tag: true } }
      }
    })

    if (!currentArticle) return []

    // Chercher les articles liés (même jeu ou tags communs)
    const articles = await prisma.article.findMany({
      where: {
        AND: [
          { slug: { not: slug } }, // Exclure l'article actuel
          {
            OR: [
              { gameId: currentArticle.gameId }, // Même jeu
              {
                tags: {
                  some: {
                    tagId: {
                      in: currentArticle.tags.map(at => at.tagId)
                    }
                  }
                }
              } // Tags communs
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        game: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    return articles.map(prismaToArticle)
  }
)

// Métadonnées avec cache long (changent rarement)
export const getAllGames = unstable_cache(
  async (): Promise<string[]> => {
    const games = await prisma.game.findMany({
      select: { name: true },
      orderBy: { name: 'asc' }
    })
    return ["Tous les jeux", ...games.map(g => g.name)]
  },
  ['all-games'],
  { 
    revalidate: CACHE_DURATION.GAMES,
    tags: [CACHE_TAGS.GAMES]
  }
)

export const getAllAuthors = unstable_cache(
  async (): Promise<string[]> => {
    const authors = await prisma.article.findMany({
      select: { author: true },
      distinct: ['author'],
      orderBy: { author: 'asc' }
    })
    return authors.map(a => a.author)
  },
  ['all-authors'],
  { 
    revalidate: CACHE_DURATION.STATIC,
    tags: [CACHE_TAGS.AUTHORS]
  }
)

export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    const tags = await prisma.tag.findMany({
      select: { name: true },
      orderBy: { name: 'asc' }
    })
    return tags.map(t => t.name)
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

// Jeu individuel par slug avec cache
export const getGameBySlug = cache(
  async (slug: string) => {
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: true,
            guides: true,
          }
        },
        platforms: {
          include: {
            platform: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    })

    if (!game) return null

    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description || "",
      genre: game.genre || "",
      platforms: game.platforms.map(gp => gp.platform),
      developer: game.developer || "",
      releaseDate: game.releaseDate || "",
      imageUrl: game.imageUrl || "",
      logoUrl: game.logoUrl || "",
      isPopular: game.isPopular,
      officialSite: game.officialSite || "",
      wiki: game.wiki || "",
      articlesCount: game._count.articles,
      guidesCount: game._count.guides,
      tags: game.tags.map(t => t.tag.name),
    }
  }
)


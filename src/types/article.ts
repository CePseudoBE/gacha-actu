export interface Article {
  title: string
  summary: string
  author: string
  publishedAt: string
  game: string
  slug: string
  imageUrl?: string
  tags?: string[]
  readingTime?: number
  category?: 'news' | 'guide' | 'tier-list' | 'event'
  isPopular?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ArticleWithContent extends Article {
  content: string
  metaDescription?: string
  seoKeywords?: string[]
}

export interface ArticleFilters {
  game?: string
  category?: string
  author?: string
  tags?: string[]
  search?: string
}

export interface ArticleSortOptions {
  field: 'publishedAt' | 'title' | 'author' | 'popularity'
  order: 'asc' | 'desc'
}

export interface PaginatedArticles {
  articles: Article[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrevious: boolean
}
import { Article, ArticleWithContent, ArticleFilters, ArticleSortOptions, PaginatedArticles } from '@/types/article'
import * as dataAccess from '@/lib/data-access'

export interface IArticleService {
  getAllArticles(filters?: ArticleFilters, sort?: ArticleSortOptions, page?: number, limit?: number): Promise<PaginatedArticles>
  getArticleBySlug(slug: string): Promise<ArticleWithContent | null>
  getPopularArticles(limit?: number): Promise<Article[]>
  getArticlesByGame(game: string, limit?: number): Promise<Article[]>
  getRelatedArticles(slug: string, limit?: number): Promise<Article[]>
  getAllGames(): Promise<string[]>
  getAllAuthors(): Promise<string[]>
  getAllTags(): Promise<string[]>
}

export class ArticleService implements IArticleService {
  async getAllArticles(
    filters?: ArticleFilters, 
    sort?: ArticleSortOptions, 
    page = 1, 
    limit = 10
  ): Promise<PaginatedArticles> {
    return await dataAccess.getAllArticles(filters, sort, page, limit)
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithContent | null> {
    return await dataAccess.getArticleBySlug(slug)
  }

  async getPopularArticles(limit = 5): Promise<Article[]> {
    return await dataAccess.getPopularArticles(limit)
  }

  async getArticlesByGame(game: string, limit = 10): Promise<Article[]> {
    return await dataAccess.getArticlesByGame(game, limit)
  }

  async getRelatedArticles(slug: string, limit = 4): Promise<Article[]> {
    return await dataAccess.getRelatedArticles(slug, limit)
  }

  async getAllGames(): Promise<string[]> {
    return await dataAccess.getAllGames()
  }

  async getAllAuthors(): Promise<string[]> {
    return await dataAccess.getAllAuthors()
  }

  async getAllTags(): Promise<string[]> {
    return await dataAccess.getAllTags()
  }
}

// Singleton instance
export const articleService = new ArticleService()
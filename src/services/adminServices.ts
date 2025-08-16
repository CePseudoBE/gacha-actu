"use client"

import { ApiServiceFactory } from "./api"
import { 
  createArticleApiSchema, 
  createGuideApiSchema, 
  createGameApiSchema 
} from "@/lib/validations"

// Services spécialisés pour l'administration
export const articleService = ApiServiceFactory.create({
  baseEndpoint: '/api/admin/articles',
  createSchema: createArticleApiSchema
})

export const guideService = ApiServiceFactory.create({
  baseEndpoint: '/api/admin/guides',
  createSchema: createGuideApiSchema
})

export const gameService = ApiServiceFactory.create({
  baseEndpoint: '/api/admin/games',
  createSchema: createGameApiSchema
})

// Service pour les données référentielles
class ReferenceDataService {
  async getTags(): Promise<Array<{ name: string }>> {
    const response = await fetch('/api/admin/tags')
    if (!response.ok) throw new Error('Erreur lors du chargement des tags')
    return response.json()
  }

  async getSeoKeywords(): Promise<Array<{ keyword: string }>> {
    const response = await fetch('/api/admin/seo-keywords')
    if (!response.ok) throw new Error('Erreur lors du chargement des mots-clés SEO')
    return response.json()
  }

  async getPlatforms(): Promise<Array<{ id: string; name: string }>> {
    const response = await fetch('/api/admin/platforms')
    if (!response.ok) throw new Error('Erreur lors du chargement des plateformes')
    return response.json()
  }
}

export const referenceDataService = new ReferenceDataService()
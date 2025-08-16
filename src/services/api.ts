"use client"

import { validateApiData } from "@/lib/validations"
import { z } from "zod"

// Interface pour le service API de base
interface ApiService<TCreateData, TUpdateData = Partial<TCreateData>> {
  create(data: TCreateData): Promise<unknown>
  getAll(): Promise<unknown[]>
  getById(id: string): Promise<unknown>
  update(id: string, data: TUpdateData): Promise<unknown>
  delete(id: string): Promise<void>
}

// Configuration pour chaque service
interface ApiServiceConfig<TCreateSchema extends z.ZodSchema> {
  baseEndpoint: string
  createSchema: TCreateSchema
}

// Factory pour créer des services API
class ApiServiceFactory {
  static create<TCreateSchema extends z.ZodSchema>(
    config: ApiServiceConfig<TCreateSchema>
  ): ApiService<z.infer<TCreateSchema>> {
    return new BaseApiService(config)
  }
}

// Implémentation de base du service API
class BaseApiService<TCreateSchema extends z.ZodSchema> 
  implements ApiService<z.infer<TCreateSchema>> {
  
  constructor(private config: ApiServiceConfig<TCreateSchema>) {}

  async create(data: z.infer<TCreateSchema>): Promise<unknown> {
    // Validation côté client
    const validatedData = validateApiData(this.config.createSchema, data)
    
    const response = await fetch(this.config.baseEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la création')
    }

    return response.json()
  }

  async getAll(): Promise<unknown[]> {
    const response = await fetch(this.config.baseEndpoint)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données')
    }

    return response.json()
  }

  async getById(id: string): Promise<unknown> {
    const response = await fetch(`${this.config.baseEndpoint}/${id}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données')
    }

    return response.json()
  }

  async update(id: string, data: Partial<z.infer<TCreateSchema>>): Promise<unknown> {
    const response = await fetch(`${this.config.baseEndpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la mise à jour')
    }

    return response.json()
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.config.baseEndpoint}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression')
    }
  }
}

export { ApiServiceFactory, type ApiService, type ApiServiceConfig }
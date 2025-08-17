import { z } from "zod"

// === ENUMS ET CONSTANTES ===
export const ARTICLE_CATEGORIES = ["NEWS", "GUIDE", "TIER_LIST", "EVENT"] as const
export const DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const
export const GUIDE_TYPES = [
  "CHARACTER_BUILD", 
  "TEAM_COMP", 
  "EQUIPMENT", 
  "STRATEGY", 
  "BEGINNER", 
  "ADVANCED", 
  "EVENT_GUIDE", 
  "FARMING"
] as const

// === SCHÉMAS DE BASE RÉUTILISABLES ===
const baseStringField = (message: string) => z.string().min(1, message)
const optionalUrlField = (message: string = "URL invalide") => 
  z.string().url(message).optional().or(z.literal(""))

// Schéma pour les champs communs à tous les contenus
const baseContentSchema = z.object({
  title: baseStringField("Le titre est requis"),
  slug: baseStringField("Le slug est requis"),
  author: baseStringField("L'auteur est requis"),
  gameId: baseStringField("Veuillez sélectionner un jeu"),
  imageUrl: optionalUrlField(),
  readingTime: z.number().min(1, "Le temps de lecture doit être positif").optional(),
  metaDescription: z.string().max(160, "Maximum 160 caractères").optional(),
  isPopular: z.boolean(),
  tags: z.array(z.string()),
  seoKeywords: z.array(z.string())
})

// Schéma pour le résumé avec validation personnalisée
const summarySchema = (minLength: number) => 
  z.string().min(minLength, `Le résumé doit faire au moins ${minLength} caractères`)

// Schéma pour le contenu avec validation personnalisée  
const contentSchema = (minLength: number) =>
  z.string().min(minLength, `Le contenu doit faire au moins ${minLength} caractères`)

// Schéma pour les sections de guide
const guideSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre de la section est requis"),
  content: z.string().min(1, "Le contenu de la section est requis"),
  order: z.number().int().min(0)
})

// === SCHÉMAS POUR LES FORMULAIRES ===

// Schéma pour les articles
export const articleFormSchema = baseContentSchema.extend({
  summary: summarySchema(50),
  content: contentSchema(200),
  category: z.enum(ARTICLE_CATEGORIES),
  publishedAt: baseStringField("La date de publication est requise")
})

// Schéma pour les guides  
export const guideFormSchema = baseContentSchema.extend({
  summary: summarySchema(50),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  guideType: z.enum(GUIDE_TYPES),
  sections: z.array(guideSectionSchema).min(1, "Le guide doit contenir au moins une section")
})

// Schéma pour les jeux
export const gameFormSchema = z.object({
  name: baseStringField("Le nom du jeu est requis"),
  slug: baseStringField("Le slug est requis"),
  description: z.string().optional(),
  genre: z.string().optional(),
  developer: z.string().optional(),
  releaseDate: z.string().optional(),
  imageUrl: optionalUrlField(),
  logoUrl: optionalUrlField(),
  officialSite: optionalUrlField(),
  wiki: optionalUrlField(),
  isPopular: z.boolean(),
  platformIds: z.array(z.string())
})

// === SCHÉMAS AVEC TRANSFORMATIONS POUR L'API CÔTÉ CLIENT ===
export const createArticleSchema = articleFormSchema.extend({
  readingTime: z.string().transform((val) => val ? parseInt(val) : null),
  publishedAt: z.string().transform((val) => new Date(val).toISOString())
})

export const createGuideSchema = guideFormSchema.extend({
  readingTime: z.string().transform((val) => val ? parseInt(val) : null)
})

// === FACTORY POUR SCHÉMAS API (CÔTÉ SERVEUR) ===
const createApiSchema = <T extends z.ZodRawShape>(baseSchema: z.ZodObject<T>) => {
  return baseSchema
    .omit({ tags: true, seoKeywords: true })
    .extend({
      tags: z.array(z.string()).optional(),
      seoKeywords: z.array(z.string()).optional()
    })
    .partial()
    .extend({
      title: z.string().min(1),
      slug: z.string().min(1),
      author: z.string().min(1),
      gameId: z.string().min(1)
    })
}

// Schémas API spécialisés
export const createArticleApiSchema = createApiSchema(articleFormSchema).extend({
  summary: z.string().min(50),
  content: z.string().min(200),
  category: z.enum(ARTICLE_CATEGORIES).optional(),
  publishedAt: z.string().datetime().optional(),
  readingTime: z.number().min(1).optional().nullable()
})

export const createGuideApiSchema = createApiSchema(guideFormSchema).extend({
  summary: z.string().min(50),
  difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
  guideType: z.enum(GUIDE_TYPES).optional(),
  readingTime: z.number().min(1).optional().nullable(),
  sections: z.array(guideSectionSchema).min(1, "Le guide doit contenir au moins une section")
})

export const createGameApiSchema = gameFormSchema
  .omit({ platformIds: true })
  .extend({
    platformIds: z.array(z.string()).optional()
  })
  .partial()
  .extend({
    name: z.string().min(1),
    slug: z.string().min(1)
  })

// === TYPES INFÉRÉS ===
export type ArticleFormData = z.infer<typeof articleFormSchema>
export type CreateArticleData = z.infer<typeof createArticleSchema>
export type GuideFormData = z.infer<typeof guideFormSchema>
export type CreateGuideData = z.infer<typeof createGuideSchema>
export type GameFormData = z.infer<typeof gameFormSchema>
export type CreateGameData = z.infer<typeof createGameApiSchema>

// === UTILITAIRES DE VALIDATION ===
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.flatten().fieldErrors
  }
}

export const validateApiData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.flatten().fieldErrors))
  }
  return result.data
}
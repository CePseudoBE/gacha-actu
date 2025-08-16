import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAll } from '@/lib/data-access'
import { createArticleApiSchema } from '@/lib/validations'
import { 
  validateAndSanitize, 
  sanitize, 
  addSecurityHeaders,
  SecurityError 
} from '@/lib/security'
import { requireAdminAuth } from '@/lib/auth-middleware'

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    
    // Validation et sanitisation sécurisées
    const validatedData = validateAndSanitize(body, (data) => {
      const result = createArticleApiSchema.safeParse(data)
      if (!result.success) {
        throw new Error('Validation failed')
      }
      return result.data
    })

    // Sanitisation supplémentaire pour les champs sensibles
    const sanitizedData = {
      ...validatedData,
      title: sanitize.text(validatedData.title),
      slug: sanitize.slug(validatedData.slug),
      summary: sanitize.text(validatedData.summary),
      content: sanitize.html(validatedData.content), // Permet le HTML sécurisé
      author: sanitize.text(validatedData.author),
      imageUrl: validatedData.imageUrl ? sanitize.url(validatedData.imageUrl) : null,
      metaDescription: validatedData.metaDescription ? sanitize.text(validatedData.metaDescription) : null
    }

    // Vérification de la longueur des champs critiques
    if (sanitizedData.title.length < 3 || sanitizedData.title.length > 200) {
      throw new SecurityError('Titre invalide', 'INVALID_TITLE', 400)
    }

    if (sanitizedData.slug.length < 3 || sanitizedData.slug.length > 100) {
      throw new SecurityError('Slug invalide', 'INVALID_SLUG', 400)
    }

    // Vérifier si le slug existe déjà
    const existingArticle = await prisma.article.findUnique({
      where: { slug: sanitizedData.slug }
    })

    if (existingArticle) {
      throw new SecurityError('Un article avec ce slug existe déjà', 'DUPLICATE_SLUG', 409)
    }

    // Vérifier que le jeu existe
    const gameExists = await prisma.game.findUnique({
      where: { id: sanitizedData.gameId }
    })

    if (!gameExists) {
      throw new SecurityError('Jeu non trouvé', 'GAME_NOT_FOUND', 400)
    }

    // Créer l'article avec transaction sécurisée
    const article = await prisma.$transaction(async (tx) => {
      const createdArticle = await tx.article.create({
        data: {
          title: sanitizedData.title,
          slug: sanitizedData.slug,
          summary: sanitizedData.summary,
          content: sanitizedData.content,
          author: sanitizedData.author,
          gameId: sanitizedData.gameId,
          category: sanitizedData.category || 'NEWS',
          imageUrl: sanitizedData.imageUrl,
          readingTime: sanitizedData.readingTime,
          metaDescription: sanitizedData.metaDescription,
          isPopular: sanitizedData.isPopular || false,
          publishedAt: sanitizedData.publishedAt ? new Date(sanitizedData.publishedAt) : new Date(),
        }
      })

      // Traiter les tags de manière sécurisée
      if (sanitizedData.tags && sanitizedData.tags.length > 0) {
        // Limiter le nombre de tags
        const limitedTags = sanitizedData.tags.slice(0, 10)
        
        for (const tagName of limitedTags) {
          const cleanTagName = sanitize.text(tagName).substring(0, 50)
          if (cleanTagName.length < 2) continue

          let tag = await tx.tag.findFirst({
            where: { name: cleanTagName }
          })

          if (!tag) {
            tag = await tx.tag.create({
              data: { 
                name: cleanTagName, 
                slug: sanitize.slug(cleanTagName)
              }
            })
          }

          // Vérifier si la relation existe déjà
          const existingRelation = await tx.articleTag.findFirst({
            where: {
              articleId: createdArticle.id,
              tagId: tag.id
            }
          })

          if (!existingRelation) {
            await tx.articleTag.create({
              data: {
                articleId: createdArticle.id,
                tagId: tag.id
              }
            })
          }
        }
      }

      // Traiter les mots-clés SEO de manière sécurisée
      if (sanitizedData.seoKeywords && sanitizedData.seoKeywords.length > 0) {
        const limitedKeywords = sanitizedData.seoKeywords.slice(0, 20)
        
        for (const keywordText of limitedKeywords) {
          const cleanKeyword = sanitize.text(keywordText).substring(0, 100)
          if (cleanKeyword.length < 2) continue

          let keyword = await tx.seoKeyword.findFirst({
            where: { keyword: cleanKeyword }
          })

          if (!keyword) {
            keyword = await tx.seoKeyword.create({
              data: { keyword: cleanKeyword }
            })
          }

          const existingRelation = await tx.articleSeoKeyword.findFirst({
            where: {
              articleId: createdArticle.id,
              keywordId: keyword.id
            }
          })

          if (!existingRelation) {
            await tx.articleSeoKeyword.create({
              data: {
                articleId: createdArticle.id,
                keywordId: keyword.id
              }
            })
          }
        }
      }

      return createdArticle
    })

    // Revalider le cache de manière sécurisée
    try {
      await revalidateAll()
    } catch (cacheError) {
      console.warn('Cache revalidation failed:', cacheError)
      // Ne pas faire échouer la création pour un problème de cache
    }

    // Retourner seulement les données nécessaires
    const response = NextResponse.json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug
      }
    }, { status: 201 })

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    
    if (error instanceof SecurityError) {
      const response = NextResponse.json({
        success: false,
        error: error.message,
        code: error.code
      }, { status: error.statusCode })
      return addSecurityHeaders(response)
    }

    const response = NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

async function handleGET(_request: NextRequest, _user: unknown) {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        author: true,
        category: true,
        isPopular: true,
        publishedAt: true,
        createdAt: true,
        readingTime: true,
        game: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            tags: true,
            seoKeywords: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100 // Limiter le nombre de résultats
    })

    const response = NextResponse.json({
      success: true,
      data: articles
    })

    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    
    const response = NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

// Routes sécurisées avec middleware d'authentification
export const POST = requireAdminAuth(handlePOST)
export const GET = requireAdminAuth(handleGET)
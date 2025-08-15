import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAll } from '@/lib/data-access'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    if (!body.title || !body.slug || !body.summary || !body.content || !body.author || !body.gameId) {
      return NextResponse.json(
        { error: 'Tous les champs marqués * sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà
    const existingArticle = await prisma.article.findUnique({
      where: { slug: body.slug }
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Un article avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer l'article avec transaction pour gérer les tags et keywords
    const article = await prisma.$transaction(async (tx) => {
      // Créer l'article
      const createdArticle = await tx.article.create({
        data: {
          title: body.title,
          slug: body.slug,
          summary: body.summary,
          content: body.content,
          author: body.author,
          gameId: body.gameId,
          category: body.category || 'NEWS',
          imageUrl: body.imageUrl || null,
          readingTime: body.readingTime || null,
          metaDescription: body.metaDescription || null,
          isPopular: body.isPopular || false,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        }
      })

      // Traiter les tags
      if (body.tags && body.tags.length > 0) {
        for (const tagName of body.tags) {
          // Créer le tag s'il n'existe pas
          let tag = await tx.tag.findFirst({
            where: { name: tagName }
          })

          if (!tag) {
            const slug = tagName
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
            
            tag = await tx.tag.create({
              data: { name: tagName, slug }
            })
          }

          // Lier le tag à l'article
          await tx.articleTag.create({
            data: {
              articleId: createdArticle.id,
              tagId: tag.id
            }
          })
        }
      }

      // Traiter les mots-clés SEO
      if (body.seoKeywords && body.seoKeywords.length > 0) {
        for (const keywordText of body.seoKeywords) {
          // Créer le keyword s'il n'existe pas
          let keyword = await tx.seoKeyword.findFirst({
            where: { keyword: keywordText }
          })

          if (!keyword) {
            keyword = await tx.seoKeyword.create({
              data: { keyword: keywordText }
            })
          }

          // Lier le keyword à l'article
          await tx.articleSeoKeyword.create({
            data: {
              articleId: createdArticle.id,
              keywordId: keyword.id
            }
          })
        }
      }

      return createdArticle
    })

    // Revalider le cache
    await revalidateAll()

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        game: {
          select: {
            name: true,
            imageUrl: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
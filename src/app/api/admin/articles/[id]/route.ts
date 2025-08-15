import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAll } from '@/lib/data-access'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            name: true
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
        },
        seoKeywords: {
          include: {
            keyword: {
              select: {
                keyword: true
              }
            }
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validation des données requises
    if (!body.title || !body.slug || !body.summary || !body.content || !body.author || !body.gameId) {
      return NextResponse.json(
        { error: 'Tous les champs marqués * sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà pour un autre article
    const existingArticle = await prisma.article.findFirst({
      where: { 
        slug: body.slug,
        NOT: { id }
      }
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Un autre article avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Mettre à jour l'article avec transaction pour gérer les tags et keywords
    const article = await prisma.$transaction(async (tx) => {
      // Supprimer les anciennes relations tags et keywords
      await tx.articleTag.deleteMany({
        where: { articleId: id }
      })
      
      await tx.articleSeoKeyword.deleteMany({
        where: { articleId: id }
      })

      // Mettre à jour l'article
      const updatedArticle = await tx.article.update({
        where: { id },
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

      // Traiter les nouveaux tags
      if (body.tags && body.tags.length > 0) {
        for (const tagName of body.tags) {
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

          await tx.articleTag.create({
            data: {
              articleId: id,
              tagId: tag.id
            }
          })
        }
      }

      // Traiter les nouveaux mots-clés SEO
      if (body.seoKeywords && body.seoKeywords.length > 0) {
        for (const keywordText of body.seoKeywords) {
          let keyword = await tx.seoKeyword.findFirst({
            where: { keyword: keywordText }
          })

          if (!keyword) {
            keyword = await tx.seoKeyword.create({
              data: { keyword: keywordText }
            })
          }

          await tx.articleSeoKeyword.create({
            data: {
              articleId: id,
              keywordId: keyword.id
            }
          })
        }
      }

      return updatedArticle
    })

    // Revalider le cache
    await revalidateAll()

    return NextResponse.json(article)
  } catch (error) {
    console.error('Erreur lors de la modification de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Supprimer l'article et ses relations
    await prisma.$transaction(async (tx) => {
      // Supprimer les relations
      await tx.articleTag.deleteMany({
        where: { articleId: id }
      })
      
      await tx.articleSeoKeyword.deleteMany({
        where: { articleId: id }
      })

      // Supprimer l'article
      await tx.article.delete({
        where: { id }
      })
    })

    // Revalider le cache
    await revalidateAll()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
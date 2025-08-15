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
    const existingGuide = await prisma.guide.findUnique({
      where: { slug: body.slug }
    })

    if (existingGuide) {
      return NextResponse.json(
        { error: 'Un guide avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer le guide
    const guide = await prisma.guide.create({
      data: {
        title: body.title,
        slug: body.slug,
        summary: body.summary,
        content: body.content,
        author: body.author,
        gameId: body.gameId,
        guideType: body.guideType || 'GENERAL',
        difficulty: body.difficulty || 'BEGINNER',
        imageUrl: body.imageUrl || null,
        readingTime: body.readingTime || null,
        metaDescription: body.metaDescription || null,
        isPopular: body.isPopular || false,
        publishedAt: new Date(),
      },
      include: {
        game: {
          select: {
            name: true
          }
        }
      }
    })

    // Revalider le cache
    await revalidateAll()

    return NextResponse.json(guide, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du guide:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({
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

    return NextResponse.json(guides)
  } catch (error) {
    console.error('Erreur lors de la récupération des guides:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
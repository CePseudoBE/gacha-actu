import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAll } from '@/lib/data-access'
import { createGuideApiSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation avec Zod
    const validationResult = createGuideApiSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data

    // Vérifier si le slug existe déjà
    const existingGuide = await prisma.guide.findUnique({
      where: { slug: validatedData.slug }
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
        title: validatedData.title,
        slug: validatedData.slug,
        summary: validatedData.summary,
        content: validatedData.content,
        author: validatedData.author,
        gameId: validatedData.gameId,
        guideType: validatedData.guideType || 'STRATEGY',
        difficulty: validatedData.difficulty || 'BEGINNER',
        imageUrl: validatedData.imageUrl || null,
        readingTime: validatedData.readingTime || null,
        metaDescription: validatedData.metaDescription || null,
        isPopular: validatedData.isPopular || false,
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
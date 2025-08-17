import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateAll } from '@/lib/data-access'
import { createGuideApiSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { validateAndSanitize, addSecurityHeaders } from '@/lib/security'

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    
    // Validation et sanitisation sécurisées
    const validatedData = validateAndSanitize(body, (data) => {
      const result = createGuideApiSchema.safeParse(data)
      if (!result.success) {
        throw new Error('Validation failed')
      }
      return result.data
    })

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

    // Créer le guide avec les sections
    const guide = await prisma.guide.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        summary: validatedData.summary,
        author: validatedData.author,
        gameId: validatedData.gameId,
        guideType: validatedData.guideType || 'STRATEGY',
        difficulty: validatedData.difficulty || 'BEGINNER',
        imageUrl: validatedData.imageUrl || null,
        readingTime: validatedData.readingTime || null,
        metaDescription: validatedData.metaDescription || null,
        isPopular: validatedData.isPopular || false,
        publishedAt: new Date(),
        // Créer les sections (obligatoires maintenant)
        sections: {
          create: validatedData.sections.map((section, index) => ({
            title: section.title,
            content: section.content,
            order: index
          }))
        }
      },
      include: {
        game: {
          select: {
            name: true
          }
        },
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Revalider le cache
    await revalidateAll()

    const response = NextResponse.json(guide, { status: 201 })
    return addSecurityHeaders(response)
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

    const response = NextResponse.json(guides)
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des guides:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Protéger la route POST avec authentification admin
export const POST = requireAdminAuth(handlePOST)
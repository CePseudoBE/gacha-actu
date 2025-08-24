import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateGames } from '@/lib/data-access'
import { createGameApiSchema } from '@/lib/validations'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { validateAndSanitize, addSecurityHeaders } from '@/lib/security'

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    
    // Validation et sanitisation sécurisées
    const validatedData = validateAndSanitize(body, (data) => {
      const result = createGameApiSchema.safeParse(data)
      if (!result.success) {
        throw new Error('Validation failed')
      }
      return result.data
    })

    // Vérifier si le slug existe déjà
    const existingGame = await prisma.game.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'Un jeu avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer le jeu avec les plateformes
    const game = await prisma.$transaction(async (tx: any) => {
      // Créer le jeu
      const createdGame = await tx.game.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description || null,
          genre: validatedData.genre || null,
          developer: validatedData.developer || null,
          releaseDate: validatedData.releaseDate || null,
          imageUrl: validatedData.imageUrl || null,
          logoUrl: validatedData.logoUrl || null,
          officialSite: validatedData.officialSite || null,
          wiki: validatedData.wiki || null,
          isPopular: validatedData.isPopular || false,
        }
      })

      // Ajouter les plateformes
      if (validatedData.platformIds && validatedData.platformIds.length > 0) {
        for (const platformId of validatedData.platformIds) {
          await tx.gamePlatform.create({
            data: {
              gameId: createdGame.id,
              platformId: platformId
            }
          })
        }
      }

      return createdGame
    })

    // Revalider le cache
    await revalidateGames()

    const response = NextResponse.json(game, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            articles: true,
            guides: true,
          }
        },
        platforms: {
          include: {
            platform: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const response = NextResponse.json(games)
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Protéger la route POST avec authentification admin
export const POST = requireAdminAuth(handlePOST)
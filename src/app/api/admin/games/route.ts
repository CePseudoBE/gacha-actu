import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateGames } from '@/lib/data-access'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données requises
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Le nom et le slug sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà
    const existingGame = await prisma.game.findUnique({
      where: { slug: body.slug }
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'Un jeu avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Créer le jeu avec les plateformes
    const game = await prisma.$transaction(async (tx) => {
      // Créer le jeu
      const createdGame = await tx.game.create({
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          genre: body.genre || null,
          developer: body.developer || null,
          releaseDate: body.releaseDate || null,
          imageUrl: body.imageUrl || null,
          logoUrl: body.logoUrl || null,
          officialSite: body.officialSite || null,
          wiki: body.wiki || null,
          isPopular: body.isPopular || false,
        }
      })

      // Ajouter les plateformes
      if (body.platformIds && body.platformIds.length > 0) {
        for (const platformId of body.platformIds) {
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

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
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

    return NextResponse.json(games)
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
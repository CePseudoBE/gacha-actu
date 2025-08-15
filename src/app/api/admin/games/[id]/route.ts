import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateGames } from '@/lib/data-access'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            guides: true,
          }
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Jeu non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu:', error)
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
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Le nom et le slug sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le slug existe déjà pour un autre jeu
    const existingGame = await prisma.game.findFirst({
      where: { 
        slug: body.slug,
        NOT: { id }
      }
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'Un autre jeu avec ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Mettre à jour le jeu avec les plateformes
    const game = await prisma.$transaction(async (tx) => {
      // Mettre à jour le jeu
      const updatedGame = await tx.game.update({
        where: { id },
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

      // Gérer les plateformes si fournies
      if (body.platformIds !== undefined) {
        // Supprimer les anciennes relations
        await tx.gamePlatform.deleteMany({
          where: { gameId: id }
        })

        // Ajouter les nouvelles plateformes
        if (body.platformIds && body.platformIds.length > 0) {
          for (const platformId of body.platformIds) {
            await tx.gamePlatform.create({
              data: {
                gameId: id,
                platformId: platformId
              }
            })
          }
        }
      }

      return updatedGame
    })

    // Revalider le cache
    await revalidateGames()

    return NextResponse.json(game)
  } catch (error) {
    console.error('Erreur lors de la modification du jeu:', error)
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
    // Vérifier si le jeu a des articles ou guides associés
    const gameWithContent = await prisma.game.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
            guides: true,
          }
        }
      }
    })

    if (!gameWithContent) {
      return NextResponse.json(
        { error: 'Jeu non trouvé' },
        { status: 404 }
      )
    }

    if (gameWithContent._count.articles > 0 || gameWithContent._count.guides > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un jeu qui a des articles ou guides associés' },
        { status: 400 }
      )
    }

    // Supprimer le jeu
    await prisma.game.delete({
      where: { id }
    })

    // Revalider le cache
    await revalidateGames()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
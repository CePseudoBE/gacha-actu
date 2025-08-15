import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const popular = searchParams.get('popular')
  const genre = searchParams.get('genre')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (popular === 'true') {
      where.isPopular = true
    }
    
    if (genre) {
      where.genre = genre
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: {
          _count: {
            select: {
              articles: true,
              guides: true,
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                }
              }
            }
          }
        },
        orderBy: [
          { isPopular: 'desc' },
          { name: 'asc' }
        ],
        skip,
        take: limit,
      }),
      prisma.game.count({ where })
    ])

    const formattedGames = games.map(game => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description,
      genre: game.genre,
      developer: game.developer,
      releaseDate: game.releaseDate,
      imageUrl: game.imageUrl,
      logoUrl: game.logoUrl,
      isPopular: game.isPopular,
      officialSite: game.officialSite,
      wiki: game.wiki,
      articlesCount: game._count.articles,
      guidesCount: game._count.guides,
      tags: game.tags.map(t => t.tag.name),
    }))

    return NextResponse.json({
      games: formattedGames,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + games.length < total,
        hasPrevPage: page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
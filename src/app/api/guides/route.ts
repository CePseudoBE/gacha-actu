import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameId = searchParams.get('gameId')
  const guideType = searchParams.get('guideType')
  const difficulty = searchParams.get('difficulty')
  const popular = searchParams.get('popular')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (gameId) {
      where.gameId = gameId
    }
    
    if (guideType) {
      where.guideType = guideType
    }
    
    if (difficulty) {
      where.difficulty = difficulty
    }
    
    if (popular === 'true') {
      where.isPopular = true
    }

    const [guides, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        include: {
          game: {
            select: {
              name: true,
              slug: true,
              imageUrl: true,
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
          },
          _count: {
            select: {
              sections: true,
            }
          }
        },
        orderBy: [
          { isPopular: 'desc' },
          { publishedAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.guide.count({ where })
    ])

    const formattedGuides = guides.map(guide => ({
      id: guide.id,
      title: guide.title,
      summary: guide.summary,
      author: guide.author,
      publishedAt: guide.publishedAt.toISOString(),
      slug: guide.slug,
      imageUrl: guide.imageUrl,
      readingTime: guide.readingTime,
      difficulty: guide.difficulty,
      guideType: guide.guideType,
      isPopular: guide.isPopular,
      viewCount: guide.viewCount,
      game: guide.game.name,
      gameSlug: guide.game.slug,
      tags: guide.tags.map(t => t.tag.name),
      sectionsCount: guide._count.sections,
    }))

    return NextResponse.json({
      guides: formattedGuides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + guides.length < total,
        hasPrevPage: page > 1,
      }
    })

  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
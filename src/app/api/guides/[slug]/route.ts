import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params

  try {
    const guide = await prisma.guide.findUnique({
      where: { slug },
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
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        prerequisites: true,
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

    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      )
    }

    // Incrémente le nombre de vues
    await prisma.guide.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    const formattedGuide = {
      id: guide.id,
      title: guide.title,
      summary: guide.summary,
      content: guide.content,
      author: guide.author,
      publishedAt: guide.publishedAt.toISOString(),
      updatedAt: guide.updatedAt.toISOString(),
      slug: guide.slug,
      imageUrl: guide.imageUrl,
      readingTime: guide.readingTime,
      difficulty: guide.difficulty,
      guideType: guide.guideType,
      isPopular: guide.isPopular,
      viewCount: guide.viewCount + 1, // Include the incremented view count
      metaDescription: guide.metaDescription,
      game: guide.game.name,
      gameSlug: guide.game.slug,
      gameImageUrl: guide.game.imageUrl,
      tags: guide.tags.map(t => t.tag.name),
      sections: guide.sections.map(section => ({
        id: section.id,
        title: section.title,
        content: section.content,
        order: section.order,
      })),
      prerequisites: guide.prerequisites.map(req => req.description),
      seoKeywords: guide.seoKeywords.map(k => k.keyword.keyword),
    }

    return NextResponse.json({ guide: formattedGuide })

  } catch (error) {
    console.error('Error fetching guide:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
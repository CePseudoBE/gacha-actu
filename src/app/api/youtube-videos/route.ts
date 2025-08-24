import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addSecurityHeaders } from '@/lib/security'

export async function GET() {
  try {
    const videos = await prisma.youTubeVideo.findMany({
      where: {
        isActive: true
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Formatter les données pour le frontend
    const formattedVideos = videos.map((video: any) => ({
      id: video.id,
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt?.toISOString(),
      category: video.category,
      duration: video.duration,
      game: video.game
    }))

    const response = NextResponse.json({ 
      success: true, 
      data: formattedVideos,
      count: formattedVideos.length 
    })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos YouTube:', error)
    const response = NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}
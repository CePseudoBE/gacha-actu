import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { validateAndSanitize, addSecurityHeaders, sanitize } from '@/lib/security'
import { z } from 'zod'

// Schéma de validation pour les vidéos YouTube
const createYouTubeVideoSchema = z.object({
  videoId: z.string().min(1, "L'ID vidéo est requis"),
  title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
  description: z.string().optional().or(z.literal("")),
  thumbnail: z.union([
    z.string().url("L'URL de la thumbnail doit être valide"),
    z.literal(""),
    z.undefined()
  ]).optional(),
  channelTitle: z.string().optional().or(z.literal("")),
  publishedAt: z.union([
    z.string().datetime("Format de date invalide"), // ISO avec timezone
    z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Format datetime-local invalide"), // datetime-local format
    z.literal(""),
    z.undefined()
  ]).optional(),
  category: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  gameId: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0)
})

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    
    // Validation avec Zod
    const result = createYouTubeVideoSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation errors:', result.error)
      const errors = result.error?.issues?.map(err => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Erreurs de validation inconnues'
      const response = NextResponse.json(
        { success: false, error: `Erreurs de validation: ${errors}` },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    const validatedData = result.data

    // Sanitisation supplémentaire
    const sanitizedData = {
      ...validatedData,
      title: sanitize.text(validatedData.title),
      description: validatedData.description ? sanitize.text(validatedData.description) : null,
      thumbnail: validatedData.thumbnail ? sanitize.url(validatedData.thumbnail) : null,
      channelTitle: validatedData.channelTitle ? sanitize.text(validatedData.channelTitle) : null,
      category: validatedData.category ? sanitize.text(validatedData.category) : null,
      duration: validatedData.duration ? sanitize.text(validatedData.duration) : null
    }

    // Vérifier si le videoId existe déjà
    const existingVideo = await prisma.youTubeVideo.findUnique({
      where: { videoId: sanitizedData.videoId }
    })

    if (existingVideo) {
      const response = NextResponse.json(
        { success: false, error: 'Une vidéo avec cet ID existe déjà' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // Créer la vidéo
    const video = await prisma.youTubeVideo.create({
      data: {
        videoId: sanitizedData.videoId,
        title: sanitizedData.title,
        description: sanitizedData.description,
        thumbnail: sanitizedData.thumbnail,
        channelTitle: sanitizedData.channelTitle,
        publishedAt: sanitizedData.publishedAt ? new Date(sanitizedData.publishedAt) : null,
        category: sanitizedData.category,
        duration: sanitizedData.duration,
        gameId: sanitizedData.gameId || null,
        isActive: sanitizedData.isActive,
        order: sanitizedData.order
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    const response = NextResponse.json({ success: true, data: video }, { status: 201 })
    return addSecurityHeaders(response)

  } catch (error) {
    console.error('Erreur lors de la création de la vidéo YouTube:', error)
    const response = NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

export async function GET() {
  try {
    const videos = await prisma.youTubeVideo.findMany({
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
        { createdAt: 'desc' }
      ]
    })

    const response = NextResponse.json({ success: true, data: videos })
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

// Protéger la route POST avec authentification admin
export const POST = requireAdminAuth(handlePOST)
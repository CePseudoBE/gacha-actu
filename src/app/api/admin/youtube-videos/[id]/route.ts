import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { addSecurityHeaders, sanitize } from '@/lib/security'

async function handleGET(
  request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const video = await prisma.youTubeVideo.findUnique({
      where: { id },
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

    if (!video) {
      const response = NextResponse.json(
        { success: false, error: 'Vidéo non trouvée' },
        { status: 404 }
      )
      return addSecurityHeaders(response)
    }

    const response = NextResponse.json({ success: true, data: video })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error)
    const response = NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

async function handlePUT(
  request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Sanitisation des données
    const sanitizedData = {
      title: body.title ? sanitize.text(body.title) : undefined,
      description: body.description ? sanitize.text(body.description) : null,
      thumbnail: body.thumbnail ? sanitize.url(body.thumbnail) : null,
      channelTitle: body.channelTitle ? sanitize.text(body.channelTitle) : null,
      category: body.category ? sanitize.text(body.category) : null,
      duration: body.duration ? sanitize.text(body.duration) : null,
      gameId: body.gameId || null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
      order: body.order !== undefined ? Number(body.order) : undefined,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
    }

    // Supprimer les undefined
    const updateData = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, value]) => value !== undefined)
    )

    const video = await prisma.youTubeVideo.update({
      where: { id },
      data: updateData,
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

    const response = NextResponse.json({ success: true, data: video })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo:', error)
    const response = NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

async function handleDELETE(
  request: NextRequest,
  _user: unknown,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.youTubeVideo.delete({
      where: { id }
    })

    const response = NextResponse.json({ success: true, message: 'Vidéo supprimée avec succès' })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error)
    const response = NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Exports sécurisés
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdminAuth(async (req, user) => {
    return handleGET(req, user, { params })
  })(request)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdminAuth(async (req, user) => {
    return handlePUT(req, user, { params })
  })(request)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdminAuth(async (req, user) => {
    return handleDELETE(req, user, { params })
  })(request)
}
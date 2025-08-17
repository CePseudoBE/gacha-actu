import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { addSecurityHeaders, sanitize } from '@/lib/security'

export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      include: {
        _count: {
          select: {
            games: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const response = NextResponse.json(platforms)
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des plateformes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    
    // Validation et sanitisation
    const sanitizedData = {
      name: sanitize.text(body.name || ''),
      color: body.color ? sanitize.text(body.color) : null
    }
    
    const { name, color } = sanitizedData
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom de la plateforme est requis' },
        { status: 400 }
      )
    }

    // Créer le slug à partir du nom
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Vérifier si la plateforme existe déjà
    const existingPlatform = await prisma.platform.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug }
        ]
      }
    })

    if (existingPlatform) {
      return NextResponse.json(
        { error: 'Une plateforme avec ce nom existe déjà' },
        { status: 400 }
      )
    }

    // Créer la nouvelle plateforme
    const platform = await prisma.platform.create({
      data: {
        name: name.trim(),
        slug,
        color: color || null
      }
    })

    const response = NextResponse.json(platform, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la création de la plateforme:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

// Protéger la route POST avec authentification admin
export const POST = requireAdminAuth(handlePOST)
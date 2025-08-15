import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Erreur lors de la récupération des plateformes:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()
    
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

    return NextResponse.json(platform, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la plateforme:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
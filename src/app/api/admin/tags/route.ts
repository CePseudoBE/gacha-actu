import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom du tag est requis' },
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

    // Vérifier si le tag existe déjà
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug }
        ]
      }
    })

    if (existingTag) {
      return NextResponse.json(existingTag)
    }

    // Créer le nouveau tag
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
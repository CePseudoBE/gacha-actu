import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { addSecurityHeaders, sanitize } from '@/lib/security'

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

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    const name = sanitize.text(body.name || '')
    
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

    const response = NextResponse.json(tag, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

export const POST = requireAdminAuth(handlePOST)
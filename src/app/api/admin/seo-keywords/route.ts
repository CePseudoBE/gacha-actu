import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { addSecurityHeaders, sanitize } from '@/lib/security'

export async function GET() {
  try {
    const keywords = await prisma.seoKeyword.findMany({
      orderBy: { keyword: 'asc' }
    })

    return NextResponse.json(keywords)
  } catch (error) {
    console.error('Erreur lors de la récupération des mots-clés SEO:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest, _user: unknown) {
  try {
    const body = await request.json()
    const keyword = sanitize.text(body.keyword || '')
    
    if (!keyword || !keyword.trim()) {
      return NextResponse.json(
        { error: 'Le mot-clé est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le mot-clé existe déjà
    const existingKeyword = await prisma.seoKeyword.findFirst({
      where: { keyword: keyword.trim() }
    })

    if (existingKeyword) {
      return NextResponse.json(existingKeyword)
    }

    // Créer le nouveau mot-clé
    const seoKeyword = await prisma.seoKeyword.create({
      data: {
        keyword: keyword.trim()
      }
    })

    const response = NextResponse.json(seoKeyword, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Erreur lors de la création du mot-clé SEO:', error)
    const response = NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
    return addSecurityHeaders(response)
  }
}

export const POST = requireAdminAuth(handlePOST)
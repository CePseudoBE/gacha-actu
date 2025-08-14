import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug manquant' 
        },
        { status: 400 }
      )
    }
    
    // Récupération de l'article
    const article = await getArticleBySlug(slug)
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Récupération des articles liés
    const relatedArticles = await getRelatedArticles(slug, 4)
    
    return NextResponse.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    })
    
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération de l\'article' 
      },
      { status: 500 }
    )
  }
}
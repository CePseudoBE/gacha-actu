import { NextRequest, NextResponse } from 'next/server'
import { getPopularArticles } from '@/lib/articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const popularArticles = await getPopularArticles(limit)
    
    return NextResponse.json({
      success: true,
      data: popularArticles
    })
    
  } catch (error) {
    console.error('Error fetching popular articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des articles populaires' 
      },
      { status: 500 }
    )
  }
}
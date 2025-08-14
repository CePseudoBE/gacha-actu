import { NextRequest, NextResponse } from 'next/server'
import { getAllArticles, getAllGames, getAllAuthors, getAllTags } from '@/lib/articles'
import { ArticleFilters, ArticleSortOptions } from '@/types/article'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Récupération des paramètres de requête
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const game = searchParams.get('game') || undefined
    const category = searchParams.get('category') || undefined
    const author = searchParams.get('author') || undefined
    const search = searchParams.get('search') || undefined
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined
    
    // Paramètres de tri
    const sortField = (searchParams.get('sortField') || 'publishedAt') as 'publishedAt' | 'title' | 'author' | 'popularity'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    
    // Construction des filtres
    const filters: ArticleFilters = {
      game,
      category,
      author,
      search,
      tags
    }
    
    const sort: ArticleSortOptions = {
      field: sortField,
      order: sortOrder
    }
    
    // Récupération des articles
    const result = await getAllArticles(filters, sort, page, limit)
    
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        availableGames: getAllGames(),
        availableAuthors: getAllAuthors(),
        availableTags: getAllTags()
      }
    })
    
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des articles' 
      },
      { status: 500 }
    )
  }
}
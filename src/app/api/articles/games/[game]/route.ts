import { NextRequest, NextResponse } from 'next/server'
import { getArticlesByGame } from '@/lib/articles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ game: string }> }
) {
  try {
    const { game } = await params
    const { searchParams } = new URL(request.url)
    
    if (!game) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nom du jeu manquant' 
        },
        { status: 400 }
      )
    }
    
    // Décodage de l'URL pour gérer les espaces et caractères spéciaux
    const decodedGame = decodeURIComponent(game)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const gameArticles = await getArticlesByGame(decodedGame, limit)
    
    return NextResponse.json({
      success: true,
      data: gameArticles,
      meta: {
        game: decodedGame,
        count: gameArticles.length
      }
    })
    
  } catch (error) {
    console.error('Error fetching articles by game:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des articles du jeu' 
      },
      { status: 500 }
    )
  }
}
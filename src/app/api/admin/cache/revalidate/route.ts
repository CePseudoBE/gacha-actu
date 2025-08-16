import { NextRequest, NextResponse } from 'next/server'
import { revalidateAll } from '@/lib/data-access'

export async function POST(_request: NextRequest) {
  try {
    await revalidateAll()
    return NextResponse.json({ 
      success: true, 
      message: 'Cache revalidé avec succès' 
    })
  } catch (error) {
    console.error('Erreur lors de la revalidation du cache:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la revalidation du cache' },
      { status: 500 }
    )
  }
}
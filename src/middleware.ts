import { NextRequest, NextResponse } from 'next/server'
import { isComingSoon } from '@/lib/coming-soon'

// Cache en mémoire simple pour Edge Runtime
export let maintenanceCache: { isEnabled: boolean; timestamp: number } | null = null
const CACHE_DURATION = 5000 // 5 secondes pour une réactivité rapide

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // === VÉRIFICATION COMING SOON ===
  if (isComingSoon(pathname)) {
    return NextResponse.redirect(new URL(`/coming-soon?page=${encodeURIComponent(pathname)}`, request.url))
  }

  // === VÉRIFICATION MAINTENANCE ===
  try {
    const isMaintenanceEnabled = await checkMaintenanceStatus(request.nextUrl.origin)
    
    if (isMaintenanceEnabled) {
      // Routes autorisées pendant la maintenance
      const allowedPaths = [
        '/maintenance',
        '/auth',
        '/_next',
        '/favicon.ico'
      ]
      
      const isPathAllowed = allowedPaths.some(path => pathname.startsWith(path))
      
      if (!isPathAllowed) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch (error) {
    console.error('Erreur middleware maintenance:', error)
  }

  return NextResponse.next()
}

async function checkMaintenanceStatus(origin: string): Promise<boolean> {
  try {
    const now = Date.now()
    
    // Utiliser le cache si valide
    if (maintenanceCache && (now - maintenanceCache.timestamp) < CACHE_DURATION) {
      return maintenanceCache.isEnabled
    }
    
    // Appel API avec timeout court pour éviter les blocages
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1000) // 1s timeout
    
    const response = await fetch(`${origin}/api/admin/maintenance`, {
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      const isEnabled = data.data?.isEnabled || false
      
      // Mettre à jour le cache
      maintenanceCache = { isEnabled, timestamp: now }
      
      return isEnabled
    }
    
    return false
  } catch (error) {
    // En cas d'erreur, retourner false (pas de maintenance)
    return false
  }
}

// Fonction pour invalider le cache (appelée par l'API)
export function invalidateMaintenanceCache() {
  maintenanceCache = null
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|admin|api/admin|api/auth|coming-soon).*)',
  ],
}
import { NextRequest, NextResponse } from 'next/server'
import { securityHeaders } from '@/lib/security'
import { maintenanceService } from '@/lib/maintenance-service'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // === VÉRIFICATION MAINTENANCE EN PREMIER ===
  try {
    const isMaintenanceEnabled = await maintenanceService.isMaintenanceEnabled()
    
    if (isMaintenanceEnabled) {
      // Vérifier si le chemin est autorisé pendant la maintenance
      const isPathAllowed = maintenanceService.isPathAllowedDuringMaintenance(pathname)
      
      if (!isPathAllowed) {
        // Vérifier si l'utilisateur est admin et si l'accès admin est autorisé
        const allowAdminAccess = await maintenanceService.isAdminAccessAllowed()
        
        if (allowAdminAccess && (pathname.startsWith('/admin') || pathname.startsWith('/api/admin'))) {
          // Récupérer le token de session
          const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                              request.cookies.get('__Secure-next-auth.session-token')?.value
          
          const isAdmin = await maintenanceService.isUserAdmin(sessionToken)
          
          if (!isAdmin) {
            // Rediriger vers la page de maintenance
            return NextResponse.redirect(new URL('/maintenance', request.url))
          }
        } else {
          // Rediriger vers la page de maintenance
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de maintenance:', error)
    // En cas d'erreur, continuer normalement (fail-safe)
  }

  // === SUITE DU MIDDLEWARE NORMAL ===
  
  // Créer la réponse
  const response = NextResponse.next()

  // Ajouter les headers de sécurité à toutes les réponses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Headers spécifiques pour les routes API
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
  }

  // Vérifications supplémentaires pour les routes admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    
    // Logging des accès admin pour surveillance (dev uniquement)
    if (process.env.NODE_ENV === 'development') {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      console.log(`Admin access attempt: ${request.method} ${pathname} from ${ip}`)
    }
    
    // Headers stricts pour l'admin
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  }

  // Bloquer l'accès aux fichiers sensibles
  const sensitiveFiles = ['.env', '.git', 'package.json', 'package-lock.json', 'yarn.lock']
  if (sensitiveFiles.some(file => pathname.includes(file))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * 1. /api/webhooks (pour les webhooks externes si besoin)
     * 2. /_next/static (fichiers statiques)
     * 3. /_next/image (optimisation d'images)
     * 4. /favicon.ico, /sitemap.xml, /robots.txt (fichiers publics)
     * 5. /public (dossier public)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public).*)',
  ],
}
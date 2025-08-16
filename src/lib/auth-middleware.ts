import { NextRequest, NextResponse } from 'next/server'
import { 
  addSecurityHeaders,
  SecurityError,
  rateLimit
} from './security'

// Interface pour l'utilisateur de la session
interface SessionUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'user'
  isActive: boolean
}

// Middleware d'authentification avec NextAuth sessions DB
export const requireAuth = (handler: (request: NextRequest, user: SessionUser) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Note: getServerSession ne fonctionne que dans les Server Components
      // Pour les API routes, on va utiliser une approche différente
      // Récupérer le cookie de session manuellement
      const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                          request.cookies.get('__Secure-next-auth.session-token')?.value

      if (!sessionToken) {
        throw new SecurityError('Authentification requise', 'AUTH_REQUIRED', 401)
      }

      // Vérifier la session en base directement
      const { prisma } = await import('@/lib/prisma')
      const sessionWithUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      })

      if (!sessionWithUser || sessionWithUser.expires < new Date()) {
        throw new SecurityError('Session expirée', 'SESSION_EXPIRED', 401)
      }

      // Vérifier si l'utilisateur est actif
      if (!sessionWithUser.user.isActive) {
        throw new SecurityError('Compte désactivé', 'ACCOUNT_DISABLED', 403)
      }

      // Rate limiting pour les utilisateurs authentifiés
      const identifier = `auth_${sessionWithUser.user.id}`
      if (!rateLimit.check(identifier, 200, 15 * 60 * 1000)) {
        throw new SecurityError('Trop de requêtes', 'RATE_LIMIT_EXCEEDED', 429)
      }

      // Construire l'objet utilisateur
      const user: SessionUser = {
        id: sessionWithUser.user.id,
        email: sessionWithUser.user.email,
        name: sessionWithUser.user.name,
        role: sessionWithUser.user.role as 'admin' | 'editor' | 'user',
        isActive: sessionWithUser.user.isActive
      }

      // Appeler le handler avec l'utilisateur
      const response = await handler(request, user)
      return addSecurityHeaders(response)

    } catch (error) {
      // Log sécurisé des erreurs d'auth
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth error:', error)
      } else {
        console.error('Authentication failed:', error instanceof SecurityError ? error.code : 'AUTH_ERROR')
      }
      
      if (error instanceof SecurityError) {
        const response = NextResponse.json({
          success: false,
          error: error.message,
          code: error.code
        }, { status: error.statusCode })
        return addSecurityHeaders(response)
      }

      const response = NextResponse.json({
        success: false,
        error: 'Erreur d\'authentification'
      }, { status: 500 })
      return addSecurityHeaders(response)
    }
  }
}

// Middleware spécifique pour les admins
export const requireAdminAuth = (handler: (request: NextRequest, user: SessionUser) => Promise<NextResponse>) => {
  return requireAuth(async (request: NextRequest, user: SessionUser) => {
    // Vérifier le rôle admin
    if (user.role !== 'admin') {
      throw new SecurityError('Accès administrateur requis', 'ADMIN_REQUIRED', 403)
    }

    // Rate limiting plus strict pour les admins
    const identifier = `admin_${user.id}`
    if (!rateLimit.check(identifier, 50, 15 * 60 * 1000)) {
      throw new SecurityError('Limite admin dépassée', 'ADMIN_RATE_LIMIT', 429)
    }

    // Log des accès admin (dev uniquement)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Admin access: ${user.email} - ${request.method} ${request.nextUrl.pathname}`)
    }

    return handler(request, user)
  })
}

// Middleware pour les éditeurs et admins
export const requireEditorAuth = (handler: (request: NextRequest, user: SessionUser) => Promise<NextResponse>) => {
  return requireAuth(async (request: NextRequest, user: SessionUser) => {
    // Vérifier le rôle éditeur ou admin
    if (user.role !== 'admin' && user.role !== 'editor') {
      throw new SecurityError('Accès éditeur requis', 'EDITOR_REQUIRED', 403)
    }

    return handler(request, user)
  })
}

// Utilitaire pour vérifier les permissions
export const checkPermissions = {
  canManageUsers: (user: SessionUser): boolean => user.role === 'admin',
  canManageContent: (user: SessionUser): boolean => ['admin', 'editor'].includes(user.role),
  canViewAnalytics: (user: SessionUser): boolean => ['admin', 'editor'].includes(user.role),
  canManageSettings: (user: SessionUser): boolean => user.role === 'admin'
}
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

// Middleware d'authentification avec NextAuth JWT
export const requireAuth = (handler: (request: NextRequest, user: SessionUser) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Récupérer le token JWT de NextAuth
      const token = request.cookies.get('next-auth.session-token')?.value ||
                   request.cookies.get('__Secure-next-auth.session-token')?.value

      if (!token) {
        throw new SecurityError('Authentification requise', 'AUTH_REQUIRED', 401)
      }

      // Décoder le JWT pour obtenir l'ID utilisateur
      // Note: En prod, NextAuth gère l'encryption/décryption automatiquement
      // On va chercher l'utilisateur par email dans la session active
      const { prisma } = await import('@/lib/prisma')
      
      // Approche simplifiée : chercher une session active récente
      const activeSession = await prisma.session.findFirst({
        where: {
          sessionToken: token,
          expires: { gt: new Date() }
        },
        include: { user: true }
      })

      // Si pas de session DB, c'est probablement du JWT pur
      // On va fallback sur une vérification moins stricte
      if (!activeSession) {
        // Pour l'instant, on va juste vérifier que le token existe
        // et faire confiance à NextAuth côté client
        throw new SecurityError('Session expirée', 'SESSION_EXPIRED', 401)
      }

      const user = activeSession.user

      if (!user || !user.isActive) {
        throw new SecurityError('Compte désactivé', 'ACCOUNT_DISABLED', 403)
      }

      // Rate limiting pour les utilisateurs authentifiés
      const identifier = `auth_${user.id}`
      if (!rateLimit.check(identifier, 200, 15 * 60 * 1000)) {
        throw new SecurityError('Trop de requêtes', 'RATE_LIMIT_EXCEEDED', 429)
      }

      // Construire l'objet utilisateur
      const sessionUser: SessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'editor' | 'user',
        isActive: user.isActive
      }

      // Appeler le handler avec l'utilisateur
      const response = await handler(request, sessionUser)
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
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
      // Décoder le JWT de NextAuth
      const { getToken } = require('next-auth/jwt')
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        throw new SecurityError('Authentification requise', 'AUTH_REQUIRED', 401)
      }

      // Vérifier que le token n'est pas expiré
      if (token.exp && Date.now() >= token.exp * 1000) {
        throw new SecurityError('Session expirée', 'SESSION_EXPIRED', 401)
      }

      // Récupérer l'utilisateur depuis la DB pour vérifications additionnelles
      const { prisma } = await import('@/lib/prisma')
      const user = await prisma.user.findUnique({
        where: { id: token.sub }
      })

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
        name: user.name || '',
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
/**
 * Hook d'authentification - Responsabilité unique : logique auth
 */

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export interface UseAuthOptions {
  requiredRole?: 'admin' | 'editor' | 'user'
  redirectTo?: string
  enabled?: boolean
}

export interface UseAuthResult {
  session: unknown
  status: 'loading' | 'authenticated' | 'unauthenticated'
  isAuthorized: boolean
  authError: string | null
}

export function useAuth(options: UseAuthOptions = {}): UseAuthResult {
  const {
    requiredRole = 'user',
    redirectTo = '/auth/login',
    enabled = true
  } = options

  const { data: session, status } = useSession()
  const router = useRouter()

  // Fonction pour vérifier les permissions de rôle
  const checkRolePermission = (userRole: string | undefined, requiredRole: string): boolean => {
    if (!userRole) return false

    const roleHierarchy = {
      'user': 1,
      'editor': 2,
      'admin': 3
    }

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  // Calcul de l'état d'autorisation
  const getAuthState = (): { isAuthorized: boolean; authError: string | null } => {
    if (status === 'loading') {
      return { isAuthorized: false, authError: null }
    }

    if (!session) {
      return { isAuthorized: false, authError: 'Authentification requise' }
    }

    if (!(session.user as any)?.isActive) {
      return { isAuthorized: false, authError: 'Compte désactivé' }
    }

    const hasRequiredRole = checkRolePermission((session.user as any)?.role, requiredRole)
    if (!hasRequiredRole) {
      return { isAuthorized: false, authError: `Accès ${requiredRole} requis` }
    }

    return { isAuthorized: true, authError: null }
  }

  const { isAuthorized, authError } = getAuthState()

  // Effet de redirection
  useEffect(() => {
    if (!enabled || status === 'loading') return

    if (!isAuthorized && authError) {
      const timer = setTimeout(() => {
        const errorParam = authError === 'Compte désactivé' 
          ? '?error=account_disabled'
          : authError === `Accès ${requiredRole} requis`
          ? '?error=insufficient_permissions'
          : ''
        
        router.push(`${redirectTo}${errorParam}`)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [session, status, router, requiredRole, redirectTo, enabled, isAuthorized, authError])

  return {
    session,
    status,
    isAuthorized,
    authError
  }
}
"use client"

import { useAuth } from "@/hooks/useAuth"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { AccessDeniedScreen } from "@/components/ui/AccessDeniedScreen"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'editor' | 'user'
  redirectTo?: string
}

/**
 * AuthGuard - Responsabilité unique : Protection d'accès
 * Utilise le hook useAuth pour la logique et des composants séparés pour l'UI
 */
export function AuthGuard({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const { status, isAuthorized, authError } = useAuth({
    requiredRole,
    redirectTo,
    enabled: true
  })

  // État de chargement
  if (status === 'loading') {
    return <LoadingScreen />
  }

  // Accès refusé
  if (!isAuthorized && authError) {
    return <AccessDeniedScreen reason={authError} />
  }

  // Accès autorisé
  return <>{children}</>
}
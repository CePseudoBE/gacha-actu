import { User } from './user-service'

/**
 * Service d'autorisation
 * Responsabilité unique : vérification des permissions
 */

export class AuthorizationService {
  /**
   * Hiérarchie des rôles pour les permissions
   */
  private static readonly ROLE_HIERARCHY = {
    'user': 1,
    'editor': 2,
    'admin': 3
  } as const

  /**
   * Vérifie si l'utilisateur a le rôle minimum requis
   */
  static hasRole(user: User | null, requiredRole: keyof typeof AuthorizationService.ROLE_HIERARCHY): boolean {
    if (!user || !user.isActive) return false

    const userLevel = this.ROLE_HIERARCHY[user.role] || 0
    const requiredLevel = this.ROLE_HIERARCHY[requiredRole] || 0

    return userLevel >= requiredLevel
  }

  /**
   * Vérifie si l'utilisateur est admin
   */
  static isAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin')
  }

  /**
   * Vérifie si l'utilisateur peut éditer du contenu
   */
  static canEdit(user: User | null): boolean {
    return this.hasRole(user, 'editor')
  }

  /**
   * Vérifie si l'utilisateur peut gérer d'autres utilisateurs
   */
  static canManageUsers(user: User | null): boolean {
    return this.hasRole(user, 'admin')
  }

  /**
   * Vérifie si l'utilisateur peut voir les analytics
   */
  static canViewAnalytics(user: User | null): boolean {
    return this.hasRole(user, 'editor')
  }

  /**
   * Vérifie si l'utilisateur peut gérer les paramètres système
   */
  static canManageSettings(user: User | null): boolean {
    return this.hasRole(user, 'admin')
  }

  /**
   * Vérifie si l'utilisateur peut accéder à une ressource spécifique
   */
  static canAccessResource(user: User | null, resourceOwnerId?: string): boolean {
    if (!user || !user.isActive) return false

    // Les admins peuvent tout voir
    if (this.isAdmin(user)) return true

    // Les éditeurs peuvent voir leur propre contenu ou le contenu public
    if (this.canEdit(user)) {
      return !resourceOwnerId || resourceOwnerId === user.id
    }

    // Les utilisateurs normaux ne peuvent voir que leur propre contenu
    return resourceOwnerId === user.id
  }
}

// Exports pour compatibilité
export const isAdmin = AuthorizationService.isAdmin
export const canEdit = AuthorizationService.canEdit
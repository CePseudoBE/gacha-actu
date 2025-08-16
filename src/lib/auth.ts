/**
 * Fichier de compatibilité - Réexporte les services SOLID
 * Maintient la compatibilité avec le code existant
 */

// Réexports des types
export type { User } from './user-service'
export type { LoginCredentials } from './auth-service'

// Réexports des services pour compatibilité
export { hashPassword, verifyPassword } from './crypto'
export { UserService } from './user-service'
export { AuthService } from './auth-service'
export { AuthorizationService } from './authorization-service'

// Interface pour compatibilité avec le code existant
export interface RegisterData {
  email: string
  password: string
  name: string
}

// Fonctions wrapper pour maintenir la compatibilité API avec DIP
import { getAuthService, getUserService } from './container'

export const verifyCredentials = (credentials: { email: string; password: string }) => getAuthService().verifyCredentials(credentials)
export const createUser = (userData: RegisterData) => getUserService().create(userData)
export const promoteToAdmin = (userId: string) => getUserService().updateRole(userId, 'admin')
export { isAdmin, canEdit } from './authorization-service'
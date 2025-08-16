/**
 * Container d'injection de dépendance simple
 * Respecte le principe DIP
 */

import { UserService } from './user-service'
import { AuthService } from './auth-service'
import { PrismaUserRepository } from './repositories/user-repository'
import { BcryptService } from './services/crypto-service'
import { prisma } from './prisma'

class Container {
  private instances = new Map<string, unknown>()

  // Singleton pattern pour les services
  getUserService(): UserService {
    if (!this.instances.has('UserService')) {
      const userRepository = new PrismaUserRepository(prisma)
      const cryptoService = new BcryptService()
      this.instances.set('UserService', new UserService(userRepository, cryptoService))
    }
    return this.instances.get('UserService') as UserService
  }

  getAuthService(): AuthService {
    if (!this.instances.has('AuthService')) {
      this.instances.set('AuthService', new AuthService(
        this.getUserService(),
        new BcryptService()
      ))
    }
    return this.instances.get('AuthService') as AuthService
  }

  getCryptoService(): BcryptService {
    if (!this.instances.has('CryptoService')) {
      this.instances.set('CryptoService', new BcryptService())
    }
    return this.instances.get('CryptoService') as BcryptService
  }
}

// Instance globale du container
export const container = new Container()

// Fonctions utilitaires pour l'accès aux services
export const getUserService = () => container.getUserService()
export const getAuthService = () => container.getAuthService()
export const getCryptoService = () => container.getCryptoService()
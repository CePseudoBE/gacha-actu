import { UserService, User } from './user-service'
import { ICryptoService } from './services/crypto-service'

/**
 * Service d'authentification avec DIP
 * Dépend d'abstractions, pas d'implémentations concrètes
 */

export interface LoginCredentials {
  email: string
  password: string
}

export class AuthService {
  constructor(
    private userService: UserService,
    private cryptoService: ICryptoService
  ) {}

  async verifyCredentials(credentials: LoginCredentials): Promise<User | null> {
    try {
      if (!credentials.email || !credentials.password) {
        return null
      }

      // Chercher l'utilisateur par email
      const user = await this.userService.findByEmail(credentials.email)

      if (!user) {
        // Simuler la vérification du mot de passe pour éviter les timing attacks
        await this.cryptoService.generateTimingAttackProtection()
        return null
      }

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return null
      }

      // Récupérer le hash depuis la DB pour vérification
      const userRecord = await this.userService.userRepository.findByEmail(credentials.email.toLowerCase().trim())

      if (!userRecord) {
        return null
      }

      // Vérifier le mot de passe
      const isValidPassword = await this.cryptoService.verifyPassword(credentials.password, userRecord.password)
      if (!isValidPassword) {
        return null
      }

      return user
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la vérification des credentials:', error)
      } else {
        console.error('Credential verification failed')
      }
      return null
    }
  }
}
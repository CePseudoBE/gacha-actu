import { IUserRepository } from './repositories/user-repository'
import { ICryptoService } from './services/crypto-service'

/**
 * Service de gestion des utilisateurs avec DIP
 * Dépend d'abstractions, pas d'implémentations concrètes
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'user'
  isActive: boolean
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role?: 'admin' | 'editor' | 'user'
}

export class UserService {
  constructor(
    public userRepository: IUserRepository,
    private cryptoService: ICryptoService
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase().trim())
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'editor' | 'user',
      isActive: user.isActive
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id)
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'editor' | 'user',
      isActive: user.isActive
    }
  }

  async create(userData: CreateUserData): Promise<User | null> {
    try {
      // Validation
      if (userData.password.length < 8) {
        throw new Error('Le mot de passe doit faire au moins 8 caractères')
      }

      if (!userData.email.includes('@')) {
        throw new Error('Email invalide')
      }

      // Vérifier si l'email existe déjà
      const existingUser = await this.findByEmail(userData.email)
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }

      // Hash du mot de passe
      const hashedPassword = await this.cryptoService.hashPassword(userData.password)

      // Créer l'utilisateur
      const user = await this.userRepository.create({
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        name: userData.name.trim(),
        role: userData.role || 'user',
        isActive: true
      })

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'editor' | 'user',
        isActive: user.isActive
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la création de l\'utilisateur:', error)
      } else {
        console.error('User creation failed')
      }
      return null
    }
  }

  async updateRole(userId: string, role: 'admin' | 'editor' | 'user'): Promise<boolean> {
    try {
      await this.userRepository.updateRole(userId, role)
      return true
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la mise à jour du rôle:', error)
      } else {
        console.error('User role update failed')
      }
      return false
    }
  }

  async setActiveStatus(userId: string, isActive: boolean): Promise<boolean> {
    try {
      await this.userRepository.updateActiveStatus(userId, isActive)
      return true
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la mise à jour du statut:', error)
      } else {
        console.error('User status update failed')
      }
      return false
    }
  }
}
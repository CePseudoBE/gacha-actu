/**
 * Service pour gérer le mode maintenance
 * Respect du principe SRP - Une seule responsabilité : gestion de la maintenance
 */

import { prisma } from './prisma'

export interface MaintenanceSettings {
  id: string
  isEnabled: boolean
  message: string
  estimatedEndTime: Date | null
  allowAdminAccess: boolean
  createdAt: Date
  updatedAt: Date
  enabledBy: string | null
  disabledBy: string | null
}

export class MaintenanceService {
  private static instance: MaintenanceService
  private cachedSettings: MaintenanceSettings | null = null
  private lastCacheTime: number = 0
  private readonly CACHE_DURATION = 60000 // 1 minute en millisecondes

  private constructor() {}

  static getInstance(): MaintenanceService {
    if (!MaintenanceService.instance) {
      MaintenanceService.instance = new MaintenanceService()
    }
    return MaintenanceService.instance
  }

  /**
   * Vérifier si le site est en maintenance (avec cache)
   */
  async isMaintenanceEnabled(): Promise<boolean> {
    const settings = await this.getSettings()
    return settings?.isEnabled || false
  }

  /**
   * Vérifier si l'admin peut accéder pendant la maintenance
   */
  async isAdminAccessAllowed(): Promise<boolean> {
    const settings = await this.getSettings()
    return settings?.allowAdminAccess || true
  }

  /**
   * Récupérer les paramètres de maintenance (avec cache)
   */
  async getSettings(): Promise<MaintenanceSettings | null> {
    const now = Date.now()
    
    // Retourner le cache si valide
    if (this.cachedSettings && (now - this.lastCacheTime) < this.CACHE_DURATION) {
      return this.cachedSettings
    }

    try {
      const settings = await prisma.maintenanceSettings.findUnique({
        where: { id: 'singleton' }
      })

      // Mettre à jour le cache
      this.cachedSettings = settings
      this.lastCacheTime = now

      return settings
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de maintenance:', error)
      // En cas d'erreur, retourner les paramètres par défaut
      return {
        id: 'singleton',
        isEnabled: false,
        message: 'Site en maintenance. Nous reviendrons bientôt !',
        estimatedEndTime: null,
        allowAdminAccess: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        enabledBy: null,
        disabledBy: null
      }
    }
  }

  /**
   * Invalider le cache (à appeler après une mise à jour)
   */
  invalidateCache(): void {
    this.cachedSettings = null
    this.lastCacheTime = 0
  }

  /**
   * Vérifier si un chemin doit être accessible pendant la maintenance
   */
  isPathAllowedDuringMaintenance(pathname: string): boolean {
    const allowedPaths = [
      '/maintenance',
      '/api/admin/maintenance',
      '/auth/login',
      '/admin/login',
      '/_next',
      '/favicon.ico',
      '/api/auth'
    ]

    return allowedPaths.some(allowedPath => 
      pathname.startsWith(allowedPath)
    )
  }

  /**
   * Vérifier si un utilisateur est admin (basé sur le token de session)
   */
  async isUserAdmin(sessionToken: string | undefined): Promise<boolean> {
    if (!sessionToken) return false

    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      })

      return session?.user?.role === 'admin' && session?.user?.isActive
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error)
      return false
    }
  }
}

// Export de l'instance singleton
export const maintenanceService = MaintenanceService.getInstance()
/**
 * Hook pour gérer l'état de maintenance - Responsabilité unique
 */

import { useState, useEffect } from 'react'

export interface MaintenanceSettings {
  isEnabled: boolean
  message: string
  estimatedEndTime: string | null
  allowAdminAccess: boolean
  createdAt: string
  updatedAt: string
  enabledBy: string | null
  disabledBy: string | null
}

export function useMaintenance() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/maintenance')
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des paramètres')
      }
      
      const data = await response.json()
      setSettings(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur lors de la récupération des paramètres de maintenance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<MaintenanceSettings>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la mise à jour')
      }
      
      const data = await response.json()
      setSettings(data.data)
      
      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      console.error('Erreur lors de la mise à jour:', err)
      
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const enableMaintenance = async (message?: string, estimatedEndTime?: string) => {
    return updateSettings({
      isEnabled: true,
      message: message || settings?.message || 'Site en maintenance. Nous reviendrons bientôt !',
      estimatedEndTime: estimatedEndTime || null
    })
  }

  const disableMaintenance = async () => {
    return updateSettings({
      isEnabled: false
    })
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    enableMaintenance,
    disableMaintenance,
    
    // États calculés
    isMaintenanceActive: settings?.isEnabled || false,
    canAdminAccess: settings?.allowAdminAccess || true
  }
}
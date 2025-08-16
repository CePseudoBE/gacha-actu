"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import Link from "next/link"

export function MaintenanceAlert() {
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [estimatedEndTime, setEstimatedEndTime] = useState<string | null>(null)

  useEffect(() => {
    checkMaintenanceStatus()
    
    // Vérifier le statut toutes les 2 minutes
    const interval = setInterval(checkMaintenanceStatus, 120000)
    
    return () => clearInterval(interval)
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/admin/maintenance')
      if (response.ok) {
        const data = await response.json()
        setIsMaintenanceActive(data.data.isEnabled)
        setEstimatedEndTime(data.data.estimatedEndTime)
        
        // Si la maintenance vient d'être désactivée, réafficher l'alerte
        if (!data.data.isEnabled && isMaintenanceActive) {
          setIsVisible(true)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de maintenance:', error)
    }
  }

  const formatTimeRemaining = () => {
    if (!estimatedEndTime) return null
    
    const endTime = new Date(estimatedEndTime)
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return "Fin prévue dépassée"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `Fin prévue dans ${hours}h ${minutes}m`
    } else {
      return `Fin prévue dans ${minutes}m`
    }
  }

  if (!isMaintenanceActive || !isVisible) {
    return null
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 mb-4">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium text-orange-800">
            🔴 Mode maintenance actif
          </span>
          <span className="text-orange-700 ml-2">
            - Le site est inaccessible aux visiteurs
          </span>
          {estimatedEndTime && (
            <span className="text-orange-600 ml-2">
              ({formatTimeRemaining()})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Link href="/admin/maintenance">
            <Button variant="outline" size="sm" className="h-7">
              <ExternalLink className="w-3 h-3 mr-1" />
              Gérer
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-orange-600 hover:text-orange-700"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
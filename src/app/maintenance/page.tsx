"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Wrench, Clock, RefreshCw, ExternalLink } from "lucide-react"
import Link from "next/link"

interface MaintenanceSettings {
  isEnabled: boolean
  message: string
  estimatedEndTime: string | null
  allowAdminAccess: boolean
}

export default function MaintenancePage() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMaintenanceSettings()
  }, [])

  useEffect(() => {
    if (settings?.estimatedEndTime) {
      const interval = setInterval(() => {
        const endTime = new Date(settings.estimatedEndTime!)
        const now = new Date()
        const diff = endTime.getTime() - now.getTime()

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${hours}h ${minutes}m`)
        } else {
          setTimeRemaining("Bientôt disponible")
          // Rafraîchir la page pour vérifier si la maintenance est terminée
          setTimeout(() => window.location.reload(), 5000)
        }
      }, 60000) // Mettre à jour toutes les minutes

      return () => clearInterval(interval)
    }
  }, [settings])

  const fetchMaintenanceSettings = async () => {
    try {
      const response = await fetch('/api/admin/maintenance')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.data)
        
        // Si la maintenance n'est plus active, rediriger vers l'accueil
        if (!data.data.isEnabled) {
          window.location.href = '/'
          return
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchMaintenanceSettings()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Site en maintenance
          </CardTitle>
          <CardDescription className="text-slate-600">
            Nous effectuons actuellement des améliorations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Message personnalisé */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-700 leading-relaxed">
              {settings?.message || "Site en maintenance. Nous reviendrons bientôt !"}
            </p>
          </div>

          {/* Temps estimé */}
          {settings?.estimatedEndTime && (
            <div className="flex items-center justify-center space-x-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Retour estimé dans : {timeRemaining || "Calcul en cours..."}
              </span>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Vérifier le statut
            </Button>

            {/* Lien vers l'admin si autorisé */}
            {settings?.allowAdminAccess && (
              <Link href="/admin">
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Accès administrateur
                </Button>
              </Link>
            )}
          </div>

          <Separator />

          {/* Informations de contact */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>Besoin d&apos;aide ? Contactez-nous :</p>
            <p className="font-mono">support@animegachapulse.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
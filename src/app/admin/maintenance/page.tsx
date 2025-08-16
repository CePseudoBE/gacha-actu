"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Wrench, AlertTriangle, CheckCircle, Clock, Users, Save } from "lucide-react"
import { toast } from "sonner"

const maintenanceSchema = z.object({
  isEnabled: z.boolean(),
  message: z.string().min(1, "Le message est requis").max(500, "Maximum 500 caractères"),
  estimatedEndTime: z.string().optional()
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

export default function AdminMaintenancePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<any>(null)
  
  const form = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      isEnabled: false,
      message: "Site en maintenance. Nous reviendrons bientôt !",
      estimatedEndTime: ""
    }
  })

  useEffect(() => {
    fetchMaintenanceSettings()
  }, [])

  const fetchMaintenanceSettings = async () => {
    try {
      const response = await fetch('/api/admin/maintenance', { method: 'PATCH' })
      if (response.ok) {
        const data = await response.json()
        setCurrentSettings(data.data)
        
        // Mettre à jour le formulaire avec les données existantes
        form.reset({
          isEnabled: data.data.isEnabled,
          message: data.data.message,
          estimatedEndTime: data.data.estimatedEndTime 
            ? new Date(data.data.estimatedEndTime).toISOString().slice(0, 16)
            : ""
        })
      } else if (response.status === 401) {
        toast.error("🔑 Session expirée - Reconnexion en cours...")
        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 1500)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      toast.error("Erreur lors du chargement des paramètres")
    }
  }

  const onSubmit = async (data: MaintenanceFormData) => {
    setIsLoading(true)
    
    try {
      const payload = {
        ...data,
        estimatedEndTime: data.estimatedEndTime 
          ? new Date(data.estimatedEndTime).toISOString()
          : undefined,
        allowAdminAccess: true // Toujours autorisé par design
      }

      const response = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentSettings(result.data)
        toast.success(result.message)
        
        // Si la maintenance vient d'être activée, avertir l'utilisateur
        if (data.isEnabled) {
          toast.warning("⚠️ Le site est maintenant en mode maintenance !")
        }
      } else {
        const error = await response.json()
        
        // Gestion spécifique pour les erreurs d'authentification
        if (response.status === 401 && error.code === 'SESSION_EXPIRED') {
          toast.error("🔑 Session expirée - Reconnexion requise")
          setTimeout(() => {
            window.location.href = '/auth/login'
          }, 2000)
          return
        }
        
        toast.error(error.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur lors de la communication avec le serveur")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!currentSettings) return null
    
    return currentSettings.isEnabled ? (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        Maintenance active
      </Badge>
    ) : (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="w-3 h-3" />
        Site opérationnel
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Wrench className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Gestion de la maintenance</h1>
          <p className="text-muted-foreground">
            Contrôlez l&apos;accès au site et configurez les messages de maintenance
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Statut actuel */}
      {currentSettings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Statut actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">État</p>
              <p className="font-medium">
                {currentSettings.isEnabled ? "🔴 Maintenance active" : "🟢 Site opérationnel"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accès admin autorisé</p>
              <p className="font-medium">
                {currentSettings.allowAdminAccess ? "✅ Oui" : "❌ Non"}
              </p>
            </div>
            {currentSettings.estimatedEndTime && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Fin estimée</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(currentSettings.estimatedEndTime)}
                </p>
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Dernière modification</p>
              <p className="font-medium">{formatDate(currentSettings.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la maintenance</CardTitle>
          <CardDescription>
            Modifiez les paramètres de maintenance du site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Activation/Désactivation */}
              <FormField
                control={form.control}
                name={"isEnabled" as any}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Mode maintenance
                      </FormLabel>
                      <FormDescription>
                        Activer ou désactiver le mode maintenance
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name={"message" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message de maintenance</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Site en maintenance. Nous reviendrons bientôt !"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Message affiché aux visiteurs (500 caractères max)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heure de fin estimée */}
              <FormField
                control={form.control}
                name={"estimatedEndTime" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fin estimée (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Heure estimée de fin de maintenance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note: L'accès admin est toujours autorisé par design */}

              <Separator />

              {/* Avertissement */}
              {form.watch("isEnabled") && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Attention :</strong> Activer le mode maintenance rendra le site inaccessible 
                    aux visiteurs. Seuls les administrateurs pourront y accéder si l&apos;option est activée.
                  </AlertDescription>
                </Alert>
              )}

              {/* Boutons */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsLoading(true)
                    fetchMaintenanceSettings().finally(() => setIsLoading(false))
                  }}
                  disabled={isLoading}
                >
                  Actualiser
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
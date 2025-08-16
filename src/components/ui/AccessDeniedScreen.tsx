/**
 * Composant AccessDeniedScreen - Responsabilité unique : Affichage erreur accès
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface AccessDeniedScreenProps {
  reason: string
  title?: string
  redirectMessage?: string
}

export function AccessDeniedScreen({ 
  reason,
  title = "Accès refusé",
  redirectMessage = "Vous allez être redirigé vers la page de connexion..."
}: AccessDeniedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>{reason}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            {redirectMessage}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
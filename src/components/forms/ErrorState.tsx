"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  title?: string
}

export function ErrorState({
  error,
  onRetry,
  title = "Erreur de chargement"
}: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>
            Une erreur s&apos;est produite lors du chargement des données
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {error}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
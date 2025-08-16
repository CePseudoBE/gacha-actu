"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface FormActionsProps {
  isSubmitting: boolean
  submitText: string
  cancelPath: string
  error?: string | null
}

export function FormActions({
  isSubmitting,
  submitText,
  cancelPath,
  error
}: FormActionsProps) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex gap-4 pt-6">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Création..." : submitText}
        </Button>
        <Link href={cancelPath}>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </Link>
      </div>
    </div>
  )
}
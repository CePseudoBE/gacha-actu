"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface UseFormSubmissionOptions {
  apiEndpoint: string
  redirectPath: string
  transformData?: (data: Record<string, unknown>) => Record<string, unknown>
}

interface UseFormSubmissionReturn {
  isSubmitting: boolean
  submitForm: (data: Record<string, unknown>) => Promise<void>
  error: string | null
}

export function useFormSubmission({
  apiEndpoint,
  redirectPath,
  transformData
}: UseFormSubmissionOptions): UseFormSubmissionReturn {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitForm = async (data: Record<string, unknown>) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const transformedData = transformData ? transformData(data) : data

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      })

      if (response.ok) {
        router.push(redirectPath)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    submitForm,
    error
  }
}
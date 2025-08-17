/**
 * Hook générique pour fetch d'API - Respecte SRP
 * Responsabilité unique : gestion état fetch générique
 */

import { useState, useEffect, useCallback } from "react"

interface UseApiDataOptions<T> {
  url: string
  enabled?: boolean
}

interface UseApiDataResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApiData<T>({
  url,
  enabled = true
}: UseApiDataOptions<T>): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const rawData = await response.json()
      setData(rawData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      setError(errorMessage)
      
      // Log sécurisé
      if (process.env.NODE_ENV === 'development') {
        console.error(`Erreur fetch ${url}:`, error)
      } else {
        console.error('API fetch failed')
      }
    } finally {
      setIsLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [fetchData, enabled])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}
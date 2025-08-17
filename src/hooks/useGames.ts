/**
 * Hook pour la gestion des jeux - Responsabilité unique
 */

import { useMemo } from 'react'
import { useApiData } from './useApiData'

export interface Game {
  id: string
  name: string
}

export function useGames() {
  const { data: rawData, isLoading, error, refetch } = useApiData<Game[]>({
    url: '/api/admin/games'
  })
  
  const data = useMemo(() => {
    return (rawData as Game[]) || []
  }, [rawData])
  
  return { data, isLoading, error, refetch }
}
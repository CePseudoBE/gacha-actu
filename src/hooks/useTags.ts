/**
 * Hook pour la gestion des tags - Responsabilité unique
 */

import { useMemo } from 'react'
import { useApiData } from './useApiData'

interface Tag {
  name: string
}

export function useTags() {
  const { data: rawData, isLoading, error, refetch } = useApiData<Tag[]>({
    url: '/api/admin/tags'
  })
  
  const data = useMemo(() => {
    return (rawData as Tag[])?.map(tag => tag.name) || []
  }, [rawData])
  
  return { data, isLoading, error, refetch }
}
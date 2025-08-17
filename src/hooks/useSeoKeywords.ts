/**
 * Hook pour la gestion des mots-clés SEO - Responsabilité unique
 */

import { useMemo } from 'react'
import { useApiData } from './useApiData'

interface SeoKeyword {
  keyword: string
}

export function useSeoKeywords() {
  const { data: rawData, isLoading, error, refetch } = useApiData<SeoKeyword[]>({
    url: '/api/admin/seo-keywords'
  })
  
  const data = useMemo(() => {
    return (rawData as SeoKeyword[])?.map(item => item.keyword) || []
  }, [rawData])
  
  return { data, isLoading, error, refetch }
}
/**
 * Hook pour la gestion des mots-clés SEO - Responsabilité unique
 */

import { useApiData } from './useApiData'

interface SeoKeyword {
  keyword: string
}

export function useSeoKeywords() {
  return useApiData<string[]>({
    url: '/api/admin/seo-keywords',
    transformer: (data) => (data as SeoKeyword[])?.map(item => item.keyword) || []
  })
}
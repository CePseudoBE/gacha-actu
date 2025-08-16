/**
 * Hook pour la gestion des tags - Responsabilité unique
 */

import { useApiData } from './useApiData'

interface Tag {
  name: string
}

export function useTags() {
  return useApiData<string[]>({
    url: '/api/admin/tags',
    transformer: (data) => (data as Tag[])?.map(tag => tag.name) || []
  })
}
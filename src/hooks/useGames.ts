/**
 * Hook pour la gestion des jeux - Responsabilité unique
 */

import { useApiData } from './useApiData'

export interface Game {
  id: string
  name: string
}

export function useGames() {
  return useApiData<Game[]>({
    url: '/api/admin/games',
    transformer: (data) => (data as Game[]) || []
  })
}
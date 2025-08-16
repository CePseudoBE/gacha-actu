/**
 * Hook composite pour données de formulaire - Respecte le pattern Facade
 * Responsabilité unique : composition des hooks spécialisés
 */

import { useGames, Game } from './useGames'
import { useTags } from './useTags'
import { useSeoKeywords } from './useSeoKeywords'

interface UseFormDataReturn {
  games: Game[]
  availableTags: string[]
  availableSeoKeywords: string[]
  isLoading: boolean
  error: string | null
}

export function useFormData(): UseFormDataReturn {
  const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useGames()
  const { data: tagsData, isLoading: tagsLoading, error: tagsError } = useTags()
  const { data: keywordsData, isLoading: keywordsLoading, error: keywordsError } = useSeoKeywords()

  // Assurer que les données sont toujours des tableaux
  const games = gamesData || []
  const availableTags = tagsData || []
  const availableSeoKeywords = keywordsData || []

  // Agrégation des états
  const isLoading = gamesLoading || tagsLoading || keywordsLoading
  const error = gamesError || tagsError || keywordsError

  return {
    games,
    availableTags,
    availableSeoKeywords,
    isLoading,
    error
  }
}
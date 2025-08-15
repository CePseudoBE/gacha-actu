"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Star, BookOpen, User, Gamepad2, TrendingUp, FileText, Clock } from "lucide-react"

const GUIDE_TYPES = [
  { value: "CHARACTER_BUILD", label: "Build Personnage", icon: User },
  { value: "TEAM_COMP", label: "Composition d'équipe", icon: Gamepad2 },
  { value: "EQUIPMENT", label: "Équipements", icon: BookOpen },
  { value: "STRATEGY", label: "Stratégie", icon: TrendingUp },
  { value: "BEGINNER", label: "Guide Débutant", icon: Star },
  { value: "ADVANCED", label: "Guide Avancé", icon: FileText },
  { value: "EVENT_GUIDE", label: "Guide Événement", icon: Clock },
  { value: "FARMING", label: "Farming", icon: TrendingUp },
]

const DIFFICULTIES = [
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "ADVANCED", label: "Avancé" },
  { value: "EXPERT", label: "Expert" },
]

const GAMES = [
  { value: "genshin-impact", label: "Genshin Impact" },
  { value: "honkai-star-rail", label: "Honkai Star Rail" },
  { value: "fire-emblem-heroes", label: "Fire Emblem Heroes" },
  { value: "arknights", label: "Arknights" },
  { value: "blue-archive", label: "Blue Archive" },
  { value: "epic-seven", label: "Epic Seven" },
]

export function GuideFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [guideType, setGuideType] = useState(searchParams.get('guideType') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')
  const [gameId, setGameId] = useState(searchParams.get('gameId') || '')
  const [popular, setPopular] = useState(searchParams.get('popular') === 'true')

  const updateFilters = (newGuideType?: string, newDifficulty?: string, newGameId?: string, newPopular?: boolean) => {
    const params = new URLSearchParams()
    
    const finalGuideType = newGuideType !== undefined ? newGuideType : guideType
    const finalDifficulty = newDifficulty !== undefined ? newDifficulty : difficulty
    const finalGameId = newGameId !== undefined ? newGameId : gameId
    const finalPopular = newPopular !== undefined ? newPopular : popular
    
    if (finalGuideType) params.set('guideType', finalGuideType)
    if (finalDifficulty) params.set('difficulty', finalDifficulty)
    if (finalGameId) params.set('gameId', finalGameId)
    if (finalPopular) params.set('popular', 'true')
    
    const queryString = params.toString()
    router.push(`/guides${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setGuideType('')
    setDifficulty('')
    setGameId('')
    setPopular(false)
    router.push('/guides')
  }

  const handleGuideTypeChange = (value: string) => {
    const newType = value === 'all' ? '' : value
    setGuideType(newType)
    updateFilters(newType, undefined, undefined, undefined)
  }

  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value === 'all' ? '' : value
    setDifficulty(newDifficulty)
    updateFilters(undefined, newDifficulty, undefined, undefined)
  }

  const handleGameChange = (value: string) => {
    const newGameId = value === 'all' ? '' : value
    setGameId(newGameId)
    updateFilters(undefined, undefined, newGameId, undefined)
  }

  const handlePopularToggle = () => {
    const newPopular = !popular
    setPopular(newPopular)
    updateFilters(undefined, undefined, undefined, newPopular)
  }

  const activeFiltersCount = (guideType ? 1 : 0) + (difficulty ? 1 : 0) + (gameId ? 1 : 0) + (popular ? 1 : 0)

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filtres</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer tout
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Game Filter */}
          <Select value={gameId || 'all'} onValueChange={handleGameChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les jeux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les jeux</SelectItem>
              {GAMES.map((game) => (
                <SelectItem key={game.value} value={game.value}>
                  {game.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={guideType || 'all'} onValueChange={handleGuideTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {GUIDE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={difficulty || 'all'} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes difficultés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes difficultés</SelectItem>
              {DIFFICULTIES.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Popular Filter */}
          <Button
            variant={popular ? "default" : "outline"}
            onClick={handlePopularToggle}
            className="w-full"
          >
            <Star className={`w-4 h-4 mr-2 ${popular ? 'fill-current' : ''}`} />
            Populaires
          </Button>
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            
            {gameId && (
              <Badge variant="secondary" className="gap-1">
                {GAMES.find(g => g.value === gameId)?.label || gameId}
                <button
                  onClick={() => handleGameChange('all')}
                  className="hover:bg-background/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {guideType && (
              <Badge variant="secondary" className="gap-1">
                {GUIDE_TYPES.find(t => t.value === guideType)?.label || guideType}
                <button
                  onClick={() => handleGuideTypeChange('all')}
                  className="hover:bg-background/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {difficulty && (
              <Badge variant="secondary" className="gap-1">
                {DIFFICULTIES.find(d => d.value === difficulty)?.label || difficulty}
                <button
                  onClick={() => handleDifficultyChange('all')}
                  className="hover:bg-background/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {popular && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                Populaires
                <button
                  onClick={handlePopularToggle}
                  className="hover:bg-background/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
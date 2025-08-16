"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Star, Grid } from "lucide-react"

const GENRES = [
  { value: "Action RPG", label: "Action RPG" },
  { value: "Turn-based RPG", label: "RPG au tour par tour" },
  { value: "Tactical RPG", label: "RPG Tactique" },
  { value: "Tower Defense", label: "Tower Defense" },
  { value: "Strategy", label: "Stratégie" },
]

export function GameFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [genre, setGenre] = useState(searchParams.get('genre') || '')
  const [popular, setPopular] = useState(searchParams.get('popular') === 'true')

  const updateFilters = (newGenre?: string, newPopular?: boolean) => {
    const params = new URLSearchParams()
    
    const finalGenre = newGenre !== undefined ? newGenre : genre
    const finalPopular = newPopular !== undefined ? newPopular : popular
    
    if (finalGenre) params.set('genre', finalGenre)
    if (finalPopular) params.set('popular', 'true')
    
    const queryString = params.toString()
    router.push(`/games${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setGenre('')
    setPopular(false)
    router.push('/games')
  }

  const handleGenreChange = (value: string) => {
    const newGenre = value === 'all' ? '' : value
    setGenre(newGenre)
    updateFilters(newGenre, undefined)
  }

  const handlePopularToggle = () => {
    const newPopular = !popular
    setPopular(newPopular)
    updateFilters(undefined, newPopular)
  }

  const activeFiltersCount = (genre ? 1 : 0) + (popular ? 1 : 0)

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left side - Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filtres</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Genre Filter */}
            <Select value={genre || 'all'} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tous les genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    Tous les genres
                  </div>
                </SelectItem>
                {GENRES.map((genreOption) => (
                  <SelectItem key={genreOption.value} value={genreOption.value}>
                    {genreOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Popular Filter */}
            <Button
              variant={popular ? "default" : "outline"}
              onClick={handlePopularToggle}
              className="w-full sm:w-auto"
            >
              <Star className={`w-4 h-4 mr-2 ${popular ? 'fill-current' : ''}`} />
              Populaires
            </Button>
          </div>
        </div>

        {/* Right side - Clear filters */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          
          {genre && (
            <Badge variant="secondary" className="gap-1">
              {GENRES.find(g => g.value === genre)?.label || genre}
              <button
                onClick={() => handleGenreChange('all')}
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
  )
}
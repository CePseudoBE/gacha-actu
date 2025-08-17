"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

interface Platform {
  id: string
  name: string
  slug: string
  color?: string
  _count?: {
    games: number
  }
}

interface PlatformSelectorProps {
  value: string[] // IDs des plateformes sélectionnées
  onChange: (platformIds: string[]) => void
  label?: string
}

export function PlatformSelector({ 
  value = [], 
  onChange, 
  label = "Plateformes" 
}: PlatformSelectorProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlatformName, setNewPlatformName] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // Charger les plateformes
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch('/api/admin/platforms')
        if (response.ok) {
          const data = await response.json()
          setPlatforms(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plateformes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlatforms()
  }, [])

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, platformId])
    } else {
      onChange(value.filter(id => id !== platformId))
    }
  }

  const handleAddPlatform = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    if (!newPlatformName.trim()) return

    setIsAdding(true)
    try {
      const response = await fetch('/api/admin/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPlatformName,
          color: "#6B7280" // Couleur par défaut
        }),
      })

      if (response.ok) {
        const newPlatform = await response.json()
        setPlatforms(prev => [...prev, newPlatform])
        setNewPlatformName("")
        setShowAddForm(false)
        // Auto-sélectionner la nouvelle plateforme
        onChange([...value, newPlatform.id])
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Chargement des plateformes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Liste des plateformes avec checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
            <Checkbox
              id={`platform-${platform.id}`}
              checked={value.includes(platform.id)}
              onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked as boolean)}
            />
            <Label
              htmlFor={`platform-${platform.id}`}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <span>{platform.name}</span>
              {platform._count && platform._count.games > 0 && (
                <Badge variant="outline" className="ml-auto">
                  {platform._count.games}
                </Badge>
              )}
            </Label>
          </div>
        ))}
      </div>

      {/* Plateformes sélectionnées */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Plateformes sélectionnées:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((platformId) => {
              const platform = platforms.find(p => p.id === platformId)
              if (!platform) return null
              
              return (
                <Badge 
                  key={platformId} 
                  variant="secondary"
                  style={{ 
                    backgroundColor: platform.color || undefined,
                    color: platform.color ? 'white' : undefined
                  }}
                >
                  {platform.name}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Ajouter une nouvelle plateforme */}
      <div className="border-t pt-4">
        {!showAddForm ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une nouvelle plateforme
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                placeholder="Nom de la plateforme..."
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                disabled={isAdding}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddPlatform(e as any)
                  }
                }}
              />
              <Button 
                type="button" 
                size="sm" 
                disabled={isAdding || !newPlatformName.trim()}
                onClick={handleAddPlatform}
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajouter"}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false)
                setNewPlatformName("")
              }}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
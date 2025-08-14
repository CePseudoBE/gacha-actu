"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Star, Calendar, User, Filter, Wind, Flame, Zap, Droplets, Snowflake, Mountain, Leaf } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export interface TierItem {
  id: string
  name: string
  imageUrl: string
  rarity?: number
  element?: string
  role?: string
  modes: string[] // PvE, PvP, Raid, etc.
  categories: string[] // DPS, Support, Tank, Healer, Hybride
}

export interface TierRow {
  tier: string
  label: string
  color: string
  items: TierItem[]
}

export interface TierListData {
  mode: string
  category?: string
  tiers: TierRow[]
}

export interface GameMode {
  id: string
  name: string
  description: string
  icon?: string
}

export interface RoleCategory {
  id: string
  name: string
  color: string
  icon?: string
}

interface TierListAdvancedProps {
  title: string
  description?: string
  author: string
  lastUpdated: string
  
  // Configuration des modes et catégories
  gameModes: GameMode[]
  roleCategories?: RoleCategory[]
  
  // Données des tier lists
  tierListData: TierListData[]
  
  // Options d'affichage
  showRoleFilters?: boolean
  defaultMode?: string
  defaultCategory?: string
}

export function TierListAdvanced({
  title,
  description,
  author,
  lastUpdated,
  gameModes,
  roleCategories = [],
  tierListData,
  showRoleFilters = true,
  defaultMode = gameModes[0]?.id,
  defaultCategory = "all"
}: TierListAdvancedProps) {
  const [selectedMode, setSelectedMode] = useState(defaultMode)
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)

  // Obtenir la tier list pour le mode/catégorie sélectionné
  const getCurrentTierList = (): TierRow[] => {
    const modeData = tierListData.find(data => data.mode === selectedMode)
    if (!modeData) return []

    if (selectedCategory === "all") {
      return modeData.tiers
    }

    // Filtrer par catégorie de rôle
    return modeData.tiers.map(tier => ({
      ...tier,
      items: tier.items.filter(item => 
        item.categories.includes(selectedCategory)
      )
    })).filter(tier => tier.items.length > 0)
  }

  const currentTiers = getCurrentTierList()

  return (
    <Card className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h2 className="text-2xl font-bold leading-tight">
              {title}
            </h2>
            
            {description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Mis à jour le {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="space-y-6 p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/50">
        {/* Modes de jeu */}
        <div>
          <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
            <div className="w-5 h-5 rounded-lg bg-primary/20 flex items-center justify-center">
              <Filter className="h-3 w-3 text-primary" />
            </div>
            Mode de jeu
          </label>
          <Tabs value={selectedMode} onValueChange={setSelectedMode}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-transparent p-0 h-auto">
              {gameModes.map((mode) => (
                <TabsTrigger
                  key={mode.id}
                  value={mode.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg bg-background/60 border border-border/60 hover:bg-background/80 transition-all duration-200 text-sm px-4 py-3 rounded-xl font-medium"
                  title={mode.description}
                >
                  {mode.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Catégories de rôles */}
        {showRoleFilters && roleCategories.length > 0 && (
          <div>
            <label className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
              <div className="w-5 h-5 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Star className="h-3 w-3 text-secondary" />
              </div>
              Filtrer par rôle
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Tous les rôles
              </Button>
              {roleCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 border-2 ${
                    selectedCategory === category.id 
                      ? "border-current shadow-lg scale-105" 
                      : "hover:border-current"
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? `${category.color}20` : undefined,
                    borderColor: category.color,
                    color: selectedCategory === category.id ? category.color : undefined,
                    boxShadow: selectedCategory === category.id ? `0 8px 24px ${category.color}40` : undefined
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tier List */}
      <div className="space-y-4">
        {currentTiers.length > 0 ? (
          currentTiers.map((tier) => (
            <div
              key={`${selectedMode}-${selectedCategory}-${tier.tier}`}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm hover:border-border transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${tier.color}08 0%, ${tier.color}04 50%, transparent 100%)`
              }}
            >
              {/* Tier Label */}
              <div className="flex gap-6 p-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20 backdrop-blur-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}dd 100%)`,
                      boxShadow: `0 8px 32px ${tier.color}40`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                    {tier.tier}
                  </div>
                  <span className="text-sm font-semibold mt-2 text-center" style={{ color: tier.color }}>
                    {tier.label}
                  </span>
                </div>

                {/* Items */}
                <div className="flex-1 min-h-[5rem] flex items-center">
                  {tier.items.length > 0 ? (
                    <div className="flex flex-wrap gap-3 w-full">
                      {tier.items.map((item) => (
                        <TierItemCard 
                          key={`${item.id}-${selectedMode}-${selectedCategory}`} 
                          item={item}
                          selectedCategory={selectedCategory}
                          tierColor={tier.color}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-20 text-muted-foreground text-sm italic">
                      Aucun personnage dans ce tier pour cette catégorie
                    </div>
                  )}
                </div>
              </div>
              
              {/* Subtle animated background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(45deg, ${tier.color}06 0%, transparent 50%)`
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-lg font-medium">Aucune tier list disponible</p>
            <p className="text-sm mt-1">Essayez une autre configuration</p>
          </div>
        )}
      </div>

      {/* Legend */}
      {currentTiers.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
          <p className="font-medium">Légende des tiers :</p>
          <div className="flex flex-wrap gap-4">
            {currentTiers.map((tier) => (
              <div key={tier.tier} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: tier.color }}
                />
                <span>{tier.tier} - {tier.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

interface TierItemCardProps {
  item: TierItem
  selectedCategory?: string
  tierColor?: string
}

function TierItemCard({ item, selectedCategory, tierColor }: TierItemCardProps) {
  // Highlight du rôle sélectionné
  const isRoleHighlighted = selectedCategory && selectedCategory !== "all" && 
    item.categories.includes(selectedCategory)

  // Fonction pour obtenir l'icône d'élément
  const getElementIcon = (element: string) => {
    switch (element?.toLowerCase()) {
      case 'anemo':
        return <Wind className="h-3 w-3 text-cyan-400" />
      case 'pyro':
        return <Flame className="h-3 w-3 text-red-400" />
      case 'electro':
        return <Zap className="h-3 w-3 text-purple-400" />
      case 'hydro':
        return <Droplets className="h-3 w-3 text-blue-400" />
      case 'cryo':
        return <Snowflake className="h-3 w-3 text-cyan-200" />
      case 'geo':
        return <Mountain className="h-3 w-3 text-amber-500" />
      case 'dendro':
        return <Leaf className="h-3 w-3 text-green-400" />
      default:
        return null
    }
  }

  return (
    <div className="group relative">
      <div className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
        isRoleHighlighted 
          ? "border-primary ring-4 ring-primary/30 shadow-primary/50" 
          : "border-white/20 hover:border-white/40"
      }`}
      style={{
        boxShadow: isRoleHighlighted 
          ? `0 12px 32px ${tierColor}60, 0 0 0 4px ${tierColor}30`
          : "0 8px 24px rgba(0,0,0,0.12)"
      }}>
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${tierColor || '#ffffff'} 0%, transparent 70%)` }}
        />
        
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={80}
          height={80}
          className="w-full h-full object-cover relative z-10"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        
        {/* Rarity stars */}
        {item.rarity && (
          <div className="absolute top-1 right-1 bg-gradient-to-br from-black/80 to-black/60 rounded-lg px-1.5 py-0.5 backdrop-blur-sm z-30">
            <div className="flex gap-0.5">
              {Array.from({ length: item.rarity }).map((_, i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Element indicator */}
        {item.element && (
          <div className="absolute bottom-1 left-1 bg-gradient-to-br from-black/80 to-black/60 rounded-lg p-1.5 backdrop-blur-sm z-30">
            {getElementIcon(item.element)}
          </div>
        )}

        {/* Role highlight indicator */}
        {isRoleHighlighted && (
          <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse z-20" />
        )}
      </div>

      {/* Character name on hover - simple et sans z-index élevé */}
      <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-2 py-1 shadow-lg">
          <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
        </div>
      </div>
    </div>
  )
}
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, Calendar, User } from "lucide-react"
import Image from "next/image"

export interface TierItem {
  id: string
  name: string
  imageUrl: string
  rarity?: number // 1-5 étoiles par exemple
  element?: string // Feu, Eau, Terre, etc.
  role?: string // DPS, Support, Tank, etc.
}

export interface TierRow {
  tier: string
  label: string
  color: string
  items: TierItem[]
}

interface TierListProps {
  title: string
  description?: string
  category: string
  author: string
  lastUpdated: string
  tiers: TierRow[]
}

export function TierList({
  title,
  description,
  category,
  author,
  lastUpdated,
  tiers
}: TierListProps) {
  return (
    <Card className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            
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

      {/* Tier List */}
      <div className="space-y-3">
        {tiers.map((tier) => (
          <div
            key={tier.tier}
            className="flex gap-4 p-4 rounded-lg border bg-card/50"
          >
            {/* Tier Label */}
            <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: tier.color }}
              >
                {tier.tier}
              </div>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {tier.label}
              </span>
            </div>

            {/* Items */}
            <div className="flex-1 min-h-[4rem]">
              {tier.items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tier.items.map((item) => (
                    <TierItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Aucun élément dans ce tier
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
        <p className="font-medium">Légende des tiers :</p>
        <div className="flex flex-wrap gap-4">
          {tiers.map((tier) => (
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
    </Card>
  )
}

interface TierItemCardProps {
  item: TierItem
}

function TierItemCard({ item }: TierItemCardProps) {
  return (
    <div className="group relative">
      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-background shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
        
        {/* Rarity stars */}
        {item.rarity && (
          <div className="absolute top-0 right-0 bg-black/70 rounded-bl-md px-1">
            <div className="flex">
              {Array.from({ length: item.rarity }).map((_, i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        )}

        {/* Element indicator */}
        {item.element && (
          <div className="absolute bottom-0 left-0 bg-black/70 rounded-tr-md px-1 py-0.5">
            <span className="text-xs text-white font-medium">
              {item.element.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-popover border rounded-md shadow-lg p-2 whitespace-nowrap text-xs">
          <div className="font-medium">{item.name}</div>
          {item.role && (
            <div className="text-muted-foreground">{item.role}</div>
          )}
        </div>
      </div>
    </div>
  )
}
"use client"

import { TierListAdvanced, type TierListData, type GameMode, type RoleCategory, type TierItem } from "@/components/TierListAdvanced"
import { useEffect, useState } from "react"

// Configuration des modes de jeu
const gameModes: GameMode[] = [
  {
    id: "spiral_abyss",
    name: "Abysse Spiralé",
    description: "Contenu end-game PvE avec timer"
  },
  {
    id: "overworld",
    name: "Exploration",
    description: "Contenu open-world et quêtes"
  },
  {
    id: "domains",
    name: "Domaines",
    description: "Donjons pour matériaux"
  },
  {
    id: "weekly_bosses",
    name: "Boss Hebdo",
    description: "Boss de fin de semaine"
  }
]

// Configuration des catégories de rôles
const roleCategories: RoleCategory[] = [
  {
    id: "main_dps",
    name: "Main DPS",
    color: "#ef4444"
  },
  {
    id: "sub_dps",
    name: "Sub DPS",
    color: "#f97316"
  },
  {
    id: "support",
    name: "Support",
    color: "#22c55e"
  },
  {
    id: "healer",
    name: "Healer",
    color: "#3b82f6"
  },
  {
    id: "shielder",
    name: "Bouclier",
    color: "#8b5cf6"
  },
  {
    id: "hybrid",
    name: "Hybride",
    color: "#f59e0b"
  }
]

// Base de données des personnages avec toutes leurs propriétés
const allCharacters: TierItem[] = [
  {
    id: "bennett",
    name: "Bennett",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    rarity: 4,
    element: "Pyro",
    role: "Support",
    modes: ["spiral_abyss", "overworld", "domains", "weekly_bosses"],
    categories: ["support", "healer", "hybrid"]
  },
  {
    id: "kazuha",
    name: "Kazuha",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Anemo",
    role: "Support",
    modes: ["spiral_abyss", "overworld", "domains"],
    categories: ["support", "sub_dps", "hybrid"]
  },
  {
    id: "zhongli",
    name: "Zhongli",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Geo",
    role: "Support",
    modes: ["spiral_abyss", "overworld", "weekly_bosses"],
    categories: ["support", "shielder"]
  },
  {
    id: "nahida",
    name: "Nahida",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Dendro",
    role: "Main DPS",
    modes: ["spiral_abyss", "domains", "weekly_bosses"],
    categories: ["main_dps", "support", "hybrid"]
  },
  {
    id: "raiden",
    name: "Raiden Shogun",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Electro",
    role: "Main DPS",
    modes: ["spiral_abyss", "domains", "weekly_bosses"],
    categories: ["main_dps", "sub_dps", "support"]
  },
  {
    id: "ayaka",
    name: "Ayaka",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Cryo",
    role: "Main DPS",
    modes: ["spiral_abyss", "domains", "weekly_bosses"],
    categories: ["main_dps"]
  },
  {
    id: "kokomi",
    name: "Kokomi",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Hydro",
    role: "Healer",
    modes: ["spiral_abyss", "overworld", "domains"],
    categories: ["healer", "support", "hybrid"]
  },
  {
    id: "xingqiu",
    name: "Xingqiu",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    rarity: 4,
    element: "Hydro",
    role: "Sub DPS",
    modes: ["spiral_abyss", "domains", "weekly_bosses"],
    categories: ["sub_dps", "support"]
  },
  {
    id: "fischl",
    name: "Fischl",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    rarity: 4,
    element: "Electro",
    role: "Sub DPS",
    modes: ["spiral_abyss", "domains", "overworld"],
    categories: ["sub_dps"]
  },
  {
    id: "venti",
    name: "Venti",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Anemo",
    role: "Support",
    modes: ["spiral_abyss", "domains", "overworld"],
    categories: ["support", "sub_dps"]
  },
  {
    id: "hutao",
    name: "Hu Tao",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Pyro",
    role: "Main DPS",
    modes: ["spiral_abyss", "weekly_bosses"],
    categories: ["main_dps"]
  },
  {
    id: "ganyu",
    name: "Ganyu",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    rarity: 5,
    element: "Cryo",
    role: "Main DPS",
    modes: ["spiral_abyss", "overworld", "weekly_bosses"],
    categories: ["main_dps", "sub_dps"]
  }
]

// Fonction pour générer des tier lists aléatoires par mode
function generateTierListsForModes(): TierListData[] {
  return gameModes.map(mode => {
    // Filtrer les personnages disponibles pour ce mode
    const availableCharacters = allCharacters.filter(char => 
      char.modes.includes(mode.id)
    )
    
    // Mélanger aléatoirement
    const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5)
    
    // Répartir dans les tiers
    const tierStructure = [
      { tier: "S+", label: "Meta", color: "#ef4444", count: 2 },
      { tier: "S", label: "Excellent", color: "#f97316", count: 3 },
      { tier: "A", label: "Très bon", color: "#eab308", count: 4 },
      { tier: "B", label: "Correct", color: "#22c55e", count: 2 },
      { tier: "C", label: "Situationnel", color: "#3b82f6", count: 1 }
    ]
    
    let charIndex = 0
    const tiers = tierStructure.map(tierInfo => {
      const items = shuffled.slice(charIndex, charIndex + tierInfo.count)
      charIndex += tierInfo.count
      
      return {
        tier: tierInfo.tier,
        label: tierInfo.label,
        color: tierInfo.color,
        items
      }
    }).filter(tier => tier.items.length > 0)
    
    return {
      mode: mode.id,
      tiers
    }
  })
}

export function GenshinAdvancedTierListExample() {
  // État pour les tier lists (évite l'erreur d'hydratation)
  const [tierListData, setTierListData] = useState<TierListData[]>([])
  const [isClient, setIsClient] = useState(false)

  // Générer les tier lists côté client uniquement
  useEffect(() => {
    setIsClient(true)
    setTierListData(generateTierListsForModes())
  }, [])

  // Affichage de loading pendant l'hydratation
  if (!isClient) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium">Génération de la tier list...</p>
        </div>
      </div>
    )
  }
  
  return (
    <TierListAdvanced
      title="Classement des Personnages"
      description="Filtrez par mode de jeu et rôle pour optimiser vos équipes."
      author="Alex Gacha"
      lastUpdated="14 août 2025"
      gameModes={gameModes}
      roleCategories={roleCategories}
      tierListData={tierListData}
      showRoleFilters={true}
      defaultMode="spiral_abyss"
      defaultCategory="all"
    />
  )
}
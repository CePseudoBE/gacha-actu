import { TierList, type TierRow, type TierItem } from "@/components/TierList"

// Liste de personnages avec données variées
const characterPool = [
  { name: "Bennett", element: "Pyro", role: "Support", rarity: 4 },
  { name: "Kazuha", element: "Anemo", role: "Support", rarity: 5 },
  { name: "Zhongli", element: "Geo", role: "Support", rarity: 5 },
  { name: "Nahida", element: "Dendro", role: "DPS", rarity: 5 },
  { name: "Raiden Shogun", element: "Electro", role: "DPS", rarity: 5 },
  { name: "Ayaka", element: "Cryo", role: "DPS", rarity: 5 },
  { name: "Xingqiu", element: "Hydro", role: "Support", rarity: 4 },
  { name: "Fischl", element: "Electro", role: "Sub-DPS", rarity: 4 },
  { name: "Xiangling", element: "Pyro", role: "DPS", rarity: 4 },
  { name: "Diluc", element: "Pyro", role: "DPS", rarity: 5 },
  { name: "Keqing", element: "Electro", role: "DPS", rarity: 5 },
  { name: "Amber", element: "Pyro", role: "DPS", rarity: 4 },
  { name: "Venti", element: "Anemo", role: "Support", rarity: 5 },
  { name: "Childe", element: "Hydro", role: "DPS", rarity: 5 },
  { name: "Hu Tao", element: "Pyro", role: "DPS", rarity: 5 },
  { name: "Albedo", element: "Geo", role: "Sub-DPS", rarity: 5 },
  { name: "Ganyu", element: "Cryo", role: "DPS", rarity: 5 },
  { name: "Xiao", element: "Anemo", role: "DPS", rarity: 5 },
  { name: "Kokomi", element: "Hydro", role: "Healer", rarity: 5 },
  { name: "Itto", element: "Geo", role: "DPS", rarity: 5 },
  { name: "Yae Miko", element: "Electro", role: "Sub-DPS", rarity: 5 },
  { name: "Ayato", element: "Hydro", role: "DPS", rarity: 5 },
  { name: "Tighnari", element: "Dendro", role: "DPS", rarity: 5 },
  { name: "Collei", element: "Dendro", role: "Support", rarity: 4 },
  { name: "Dori", element: "Electro", role: "Support", rarity: 4 },
  { name: "Candace", element: "Hydro", role: "Support", rarity: 4 }
]

const imageUrls = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop"
]

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function generateRandomTierList(): TierRow[] {
  const shuffledCharacters = shuffleArray(characterPool)
  const tiers = [
    { tier: "S+", label: "Meta", color: "#ff4444", count: Math.floor(Math.random() * 4) + 2 },
    { tier: "S", label: "Excellent", color: "#ff8844", count: Math.floor(Math.random() * 4) + 3 },
    { tier: "A", label: "Très bon", color: "#ffaa44", count: Math.floor(Math.random() * 5) + 3 },
    { tier: "B", label: "Correct", color: "#88cc44", count: Math.floor(Math.random() * 4) + 2 },
    { tier: "C", label: "Situationnel", color: "#44aacc", count: Math.floor(Math.random() * 3) + 1 }
  ]
  
  let characterIndex = 0
  
  return tiers.map(tierInfo => {
    const items: TierItem[] = []
    
    for (let i = 0; i < tierInfo.count && characterIndex < shuffledCharacters.length; i++) {
      const character = shuffledCharacters[characterIndex]
      items.push({
        id: character.name.toLowerCase().replace(/\s+/g, '-'),
        name: character.name,
        imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
        rarity: character.rarity,
        element: character.element,
        role: character.role
      })
      characterIndex++
    }
    
    return {
      tier: tierInfo.tier,
      label: tierInfo.label,
      color: tierInfo.color,
      items
    }
  })
}

export function GenshinTierListExample() {
  // Générer une tier list aléatoire à chaque render pour tester
  const genshinCharacterTiers: TierRow[] = generateRandomTierList()
  
  return (
    <TierList
      title="Tier List Personnages Genshin Impact - Méta 5.3"
      description="Classement des personnages les plus efficaces pour le contenu end-game actuel. Basé sur leur polyvalence, impact en équipe et performance dans l&apos;Abysse Spiralé."
      category="Personnages"
      author="Alex Gacha"
      lastUpdated="14 août 2025"
      tiers={genshinCharacterTiers}
    />
  )
}
// Données de démonstration pour les vidéos YouTube
// En production, ces données viendraient d'une API ou d'une base de données

export interface YouTubeVideoData {
  id: string
  videoId: string
  title: string
  description?: string
  publishedAt?: string
  channelTitle?: string
  thumbnail?: string
  category?: string
}

export const mockYouTubeVideos: YouTubeVideoData[] = [
  {
    id: "1",
    videoId: "dQw4w9WgXcQ", // Rick Roll pour démonstration
    title: "Guide Complet Genshin Impact 2024 - Build Raiden Shogun",
    description: "Découvrez le meilleur build pour Raiden Shogun avec les dernières optimisations de stats et d'artefacts.",
    publishedAt: "2024-01-15T10:00:00Z",
    channelTitle: "GachaGuru",
    category: "Guides"
  },
  {
    id: "2",
    videoId: "jNQXAC9IVRw", // Me at the zoo (première vidéo YouTube)
    title: "Honkai Star Rail - Event Limité : Guide Stratégie",
    description: "Comment maximiser vos récompenses lors de l'événement limité avec les meilleures équipes.",
    publishedAt: "2024-01-10T15:30:00Z",
    channelTitle: "StarRailPro",
    category: "Événements"
  },
  {
    id: "3",
    videoId: "9bZkp7q19f0", // Gangnam Style
    title: "Tier List Fire Emblem Heroes - Méta Janvier 2024",
    description: "Analyse complète de la méta actuelle avec classement détaillé des héros les plus performants.",
    publishedAt: "2024-01-08T12:15:00Z",
    channelTitle: "FEH Masters",
    category: "Tier Lists"
  },
  {
    id: "4",
    videoId: "kJQP7kiw5Fk", // Despacito
    title: "Seven Deadly Sins Origins - Invocation Banner Review",
    description: "Faut-il invoquer sur ce banner ? Analyse des rates et des personnages disponibles.",
    publishedAt: "2024-01-05T18:45:00Z",
    channelTitle: "SDS Analytics",
    category: "Analyses"
  },
  {
    id: "5",
    videoId: "fJ9rUzIMcZQ", // Queen - Bohemian Rhapsody
    title: "Bleach Soul Resonance - Techniques Avancées PvP",
    description: "Maîtrisez les combats PvP avec ces techniques et stratégies avancées.",
    publishedAt: "2024-01-03T14:20:00Z",
    channelTitle: "Soul Tactics",
    category: "PvP"
  },
  {
    id: "6",
    videoId: "L_jWHffIx5E", // Smells Like Teen Spirit
    title: "Actualités Gacha - Récap Semaine du 1er Janvier",
    description: "Toutes les actualités importantes de la semaine dans l'univers des jeux Gacha.",
    publishedAt: "2024-01-01T09:00:00Z",
    channelTitle: "Gacha News",
    category: "Actualités"
  }
]

// Fonction pour récupérer les vidéos (simulation d'appel API)
export async function getYouTubeVideos(): Promise<YouTubeVideoData[]> {
  // Simulation d'un délai d'API
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return mockYouTubeVideos
}

// Fonction pour filtrer par catégorie
export function getVideosByCategory(category: string): YouTubeVideoData[] {
  return mockYouTubeVideos.filter(video => 
    video.category?.toLowerCase() === category.toLowerCase()
  )
}

// Fonction pour récupérer les vidéos récentes
export function getRecentVideos(limit: number = 6): YouTubeVideoData[] {
  return mockYouTubeVideos
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
    .slice(0, limit)
}
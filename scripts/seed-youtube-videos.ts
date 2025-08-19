import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const youtubeVideos = [
  {
    videoId: "dQw4w9WgXcQ",
    title: "Guide Complet Genshin Impact 2024 - Build Raiden Shogun",
    description: "Découvrez le meilleur build pour Raiden Shogun avec les dernières optimisations de stats et d'artefacts.",
    channelTitle: "GachaGuru",
    category: "Guides",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date("2024-01-15T10:00:00Z"),
    order: 1,
    isActive: true
  },
  {
    videoId: "jNQXAC9IVRw",
    title: "Honkai Star Rail - Event Limité : Guide Stratégie",
    description: "Comment maximiser vos récompenses lors de l'événement limité avec les meilleures équipes.",
    channelTitle: "StarRailPro",
    category: "Événements",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    publishedAt: new Date("2024-01-10T15:30:00Z"),
    order: 2,
    isActive: true
  },
  {
    videoId: "9bZkp7q19f0",
    title: "Tier List Fire Emblem Heroes - Méta Janvier 2024",
    description: "Analyse complète de la méta actuelle avec classement détaillé des héros les plus performants.",
    channelTitle: "FEH Masters",
    category: "Tier Lists",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
    publishedAt: new Date("2024-01-08T12:15:00Z"),
    order: 3,
    isActive: true
  },
  {
    videoId: "kJQP7kiw5Fk",
    title: "Seven Deadly Sins Origins - Invocation Banner Review",
    description: "Faut-il invoquer sur ce banner ? Analyse des rates et des personnages disponibles.",
    channelTitle: "SDS Analytics",
    category: "Analyses",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    publishedAt: new Date("2024-01-05T18:45:00Z"),
    order: 4,
    isActive: true
  },
  {
    videoId: "fJ9rUzIMcZQ",
    title: "Bleach Soul Resonance - Techniques Avancées PvP",
    description: "Maîtrisez les combats PvP avec ces techniques et stratégies avancées.",
    channelTitle: "Soul Tactics",
    category: "PvP",
    thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
    publishedAt: new Date("2024-01-03T14:20:00Z"),
    order: 5,
    isActive: true
  },
  {
    videoId: "L_jWHffIx5E",
    title: "Actualités Gacha - Récap Semaine du 1er Janvier",
    description: "Toutes les actualités importantes de la semaine dans l'univers des jeux Gacha.",
    channelTitle: "Gacha News",
    category: "Actualités",
    thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg",
    publishedAt: new Date("2024-01-01T09:00:00Z"),
    order: 6,
    isActive: true
  }
]

async function main() {
  console.log('🎥 Ajout des vidéos YouTube de démonstration...')

  // Nettoyer les vidéos existantes
  await prisma.youTubeVideo.deleteMany()

  // Récupérer les jeux pour associer quelques vidéos
  const genshinGame = await prisma.game.findFirst({ where: { name: { contains: "Genshin" } } })
  const starRailGame = await prisma.game.findFirst({ where: { name: { contains: "Honkai" } } })
  const fehGame = await prisma.game.findFirst({ where: { name: { contains: "Fire Emblem" } } })

  // Créer les vidéos avec associations aux jeux
  for (const [index, video] of youtubeVideos.entries()) {
    let gameId = null
    
    if (index === 0 && genshinGame) gameId = genshinGame.id
    else if (index === 1 && starRailGame) gameId = starRailGame.id
    else if (index === 2 && fehGame) gameId = fehGame.id

    await prisma.youTubeVideo.create({
      data: {
        ...video,
        gameId
      }
    })
  }

  console.log(`✅ ${youtubeVideos.length} vidéos YouTube ajoutées avec succès !`)
  console.log('🎬 Le carousel YouTube est maintenant opérationnel avec de vraies données.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
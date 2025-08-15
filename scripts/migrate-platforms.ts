import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migratePlatforms() {
  console.log('Début de la migration des plateformes...')

  // 1. Créer les plateformes de base
  const platformsData = [
    { name: "iOS", slug: "ios", color: "#007AFF" },
    { name: "Android", slug: "android", color: "#3DDC84" },
    { name: "PC", slug: "pc", color: "#0078D4" },
    { name: "PlayStation", slug: "playstation", color: "#0070F3" },
    { name: "Xbox", slug: "xbox", color: "#107C10" },
    { name: "Nintendo Switch", slug: "nintendo-switch", color: "#E60012" },
    { name: "Web Browser", slug: "web-browser", color: "#FF6B35" },
    { name: "Mobile (iOS/Android)", slug: "mobile", color: "#6B73FF" },
    { name: "Cross-platform", slug: "cross-platform", color: "#9333EA" },
    { name: "Console", slug: "console", color: "#1F2937" }
  ]

  // Créer les plateformes (en ignorant les doublons)
  for (const platformData of platformsData) {
    await prisma.platform.upsert({
      where: { name: platformData.name },
      update: {},
      create: platformData
    })
  }

  console.log('Plateformes créées ✅')

  // 2. Les données de plateformes ont été perdues lors du db push
  // On va juste créer les plateformes de base pour le moment

  console.log('Migration des données terminée ✅')
}

migratePlatforms()
  .catch((e) => {
    console.error('❌ Erreur lors de la migration:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSamplePlatforms() {
  console.log('Ajout de plateformes d\'exemple...')

  try {
    // Trouver Genshin Impact
    const genshinGame = await prisma.game.findFirst({
      where: {
        OR: [
          { name: { contains: 'Genshin' } },
          { slug: 'genshin-impact' }
        ]
      }
    })

    if (!genshinGame) {
      console.log('❌ Genshin Impact non trouvé')
      return
    }

    console.log(`✅ Jeu trouvé: ${genshinGame.name}`)

    // Trouver les plateformes
    const platforms = await prisma.platform.findMany({
      where: {
        name: {
          in: ['iOS', 'Android', 'PC', 'PlayStation']
        }
      }
    })

    console.log(`✅ ${platforms.length} plateformes trouvées`)

    // Ajouter les associations
    for (const platform of platforms) {
      await prisma.gamePlatform.upsert({
        where: {
          gameId_platformId: {
            gameId: genshinGame.id,
            platformId: platform.id
          }
        },
        update: {},
        create: {
          gameId: genshinGame.id,
          platformId: platform.id
        }
      })
      console.log(`✅ Ajouté plateforme: ${platform.name}`)
    }

    console.log('🎉 Terminé ! Genshin Impact devrait maintenant afficher ses plateformes.')

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

addSamplePlatforms()
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Créer les plateformes
  console.log('📝 Creating platforms...')
  const platforms = [
    { name: 'iOS', slug: 'ios', color: '#007AFF' },
    { name: 'Android', slug: 'android', color: '#34C759' },
    { name: 'PC', slug: 'pc', color: '#5856D6' },
    { name: 'PlayStation', slug: 'playstation', color: '#0070F3' },
    { name: 'Nintendo Switch', slug: 'nintendo-switch', color: '#E60012' },
    { name: 'Xbox', slug: 'xbox', color: '#107C10' }
  ]

  const createdPlatforms: Record<string, any> = {}
  for (const platform of platforms) {
    const created = await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: {},
      create: platform
    })
    createdPlatforms[platform.slug] = created
  }

  // 2. Créer les jeux
  console.log('📝 Creating games...')
  
  const genshin = await prisma.game.upsert({
    where: { slug: 'genshin-impact' },
    update: {},
    create: {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'RPG open-world avec système gacha développé par miHoYo',
      genre: 'Action RPG',
      developer: 'miHoYo',
      releaseDate: '2020',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=100',
      isPopular: true,
      officialSite: 'https://genshin.hoyoverse.com',
      wiki: 'https://genshin-impact.fandom.com'
    }
  })

  const honkai = await prisma.game.upsert({
    where: { slug: 'honkai-star-rail' },
    update: {},
    create: {
      name: 'Honkai Star Rail',
      slug: 'honkai-star-rail',
      description: 'RPG au tour par tour spatial avec système gacha',
      genre: 'Turn-based RPG',
      developer: 'miHoYo',
      releaseDate: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=100',
      isPopular: true,
      officialSite: 'https://hsr.hoyoverse.com',
      wiki: 'https://honkai-star-rail.fandom.com'
    }
  })

  const fireEmblem = await prisma.game.upsert({
    where: { slug: 'fire-emblem-heroes' },
    update: {},
    create: {
      name: 'Fire Emblem Heroes',
      slug: 'fire-emblem-heroes',
      description: 'Stratégie tactique mobile',
      genre: 'Tactical RPG',
      developer: 'Nintendo',
      releaseDate: '2017',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=100',
      isPopular: false,
      officialSite: 'https://fire-emblem-heroes.com',
      wiki: 'https://feheroes.fandom.com'
    }
  })

  const arknights = await prisma.game.upsert({
    where: { slug: 'arknights' },
    update: {},
    create: {
      name: 'Arknights',
      slug: 'arknights',
      description: 'Tower Defense avec éléments RPG',
      genre: 'Tower Defense',
      developer: 'Hypergryph',
      releaseDate: '2019',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=100',
      isPopular: false,
      officialSite: 'https://www.arknights.global',
      wiki: 'https://arknights.fandom.com'
    }
  })

  const blueArchive = await prisma.game.upsert({
    where: { slug: 'blue-archive' },
    update: {},
    create: {
      name: 'Blue Archive',
      slug: 'blue-archive',
      description: 'RPG académique avec combat au tour par tour',
      genre: 'Turn-based RPG',
      developer: 'Nexon',
      releaseDate: '2021',
      imageUrl: 'https://images.unsplash.com/photo-1607375119374-8e4e5e5c9e3f?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1607375119374-8e4e5e5c9e3f?w=200&h=100',
      isPopular: false,
      officialSite: 'https://bluearchive.nexon.com',
      wiki: 'https://bluearchive.fandom.com'
    }
  })

  const epicSeven = await prisma.game.upsert({
    where: { slug: 'epic-seven' },
    update: {},
    create: {
      name: 'Epic Seven',
      slug: 'epic-seven',
      description: 'RPG anime au tour par tour',
      genre: 'Turn-based RPG',
      developer: 'Smilegate',
      releaseDate: '2018',
      imageUrl: 'https://images.unsplash.com/photo-1569203583647-e4bf80e8a26f?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1569203583647-e4bf80e8a26f?w=200&h=100',
      isPopular: false,
      officialSite: 'https://epic7.com',
      wiki: 'https://epic7x.com'
    }
  })

  // 3. Associer des plateformes aux jeux
  console.log('📝 Creating game-platform relationships...')
  const gamesPlatforms = [
    // Genshin Impact - Mobile, PC, PlayStation
    { game: genshin, platforms: ['ios', 'android', 'pc', 'playstation'] },
    // Honkai Star Rail - Mobile, PC
    { game: honkai, platforms: ['ios', 'android', 'pc'] },
    // Fire Emblem Heroes - Mobile only
    { game: fireEmblem, platforms: ['ios', 'android'] },
    // Arknights - Mobile only
    { game: arknights, platforms: ['ios', 'android'] },
    // Blue Archive - Mobile only
    { game: blueArchive, platforms: ['ios', 'android'] },
    // Epic Seven - Mobile only
    { game: epicSeven, platforms: ['ios', 'android'] }
  ]

  for (const { game, platforms: platformSlugs } of gamesPlatforms) {
    for (const platformSlug of platformSlugs) {
      const platform = createdPlatforms[platformSlug]
      if (platform) {
        await prisma.gamePlatform.upsert({
          where: {
            gameId_platformId: {
              gameId: game.id,
              platformId: platform.id
            }
          },
          update: {},
          create: {
            gameId: game.id,
            platformId: platform.id
          }
        })
      }
    }
  }

  // 4. Créer des tags
  console.log('📝 Creating tags...')
  const tagNames = [
    'Gacha', 'RPG', 'Mobile', 'Free-to-Play', 'miHoYo', 'Anime', 'Action', 'Adventure',
    'Strategy', 'Nintendo', 'Tower Defense', 'Turn-based', 'Academic', 'Fantasy'
  ]
  
  const createdTags: Record<string, any> = {}
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: tagName, slug }
    })
    createdTags[tagName] = tag
  }

  // 5. Créer des articles
  console.log('📝 Creating articles...')
  const articles = [
    {
      title: 'Nouvelle bannière Raiden Shogun - Tous les détails',
      slug: 'nouvelle-banniere-raiden-shogun',
      summary: 'La bannière tant attendue de Raiden Shogun fait son grand retour dans Genshin Impact avec des bonus exclusifs.',
      content: 'La nouvelle bannière de Raiden Shogun est disponible avec des taux de drop améliorés...',
      author: 'Sarah Chen',
      game: genshin,
      category: 'NEWS',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400',
      readingTime: 3,
      metaDescription: 'Découvrez tous les détails de la nouvelle bannière Raiden Shogun dans Genshin Impact',
      isPopular: true,
      tags: ['Gacha', 'miHoYo', 'Action']
    },
    {
      title: 'Guide complet : Optimiser Firefly dans Honkai Star Rail',
      slug: 'guide-firefly-honkai-star-rail',
      summary: 'Découvrez comment construire et optimiser Firefly pour maximiser ses dégâts dans toutes les situations.',
      content: 'Firefly est un personnage complexe qui nécessite une approche stratégique...',
      author: 'Marc Dubois',
      game: honkai,
      category: 'GUIDE',
      imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400',
      readingTime: 8,
      metaDescription: 'Guide complet pour optimiser Firefly dans Honkai Star Rail',
      isPopular: true,
      tags: ['RPG', 'miHoYo', 'Turn-based']
    },
    {
      title: 'Événement Fallen Heroes - Fire Emblem Heroes',
      slug: 'evenement-fallen-heroes-feh',
      summary: 'Un nouvel événement majeur débarque dans Fire Emblem Heroes avec des héros légendaires.',
      content: 'L\'événement Fallen Heroes introduit de nouveaux personnages puissants...',
      author: 'Julie Martin',
      game: fireEmblem,
      category: 'EVENT',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400',
      readingTime: 5,
      metaDescription: 'Tout sur l\'événement Fallen Heroes dans Fire Emblem Heroes',
      isPopular: false,
      tags: ['Strategy', 'Nintendo', 'Mobile']
    },
    {
      title: 'Tier List des Opérateurs - Arknights 2025',
      slug: 'tier-list-operateurs-arknights-2025',
      summary: 'Notre tier list complète des meilleurs opérateurs Arknights pour le meta actuel.',
      content: 'Voici notre analyse détaillée des opérateurs les plus efficaces...',
      author: 'Alex Thompson',
      game: arknights,
      category: 'TIER_LIST',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400',
      readingTime: 12,
      metaDescription: 'Tier list complète des opérateurs Arknights 2025',
      isPopular: true,
      tags: ['Tower Defense', 'Strategy', 'Mobile']
    },
    {
      title: 'Raid Binah : Stratégies avancées - Blue Archive',
      slug: 'raid-binah-strategies-blue-archive',
      summary: 'Maîtrisez le raid Binah avec nos stratégies éprouvées et compositions d\'équipe optimales.',
      content: 'Le raid Binah est l\'un des défis les plus difficiles de Blue Archive...',
      author: 'Yuki Tanaka',
      game: blueArchive,
      category: 'GUIDE',
      imageUrl: 'https://images.unsplash.com/photo-1607375119374-8e4e5e5c9e3f?w=800&h=400',
      readingTime: 10,
      metaDescription: 'Guide du raid Binah dans Blue Archive avec stratégies avancées',
      isPopular: false,
      tags: ['Academic', 'Turn-based', 'Mobile']
    },
    {
      title: 'Guide ML Belian : Build et utilisation - Epic Seven',
      slug: 'guide-ml-belian-epic-seven',
      summary: 'Découvrez comment optimiser ML Belian, l\'une des unités les plus polyvalentes d\'Epic Seven.',
      content: 'ML Belian est une unité défensive exceptionnelle qui peut changer le cours...',
      author: 'Kevin Park',
      game: epicSeven,
      category: 'GUIDE',
      imageUrl: 'https://images.unsplash.com/photo-1569203583647-e4bf80e8a26f?w=800&h=400',
      readingTime: 7,
      metaDescription: 'Guide complet de ML Belian dans Epic Seven',
      isPopular: false,
      tags: ['Anime', 'Turn-based', 'Fantasy']
    }
  ]

  for (const articleData of articles) {
    const { tags, game, ...data } = articleData
    
    const article = await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {},
      create: {
        ...data,
        gameId: game.id,
        publishedAt: new Date()
      }
    })

    // Associer les tags
    for (const tagName of tags) {
      const tag = createdTags[tagName]
      if (tag) {
        await prisma.articleTag.upsert({
          where: {
            articleId_tagId: {
              articleId: article.id,
              tagId: tag.id
            }
          },
          update: {},
          create: {
            articleId: article.id,
            tagId: tag.id
          }
        })
      }
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${platforms.length} platforms`)
  console.log(`   - 6 games with platform associations`)
  console.log(`   - ${tagNames.length} tags`)
  console.log(`   - ${articles.length} articles with tags`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
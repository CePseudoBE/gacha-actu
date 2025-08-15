import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Créer les jeux
  console.log('📝 Creating games...')
  const genshin = await prisma.game.upsert({
    where: { slug: 'genshin-impact' },
    update: {},
    create: {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'RPG open-world avec système gacha développé par miHoYo',
      genre: 'Action RPG',
      platform: 'Mobile, PC, PlayStation',
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
      platform: 'Mobile, PC',
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
      platform: 'Mobile',
      developer: 'Nintendo',
      releaseDate: '2017',
      imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=100',
      isPopular: true,
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
      description: 'Tower defense stratégique',
      genre: 'Tower Defense',
      platform: 'Mobile, PC',
      developer: 'Hypergryph',
      releaseDate: '2019',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=100',
      isPopular: true,
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
      description: 'RPG tactique avec étudiantes',
      genre: 'Tactical RPG',
      platform: 'Mobile',
      developer: 'Nexon',
      releaseDate: '2021',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=100',
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
      description: 'RPG anime avec combats au tour par tour',
      genre: 'Turn-based RPG',
      platform: 'Mobile, PC',
      developer: 'Smilegate',
      releaseDate: '2018',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=600',
      logoUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=100',
      isPopular: true,
      officialSite: 'https://epic7.smilegatemegaport.com',
      wiki: 'https://epic7x.com'
    }
  })

  // 2. Créer les tags
  console.log('🏷️ Creating tags...')
  const banniereTag = await prisma.tag.upsert({
    where: { slug: 'banniere' },
    update: {},
    create: { name: 'bannière', slug: 'banniere' }
  })

  const electroTag = await prisma.tag.upsert({
    where: { slug: 'electro' },
    update: {},
    create: { name: 'electro', slug: 'electro' }
  })

  const archonTag = await prisma.tag.upsert({
    where: { slug: 'archon' },
    update: {},
    create: { name: 'archon', slug: 'archon' }
  })

  const guideTag = await prisma.tag.upsert({
    where: { slug: 'guide' },
    update: {},
    create: { name: 'guide', slug: 'guide' }
  })

  const dpsTag = await prisma.tag.upsert({
    where: { slug: 'dps' },
    update: {},
    create: { name: 'dps', slug: 'dps' }
  })

  const feuTag = await prisma.tag.upsert({
    where: { slug: 'feu' },
    update: {},
    create: { name: 'feu', slug: 'feu' }
  })

  const evenementTag = await prisma.tag.upsert({
    where: { slug: 'evenement' },
    update: {},
    create: { name: 'événement', slug: 'evenement' }
  })

  const herosCorrompusTag = await prisma.tag.upsert({
    where: { slug: 'heros-corrompus' },
    update: {},
    create: { name: 'héros corrompus', slug: 'heros-corrompus' }
  })

  const tierListTag = await prisma.tag.upsert({
    where: { slug: 'tier-list' },
    update: {},
    create: { name: 'tier-list', slug: 'tier-list' }
  })

  const metaTag = await prisma.tag.upsert({
    where: { slug: 'meta' },
    update: {},
    create: { name: 'meta', slug: 'meta' }
  })

  const operateursTag = await prisma.tag.upsert({
    where: { slug: 'operateurs' },
    update: {},
    create: { name: 'opérateurs', slug: 'operateurs' }
  })

  const raidTag = await prisma.tag.upsert({
    where: { slug: 'raid' },
    update: {},
    create: { name: 'raid', slug: 'raid' }
  })

  const bossTag = await prisma.tag.upsert({
    where: { slug: 'boss' },
    update: {},
    create: { name: 'boss', slug: 'boss' }
  })

  const extremeTag = await prisma.tag.upsert({
    where: { slug: 'extreme' },
    update: {},
    create: { name: 'extrême', slug: 'extreme' }
  })

  const herosTag = await prisma.tag.upsert({
    where: { slug: 'heros' },
    update: {},
    create: { name: 'héros', slug: 'heros' }
  })

  const moonlightTag = await prisma.tag.upsert({
    where: { slug: 'moonlight' },
    update: {},
    create: { name: 'moonlight', slug: 'moonlight' }
  })

  const pvpTag = await prisma.tag.upsert({
    where: { slug: 'pvp' },
    update: {},
    create: { name: 'pvp', slug: 'pvp' }
  })

  // 3. Créer les mots-clés SEO
  console.log('🔍 Creating SEO keywords...')
  const gachaKeyword = await prisma.seoKeyword.upsert({
    where: { keyword: 'gacha' },
    update: {},
    create: { keyword: 'gacha' }
  })

  const actualitesKeyword = await prisma.seoKeyword.upsert({
    where: { keyword: 'actualités' },
    update: {},
    create: { keyword: 'actualités' }
  })

  const guidesKeyword = await prisma.seoKeyword.upsert({
    where: { keyword: 'guides' },
    update: {},
    create: { keyword: 'guides' }
  })

  // 4. Créer les articles
  console.log('📰 Creating articles...')

  const article1 = await prisma.article.upsert({
    where: { slug: 'raiden-shogun-banniere-5-3' },
    update: {},
    create: {
      title: 'Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3',
      summary: 'La bannière de re-run de Raiden Shogun arrive avec de nouveaux personnages 4 étoiles. Découvrez les détails et les conseils pour optimiser vos tirages.',
      author: 'Alex Gacha',
      publishedAt: new Date('2025-08-13'),
      slug: 'raiden-shogun-banniere-5-3',
      gameId: genshin.id,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400',
      content: `# Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3

La version 5.3 de Genshin Impact apporte son lot de nouveautés avec le retour très attendu de **Raiden Shogun** dans une bannière de re-run.

## Détails de la bannière

- **Période** : Du 15 au 30 août 2025
- **Personnage 5★** : Raiden Shogun (Electro, Polearm)
- **Personnages 4★** : Kujou Sara, Sucrose, Xiangling

## Conseils pour vos tirages

La Raiden Shogun reste l'un des personnages les plus polyvalents du jeu...`,
      readingTime: 5,
      category: 'NEWS',
      isPopular: true
    }
  })

  const article2 = await prisma.article.upsert({
    where: { slug: 'guide-firefly-honkai-star-rail' },
    update: {},
    create: {
      title: 'Honkai Star Rail : Guide complet de Firefly',
      summary: 'Tout ce qu\'il faut savoir sur Firefly, le nouveau personnage DPS Feu. Build, équipes recommandées et stratégies de combat.',
      author: 'Marie HSR',
      publishedAt: new Date('2025-08-12'),
      slug: 'guide-firefly-honkai-star-rail',
      gameId: honkai.id,
      imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400',
      content: `# Honkai Star Rail : Guide complet de Firefly

Firefly est le nouveau personnage DPS Feu introduit dans la version 2.3 de Honkai Star Rail.

## Analyse des compétences

### Compétence basique
- **Dégâts** : 50% ATQ + 25% PV Max
- **Type** : Mono-cible

### Compétence élémentaire
Firefly entre en mode "Enhanced" qui augmente ses statistiques...`,
      readingTime: 8,
      category: 'GUIDE',
      isPopular: false
    }
  })

  // Continuer avec les autres articles...
  const article3 = await prisma.article.upsert({
    where: { slug: 'evenement-fallen-heroes-feh' },
    update: {},
    create: {
      title: 'Fire Emblem Heroes : Événement Fallen Heroes',
      summary: 'Un nouvel événement avec des héros corrompus fait son apparition. Découvrez les nouveaux personnages et les récompenses à obtenir.',
      author: 'Thomas FEH',
      publishedAt: new Date('2025-08-11'),
      slug: 'evenement-fallen-heroes-feh',
      gameId: fireEmblem.id,
      imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400',
      content: `# Fire Emblem Heroes : Événement Fallen Heroes

L'événement "Fallen Heroes" revient avec de nouveaux héros corrompus à recruter.

## Nouveaux héros

### Fallen Byleth
- **Type** : Rouge, Épée
- **Compétence spéciale** : Ruptured Sky
- **Passif** : Creator Sword+

### Fallen Dimitri
- **Type** : Bleu, Lance
- **Compétence spéciale** : Galeforce
- **Passif** : Murderous Lion+

## Récompenses de l'événement

- Orbes x40
- Cristaux divins x20
- Plumes héroïques x5000`,
      readingTime: 6,
      category: 'EVENT',
      isPopular: true
    }
  })

  // 5. Associer les tags aux articles
  console.log('🔗 Creating article-tag relationships...')

  // Article 1: Raiden Shogun
  await prisma.articleTag.create({ data: { articleId: article1.id, tagId: banniereTag.id } })
  await prisma.articleTag.create({ data: { articleId: article1.id, tagId: electroTag.id } })
  await prisma.articleTag.create({ data: { articleId: article1.id, tagId: archonTag.id } })

  // Article 2: Firefly guide  
  await prisma.articleTag.create({ data: { articleId: article2.id, tagId: guideTag.id } })
  await prisma.articleTag.create({ data: { articleId: article2.id, tagId: dpsTag.id } })
  await prisma.articleTag.create({ data: { articleId: article2.id, tagId: feuTag.id } })

  // Article 3: FEH event
  await prisma.articleTag.create({ data: { articleId: article3.id, tagId: evenementTag.id } })
  await prisma.articleTag.create({ data: { articleId: article3.id, tagId: herosCorrompusTag.id } })

  // 6. Créer les guides
  console.log('📚 Creating guides...')

  const guide1 = await prisma.guide.upsert({
    where: { slug: 'raiden-shogun-build-complet' },
    update: {},
    create: {
      title: 'Guide complet Raiden Shogun : Build optimal et stratégies',
      summary: 'Découvrez le build optimal pour Raiden Shogun, ses meilleures équipes et stratégies de combat avancées.',
      author: 'Alex Gacha',
      publishedAt: new Date('2025-08-10'),
      slug: 'raiden-shogun-build-complet',
      gameId: genshin.id,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400',
      content: `# Guide complet Raiden Shogun

La Raiden Shogun est l'un des personnages les plus polyvalents de Genshin Impact...`,
      readingTime: 12,
      difficulty: 'INTERMEDIATE',
      guideType: 'CHARACTER_BUILD',
      isPopular: true,
      viewCount: 2500,
      metaDescription: 'Guide complet pour optimiser Raiden Shogun dans Genshin Impact : builds, équipes, artefacts et stratégies.'
    }
  })

  const guide2 = await prisma.guide.upsert({
    where: { slug: 'genshin-impact-guide-debutant' },
    update: {},
    create: {
      title: 'Guide débutant Genshin Impact : Les bases pour bien commencer',
      summary: 'Tout ce qu\'un débutant doit savoir pour bien débuter dans Genshin Impact : système de tirage, exploration, combat.',
      author: 'Marie Guide',
      publishedAt: new Date('2025-08-08'),
      slug: 'genshin-impact-guide-debutant',
      gameId: genshin.id,
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400',
      content: `# Guide débutant Genshin Impact

Bienvenue dans le monde de Teyvat ! Ce guide vous accompagnera...`,
      readingTime: 15,
      difficulty: 'BEGINNER',
      guideType: 'BEGINNER',
      isPopular: true,
      viewCount: 5000,
      metaDescription: 'Guide complet pour débuter dans Genshin Impact : conseils, astuces et mécaniques essentielles.'
    }
  })

  const guide3 = await prisma.guide.upsert({
    where: { slug: 'honkai-star-rail-equipements-reliques' },
    update: {},
    create: {
      title: 'Honkai Star Rail : Guide des équipements et reliques optimales',
      summary: 'Apprenez à optimiser vos équipements et reliques pour maximiser la puissance de vos personnages.',
      author: 'Thomas HSR',
      publishedAt: new Date('2025-08-07'),
      slug: 'honkai-star-rail-equipements-reliques',
      gameId: honkai.id,
      imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400',
      content: `# Guide équipements Honkai Star Rail

Les équipements et reliques sont cruciaux pour optimiser vos personnages...`,
      readingTime: 10,
      difficulty: 'INTERMEDIATE',
      guideType: 'EQUIPMENT',
      isPopular: false,
      viewCount: 1200,
      metaDescription: 'Guide complet des équipements et reliques dans Honkai Star Rail pour optimiser vos builds.'
    }
  })

  const guide4 = await prisma.guide.upsert({
    where: { slug: 'arknights-strategie-avancee-defense' },
    update: {},
    create: {
      title: 'Arknights : Stratégies avancées de tower defense',
      summary: 'Maîtrisez les stratégies avancées d\'Arknights : placement optimal, synergies d\'opérateurs et tactiques de niveau expert.',
      author: 'Sophie Arknight',
      publishedAt: new Date('2025-08-05'),
      slug: 'arknights-strategie-avancee-defense',
      gameId: arknights.id,
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400',
      content: `# Stratégies avancées Arknights

Pour exceller dans Arknights, la stratégie prime sur la force brute...`,
      readingTime: 20,
      difficulty: 'EXPERT',
      guideType: 'STRATEGY',
      isPopular: true,
      viewCount: 3200,
      metaDescription: 'Stratégies expertes pour Arknights : placement, synergies et tactiques avancées de tower defense.'
    }
  })

  // 7. Créer les sections de guides
  console.log('📖 Creating guide sections...')

  await prisma.guideSection.create({
    data: {
      title: 'Introduction à Raiden Shogun',
      content: 'La Raiden Shogun est l\'Archon Electro d\'Inazuma...',
      order: 1,
      guideId: guide1.id
    }
  })

  await prisma.guideSection.create({
    data: {
      title: 'Artefacts recommandés',
      content: 'Les meilleurs sets d\'artefacts pour Raiden Shogun...',
      order: 2,
      guideId: guide1.id
    }
  })

  await prisma.guideSection.create({
    data: {
      title: 'Compositions d\'équipe',
      content: 'Les meilleures équipes pour exploiter le potentiel de Raiden...',
      order: 3,
      guideId: guide1.id
    }
  })

  // 8. Créer les prérequis
  console.log('📋 Creating guide prerequisites...')

  await prisma.guidePrerequisite.create({
    data: {
      description: 'Avoir débloqué Inazuma',
      guideId: guide1.id
    }
  })

  await prisma.guidePrerequisite.create({
    data: {
      description: 'Niveau d\'aventure 30+',
      guideId: guide1.id
    }
  })

  // 9. Associer les tags aux guides
  console.log('🏷️ Creating guide-tag relationships...')

  // Guide 1: Raiden Shogun
  await prisma.guideTag.create({ data: { guideId: guide1.id, tagId: guideTag.id } })
  await prisma.guideTag.create({ data: { guideId: guide1.id, tagId: electroTag.id } })
  await prisma.guideTag.create({ data: { guideId: guide1.id, tagId: dpsTag.id } })

  // Guide 2: Débutant Genshin
  await prisma.guideTag.create({ data: { guideId: guide2.id, tagId: guideTag.id } })

  // Guide 3: Équipements HSR
  await prisma.guideTag.create({ data: { guideId: guide3.id, tagId: guideTag.id } })

  // Guide 4: Stratégie Arknights
  await prisma.guideTag.create({ data: { guideId: guide4.id, tagId: guideTag.id } })
  await prisma.guideTag.create({ data: { guideId: guide4.id, tagId: operateursTag.id } })

  // 10. Associer les mots-clés SEO aux articles
  console.log('🔍 Creating article-keyword relationships...')
  await prisma.articleSeoKeyword.create({ data: { articleId: article1.id, keywordId: gachaKeyword.id } })
  await prisma.articleSeoKeyword.create({ data: { articleId: article1.id, keywordId: actualitesKeyword.id } })
  await prisma.articleSeoKeyword.create({ data: { articleId: article2.id, keywordId: guidesKeyword.id } })
  await prisma.articleSeoKeyword.create({ data: { articleId: article2.id, keywordId: gachaKeyword.id } })
  await prisma.articleSeoKeyword.create({ data: { articleId: article3.id, keywordId: actualitesKeyword.id } })

  // 11. Associer les mots-clés SEO aux guides
  console.log('🔍 Creating guide-keyword relationships...')
  await prisma.guideSeoKeyword.create({ data: { guideId: guide1.id, keywordId: guidesKeyword.id } })
  await prisma.guideSeoKeyword.create({ data: { guideId: guide1.id, keywordId: gachaKeyword.id } })
  await prisma.guideSeoKeyword.create({ data: { guideId: guide2.id, keywordId: guidesKeyword.id } })
  await prisma.guideSeoKeyword.create({ data: { guideId: guide3.id, keywordId: guidesKeyword.id } })
  await prisma.guideSeoKeyword.create({ data: { guideId: guide4.id, keywordId: guidesKeyword.id } })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${await prisma.game.count()} games`)
  console.log(`   - ${await prisma.tag.count()} tags`)
  console.log(`   - ${await prisma.seoKeyword.count()} SEO keywords`)
  console.log(`   - ${await prisma.article.count()} articles`)
  console.log(`   - ${await prisma.guide.count()} guides`)
  console.log(`   - ${await prisma.guideSection.count()} guide sections`)
  console.log(`   - ${await prisma.guidePrerequisite.count()} guide prerequisites`)
  console.log(`   - ${await prisma.articleTag.count()} article-tag relationships`)
  console.log(`   - ${await prisma.guideTag.count()} guide-tag relationships`)
  console.log(`   - ${await prisma.articleSeoKeyword.count()} article-keyword relationships`)
  console.log(`   - ${await prisma.guideSeoKeyword.count()} guide-keyword relationships`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
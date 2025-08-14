import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gachaactu.com'
  
  // URLs statiques principales
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tier-lists`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // URLs des jeux populaires
  const gameRoutes = [
    'genshin-impact',
    'honkai-star-rail', 
    'fire-emblem-heroes',
    'arknights',
    'blue-archive',
    'epic-seven',
    'bleach-soul-resonance',
    'seven-deadly-sins-origins'
  ].map(game => ({
    url: `${baseUrl}/games/${game}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // URLs des articles mock (à remplacer par vraies données plus tard)
  const articleRoutes = [
    'raiden-shogun-banniere-5-3',
    'guide-firefly-honkai-star-rail',
    'evenement-fallen-heroes-feh',
    'tier-list-operateurs-arknights-15-0',
    'raid-binah-blue-archive',
    'guide-belian-ml-epic-seven'
  ].map(slug => ({
    url: `${baseUrl}/article/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...gameRoutes, ...articleRoutes]
}
import { Article, ArticleWithContent, ArticleFilters, ArticleSortOptions, PaginatedArticles } from '@/types/article'

// Mock database - sera remplacé par une vraie DB plus tard
const mockArticlesData: ArticleWithContent[] = [
  {
    title: "Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3",
    summary: "La bannière de re-run de Raiden Shogun arrive avec de nouveaux personnages 4 étoiles. Découvrez les détails et les conseils pour optimiser vos tirages.",
    author: "Alex Gacha",
    publishedAt: "13 août 2025",
    game: "Genshin Impact",
    slug: "raiden-shogun-banniere-5-3",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400",
    content: `# Nouvelle bannière Raiden Shogun dans Genshin Impact 5.3

La version 5.3 de Genshin Impact apporte son lot de nouveautés avec le retour très attendu de **Raiden Shogun** dans une bannière de re-run.

## Détails de la bannière

- **Période** : Du 15 au 30 août 2025
- **Personnage 5★** : Raiden Shogun (Electro, Polearm)
- **Personnages 4★** : Kujou Sara, Sucrose, Xiangling

## Conseils pour vos tirages

La Raiden Shogun reste l'un des personnages les plus polyvalents du jeu...`,
    tags: ["bannière", "electro", "archon"],
    readingTime: 5,
    category: 'news',
    isPopular: true,
    createdAt: "2025-08-13T08:00:00Z",
    updatedAt: "2025-08-13T08:00:00Z"
  },
  {
    title: "Honkai Star Rail : Guide complet de Firefly",
    summary: "Tout ce qu'il faut savoir sur Firefly, le nouveau personnage DPS Feu. Build, équipes recommandées et stratégies de combat.",
    author: "Marie HSR",
    publishedAt: "12 août 2025", 
    game: "Honkai Star Rail",
    slug: "guide-firefly-honkai-star-rail",
    imageUrl: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400",
    content: `# Honkai Star Rail : Guide complet de Firefly

Firefly est le nouveau personnage DPS Feu introduit dans la version 2.3 de Honkai Star Rail.

## Analyse des compétences

### Compétence basique
- **Dégâts** : 50% ATQ + 25% PV Max
- **Type** : Mono-cible

### Compétence élémentaire
Firefly entre en mode "Enhanced" qui augmente ses statistiques...`,
    tags: ["guide", "dps", "feu"],
    readingTime: 8,
    category: 'guide',
    isPopular: false,
    createdAt: "2025-08-12T08:00:00Z",
    updatedAt: "2025-08-12T08:00:00Z"
  },
  {
    title: "Fire Emblem Heroes : Événement Fallen Heroes",
    summary: "Un nouvel événement avec des héros corrompus fait son apparition. Découvrez les nouveaux personnages et les récompenses à obtenir.",
    author: "Thomas FEH",
    publishedAt: "11 août 2025",
    game: "Fire Emblem Heroes", 
    slug: "evenement-fallen-heroes-feh",
    imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400",
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
    tags: ["événement", "héros corrompus"],
    readingTime: 6,
    category: 'event',
    isPopular: true,
    createdAt: "2025-08-11T08:00:00Z",
    updatedAt: "2025-08-11T08:00:00Z"
  },
  {
    title: "Arknights : Tier List des Opérateurs après la mise à jour 15.0",
    summary: "Notre tier list mise à jour avec les derniers opérateurs et les changements d'équilibrage. Qui sont les meilleurs picks actuellement ?",
    author: "Sophie AK",
    publishedAt: "10 août 2025",
    game: "Arknights",
    slug: "tier-list-operateurs-arknights-15-0",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400",
    content: `# Arknights : Tier List des Opérateurs après la mise à jour 15.0

La mise à jour 15.0 d'Arknights a apporté plusieurs changements d'équilibrage.

## Tier S+ (Meta-définissant)

### Guards
- **SilverAsh** : Toujours dominant avec sa True Silver Slash
- **Thorns** : Excellent pour la lane holding

### Casters
- **Eyjafjalla** : Incontournable pour les dégâts AoE
- **Ifrit** : Idéale pour les couloirs étroits

## Tier S (Excellent)

### Defenders
- **Hoshiguma** : Tank physique de référence
- **Saria** : Support healing exceptionnel

### Medics
- **Shining** : Meilleure défense physique
- **Nightingale** : Protection arts unmatched`,
    tags: ["tier-list", "meta", "opérateurs"],
    readingTime: 10,
    category: 'tier-list',
    isPopular: true,
    createdAt: "2025-08-10T08:00:00Z",
    updatedAt: "2025-08-10T08:00:00Z"
  },
  {
    title: "Blue Archive : Nouveau raid contre Binah",
    summary: "Un raid de difficulté extrême fait son apparition. Découvrez les meilleures équipes et stratégies pour vaincre ce boss redoutable.",
    author: "Kevin BA",
    publishedAt: "9 août 2025",
    game: "Blue Archive",
    slug: "raid-binah-blue-archive",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400",
    content: `# Blue Archive : Nouveau raid contre Binah

Le raid contre Binah est désormais disponible avec une difficulté Extreme.

## Mécaniques du boss

### Phase 1 (100% - 70% HP)
- Attaque normale toutes les 10 secondes
- Gimmick : Shield tous les 30%
- Résistance : Mystique (Rouge)

### Phase 2 (70% - 40% HP)
- AoE damage toutes les 8 secondes
- Gimmick : Debuff Fear
- Nouveau pattern d'attaque

### Phase 3 (40% - 0% HP)
- Berserk mode
- Attaques multiples
- Timer serré

## Équipes recommandées

### Team DPS Rouge
- Aru : DPS principal
- Mutsuki : Sub DPS
- Serina : Healer
- Fuuka : Support

### Team Tank
- Yuuka : Main tank
- Tsubaki : Off tank
- Hanae : Healer spé
- Kotama : Buffer`,
    tags: ["raid", "boss", "extrême"],
    readingTime: 7,
    category: 'guide',
    isPopular: false,
    createdAt: "2025-08-09T08:00:00Z",
    updatedAt: "2025-08-09T08:00:00Z"
  },
  {
    title: "Epic Seven : Guide du nouveau héros Belian ML",
    summary: "La version Moonlight de Belian arrive bientôt ! Analyse de ses compétences, builds recommandés et impact sur la méta PvP.",
    author: "Lucas E7",
    publishedAt: "8 août 2025",
    game: "Epic Seven",
    slug: "guide-belian-ml-epic-seven",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400",
    content: `# Epic Seven : Guide du nouveau héros Belian ML

Machine Learning Belian arrive dans la prochaine rotation Mystic.

## Analyse des compétences

### S1 : Fracture temporelle
- Dégâts basés sur les PV manquants
- Applique Restrict (2 tours)
- Cooldown : Aucun

### S2 : Distorsion dimensionnelle (Passif)
- 30% de chance de counter
- Le counter ignore l'effet elemental
- Gagne Combat Readiness +15%

### S3 : Effondrement de l'espace-temps
- AoE sur tous les ennemis
- Dispel 2 buffs + apply Unbuffable (2 tours)
- Dégâts augmentés selon les debuffs sur l'ennemi

## Builds recommandés

### PvP Défense
- Set : Immunity + Health
- Stats focus : HP > DEF > SPD
- Artifact : Elbris Ritual Sword

### PvP Offense
- Set : Speed + Immunity
- Stats focus : SPD > HP > EFF
- Artifact : Tagehel's Ancient Book

## Synergie d'équipe

ML Belian fonctionne excellemment avec :
- Politis (Anti-cleave)
- ML Krau (Tank provoke)
- Ruele (Revive support)`,
    tags: ["héros", "moonlight", "pvp"],
    readingTime: 9,
    category: 'guide',
    isPopular: true,
    createdAt: "2025-08-08T08:00:00Z",
    updatedAt: "2025-08-08T08:00:00Z"
  }
]

// Utilitaires pour les dates
export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(" ")
  const monthMap: Record<string, number> = {
    "janvier": 0, "février": 1, "mars": 2, "avril": 3, "mai": 4, "juin": 5,
    "juillet": 6, "août": 7, "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11
  }
  return new Date(parseInt(year), monthMap[month] || 7, parseInt(day))
}

// API Functions
export async function getAllArticles(
  filters?: ArticleFilters,
  sort?: ArticleSortOptions,
  page = 1,
  limit = 10
): Promise<PaginatedArticles> {
  let articles = [...mockArticlesData]

  // Filtrage
  if (filters?.game && filters.game !== "Tous les jeux") {
    articles = articles.filter(article => article.game === filters.game)
  }

  if (filters?.category) {
    articles = articles.filter(article => article.category === filters.category)
  }

  if (filters?.author) {
    articles = articles.filter(article => article.author === filters.author)
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase()
    articles = articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (filters?.tags?.length) {
    articles = articles.filter(article =>
      filters.tags?.some(tag => article.tags?.includes(tag))
    )
  }

  // Tri
  if (sort) {
    articles.sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sort.field) {
        case 'publishedAt':
          aValue = parseDate(a.publishedAt).getTime()
          bValue = parseDate(b.publishedAt).getTime()
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'author':
          aValue = a.author.toLowerCase()
          bValue = b.author.toLowerCase()
          break
        case 'popularity':
          // Mock popularity basée sur isPopular et readingTime
          aValue = (a.isPopular ? 1000 : 0) + (a.readingTime || 0)
          bValue = (b.isPopular ? 1000 : 0) + (b.readingTime || 0)
          break
        default:
          return 0
      }

      if (sort.order === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
  } else {
    // Tri par défaut : plus récent d'abord
    articles.sort((a, b) => parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime())
  }

  // Pagination
  const total = articles.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedArticles = articles.slice(start, end)

  return {
    articles: paginatedArticles.map(({ content: _, ...article }) => article), // On retire le contenu pour la liste
    total,
    page,
    limit,
    hasNext: end < total,
    hasPrevious: page > 1
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithContent | null> {
  const article = mockArticlesData.find(article => article.slug === slug)
  return article || null
}

export async function getPopularArticles(limit = 5): Promise<Article[]> {
  const popularArticles = mockArticlesData
    .filter(article => article.isPopular)
    .sort((a, b) => parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime())
    .slice(0, limit)
    .map(({ content: _, ...article }) => article)

  return popularArticles
}

export async function getArticlesByGame(game: string, limit = 10): Promise<Article[]> {
  const gameArticles = mockArticlesData
    .filter(article => article.game === game)
    .sort((a, b) => parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime())
    .slice(0, limit)
    .map(({ content: _, ...article }) => article)

  return gameArticles
}

export async function getRelatedArticles(slug: string, limit = 4): Promise<Article[]> {
  const currentArticle = await getArticleBySlug(slug)
  if (!currentArticle) return []

  const relatedArticles = mockArticlesData
    .filter(article => 
      article.slug !== slug && 
      (article.game === currentArticle.game || 
       article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .sort((a, b) => parseDate(b.publishedAt).getTime() - parseDate(a.publishedAt).getTime())
    .slice(0, limit)
    .map(({ content: _, ...article }) => article)

  return relatedArticles
}

export function getAllGames(): string[] {
  const games = [...new Set(mockArticlesData.map(article => article.game))]
  return ["Tous les jeux", ...games.sort()]
}

export function getAllAuthors(): string[] {
  const authors = [...new Set(mockArticlesData.map(article => article.author))]
  return authors.sort()
}

export function getAllTags(): string[] {
  const tags = [...new Set(mockArticlesData.flatMap(article => article.tags || []))]
  return tags.sort()
}
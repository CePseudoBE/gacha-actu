# Composants YouTube

## YouTubeVideo

Composant pour afficher une vidéo YouTube avec lazy-loading optimisé.

### Fonctionnalités

- **Lazy Loading** : La vidéo ne se charge qu'au clic
- **Intersection Observer** : Détection automatique de la visibilité
- **Thumbnail** : Affichage de la miniature avant chargement
- **Responsive** : S'adapte aux différentes tailles d'écran
- **Accessible** : Support des lecteurs d'écran et navigation clavier

### Props

```typescript
interface YouTubeVideoProps {
  videoId: string        // ID de la vidéo YouTube (ex: "dQw4w9WgXcQ")
  title: string          // Titre de la vidéo pour l'accessibilité
  thumbnail?: string     // URL de la thumbnail (auto-générée si non fournie)
  className?: string     // Classes CSS additionnelles
  autoplay?: boolean     // Lecture automatique (défaut: false)
}
```

### Exemple d'utilisation

```tsx
<YouTubeVideo
  videoId="dQw4w9WgXcQ"
  title="Guide Genshin Impact - Build Raiden"
  className="w-full max-w-md"
/>
```

## YouTubeCarousel

Carousel responsive pour afficher plusieurs vidéos YouTube.

### Fonctionnalités

- **Responsive** : 1 vidéo sur mobile, 2 sur tablette, 3 sur desktop
- **Navigation** : Flèches et pagination par points
- **Lazy Loading** : Toutes les vidéos utilisent le lazy-loading
- **Métadonnées** : Affichage des infos (auteur, date, description)
- **Design distinct** : Style différent du carousel d'articles

### Props

```typescript
interface YouTubeCarouselProps {
  videos: YouTubeVideoData[]  // Liste des vidéos à afficher
  title?: string              // Titre du carousel (défaut: "Vidéos Récentes")
  className?: string          // Classes CSS additionnelles
}

interface YouTubeVideoData {
  id: string
  videoId: string
  title: string
  description?: string
  publishedAt?: string
  channelTitle?: string
  thumbnail?: string
  category?: string
}
```

### Exemple d'utilisation

```tsx
import { YouTubeCarousel } from "@/components/home/YouTubeCarousel"
import { getRecentVideos } from "@/lib/youtube-data"

const videos = getRecentVideos(6)

<YouTubeCarousel 
  videos={videos}
  title="Vidéos de la Communauté"
/>
```

## Performance

### Optimisations implémentées

1. **Lazy Loading des iframes** : Les vidéos ne se chargent qu'au clic
2. **Intersection Observer** : Détection de visibilité avec marge de 50px
3. **Thumbnails optimisées** : Utilisation des thumbnails YouTube (hqdefault)
4. **Domaine youtube-nocookie.com** : Respect de la vie privée
5. **Fallback thumbnails** : Dégradation gracieuse si image non disponible

### Métriques

- **Poids initial** : ~2.2 kB ajouté à la page d'accueil
- **Chargement réseau** : 0 requête avant interaction utilisateur
- **Time to Interactive** : Aucun impact (pas de JavaScript lourd)

## Configuration

### Variables d'environnement

Aucune variable d'environnement requise pour le fonctionnement de base.

Pour une intégration YouTube API future :
```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

### Données de démonstration

Les données sont actuellement statiques dans `src/lib/youtube-data.ts`.
En production, remplacer par des appels API réels.

```typescript
// Remplacer cette fonction pour une vraie API
export async function getYouTubeVideos(): Promise<YouTubeVideoData[]> {
  const response = await fetch('/api/youtube/videos')
  return response.json()
}
```

## Accessibilité

- **ARIA labels** : Tous les boutons ont des labels descriptifs
- **Alt text** : Images avec descriptions appropriées
- **Navigation clavier** : Support complet du clavier
- **Focus management** : Indicateurs de focus visibles
- **Screen readers** : Métadonnées lisibles par les lecteurs d'écran

## Sécurité

- **youtube-nocookie.com** : Pas de cookies de tracking
- **rel="noopener noreferrer"** : Liens externes sécurisés
- **Content Security Policy** : Compatible avec les headers CSP stricts
- **XSS Protection** : Pas d'insertion de HTML non sécurisé
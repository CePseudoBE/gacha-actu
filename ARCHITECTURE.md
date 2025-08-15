# Architecture SOLID - GachaActu

## Vue d'ensemble

Le code de GachaActu a été refactorisé pour respecter les principes SOLID, rendant l'application plus maintenable, testable et extensible.

## Principes SOLID appliqués

### 1. Single Responsibility Principle (SRP)

Chaque composant et module a une responsabilité unique et bien définie :

#### Composants Navigation
- `Logo.tsx` : Affichage du logo uniquement
- `DesktopNavigation.tsx` : Navigation desktop
- `MobileNavigation.tsx` : Navigation mobile
- `SocialLinks.tsx` : Liens réseaux sociaux

#### Composants Hero
- `HeroBackground.tsx` : Gestion de l'arrière-plan mobile
- `HeroContent.tsx` : Contenu principal (titre, texte, boutons)
- `HeroPartners.tsx` : Affichage des partenaires
- `HeroImages.tsx` : Images desktop

#### Composants Article
- `ArticleImage.tsx` : Image et badge de l'article
- `ArticleMeta.tsx` : Métadonnées (jeu, rating)
- `ArticleFooter.tsx` : Auteur et date

### 2. Open/Closed Principle (OCP)

#### Configuration externalisée
```typescript
// src/config/navigation.ts - Extensible sans modifier le code
export const navigationConfig: NavigationConfig = {
  items: [...], // Facilement modifiable
  socialLinks: [...] // Nouveaux liens ajoutables
}
```

#### Composants extensibles
```typescript
// Interfaces permettant l'extension
interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string // Optionnel pour extension
}
```

### 3. Liskov Substitution Principle (LSP)

#### Services interchangeables
```typescript
// Interface pour les services d'articles
export interface IArticleService {
  getAllArticles(): Promise<PaginatedArticles>
  getArticleBySlug(slug: string): Promise<ArticleWithContent | null>
}

// Implémentation actuelle (mock)
export class ArticleService implements IArticleService

// Future implémentation DB sera substituable
export class DatabaseArticleService implements IArticleService
```

### 4. Interface Segregation Principle (ISP)

#### Interfaces spécifiques et cohérentes
```typescript
// Types UI séparés par responsabilité
interface LoadingState {
  isLoading: boolean
  error?: string | null
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface SearchableProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}
```

### 5. Dependency Inversion Principle (DIP)

#### Abstractions au lieu de concrétions
```typescript
// Hook abstrait la logique de récupération
export function useArticles(options: UseArticlesOptions): UseArticlesReturn {
  // Utilise le service via abstraction
  const result = await getAllArticles(filters, sort, page, limit)
}

// Service abstrait l'accès aux données
export class ArticleService implements IArticleService {
  // Implémentation peut changer sans affecter les consommateurs
}
```

## Structure des dossiers optimisée

```
src/
├── components/
│   ├── navigation/          # Composants navigation (SRP)
│   ├── hero/               # Composants hero section (SRP)
│   ├── article/            # Composants article (SRP)
│   ├── seo/               # Composants SEO (SRP)
│   └── ui/                # Composants UI génériques
├── hooks/                 # Hooks personnalisés (logique réutilisable)
├── services/             # Services (DIP - abstractions)
├── config/              # Configuration externalisée (OCP)
├── types/              # Types TypeScript (ISP)
└── lib/               # Utilitaires et accès données
```

## Hooks personnalisés

### useArticles
- Gère l'état et la logique des articles
- Réutilisable dans différents contextes
- Abstrait la complexité de récupération des données

### useNavigation
- Gère l'état du menu mobile
- Logique encapsulée et réutilisable

## Avantages de cette architecture

### ✅ Maintenabilité
- Composants petits et focalisés
- Responsabilités claires
- Modification d'un composant n'affecte pas les autres

### ✅ Testabilité
- Composants isolés faciles à tester
- Mocks possibles grâce aux interfaces
- Logique séparée de l'UI

### ✅ Réutilisabilité
- Composants génériques (LoadingSpinner, ErrorMessage)
- Hooks réutilisables
- Configuration externalisée

### ✅ Extensibilité
- Nouveaux types de navigation faciles à ajouter
- Nouvelles sources de données sans modification du code
- Nouveaux composants suivent les mêmes patterns

### ✅ Performance
- Tree-shaking optimisé
- Composants granulaires
- Cache et optimisations Next.js préservés

## Migration future vers une base de données

Grâce à l'architecture actuelle, la migration vers une vraie DB sera transparente :

```typescript
// Il suffira de remplacer l'implémentation
export class DatabaseArticleService implements IArticleService {
  async getAllArticles() {
    // Requête DB au lieu de données mock
    return await db.articles.findMany(...)
  }
}
```

Les composants UI n'auront aucune modification à subir.

## Conclusion

Cette architecture SOLID assure :
- Code plus propre et maintenable
- Évolutivité facilitée
- Tests plus simples
- Performance optimisée
- Respect des bonnes pratiques React/Next.js
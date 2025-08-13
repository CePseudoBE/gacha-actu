# GachaActu 🎮

> **"Par un fan, pour les fans"**

La source numéro une de l'actualité des jeux mobile et multi-plateformes Gacha. Suivez les dernières bannières, guides exclusifs et événements de vos jeux favoris comme Bleach Soul Resonance, Seven Deadly Sins Origins et bien d'autres !

## ✨ Fonctionnalités

- 📰 **Actualités** - Dernières bannières, mises à jour et événements
- 📖 **Guides** - Analyses d'experts et stratégies 
- 🏆 **Tier Lists** - Classements méta des personnages
- 📅 **Événements** - Calendrier et suivi des events
- 💬 **Communauté** - Discussions Discord intégrées

## 🎯 Jeux couverts

### Principaux
- **Bleach Soul Resonance** (BSR)
- **Seven Deadly Sins Origins** (7DS)

## 🛠 Stack technique

- **Framework** : Next.js 15.4.6 (App Router)
- **UI Library** : shadcn/ui + Tailwind CSS
- **Typography** : Source Sans 3
- **Icons** : Lucide React
- **Deployment** : Vercel Ready

## 🚀 Démarrage rapide

1. **Installation des dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

3. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── layout.tsx        # Layout global + Header
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
├── components/
│   ├── Header.tsx        # Navigation principale
│   ├── ArticleCard.tsx   # Card article réutilisable
│   └── home/
│       └── HeroSection.tsx # Hero de l'accueil
└── lib/
    └── utils.ts          # Utilitaires Tailwind

public/
├── icons/
│   └── discord.svg       # Icône Discord custom
└── img/
    ├── 7ds.jpg          # Seven Deadly Sins
    └── bsr.jpg          # Bleach Soul Resonance
```

## 🎨 Design System

### Couleurs
- **Hero** : Gradient noir vers vert très foncé (`#051202`)
- **Texte** : Grises (`gray-500`, `gray-600`) 
- **Accent** : Vert émeraude pour les highlights

### Components
- **Navigation** : shadcn NavigationMenu avec dropdown "Jeux"
- **Cards** : Design moderne avec images optimisées
- **Boutons** : Style outline cohérent
- **Responsive** : Mobile-first design

## 📱 Pages disponibles

- ✅ **Accueil** (`/`) - Hero + Liste d'actualités
- 🚧 **Articles** (`/article/[slug]`) - Pages individuelles  
- 🚧 **Jeux** (`/jeux`) - Liste des jeux couverts
- 🚧 **Événements** (`/evenements`) - Calendrier events
- 🚧 **Tier Lists** (`/tier-lists`) - Classements

## 🤝 Contribution

Ce projet suit les bonnes pratiques :
- Components shadcn/ui privilégiés
- Next.js Image pour l'optimisation
- TypeScript pour le typage
- Responsive design mobile-first
- Accessibilité (alt text, aria-labels)

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production  
npm run start    # Serveur de production
npm run lint     # Linting ESLint
```

## 🌐 Déploiement

Le projet est optimisé pour Vercel avec :
- Configuration Next.js 15
- Images externes autorisées (Unsplash)
- Polices Google Fonts intégrées
- Build automatique sur push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ton-username/gacha-actu)

## 📄 Documentation

- 🔧 **[next.config.ts](./next.config.ts)** - Configuration Next.js
- 🎨 **[components.json](./components.json)** - Configuration shadcn/ui
import { HeroContent } from '@/types/hero'

export const heroConfig: HeroContent = {
  title: 'Par un fan, pour les fans.',
  subtitle: 'La source numéro une de l\'actualité des jeux mobile et multi-plateformes. Bleach Soul Resonance, 7DS Origins et d\'autres.',
  buttons: [
    {
      id: 'news',
      label: 'Actus',
      href: '/news',
      variant: 'primary'
    },
    {
      id: 'upcoming',
      label: 'À venir',
      href: '/evenements',
      variant: 'secondary'
    }
  ],
  partners: [
    {
      id: 'ldplayer',
      name: 'LDPlayer',
      href: 'https://leap.ldplayer.gg/T4DYBI9Ic',
      logo: {
        desktop: 'https://res.ldrescdn.com/ldplayer-official/static/image/home/btn/down-fr.svg?url',
        mobile: '/icons/ldplayer.svg'
      },
      alt: 'LDPlayer - Émulateur Android pour PC',
      dimensions: {
        desktop: { width: 200, height: 60 },
        mobile: { width: 48, height: 48 }
      }
    },
    {
      id: 'gamesplanet',
      name: 'Gamesplanet',
      href: 'https://fr.gamesplanet.com/?ref=kakutvd',
      logo: {
        desktop: '/icons/gamsplanetbig.svg',
        mobile: '/icons/gamesplanetsmall.png'
      },
      alt: 'Gamesplanet - Boutique de jeux PC',
      dimensions: {
        desktop: { width: 200, height: 32 },
        mobile: { width: 48, height: 48 }
      }
    }
  ],
  images: {
    desktop: [
      {
        src: '/img/7ds.jpg',
        alt: 'Seven Deadly Sins Origins - Artwork officiel du jeu mobile Gacha',
        priority: true
      },
      {
        src: '/img/bsr.jpg',
        alt: 'Bleach Soul Resonance - Artwork officiel du jeu mobile Gacha',
        priority: true
      }
    ],
    mobile: [
      {
        src: '/img/7ds.jpg',
        alt: 'Seven Deadly Sins Origins - Artwork officiel du jeu mobile',
        priority: false
      },
      {
        src: '/img/bsr.jpg',
        alt: 'Bleach Soul Resonance - Artwork officiel du jeu mobile',
        priority: false
      }
    ]
  }
}
import { Suspense } from 'react'
import ComingSoon from '@/components/ComingSoon'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

async function ComingSoonContent({ searchParams }: PageProps) {
  const params = await searchParams
  const pagePath = params.page || ''
  
  // Mapper les chemins vers des noms conviviaux
  const pageNames: Record<string, { name: string; description: string }> = {
    '/games': {
      name: 'Jeux',
      description: 'Découvrez bientôt notre section dédiée aux jeux Gacha avec analyses, guides et recommandations.'
    },
    '/guides': {
      name: 'Guides',
      description: 'Nos guides experts arrivent bientôt ! Builds, stratégies et conseils pour dominer vos jeux favoris.'
    },
    '/tier-lists': {
      name: 'Tier Lists',
      description: 'Les tier lists officielles par nos experts ! Classements des personnages et équipements à jour.'
    }
  }
  
  const pageInfo = pageNames[pagePath] || { 
    name: 'Bientôt disponible', 
    description: 'Cette section sera bientôt disponible !' 
  }
  
  return (
    <ComingSoon 
      pageName={pageInfo.name}
      description={pageInfo.description}
    />
  )
}

export default function ComingSoonPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ComingSoonContent searchParams={searchParams} />
    </Suspense>
  )
}
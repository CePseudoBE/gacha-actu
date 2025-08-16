/**
 * Gestion du Coming Soon pour les pages en cours de développement
 * Simple et temporaire - se désactive automatiquement après la date de lancement
 */

const LAUNCH_DATE = new Date('2025-09-15') // Date de lancement - ajustable
const COMING_SOON_PAGES = [
  '/games',
  '/guides', 
  '/tier-lists'
]

/**
 * Vérifie si une page doit afficher "Coming Soon"
 */
export function isComingSoon(pathname: string): boolean {
  // Si on a dépassé la date de lancement, plus de coming soon
  if (new Date() > LAUNCH_DATE) return false
  
  // Vérifier si la page est dans la liste
  return COMING_SOON_PAGES.some(page => pathname.startsWith(page))
}

/**
 * Récupère la date de lancement formatée
 */
export function getLaunchDate(): string {
  return LAUNCH_DATE.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Pages concernées par le Coming Soon
 */
export function getComingSoonPages(): string[] {
  return COMING_SOON_PAGES
}
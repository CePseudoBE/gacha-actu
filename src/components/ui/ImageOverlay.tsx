import { BaseComponentProps } from "@/types/ui"

interface ImageOverlayProps extends BaseComponentProps {
  variant?: 'gradient' | 'blur' | 'dark' | 'adaptive'
  intensity?: 'light' | 'medium' | 'strong'
}

export function ImageOverlay({ 
  variant = 'gradient', 
  intensity = 'medium', 
  className = "" 
}: ImageOverlayProps) {
  const getOverlayClasses = () => {
    const base = "absolute inset-0"
    
    switch (variant) {
      case 'gradient':
        switch (intensity) {
          case 'light':
            return `${base} bg-gradient-to-t from-black/50 via-black/10 to-transparent`
          case 'medium':
            return `${base} bg-gradient-to-t from-black/70 via-black/25 to-transparent`
          case 'strong':
            return `${base} bg-gradient-to-t from-black/90 via-black/40 to-transparent`
          default:
            return `${base} bg-gradient-to-t from-black/70 via-black/25 to-transparent`
        }
      
      case 'blur':
        return `${base} bg-black/30 backdrop-blur-sm`
      
      case 'dark':
        switch (intensity) {
          case 'light':
            return `${base} bg-black/30`
          case 'medium':
            return `${base} bg-black/50`
          case 'strong':
            return `${base} bg-black/70`
          default:
            return `${base} bg-black/50`
        }
      
      case 'adaptive':
        // Combinaison gradient + blur pour adaptation maximale
        return `${base} bg-gradient-to-t from-black/80 via-black/30 to-transparent backdrop-blur-[1px]`
      
      default:
        return `${base} bg-gradient-to-t from-black/70 via-black/25 to-transparent`
    }
  }

  return <div className={`${getOverlayClasses()} ${className}`} />
}
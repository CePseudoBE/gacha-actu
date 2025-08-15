import { BaseComponentProps } from "@/types/ui"

interface TextShadowProps extends BaseComponentProps {
  intensity?: 'light' | 'medium' | 'strong'
  color?: 'black' | 'white' | 'primary'
}

export function TextShadow({ 
  children, 
  intensity = 'medium', 
  color = 'black',
  className = ""
}: TextShadowProps) {
  const getShadowClasses = () => {
    const shadowColor = color === 'black' ? 'black' : color === 'white' ? 'white' : 'rgb(var(--primary))'
    
    switch (intensity) {
      case 'light':
        return `drop-shadow-sm [text-shadow:1px_1px_2px_${shadowColor}]`
      case 'medium':
        return `drop-shadow-md [text-shadow:2px_2px_4px_${shadowColor}]`
      case 'strong':
        return `drop-shadow-lg [text-shadow:3px_3px_6px_${shadowColor},1px_1px_2px_${shadowColor}]`
      default:
        return `drop-shadow-md [text-shadow:2px_2px_4px_${shadowColor}]`
    }
  }

  return (
    <div className={`${getShadowClasses()} ${className}`}>
      {children}
    </div>
  )
}
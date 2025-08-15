import Link from "next/link"
import Image from "next/image"
import { Twitter, Youtube } from "lucide-react"
import { SocialLink } from "@/types/navigation"

interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  variant?: 'desktop' | 'mobile'
}

export function SocialLinks({ links, className = "", variant = 'desktop' }: SocialLinksProps) {
  const renderIcon = (link: SocialLink) => {
    if (link.iconType === 'custom') {
      return (
        <Image 
          src={link.icon} 
          alt={link.name} 
          width={20} 
          height={20}
          className="transition-opacity hover:opacity-80"
        />
      )
    }

    // Lucide icons
    switch (link.icon) {
      case 'Twitter':
        return <Twitter className="h-4 w-4" />
      case 'Youtube':
        return <Youtube className="h-5 w-5" />
      default:
        return null
    }
  }

  const linkClassName = variant === 'desktop'
    ? "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground hover:text-foreground"
    : "flex items-center justify-center rounded-md hover:bg-accent h-10 w-10"

  return (
    <div className={`flex items-center ${variant === 'desktop' ? 'space-x-2' : 'space-x-4'} ${className}`}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          title={link.ariaLabel}
        >
          {renderIcon(link)}
        </Link>
      ))}
    </div>
  )
}
import Link from "next/link"
import { GamepadIcon } from "lucide-react"

interface LogoProps {
  text: string
  href: string
  className?: string
}

export function Logo({ text, href, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <GamepadIcon className="h-7 w-7 text-primary" />
      <Link 
        href={href} 
        className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
      >
        {text}
      </Link>
    </div>
  )
}
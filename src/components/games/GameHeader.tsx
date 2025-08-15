import Image from "next/image"
import { ImageOverlay } from "@/components/ui/ImageOverlay"
import { GameHeaderContent } from "./GameHeaderContent"

interface Platform {
  id: string
  name: string
  slug: string
  color?: string | null
}

interface GameData {
  name: string
  description: string
  genre: string
  platforms: Platform[]
  developer: string
  releaseDate: string
  imageUrl: string
  logoUrl: string
  isPopular: boolean
  tags: string[]
  officialSite: string
  wiki: string
}

interface GameHeaderProps {
  game: GameData
}

export function GameHeader({ game }: GameHeaderProps) {
  return (
    <div className="relative">
      {/* Background Hero Image */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden mt-16 sm:mt-0">
        <Image
          src={game.imageUrl}
          alt={`${game.name} artwork`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Enhanced overlay for better text readability */}
        <ImageOverlay variant="adaptive" intensity="strong" />
        
        {/* Additional safety overlay for very bright images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-50% to-black/10" />
      </div>

      {/* Content overlay */}
      <GameHeaderContent game={game} />
    </div>
  )
}
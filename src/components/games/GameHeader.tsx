import Image from "next/image"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface GameData {
  name: string
  description: string
  genre: string
  platform: string
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
            {/* Logo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src={game.logoUrl}
                alt={`${game.name} logo`}
                fill
                className="object-contain rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm p-2"
              />
            </div>

            {/* Game Info */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {game.isPopular && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <Star className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {game.genre}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3">
                {game.name}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-3 sm:mb-4 max-w-2xl">
                {game.description}
              </p>

              {/* Game Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <div className="text-xs sm:text-sm text-gray-400">Développeur</div>
                  <div className="text-sm sm:text-base font-medium">{game.developer}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-400">Plateforme</div>
                  <div className="text-sm sm:text-base font-medium">{game.platform}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-400">Sortie</div>
                  <div className="text-sm sm:text-base font-medium">{game.releaseDate}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-400">Type</div>
                  <div className="text-sm sm:text-base font-medium">Free-to-play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
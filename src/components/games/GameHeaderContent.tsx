import Image from "next/image"
import { TextShadow } from "@/components/ui/TextShadow"

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
  logoUrl: string
  isPopular: boolean
}

interface GameHeaderContentProps {
  game: GameData
}

export function GameHeaderContent({ game }: GameHeaderContentProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
          {/* Logo with enhanced visibility */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md rounded-xl" />
            <Image
              src={game.logoUrl}
              alt={`${game.name} logo`}
              fill
              className="object-contain rounded-xl border-2 border-white/40 p-2 relative z-10"
            />
          </div>

          {/* Game Info with text shadow for readability */}
          <div className="flex-1">
            {/* Title with text shadow */}
            <TextShadow intensity="strong" color="black">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {game.name}
              </h1>
            </TextShadow>

            {/* Description with text shadow */}
            <TextShadow intensity="medium" color="black">
              <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed max-w-2xl mb-4">
                {game.description}
              </p>
            </TextShadow>

            {/* Game Meta with background box */}
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <TextShadow intensity="light" color="black">
                    <div className="text-xs sm:text-sm text-gray-200 font-medium">Développeur</div>
                    <div className="text-sm sm:text-base font-bold text-white">{game.developer}</div>
                  </TextShadow>
                </div>
                <div>
                  <TextShadow intensity="light" color="black">
                    <div className="text-xs sm:text-sm text-gray-200 font-medium">Plateformes</div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {game.platforms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {game.platforms.map((platform, index) => (
                            <span key={platform.id}>
                              {platform.name}
                              {index < game.platforms.length - 1 && <span className="text-gray-300">, </span>}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Non spécifiées</span>
                      )}
                    </div>
                  </TextShadow>
                </div>
                <div>
                  <TextShadow intensity="light" color="black">
                    <div className="text-xs sm:text-sm text-gray-200 font-medium">Sortie</div>
                    <div className="text-sm sm:text-base font-bold text-white">{game.releaseDate}</div>
                  </TextShadow>
                </div>
                <div>
                  <TextShadow intensity="light" color="black">
                    <div className="text-xs sm:text-sm text-gray-200 font-medium">Type</div>
                    <div className="text-sm sm:text-base font-bold text-white">Free-to-play</div>
                  </TextShadow>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
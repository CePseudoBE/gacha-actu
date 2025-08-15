import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface ArticleImageProps {
  imageUrl: string
  title: string
  game: string
  showTrendingBadge?: boolean
}

export function ArticleImage({ imageUrl, title, game, showTrendingBadge = false }: ArticleImageProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={`Image d'illustration pour l'article : ${title} - ${game}`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {showTrendingBadge && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            Populaire
          </Badge>
        </div>
      )}
    </div>
  )
}
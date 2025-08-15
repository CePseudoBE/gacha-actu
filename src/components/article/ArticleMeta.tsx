import { Badge } from "@/components/ui/badge"
import { Tag, Star } from "lucide-react"

interface ArticleMetaProps {
  game: string
  rating?: number
  className?: string
}

export function ArticleMeta({ game, rating = 4.8, className = "" }: ArticleMetaProps) {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <Badge variant="outline" className="text-xs font-medium">
        <Tag className="h-3 w-3 mr-1.5" />
        {game}
      </Badge>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 fill-current text-yellow-500" />
        <span>{rating}</span>
      </div>
    </div>
  )
}
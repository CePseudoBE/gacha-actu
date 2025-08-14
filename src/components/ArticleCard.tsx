import { Calendar, User, Tag, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  title: string
  summary: string
  author: string
  publishedAt: string
  game: string
  imageUrl?: string
  slug: string
}


export function ArticleCard({ 
  title, 
  summary, 
  author, 
  publishedAt, 
  game, 
  imageUrl, 
  slug 
}: ArticleCardProps) {
  return (
    <article className="group border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden hover:border-primary/20">
      {imageUrl && (
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
          
          {/* Trending badge for recent articles */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Populaire
            </Badge>
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            <Tag className="h-3 w-3 mr-1.5" />
            {game}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
            <span>4.8</span>
          </div>
        </div>
        
        <Link href={`/article/${slug}`} className="block">
          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {publishedAt}
          </div>
        </div>
      </div>
    </article>
  )
}
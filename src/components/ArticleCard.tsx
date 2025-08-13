import { Calendar, User, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    <article className="group border rounded-lg p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <Tag className="h-3 w-3 mr-1" />
            {game}
          </span>
        </div>
        
        <Link href={`/article/${slug}`} className="block">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {author}
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
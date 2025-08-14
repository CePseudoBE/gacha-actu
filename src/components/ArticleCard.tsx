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
    <article className="group border rounded-lg p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {imageUrl && (
        <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Image d'illustration pour l'article : ${title} - ${game}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      )}
      
      <div className="space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            <Tag className="h-3 w-3 mr-1" />
            {game}
          </span>
        </div>
        
        <Link href={`/article/${slug}`} className="block">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t mt-auto">
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
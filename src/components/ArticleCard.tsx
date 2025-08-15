import Link from "next/link"
import { ArticleImage } from "./article/ArticleImage"
import { ArticleMeta } from "./article/ArticleMeta"
import { ArticleFooter } from "./article/ArticleFooter"

interface ArticleCardProps {
  title: string
  summary: string
  author: string
  publishedAt: string
  game: string
  imageUrl?: string
  slug: string
  isPopular?: boolean
}

export function ArticleCard({ 
  title, 
  summary, 
  author, 
  publishedAt, 
  game, 
  imageUrl, 
  slug,
  isPopular = false
}: ArticleCardProps) {
  return (
    <article className="group border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden hover:border-primary/20">
      {imageUrl && (
        <ArticleImage 
          imageUrl={imageUrl}
          title={title}
          game={game}
          showTrendingBadge={isPopular}
        />
      )}
      
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <ArticleMeta game={game} />
        
        <Link href={`/article/${slug}`} className="block">
          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>
        
        <ArticleFooter 
          author={author}
          publishedAt={publishedAt}
        />
      </div>
    </article>
  )
}
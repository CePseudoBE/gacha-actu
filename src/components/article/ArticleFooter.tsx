import { Calendar, User } from "lucide-react"

interface ArticleFooterProps {
  author: string
  publishedAt: string
  className?: string
}

export function ArticleFooter({ author, publishedAt, className = "" }: ArticleFooterProps) {
  return (
    <div className={`flex items-center justify-between text-xs text-muted-foreground pt-3 border-t mt-auto ${className}`}>
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
  )
}
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Clock, User, Tag, Calendar } from "lucide-react"
import { getArticleBySlug, getRelatedArticles } from "@/lib/data-access"
import { ArticleCard } from "@/components/ArticleCard"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: "Article non trouvé",
      description: "L'article demandé n'existe pas."
    }
  }

  return {
    title: `${article.title} - GachaActu`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: article.imageUrl ? [{ url: article.imageUrl }] : [],
    },
    keywords: article.tags?.join(", "),
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, 4)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "publisher": {
      "@type": "Organization",
      "name": "GachaActu"
    },
    "about": {
      "@type": "VideoGame",
      "name": article.game
    },
    "keywords": article.tags?.join(", "),
    "image": article.imageUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://gachaactu.com/article/${article.slug}`
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Game badge */}
          <div className="mb-4">
            <Badge variant="secondary" className="text-sm">
              {article.game}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {article.summary}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.publishedAt}</span>
            </div>
            {article.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min de lecture</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Featured image */}
          {article.imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
          />
        </div>

        <Separator className="my-12" />

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Articles similaires</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.slug} {...relatedArticle} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
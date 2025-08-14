import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ArticleCard } from "@/components/ArticleCard"

interface Article {
  title: string
  summary: string
  author: string
  publishedAt: string
  game: string
  slug: string
  imageUrl?: string
}

interface ArticlesCarouselProps {
  articles: Article[]
  title?: string
  subtitle?: string
}

export function ArticlesCarousel({ 
  articles, 
  title = "Articles récents", 
  subtitle = "Découvrez nos dernières actualités et guides" 
}: ArticlesCarouselProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {articles.map((article, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <ArticleCard {...article} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
        
        <div className="flex justify-center mt-8 md:hidden">
          <p className="text-sm text-muted-foreground">
            Balayez pour voir plus d&apos;articles →
          </p>
        </div>
      </div>
    </section>
  )
}
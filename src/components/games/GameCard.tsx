import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { 
  Gamepad2, 
  Calendar, 
  Users, 
  ExternalLink, 
  BookOpen,
  Newspaper,
  Star
} from "lucide-react"

interface GameCardProps {
  game: {
    id: string
    name: string
    slug: string
    description: string
    genre: string
    platform: string
    developer: string
    releaseDate: string
    imageUrl: string
    logoUrl: string
    isPopular: boolean
    officialSite: string
    wiki: string
    articlesCount: number
    guidesCount: number
    tags: string[]
  }
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={game.imageUrl}
          alt={`${game.name} artwork`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Popular Badge */}
        {game.isPopular && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Populaire
            </Badge>
          </div>
        )}
        
        {/* Genre Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">
            {game.genre}
          </Badge>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {game.name}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {game.description}
        </p>

        {/* Game Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{game.developer}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{game.releaseDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gamepad2 className="w-4 h-4" />
            <span>{game.platform}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
            <Newspaper className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-sm">{game.articlesCount}</div>
              <div className="text-xs text-muted-foreground">Articles</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-sm">{game.guidesCount}</div>
              <div className="text-xs text-muted-foreground">Guides</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {game.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{game.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button asChild className="flex-1">
          <Link href={`/games/${game.slug}`}>
            Voir les contenus
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="icon">
          <Link 
            href={game.officialSite} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
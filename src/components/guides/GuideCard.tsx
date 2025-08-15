import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { 
  BookOpen, 
  Clock, 
  User, 
  Eye,
  Star,
  Gamepad2,
  TrendingUp,
  FileText
} from "lucide-react"

interface GuideCardProps {
  guide: {
    id: string
    title: string
    summary: string
    author: string
    publishedAt: string
    slug: string
    imageUrl?: string
    readingTime?: number
    difficulty: string
    guideType: string
    isPopular: boolean
    viewCount: number
    game: string
    gameSlug: string
    tags: string[]
    sectionsCount: number
  }
}

const DIFFICULTY_CONFIG = {
  'BEGINNER': { label: 'Débutant', color: 'bg-green-500', variant: 'default' as const },
  'INTERMEDIATE': { label: 'Intermédiaire', color: 'bg-yellow-500', variant: 'secondary' as const },
  'ADVANCED': { label: 'Avancé', color: 'bg-orange-500', variant: 'destructive' as const },
  'EXPERT': { label: 'Expert', color: 'bg-red-500', variant: 'destructive' as const }
}

const GUIDE_TYPE_CONFIG = {
  'CHARACTER_BUILD': { label: 'Build Personnage', icon: User },
  'TEAM_COMP': { label: 'Composition', icon: Gamepad2 },
  'EQUIPMENT': { label: 'Équipements', icon: BookOpen },
  'STRATEGY': { label: 'Stratégie', icon: TrendingUp },
  'BEGINNER': { label: 'Guide Débutant', icon: Star },
  'ADVANCED': { label: 'Guide Avancé', icon: FileText },
  'EVENT_GUIDE': { label: 'Guide Événement', icon: Clock },
  'FARMING': { label: 'Farming', icon: TrendingUp }
}

export function GuideCard({ guide }: GuideCardProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[guide.difficulty as keyof typeof DIFFICULTY_CONFIG]
  const typeConfig = GUIDE_TYPE_CONFIG[guide.guideType as keyof typeof GUIDE_TYPE_CONFIG]
  const TypeIcon = typeConfig?.icon || BookOpen

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={guide.imageUrl || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400'}
          alt={guide.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {guide.isPopular && (
            <Badge className="bg-primary/90 text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Populaire
            </Badge>
          )}
          
          <Badge variant={difficultyConfig?.variant || 'secondary'}>
            {difficultyConfig?.label || guide.difficulty}
          </Badge>
        </div>
        
        {/* Game badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90">
            {guide.game}
          </Badge>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardHeader className="flex-1">
        <div className="flex items-start gap-2 mb-2">
          <TypeIcon className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            {typeConfig?.label || guide.guideType}
          </div>
        </div>
        
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {guide.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {guide.summary}
        </p>

        {/* Guide Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{guide.author}</span>
            </div>
            
            {guide.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{guide.readingTime}min</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{guide.viewCount.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        <div className="flex items-center justify-between mb-4 p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-sm">{guide.sectionsCount}</div>
              <div className="text-xs text-muted-foreground">Sections</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {new Date(guide.publishedAt).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Tags */}
        {guide.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guide.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {guide.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{guide.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/guide/${guide.slug}`}>
            <BookOpen className="w-4 h-4 mr-2" />
            Lire le guide
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
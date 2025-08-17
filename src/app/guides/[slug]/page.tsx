import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { JsonLdScript } from "@/components/seo/JsonLdScript"
import { 
  ArrowLeft, 
  User, 
  Clock, 
  Calendar,
  Eye,
  Star,
  Gamepad2,
  BookOpen,
  TrendingUp,
  FileText,
  List
} from "lucide-react"

interface Guide {
  id: string
  title: string
  summary: string
  author: string
  publishedAt: string
  slug: string
  imageUrl?: string | null
  readingTime?: number | null
  difficulty: string
  guideType: string
  isPopular: boolean
  viewCount: number
  metaDescription?: string | null
  game: {
    id: string
    name: string
    slug: string
  }
  sections: Array<{
    id: string
    title: string
    content: string
    order: number
  }>
  tags: Array<{
    tag: {
      name: string
    }
  }>
}

// Configuration des difficultés et types
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

async function getGuide(slug: string): Promise<Guide | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        },
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!guide) {
      return null
    }

    // Incrémente le nombre de vues
    await prisma.guide.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Retourner directement l'objet avec la bonne structure
    return {
      ...guide,
      publishedAt: guide.publishedAt.toISOString(),
      updatedAt: guide.updatedAt.toISOString(),
      viewCount: guide.viewCount + 1
    } as Guide
  } catch (error) {
    console.error('Erreur lors du chargement du guide:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuide(slug)
  
  if (!guide) {
    return {
      title: 'Guide non trouvé',
      description: 'Ce guide n\'existe pas ou a été supprimé.'
    }
  }

  return {
    title: `${guide.title} - Guide ${guide.game.name}`,
    description: guide.metaDescription || guide.summary,
    openGraph: {
      title: guide.title,
      description: guide.summary,
      type: 'article',
      publishedTime: guide.publishedAt,
      authors: [guide.author],
      images: guide.imageUrl ? [{
        url: guide.imageUrl,
        width: 1200,
        height: 630,
        alt: guide.title
      }] : undefined,
    },
    keywords: guide.tags.map(t => t.tag.name),
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = await getGuide(slug)
  
  if (!guide) {
    notFound()
  }

  const difficultyConfig = DIFFICULTY_CONFIG[guide.difficulty as keyof typeof DIFFICULTY_CONFIG]
  const typeConfig = GUIDE_TYPE_CONFIG[guide.guideType as keyof typeof GUIDE_TYPE_CONFIG]
  const TypeIcon = typeConfig?.icon || BookOpen

  // JSON-LD pour le SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.summary,
    "author": {
      "@type": "Person",
      "name": guide.author
    },
    "datePublished": guide.publishedAt,
    "image": guide.imageUrl,
    "articleSection": "Gaming Guide",
    "keywords": "",
    "wordCount": guide.sections?.reduce((acc, section) => acc + section.content.length, 0) || 0
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      
      <div className="min-h-screen bg-background">
        {/* Header avec image */}
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
          {guide.imageUrl && (
            <Image
              src={guide.imageUrl}
              alt={guide.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-6 left-6">
            <Link href="/guides">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux guides
              </Button>
            </Link>
          </div>

          {/* Badges overlay */}
          <div className="absolute top-6 right-6 flex gap-2">
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

          {/* Titre et meta */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <div className="flex items-start gap-2 mb-3">
                <Badge variant="outline" className="bg-background/90">
                  {typeConfig?.label || guide.guideType}
                </Badge>
                <Badge variant="outline" className="bg-background/90">
                  {guide.game.name}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {guide.title}
              </h1>
              
              <p className="text-xl text-gray-200 mb-4 max-w-3xl">
                {guide.summary}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{guide.author}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(guide.publishedAt).toLocaleDateString('fr-FR')}</span>
                </div>

                {guide.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{guide.readingTime} min de lecture</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{guide.viewCount.toLocaleString()} vues</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Table des matières (si sections) */}
              {guide.sections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <List className="w-5 h-5" />
                      Table des matières
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {guide.sections.map((section, index) => (
                        <a
                          key={section.id}
                          href={`#section-${index}`}
                          className="block p-2 rounded hover:bg-accent transition-colors"
                        >
                          <span className="text-sm text-muted-foreground">
                            {index + 1}.
                          </span>{' '}
                          {section.title}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Sections du guide */}
              {guide.sections.map((section, index) => (
                <Card key={section.id} id={`section-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      {section.content.split('\n').map((paragraph, pIndex) => (
                        paragraph.trim() && (
                          <p key={pIndex} className="mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informations du guide */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Jeu</div>
                    <div className="font-medium">{guide.game.name}</div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Difficulté</div>
                    <Badge variant={difficultyConfig?.variant || 'secondary'}>
                      {difficultyConfig?.label || guide.difficulty}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Type</div>
                    <div className="font-medium">{typeConfig?.label || guide.guideType}</div>
                  </div>

                  {guide.sections.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Structure</div>
                        <div className="font-medium">{guide.sections.length} sections</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>


              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/guides?game=${guide.game.slug}`}>
                    <Button variant="outline" className="w-full">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Autres guides {guide.game.name}
                    </Button>
                  </Link>
                  
                  <Link href="/guides">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Tous les guides
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
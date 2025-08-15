"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { TagInput } from "@/components/admin/TagInput"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Separator } from "@/components/ui/separator"

const categories = [
  { value: "NEWS", label: "Actualité" },
  { value: "GUIDE", label: "Guide" },
  { value: "TIER_LIST", label: "Tier List" },
  { value: "EVENT", label: "Événement" }
]

interface FormErrors {
  title?: string
  slug?: string
  summary?: string
  content?: string
  author?: string
  gameId?: string
}

export default function AddArticlePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<Array<{id: string, name: string}>>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    author: "",
    gameId: "",
    category: "NEWS",
    imageUrl: "",
    readingTime: "",
    metaDescription: "",
    isPopular: false,
    publishedAt: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    seoKeywords: [] as string[]
  })

  // Charger les jeux et tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, tagsResponse] = await Promise.all([
          fetch('/api/admin/games'),
          fetch('/api/admin/tags')
        ])
        
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json()
          setGames(gamesData)
        }
        
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json()
          setAvailableTags(tagsData.map((tag: {name: string}) => tag.name))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
    fetchData()
  }, [])

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est requis"
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Le résumé est requis"
    } else if (formData.summary.length < 50) {
      newErrors.summary = "Le résumé doit faire au moins 50 caractères"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Le contenu est requis"
    } else if (formData.content.length < 200) {
      newErrors.content = "Le contenu doit faire au moins 200 caractères"
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'auteur est requis"
    }

    if (!formData.gameId) {
      newErrors.gameId = "Le jeu est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          readingTime: formData.readingTime ? parseInt(formData.readingTime) : null,
          publishedAt: new Date(formData.publishedAt).toISOString()
        }),
      })

      if (response.ok) {
        router.push('/admin/articles')
      } else {
        const errorData = await response.json()
        console.error('Erreur lors de la création de l\'article:', errorData.error)
        // Ici on pourrait afficher une notification d'erreur
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Ici on pourrait afficher une notification d'erreur
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Créer un article</h1>
          <p className="text-muted-foreground">Rédigez une nouvelle actualité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contenu de l&apos;article</CardTitle>
            <CardDescription>
              Informations principales et contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;article *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Nouvelle bannière Raiden Shogun disponible"
                  className={errors.title ? "border-red-500" : ""}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="nouvelle-banniere-raiden-shogun"
                />
              </div>

              {/* Résumé */}
              <div className="space-y-2">
                <Label htmlFor="summary">Résumé *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Résumé court de l'article..."
                  rows={3}
                  required
                />
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Label htmlFor="content">Contenu de l&apos;article *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu complet de l'article en Markdown..."
                  rows={15}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Vous pouvez utiliser le format Markdown pour la mise en forme
                </p>
              </div>

              {/* Description meta */}
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Description SEO</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Description pour les moteurs de recherche..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Idéal: 150-160 caractères ({formData.metaDescription.length}/160)
                </p>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput
                  value={formData.tags}
                  onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                  placeholder="Ajouter des tags..."
                  suggestions={availableTags}
                />
                <p className="text-xs text-muted-foreground">
                  Appuyez sur Entrée ou cliquez sur + pour ajouter un tag
                </p>
              </div>

              {/* Mots-clés SEO */}
              <div className="space-y-2">
                <Label>Mots-clés SEO</Label>
                <TagInput
                  value={formData.seoKeywords}
                  onChange={(keywords) => setFormData(prev => ({ ...prev, seoKeywords: keywords }))}
                  placeholder="Ajouter des mots-clés SEO..."
                />
                <p className="text-xs text-muted-foreground">
                  Mots-clés pour améliorer le référencement naturel
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Création..." : "Créer l'article"}
                </Button>
                <Link href="/admin/articles">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar métadonnées */}
        <Card>
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
            <CardDescription>
              Informations complémentaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auteur */}
            <div className="space-y-2">
              <Label htmlFor="author">Auteur *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Nom de l'auteur"
                required
              />
            </div>

            {/* Jeu */}
            <div className="space-y-2">
              <Label htmlFor="gameId">Jeu *</Label>
              <Select
                value={formData.gameId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gameId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un jeu" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image */}
            <ImageUpload
              label="Image de l'article"
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              placeholder="https://example.com/article.jpg"
              description="Image d'illustration de l'article (recommandé: 16:9)"
              aspectRatio="aspect-video"
            />

            {/* Temps de lecture */}
            <div className="space-y-2">
              <Label htmlFor="readingTime">Temps de lecture (min)</Label>
              <Input
                id="readingTime"
                type="number"
                value={formData.readingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readingTime: e.target.value }))}
                placeholder="5"
                min="1"
                max="60"
              />
            </div>

            {/* Date de publication */}
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Date de publication</Label>
              <Input
                id="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
              />
            </div>

            {/* Populaire */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
              />
              <Label htmlFor="isPopular">Article populaire</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
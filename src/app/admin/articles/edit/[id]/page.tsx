"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { TagInput } from "@/components/admin/TagInput"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Separator } from "@/components/ui/separator"

const categories = [
  { value: "NEWS", label: "Actualité" },
  { value: "GUIDE", label: "Guide" },
  { value: "TIER_LIST", label: "Tier List" },
  { value: "EVENT", label: "Événement" }
]

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [games, setGames] = useState<{id: string, name: string}[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
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
    publishedAt: "",
    tags: [] as string[],
    seoKeywords: [] as string[]
  })

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleResponse, gamesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/admin/articles/${articleId}`),
          fetch('/api/admin/games'),
          fetch('/api/admin/tags')
        ])
        
        if (articleResponse.ok) {
          const article = await articleResponse.json()
          setFormData({
            title: article.title || "",
            slug: article.slug || "",
            summary: article.summary || "",
            content: article.content || "",
            author: article.author || "",
            gameId: article.gameId || "",
            category: article.category || "NEWS",
            imageUrl: article.imageUrl || "",
            readingTime: article.readingTime?.toString() || "",
            metaDescription: article.metaDescription || "",
            isPopular: article.isPopular || false,
            publishedAt: article.publishedAt ? article.publishedAt.split('T')[0] : "",
            tags: article.tags?.map((t: {tag: {name: string}}) => t.tag.name) || [],
            seoKeywords: article.seoKeywords?.map((k: {keyword: {keyword: string}}) => k.keyword.keyword) || []
          })
        } else {
          setError("Article non trouvé")
        }
        
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
        setError("Erreur lors du chargement")
      } finally {
        setIsLoadingData(false)
      }
    }

    if (articleId) {
      fetchData()
    }
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PUT',
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
        setError(errorData.error || 'Erreur lors de la modification de l\'article')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion au serveur')
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

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Chargement de l&apos;article...</span>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Modifier l&apos;article</h1>
          <p className="text-muted-foreground">Modifier les informations de l&apos;article</p>
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
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l&apos;article *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Nouvelle bannière Raiden Shogun disponible"
                  required
                />
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
              </div>

              {/* Mots-clés SEO */}
              <div className="space-y-2">
                <Label>Mots-clés SEO</Label>
                <TagInput
                  value={formData.seoKeywords}
                  onChange={(keywords) => setFormData(prev => ({ ...prev, seoKeywords: keywords }))}
                  placeholder="Ajouter des mots-clés SEO..."
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Modification..." : "Sauvegarder"}
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
              description="Image d&apos;illustration de l&apos;article (recommandé: 16:9)"
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
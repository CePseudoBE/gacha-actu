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

const difficulties = [
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "ADVANCED", label: "Avancé" }
]

interface FormErrors {
  title?: string
  slug?: string
  summary?: string
  content?: string
  author?: string
  gameId?: string
}

export default function AddGuidePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<{id: string, name: string}[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    author: "",
    gameId: "",
    difficulty: "BEGINNER",
    imageUrl: "",
    readingTime: "",
    metaDescription: "",
    isPopular: false
  })

  // Charger les jeux
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/admin/games')
        if (response.ok) {
          const data = await response.json()
          setGames(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des jeux:', error)
      }
    }
    fetchGames()
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
    } else if (formData.content.length < 300) {
      newErrors.content = "Le contenu doit faire au moins 300 caractères"
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
      const response = await fetch('/api/admin/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          readingTime: formData.readingTime ? parseInt(formData.readingTime) : null
        }),
      })

      if (response.ok) {
        router.push('/admin/guides')
      } else {
        const errorData = await response.json()
        console.error('Erreur lors de la création du guide:', errorData.error)
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
        <Link href="/admin/guides">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Créer un guide</h1>
          <p className="text-muted-foreground">Rédigez un nouveau guide pour les joueurs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contenu du guide</CardTitle>
            <CardDescription>
              Informations principales et contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre du guide *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Guide complet de Raiden Shogun"
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
                  placeholder="guide-raiden-shogun"
                />
              </div>

              {/* Résumé */}
              <div className="space-y-2">
                <Label htmlFor="summary">Résumé *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Résumé court du guide..."
                  rows={3}
                  className={errors.summary ? "border-red-500" : ""}
                  required
                />
                {errors.summary && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.summary}
                  </p>
                )}
                <p className={`text-xs ${formData.summary.length >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {formData.summary.length}/50 caractères minimum {formData.summary.length >= 50 && '✓'}
                </p>
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <Label htmlFor="content">Contenu du guide *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu complet du guide en Markdown..."
                  rows={12}
                  className={errors.content ? "border-red-500" : ""}
                  required
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content}
                  </p>
                )}
                <p className={`text-xs ${formData.content.length >= 300 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {formData.content.length}/300 caractères minimum {formData.content.length >= 300 && '✓'}
                </p>
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
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Création..." : "Créer le guide"}
                </Button>
                <Link href="/admin/guides">
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
                className={errors.author ? "border-red-500" : ""}
                required
              />
              {errors.author && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.author}
                </p>
              )}
            </div>

            {/* Jeu */}
            <div className="space-y-2">
              <Label htmlFor="gameId">Jeu *</Label>
              <Select
                value={formData.gameId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gameId: value }))}
                required
              >
                <SelectTrigger className={errors.gameId ? "border-red-500" : ""}>
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
              {errors.gameId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gameId}
                </p>
              )}
            </div>

            {/* Difficulté */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulté</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l&apos;image</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

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

            {/* Populaire */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
              />
              <Label htmlFor="isPopular">Guide populaire</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
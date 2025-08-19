"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Youtube, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Game {
  id: string
  name: string
  slug: string
}

export default function AddYouTubeVideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [formData, setFormData] = useState({
    videoId: "",
    title: "",
    description: "",
    thumbnail: "",
    channelTitle: "",
    publishedAt: "",
    category: "",
    duration: "",
    gameId: "none",
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      if (data.games) {
        setGames(data.games)
      } else {
        toast.error('Erreur lors du chargement des jeux')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des jeux:', error)
      toast.error('Erreur de connexion lors du chargement des jeux')
    }
  }

  const extractVideoId = (url: string): string => {
    // Extraire l'ID d'une URL YouTube
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const generateThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  const handleVideoIdChange = (value: string) => {
    const cleanVideoId = extractVideoId(value)
    setFormData(prev => ({
      ...prev,
      videoId: cleanVideoId,
      thumbnail: cleanVideoId ? generateThumbnail(cleanVideoId) : ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.videoId || !formData.title) {
      toast.error('Veuillez remplir les champs obligatoires (ID vidéo et titre)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/youtube-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          gameId: formData.gameId || null,
          publishedAt: formData.publishedAt || null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Vidéo créée avec succès !')
        router.push('/admin/youtube-videos')
      } else {
        // Gérer les erreurs de validation de façon plus user-friendly
        const errorMessage = data.error || 'Erreur lors de la création'
        if (errorMessage.includes('Erreurs de validation:')) {
          // Extraire et formater les erreurs de validation
          const validationErrors = errorMessage.replace('Erreurs de validation: ', '')
          toast.error(`Veuillez corriger les erreurs suivantes :\n${validationErrors}`)
        } else {
          toast.error(errorMessage)
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/admin/youtube-videos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ajouter une vidéo YouTube</h1>
            <p className="text-muted-foreground">
              Ajoutez une nouvelle vidéo au carousel
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoId">URL ou ID de la vidéo YouTube *</Label>
                <Input
                  id="videoId"
                  placeholder="https://www.youtube.com/watch?v=... ou dQw4w9WgXcQ"
                  value={formData.videoId}
                  onChange={(e) => handleVideoIdChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Collez l'URL complète ou juste l'ID de la vidéo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Titre de la vidéo"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la vidéo"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelTitle">Nom de la chaîne</Label>
                <Input
                  id="channelTitle"
                  placeholder="Nom de la chaîne YouTube"
                  value={formData.channelTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, channelTitle: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL de la miniature</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://img.youtube.com/vi/..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Générée automatiquement à partir de l'ID vidéo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">Date de publication</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guides">Guides</SelectItem>
                    <SelectItem value="Analyses">Analyses</SelectItem>
                    <SelectItem value="Actualités">Actualités</SelectItem>
                    <SelectItem value="Tier Lists">Tier Lists</SelectItem>
                    <SelectItem value="PvP">PvP</SelectItem>
                    <SelectItem value="Événements">Événements</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameId">Jeu associé</Label>
                <Select value={formData.gameId} onValueChange={(value) => setFormData(prev => ({ ...prev, gameId: value === "none" ? "" : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un jeu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun jeu</SelectItem>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  placeholder="4:33 ou PT4M33S"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Vidéo active</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu */}
        {formData.videoId && (
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden">
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{formData.title || "Titre de la vidéo"}</h3>
                  {formData.channelTitle && (
                    <p className="text-sm text-red-600">{formData.channelTitle}</p>
                  )}
                  {formData.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer la vidéo"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/youtube-videos">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
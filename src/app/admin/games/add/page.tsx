"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { PlatformSelector } from "@/components/admin/PlatformSelector"

const genres = [
  "RPG", "Action RPG", "Collectible Card Game", "Strategy", "MMORPG", "Idle Game", "Puzzle", "Autre"
]


export default function AddGamePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    genre: "",
    platformIds: [] as string[],
    developer: "",
    releaseDate: "",
    imageUrl: "",
    logoUrl: "",
    officialSite: "",
    wiki: "",
    isPopular: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validation basique
    if (!formData.name.trim()) {
      setError("Le nom du jeu est requis")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/games')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erreur lors de la création du jeu')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/games">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Ajouter un jeu</h1>
          <p className="text-muted-foreground">Créer une nouvelle fiche jeu</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du jeu</CardTitle>
          <CardDescription>
            Remplissez les informations de base du jeu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-800">
                <Upload className="w-4 h-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du jeu */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du jeu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ex: Genshin Impact"
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
                placeholder="genshin-impact"
              />
              <p className="text-xs text-muted-foreground">
                Généré automatiquement à partir du nom
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du jeu..."
                rows={3}
              />
            </div>

            {/* Genre et Plateforme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <PlatformSelector
                value={formData.platformIds}
                onChange={(platformIds) => setFormData(prev => ({ ...prev, platformIds }))}
                label="Plateformes supportées"
              />
            </div>

            {/* Développeur et Date de sortie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="developer">Développeur</Label>
                <Input
                  id="developer"
                  value={formData.developer}
                  onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
                  placeholder="ex: miHoYo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Date de sortie</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <ImageUpload
                label="Image de couverture"
                value={formData.imageUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                placeholder="https://example.com/cover.jpg"
                description="Image principale du jeu (recommandé: 400x600px)"
                aspectRatio="aspect-[2/3]"
              />

              <ImageUpload
                label="Logo du jeu"
                value={formData.logoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                placeholder="https://example.com/logo.png"
                description="Logo/icône du jeu (recommandé: format carré)"
                aspectRatio="aspect-square"
              />
            </div>

            {/* URLs externes */}
            <div className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="officialSite">Site officiel</Label>
                <Input
                  id="officialSite"
                  value={formData.officialSite}
                  onChange={(e) => setFormData(prev => ({ ...prev, officialSite: e.target.value }))}
                  placeholder="https://genshin.hoyoverse.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wiki">Wiki</Label>
                <Input
                  id="wiki"
                  value={formData.wiki}
                  onChange={(e) => setFormData(prev => ({ ...prev, wiki: e.target.value }))}
                  placeholder="https://wiki.example.com"
                />
              </div>
            </div>

            {/* Populaire */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
              />
              <Label htmlFor="isPopular">Jeu populaire</Label>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Création..." : "Créer le jeu"}
              </Button>
              <Link href="/admin/games">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
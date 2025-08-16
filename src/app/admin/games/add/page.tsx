"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Save } from "lucide-react"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { PlatformSelector } from "@/components/admin/PlatformSelector"
import { gameFormSchema, type GameFormData } from "@/lib/validations"

const genres = [
  "RPG", 
  "Action RPG", 
  "Collectible Card Game", 
  "Strategy", 
  "MMORPG", 
  "Idle Game", 
  "Puzzle", 
  "Tower Defense",
  "Turn-based RPG",
  "Tactical RPG",
  "Autre"
] as const

export default function AddGamePage() {
  const router = useRouter()

  // Configuration React Hook Form avec Zod
  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      genre: "",
      developer: "",
      releaseDate: "",
      imageUrl: "",
      logoUrl: "",
      officialSite: "",
      wiki: "",
      isPopular: false,
      platformIds: []
    }
  })

  // Soumission du formulaire
  const onSubmit = async (data: GameFormData) => {
    try {
      const response = await fetch('/api/admin/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/admin/games')
      } else {
        const errorData = await response.json()
        console.error('Erreur lors de la création du jeu:', errorData.error)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Génération automatique du slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (value: string) => {
    form.setValue('name', value)
    form.setValue('slug', generateSlug(value))
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nom du jeu */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du jeu *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: Genshin Impact"
                        {...field}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="genshin-impact"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Généré automatiquement à partir du nom
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description du jeu..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genre et Plateformes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platformIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plateformes supportées</FormLabel>
                      <FormControl>
                        <PlatformSelector
                          value={field.value}
                          onChange={field.onChange}
                          label=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Développeur et Date de sortie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="developer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Développeur</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: miHoYo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de sortie</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image de couverture</FormLabel>
                      <FormControl>
                        <ImageUpload
                          label=""
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="https://example.com/cover.jpg"
                          description="Image principale du jeu (recommandé: 400x600px)"
                          aspectRatio="aspect-[2/3]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo du jeu</FormLabel>
                      <FormControl>
                        <ImageUpload
                          label=""
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="https://example.com/logo.png"
                          description="Logo/icône du jeu (recommandé: format carré)"
                          aspectRatio="aspect-square"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* URLs externes */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="officialSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site officiel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://genshin.hoyoverse.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wiki"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wiki</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://wiki.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Populaire */}
              <FormField
                control={form.control}
                name="isPopular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Jeu populaire</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Boutons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting} 
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {form.formState.isSubmitting ? "Création..." : "Créer le jeu"}
                </Button>
                <Link href="/admin/games">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
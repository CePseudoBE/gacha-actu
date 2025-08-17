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
import { guideFormSchema, type GuideFormData } from "@/lib/validations"
import { SectionsEditor, type Section } from "@/components/forms/SectionsEditor"

// Hooks personnalisés
import { useFormData } from "@/hooks/useFormData"
import { useAsyncOperation } from "@/hooks/useAsyncOperation"

// Composants réutilisables  
import { SidebarFields } from "@/components/forms/SidebarFields"
import { LoadingState } from "@/components/forms/LoadingState"
import { ErrorState } from "@/components/forms/ErrorState"

const difficulties = [
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "ADVANCED", label: "Avancé" },
  { value: "EXPERT", label: "Expert" }
] as const

const guideTypes = [
  { value: "CHARACTER_BUILD", label: "Build de personnage" },
  { value: "TEAM_COMP", label: "Composition d'équipe" },
  { value: "EQUIPMENT", label: "Équipement" },
  { value: "STRATEGY", label: "Stratégie" },
  { value: "BEGINNER", label: "Guide débutant" },
  { value: "ADVANCED", label: "Guide avancé" },
  { value: "EVENT_GUIDE", label: "Guide d'événement" },
  { value: "FARMING", label: "Guide de farm" }
] as const

export default function AddGuidePage() {
  const router = useRouter()
  
  // Hooks pour la logique métier
  const { games, availableTags, availableSeoKeywords, isLoading, error } = useFormData()
  const { execute: submitGuide, isLoading: isSubmitting, error: submitError } = useAsyncOperation()

  // Configuration React Hook Form avec Zod
  const form = useForm<GuideFormData>({
    resolver: zodResolver(guideFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      author: "",
      gameId: "",
      difficulty: "BEGINNER",
      guideType: "STRATEGY",
      imageUrl: "",
      readingTime: undefined,
      metaDescription: "",
      isPopular: false,
      tags: [],
      seoKeywords: [],
      sections: []
    }
  })


  // Gestion de la soumission
  const onSubmit = async (data: GuideFormData) => {
    const result = await submitGuide(async () => {
      const transformedData = {
        ...data,
        readingTime: data.readingTime || null
      }
      
      const response = await fetch('/api/admin/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du guide')
      }

      return response.json()
    })

    if (result) {
      router.push('/admin/guides')
    }
  }

  // Génération automatique du slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    form.setValue('title', value)
    form.setValue('slug', generateSlug(value))
  }

  const { watch } = form
  const watchedSummary = watch("summary")

  // États de chargement et d'erreur
  if (isLoading) {
    return <LoadingState title="Chargement du formulaire" description="Chargement des données nécessaires..." />
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire principal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contenu du guide</CardTitle>
                <CardDescription>
                  Informations principales et contenu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Titre */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre du guide *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: Guide complet de Raiden Shogun"
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value)}
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
                          placeholder="guide-raiden-shogun"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Résumé */}
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Résumé *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Résumé court du guide..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className={watchedSummary.length >= 50 ? 'text-green-600' : ''}>
                        {watchedSummary.length}/50 caractères minimum {watchedSummary.length >= 50 && '✓'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sections du guide */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Structure du guide</h3>
                    <p className="text-sm text-muted-foreground">
                      Organisez votre guide en sections pour une meilleure lisibilité
                    </p>
                  </div>
                  
                  <SectionsEditor
                    sections={form.watch("sections") || []}
                    onChange={(sections) => form.setValue("sections", sections)}
                    disabled={form.formState.isSubmitting}
                  />
                </div>

                {/* Description SEO */}
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description SEO</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description pour les moteurs de recherche..."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Idéal: 150-160 caractères ({field.value?.length || 0}/160)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de l'auteur"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Jeu */}
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jeu *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un jeu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {games.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type de guide */}
            <FormField
              control={form.control}
              name="guideType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de guide</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guideTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulté */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulté</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l&apos;image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Temps de lecture */}
            <FormField
              control={form.control}
              name="readingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de lecture (min)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      min="1"
                      max="60"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Populaire */}
            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Guide populaire</FormLabel>
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


                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting} 
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {form.formState.isSubmitting ? "Création..." : "Créer le guide"}
                  </Button>
                  <Link href="/admin/guides">
                    <Button type="button" variant="outline">
                      Annuler
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  )
}
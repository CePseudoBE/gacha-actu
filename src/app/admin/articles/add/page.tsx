"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Hooks personnalisés
import { useFormData } from "@/hooks/useFormData"
import { useAsyncOperation } from "@/hooks/useAsyncOperation"

// Composants réutilisables
import { TitleSlugFields } from "@/components/forms/TitleSlugFields"
import { ContentFields } from "@/components/forms/ContentFields"
import { MainContentFields } from "@/components/forms/MainContentFields"
import { SidebarFields } from "@/components/forms/SidebarFields"
import { FormActions } from "@/components/forms/FormActions"
import { LoadingState } from "@/components/forms/LoadingState"
import { ErrorState } from "@/components/forms/ErrorState"

// Services et validations
import { articleService } from "@/services/adminServices"
import { articleFormSchema, type ArticleFormData } from "@/lib/validations"

const categories = [
  { value: "NEWS", label: "Actualité" },
  { value: "GUIDE", label: "Guide" },
  { value: "TIER_LIST", label: "Tier List" },
  { value: "EVENT", label: "Événement" }
]

export const dynamic = 'force-dynamic'

export default function AddArticlePage() {
  const router = useRouter()
  
  // Hooks pour la logique métier
  const { games, availableTags, availableSeoKeywords, isLoading, error } = useFormData()
  const { execute: submitArticle, isLoading: isSubmitting, error: submitError } = useAsyncOperation()

  // Configuration du formulaire
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      author: "",
      gameId: "",
      category: "NEWS",
      imageUrl: "",
      readingTime: undefined,
      metaDescription: "",
      isPopular: false,
      publishedAt: new Date().toISOString().split('T')[0],
      tags: [],
      seoKeywords: []
    }
  })

  // Gestion de la soumission
  const onSubmit = async (data: ArticleFormData) => {
    const result = await submitArticle(async () => {
      const transformedData = {
        ...data,
        readingTime: data.readingTime || null,
        publishedAt: new Date(data.publishedAt).toISOString()
      }
      return articleService.create(transformedData)
    })

    if (result) {
      router.push('/admin/articles')
    }
  }

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Contenu de l&apos;article</CardTitle>
                <CardDescription>
                  Informations principales et contenu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TitleSlugFields
                  control={form.control}
                  form={form}
                  titlePlaceholder="ex: Nouvelle bannière Raiden Shogun disponible"
                  slugPlaceholder="nouvelle-banniere-raiden-shogun"
                />

                <ContentFields
                  control={form.control}
                  form={form}
                  summaryMinLength={50}
                  contentMinLength={200}
                  contentLabel="Contenu de l&apos;article"
                  contentPlaceholder="Contenu complet de l&apos;article en Markdown..."
                />

                <Separator />

                <MainContentFields
                  control={form.control}
                  games={games}
                  availableTags={availableTags}
                  showCategory={true}
                  categories={categories}
                />
              </CardContent>
            </Card>

            {/* Sidebar des métadonnées et actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métadonnées</CardTitle>
                  <CardDescription>
                    Informations de l&apos;article
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <SidebarFields
                    control={form.control}
                    availableTags={availableTags}
                    availableSeoKeywords={availableSeoKeywords}
                    showPublishedAt={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
                  <CardDescription>
                    Actions et paramètres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormActions
                    isSubmitting={isSubmitting}
                    submitText="Créer l&apos;article"
                    cancelPath="/admin/articles"
                    error={submitError}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
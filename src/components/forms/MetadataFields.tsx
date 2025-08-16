"use client"

import { Control, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TagInput } from "@/components/admin/TagInput"
import { ImageUpload } from "@/components/admin/ImageUpload"

interface Game {
  id: string
  name: string
}

interface MetadataFieldsProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  games: Game[]
  availableTags: string[]
  availableSeoKeywords: string[]
  showCategory?: boolean
  showPublishedAt?: boolean
  categories?: Array<{ value: string; label: string }>
}

export function MetadataFields<T extends FieldValues = FieldValues>({
  control,
  games,
  availableTags,
  availableSeoKeywords,
  showCategory = false,
  showPublishedAt = false,
  categories = []
}: MetadataFieldsProps<T>) {
  return (
    <>
      {/* Auteur */}
      <FormField
        control={control}
        name={"author" as Path<T>}
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
        control={control}
        name={"gameId" as Path<T>}
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

      {/* Catégorie */}
      {showCategory && (
        <FormField
          control={control}
          name={"category" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Image */}
      <FormField
        control={control}
        name={"imageUrl" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <ImageUpload
                label=""
                value={field.value}
                onChange={field.onChange}
                placeholder="https://example.com/image.jpg"
                description="Image d'illustration (recommandé: 16:9)"
                aspectRatio="aspect-video"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Temps de lecture */}
      <FormField
        control={control}
        name={"readingTime" as Path<T>}
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

      {/* Date de publication */}
      {showPublishedAt && (
        <FormField
          control={control}
          name={"publishedAt" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de publication</FormLabel>
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
      )}

      {/* Description SEO */}
      <FormField
        control={control}
        name={"metaDescription" as Path<T>}
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={control}
        name={"tags" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Ajouter des tags..."
                suggestions={availableTags}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mots-clés SEO */}
      <FormField
        control={control}
        name={"seoKeywords" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mots-clés SEO</FormLabel>
            <FormControl>
              <TagInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Ajouter des mots-clés SEO..."
                suggestions={availableSeoKeywords}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Populaire */}
      <FormField
        control={control}
        name={"isPopular" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Contenu populaire</FormLabel>
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
    </>
  )
}
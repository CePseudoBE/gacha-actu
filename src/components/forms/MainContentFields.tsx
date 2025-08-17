"use client"

import { Control, FieldValues, Path } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TagInput } from "@/components/admin/TagInput"
import { ImageUpload } from "@/components/admin/ImageUpload"

interface Game {
  id: string
  name: string
}

interface MainContentFieldsProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  games: Game[]
  availableTags: string[]
  showCategory?: boolean
  categories?: Array<{ value: string; label: string }>
}

export function MainContentFields<T extends FieldValues = FieldValues>({
  control,
  games,
  availableTags,
  showCategory = false,
  categories = []
}: MainContentFieldsProps<T>) {
  return (
    <>
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
    </>
  )
}
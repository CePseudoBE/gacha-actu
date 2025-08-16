"use client"

import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSlugGeneration } from "@/hooks/useSlugGeneration"

interface TitleSlugFieldsProps<T extends FieldValues & { title: string; slug: string }> {
  control: Control<T>
  form: UseFormReturn<T>
  titlePlaceholder?: string
  slugPlaceholder?: string
}

export function TitleSlugFields<T extends FieldValues & { title: string; slug: string }>({
  control,
  form,
  titlePlaceholder = "Titre...",
  slugPlaceholder = "slug-automatique"
}: TitleSlugFieldsProps<T>) {
  const { handleTitleChange } = useSlugGeneration(form)

  return (
    <>
      <FormField
        control={control}
        name={"title" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre *</FormLabel>
            <FormControl>
              <Input
                placeholder={titlePlaceholder}
                {...field}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={"slug" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug (URL)</FormLabel>
            <FormControl>
              <Input
                placeholder={slugPlaceholder}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Généré automatiquement à partir du titre
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
"use client"

import { Control, UseFormReturn, FieldValues, Path } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCharacterCount } from "@/hooks/useCharacterCount"

interface ContentFieldsProps<T extends FieldValues & { summary: string; content: string }> {
  control: Control<T>
  form: UseFormReturn<T>
  summaryMinLength: number
  contentMinLength: number
  contentLabel?: string
  contentPlaceholder?: string
}

export function ContentFields<T extends FieldValues & { summary: string; content: string }>({
  control,
  form,
  summaryMinLength,
  contentMinLength,
  contentLabel = "Contenu",
  contentPlaceholder = "Contenu complet en Markdown..."
}: ContentFieldsProps<T>) {
  const summaryCount = useCharacterCount({
    fieldName: "summary",
    minLength: summaryMinLength,
    form
  })

  const contentCount = useCharacterCount({
    fieldName: "content",
    minLength: contentMinLength,
    form
  })

  return (
    <>
      {/* Résumé */}
      <FormField
        control={control}
        name={"summary" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Résumé *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Résumé court..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormDescription className={summaryCount.displayClass}>
              {summaryCount.displayText}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contenu */}
      <FormField
        control={control}
        name={"content" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{contentLabel} *</FormLabel>
            <FormControl>
              <Textarea
                placeholder={contentPlaceholder}
                rows={15}
                {...field}
              />
            </FormControl>
            <FormDescription className={contentCount.displayClass}>
              {contentCount.displayText}
            </FormDescription>
            <FormDescription>
              Vous pouvez utiliser le format Markdown pour la mise en forme
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
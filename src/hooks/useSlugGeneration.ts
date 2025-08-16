"use client"

import { UseFormReturn } from "react-hook-form"

export function useSlugGeneration<T extends { title: string; slug: string }>(
  form: UseFormReturn<T>
) {
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    // @ts-expect-error - Type safe mais TypeScript n'arrive pas à l'inférer
    form.setValue('title', value)
    // @ts-expect-error - Type safe mais TypeScript n'arrive pas à l'inférer  
    form.setValue('slug', generateSlug(value))
  }

  return {
    generateSlug,
    handleTitleChange
  }
}
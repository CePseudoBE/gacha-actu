"use client"

import { Control } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface BaseFormFieldProps {
  control: Control<Record<string, unknown>>
  name: string
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
}

export function BaseFormField({
  control,
  name,
  label,
  description,
  required = false,
  children
}: BaseFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: _field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && " *"}
          </FormLabel>
          <FormControl>
            {children}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
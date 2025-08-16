"use client"

import { UseFormReturn, FieldValues } from "react-hook-form"

interface UseCharacterCountOptions<T extends FieldValues = FieldValues> {
  fieldName: string
  minLength: number
  form: UseFormReturn<T>
}

interface UseCharacterCountReturn {
  currentLength: number
  isValid: boolean
  displayText: string
  displayClass: string
}

export function useCharacterCount<T extends FieldValues = FieldValues>({
  fieldName,
  minLength,
  form
}: UseCharacterCountOptions<T>): UseCharacterCountReturn {
  const { watch } = form
  const fieldValue = watch(fieldName as any) || ""
  const currentLength = (fieldValue as string).length
  const isValid = currentLength >= minLength

  const displayText = `${currentLength}/${minLength} caractères minimum${isValid ? ' ✓' : ''}`
  const displayClass = isValid ? 'text-green-600' : ''

  return {
    currentLength,
    isValid,
    displayText,
    displayClass
  }
}
"use client"

import { useState, useCallback } from "react"

interface UseAsyncOperationState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

interface UseAsyncOperationReturn<T> extends UseAsyncOperationState<T> {
  execute: (operation: () => Promise<T>) => Promise<T | null>
  reset: () => void
}

export function useAsyncOperation<T = unknown>(): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: null,
    isLoading: false,
    error: null
  })

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await operation()
      setState(prev => ({ ...prev, data: result, isLoading: false }))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}
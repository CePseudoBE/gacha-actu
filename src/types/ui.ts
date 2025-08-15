export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

export interface SearchableProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export interface FilterableProps<T = Record<string, unknown>> {
  filters?: T
  onFiltersChange?: (filters: T) => void
}

export interface SortableProps<T extends string = string> {
  sortBy?: T
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (field: T, order: 'asc' | 'desc') => void
}

export type ComponentVariant = 'default' | 'outline' | 'ghost' | 'link'
export type ComponentSize = 'sm' | 'md' | 'lg'
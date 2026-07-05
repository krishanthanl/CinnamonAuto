import { useMemo, useState } from 'react'
import type { Category, Part } from '@/types/part'

type UsePartsFilterOptions = {
  parts: Part[]
  debounceMs?: number
}

export function usePartsFilter({ parts }: UsePartsFilterOptions) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')

  const filteredParts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return parts.filter((part) => {
      const matchesCategory = category === 'All' || part.category === category
      const matchesSearch =
        query.length === 0 ||
        part.name.toLowerCase().includes(query) ||
        part.category.toLowerCase().includes(query) ||
        part.description.toLowerCase().includes(query) ||
        part.id.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [parts, search, category])

  return {
    search,
    setSearch,
    category,
    setCategory,
    filteredParts,
    totalCount: parts.length,
    filteredCount: filteredParts.length,
  }
}

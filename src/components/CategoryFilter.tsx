import { CATEGORIES } from '@/data/categories'
import type { Category } from '@/types/part'

type CategoryFilterProps = {
  selected: Category | 'All'
  onChange: (category: Category | 'All') => void
  counts: Record<Category | 'All', number>
}

export default function CategoryFilter({
  selected,
  onChange,
  counts,
}: CategoryFilterProps) {
  const options: Array<{ value: Category | 'All'; label: string }> = [
    { value: 'All', label: 'All' },
    ...CATEGORIES.map((category) => ({ value: category, label: category })),
  ]

  return (
    <div className="scrollbar-hide flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`shrink-0 border px-4 py-2 font-display text-xs font-medium uppercase tracking-wider transition ${
              isActive
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-neutral-300 bg-white text-kardone-muted hover:border-brand-600 hover:text-brand-600'
            }`}
          >
            {option.label}
            <span
              className={`ml-2 ${
                isActive ? 'text-white/80' : 'text-neutral-400'
              }`}
            >
              ({counts[option.value]})
            </span>
          </button>
        )
      })}
    </div>
  )
}

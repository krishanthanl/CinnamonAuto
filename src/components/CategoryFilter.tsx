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
            className={`shrink-0 border px-4 py-2 font-display text-xs font-semibold uppercase tracking-widest transition rounded-full cursor-pointer ${
              isActive
                ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-lg shadow-cyan-500/20'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            {option.label}
            <span
              className={`ml-2 ${
                isActive ? 'text-black/70' : 'text-slate-500'
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

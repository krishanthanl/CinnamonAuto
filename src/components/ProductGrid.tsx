import ProductCard from '@/components/ProductCard'
import type { Part } from '@/types/part'

type ProductGridProps = {
  parts: Part[]
  onSelect: (part: Part) => void
}

export default function ProductGrid({ parts, onSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {parts.map((part) => (
        <ProductCard key={part.id} part={part} onSelect={onSelect} />
      ))}
    </div>
  )
}

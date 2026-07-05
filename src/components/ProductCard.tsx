import { useState } from 'react'
import type { Part } from '@/types/part'
import { useCart } from '@/context/CartContext'

type ProductCardProps = {
  part: Part
  onSelect: (part: Part) => void
}

export default function ProductCard({ part, onSelect }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(part)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <article className="group flex h-full flex-col border border-neutral-200 bg-white transition hover:shadow-lg">
      <button
        type="button"
        onClick={() => onSelect(part)}
        className="flex flex-1 flex-col text-left focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={part.image}
            alt={part.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {!part.inStock && (
            <span className="absolute left-0 top-3 bg-kardone-dark px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
              Unavailable
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-display text-base font-medium uppercase leading-snug text-kardone-dark">
            {part.name}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-kardone-muted">
            {part.description}
          </p>
        </div>
      </button>

      <div className="border-t border-neutral-100 p-4 pt-0 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect(part)}
          className="w-full border border-neutral-300 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-kardone-dark hover:bg-neutral-50 transition"
        >
          View details
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!part.inStock}
          className={`w-full py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 ${
            isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {part.inStock ? (isAdded ? 'Added ✓' : 'Add to cart') : 'Unavailable'}
        </button>
      </div>
    </article>
  )
}

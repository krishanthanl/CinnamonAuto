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
    <article className="group flex h-full flex-col border border-slate-800/80 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onSelect(part)}
        className="flex flex-1 flex-col text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-950">
          <img
            src={part.image}
            alt={part.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {!part.inStock && (
            <span className="absolute left-0 top-3 bg-slate-950/90 border-r border-y border-slate-850 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Unavailable
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-display text-sm font-semibold uppercase tracking-wider leading-snug text-white group-hover:text-cyan-400 transition-colors">
            {part.name}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-400">
            {part.description}
          </p>
        </div>
      </button>

      <div className="border-t border-slate-800/60 p-5 pt-0 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onSelect(part)}
          className="w-full border border-slate-700 py-2.5 rounded-lg font-display text-xs font-semibold uppercase tracking-widest text-slate-200 hover:bg-slate-800/80 hover:text-white transition duration-200 cursor-pointer"
        >
          View details
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!part.inStock}
          className={`w-full py-2.5 rounded-lg font-display text-xs font-bold uppercase tracking-widest text-white transition disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 ${
            isAdded 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 shadow-md hover:shadow-cyan-500/20'
          }`}
        >
          {part.inStock ? (isAdded ? 'Added ✓' : 'Add to cart') : 'Unavailable'}
        </button>
      </div>
    </article>
  )
}

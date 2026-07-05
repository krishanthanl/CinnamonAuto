import { Menu, ShoppingBag, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { vendor } from '@/config/vendor'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { setIsOpen, cartCount } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-kardone-dark shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-widest text-white sm:text-3xl hover:text-brand-500 transition-colors">
          {vendor.shopName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-display text-sm font-medium uppercase tracking-wider text-white/90 transition hover:text-brand-500"
          >
            Home
          </Link>
          <a
            href="/#catalog"
            className="font-display text-sm font-medium uppercase tracking-wider text-white/90 transition hover:text-brand-500"
          >
            Catalog
          </a>
          <Link
            to="/create-part"
            className="flex items-center gap-1.5 font-display text-sm font-medium uppercase tracking-wider text-brand-400 transition hover:text-brand-300"
          >
            <PlusCircle className="h-4 w-4" />
            Add Part
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/create-part"
            className="md:hidden flex items-center justify-center p-2 text-brand-400 hover:text-brand-300 transition-colors"
            aria-label="Add Part"
          >
            <PlusCircle className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Open cart"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 font-display text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
          <button
            type="button"
            className="rounded p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

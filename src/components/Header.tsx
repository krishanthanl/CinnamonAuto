import { Menu, ShoppingBag, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { vendor } from '@/config/vendor'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { setIsOpen, cartCount } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md shadow-lg shadow-cyan-950/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-widest text-white sm:text-3xl hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all">
          {vendor.shopName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-display text-sm font-medium uppercase tracking-wider text-slate-300 transition hover:text-cyan-400"
          >
            Home
          </Link>
          <a
            href="/#catalog"
            className="font-display text-sm font-medium uppercase tracking-wider text-slate-300 transition hover:text-cyan-400"
          >
            Catalog
          </a>
          <Link
            to="/create-part"
            className="flex items-center gap-1.5 font-display text-sm font-medium uppercase tracking-wider text-cyan-400 transition hover:text-cyan-300"
          >
            <PlusCircle className="h-4 w-4" />
            Add Part
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/create-part"
            className="md:hidden flex items-center justify-center p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            aria-label="Add Part"
          >
            <PlusCircle className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Open cart"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 hover:text-cyan-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 font-display text-[9px] font-bold text-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
          <button
            type="button"
            className="rounded p-2 text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

import { MapPin, Phone } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import { getPhoneUrl, vendor } from '@/config/vendor'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-kardone-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-wide">Main menu</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a href="#" className="transition hover:text-brand-500">
                Home
              </a>
            </li>
            <li>
              <a href="#catalog" className="transition hover:text-brand-500">
                Catalog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-wide">Catalog</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {CATEGORIES.slice(0, 5).map((category) => (
              <li key={category}>
                <a href="#catalog" className="transition hover:text-brand-500">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-wide">Our shop</h3>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span>{vendor.address}</span>
            </p>
            <a
              href={getPhoneUrl()}
              className="flex items-center gap-2 transition hover:text-brand-500"
            >
              <Phone className="h-4 w-4 shrink-0 text-brand-500" />
              {vendor.phone}
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold tracking-wide">About</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            We provide auto spare parts and our main goal is to satisfy all of our customers with
            reliable, professional-grade components.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        <p>
          &copy; {new Date().getFullYear()} {vendor.shopName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

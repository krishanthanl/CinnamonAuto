import { Mail, Phone } from 'lucide-react'
import { getPhoneUrl, vendor } from '@/config/vendor'

export default function TopBar() {
  return (
    <div className="hidden border-b border-white/10 bg-kardone-darker text-white sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <a
            href={getPhoneUrl()}
            className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" />
            {vendor.phone}
          </a>
          <a
            href={`mailto:${vendor.email}`}
            className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" />
            {vendor.email}
          </a>
        </div>
        <p className="text-white/60">Professional auto spare parts catalog</p>
      </div>
    </div>
  )
}

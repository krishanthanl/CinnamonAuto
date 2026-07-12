import { Mail, Phone } from 'lucide-react'
import { getPhoneUrl, vendor } from '@/config/vendor'

export default function TopBar() {
  return (
    <div className="hidden border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md text-slate-300 sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <a
            href={getPhoneUrl()}
            className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-cyan-400"
          >
            <Phone className="h-3.5 w-3.5" />
            {vendor.phone}
          </a>
          <a
            href={`mailto:${vendor.email}`}
            className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-cyan-400"
          >
            <Mail className="h-3.5 w-3.5" />
            {vendor.email}
          </a>
        </div>
        <p className="text-slate-500 tracking-wider font-display font-medium uppercase text-[10px]">Check out our range</p>
      </div>
    </div>
  )
}

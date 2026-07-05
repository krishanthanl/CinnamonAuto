import { MessageCircle, Phone } from 'lucide-react'
import { getPhoneUrl, getWhatsAppUrl, vendor } from '@/config/vendor'

export default function ContactBar() {
  const generalMessage = `Hi, I'd like to inquire about spare parts from ${vendor.shopName}.`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-brand-600 bg-kardone-dark">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Need help finding a part?
          </p>
          <p className="text-xs text-white/60">Contact us anytime</p>
        </div>

        <div className="flex gap-2">
          <a
            href={getWhatsAppUrl(generalMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 bg-[#25D366] px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1fb855] sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={getPhoneUrl()}
            className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-600 px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:flex-none"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        </div>
      </div>
    </div>
  )
}

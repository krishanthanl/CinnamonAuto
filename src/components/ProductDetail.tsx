import { useEffect, useState } from 'react'
import { MessageCircle, Phone, X, Plus, Minus } from 'lucide-react'
import {
  getPartInquiryMessage,
  getPhoneUrl,
  getWhatsAppUrl,
} from '@/config/vendor'
import type { Part } from '@/types/part'
import { useCart } from '@/context/CartContext'

type ProductDetailProps = {
  part: Part
  onClose: () => void
}

export default function ProductDetail({ part, onClose }: ProductDetailProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(part, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const inquiryMessage = getPartInquiryMessage(part.name, part.id)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close product details"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:max-w-4xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-kardone-muted">
              {part.id}
            </p>
            <h2 className="font-display text-lg font-semibold text-kardone-dark sm:text-xl">
              {part.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-kardone-dark"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="bg-neutral-100">
            <img
              src={part.image}
              alt={part.name}
              className="mx-auto max-h-[50vh] w-full object-contain"
            />
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-brand-600 px-3 py-1 font-display text-xs font-medium uppercase tracking-wider text-brand-600">
                {part.category}
              </span>
              {part.inStock && (
                <span className="bg-kardone-dark px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  Available now
                </span>
              )}
            </div>

            <p className="text-sm leading-7 text-kardone-muted sm:text-base">{part.description}</p>

            <div className="border border-neutral-200 bg-neutral-50 p-4">
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-kardone-dark">
                Interested in this part?
              </p>
              <p className="mt-1 text-sm text-kardone-muted">
                Add to your cart to inquire about multiple parts together, or contact us directly.
              </p>

              {part.inStock && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row border-b border-neutral-200 pb-4 mb-4">
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <span className="text-xs font-semibold uppercase text-kardone-dark">Quantity:</span>
                    <div className="flex items-center border border-neutral-300 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1 px-2.5 text-neutral-500 hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center font-display text-sm font-bold text-kardone-dark">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-1 px-2.5 text-neutral-500 hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`inline-flex flex-1 items-center justify-center gap-2 py-3 font-display text-xs font-semibold uppercase tracking-wider text-white transition ${
                      isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'
                    }`}
                  >
                    {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={getWhatsAppUrl(inquiryMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-[#25D366] px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1fb855]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={getPhoneUrl()}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-brand-600 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-700"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

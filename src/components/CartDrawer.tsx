import { useEffect, useRef } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Mail } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { vendor } from '@/config/vendor'

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  } = useCart()

  const drawerRef = useRef<HTMLDivElement>(null)

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const inquiryMessage = (() => {
    let msg = "Hi, I am interested in the following spare parts from your shop:\n\n"
    cartItems.forEach((item) => {
      msg += `- ${item.quantity}x ${item.part.name} (ID: ${item.part.id})\n`
    })
    msg += "\nPlease let me know the pricing, availability, and compatibility."
    return msg
  })()

  const whatsappUrl = `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(inquiryMessage)}`
  const emailUrl = `mailto:${vendor.email}?subject=Spare%20Parts%20Inquiry&body=${encodeURIComponent(inquiryMessage)}`

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
        aria-label="Close cart drawer backdrop"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-kardone-dark">
              Shopping Cart
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 font-display text-xs font-bold text-white">
              {cartCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-kardone-dark transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-neutral-100 p-6 text-neutral-400 mb-4 animate-pulse">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <h3 className="font-display text-lg font-medium text-kardone-dark">
                Your cart is empty
              </h3>
              <p className="mt-2 text-sm text-kardone-muted max-w-[250px]">
                Add spare parts from our catalog to request a quote.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-6 bg-brand-600 px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-700 transition duration-200 active:scale-95"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-kardone-muted">
                  Items in your list
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-brand-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.part.id}
                  className="flex gap-4 border border-neutral-200 p-3 bg-white transition hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img
                      src={item.part.image}
                      alt={item.part.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-1 font-display text-sm font-semibold uppercase text-kardone-dark leading-tight">
                        {item.part.name}
                      </h4>
                      <p className="text-[11px] text-kardone-muted mt-0.5">
                        ID: {item.part.id}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                          className="p-1 px-2 text-neutral-500 hover:bg-neutral-100 hover:text-kardone-dark"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-kardone-dark">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                          className="p-1 px-2 text-neutral-500 hover:bg-neutral-100 hover:text-kardone-dark"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.part.id)}
                        className="text-neutral-400 hover:text-brand-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Inquiry Actions */}
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-6 space-y-3">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-kardone-dark">
                Send Bulk Inquiry
              </p>
              <p className="text-xs text-kardone-muted mt-1 leading-normal">
                Receive customized pricing and compatibility verification for all parts in your list.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] py-3 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1fb855] shadow-sm hover:shadow active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4" />
                Inquire via WhatsApp
              </a>

              <a
                href={emailUrl}
                className="inline-flex w-full items-center justify-center gap-2 bg-brand-600 py-3 font-display text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-brand-700 shadow-sm hover:shadow active:scale-[0.99]"
              >
                <Mail className="h-4 w-4" />
                Inquire via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

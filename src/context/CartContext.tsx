import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Part } from '@/types/part'

export interface CartItem {
  part: Part
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  addToCart: (part: Part, quantity?: number) => void
  removeFromCart: (partId: string) => void
  updateQuantity: (partId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinnamon_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cinnamon_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (part: Part, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.part.id === part.id)
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { part, quantity }]
    })
  }

  const removeFromCart = (partId: string) => {
    setCartItems((prev) => prev.filter((item) => item.part.id !== partId))
  }

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.part.id === partId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

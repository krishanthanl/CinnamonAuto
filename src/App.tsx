import { Routes, Route } from 'react-router-dom'
import CatalogPage from '@/pages/CatalogPage'
import CreatePartPage from '@/pages/CreatePartPage'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/part/:id" element={<CatalogPage />} />
        <Route path="/create-part" element={<CreatePartPage />} />
      </Routes>
      <CartDrawer />
    </CartProvider>
  )
}

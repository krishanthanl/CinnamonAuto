import { Routes, Route } from 'react-router-dom'
import CatalogPage from '@/pages/CatalogPage'
import CreatePartPage from '@/pages/CreatePartPage'
import CategoryManagementPage from '@/pages/CategoryManagementPage'
import ProductListPage from '@/pages/ProductListPage'
import VehicleMasterPage from '@/pages/VehicleMasterPage'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import ApiLoadingIndicator from '@/components/ApiLoadingIndicator'

export default function App() {
  return (
    <CartProvider>
      <ApiLoadingIndicator />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/part/:id" element={<CatalogPage />} />
        <Route path="/create-part" element={<CreatePartPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/vehicle-masters" element={<VehicleMasterPage />} />
      </Routes>
      <CartDrawer />
    </CartProvider>
  )
}

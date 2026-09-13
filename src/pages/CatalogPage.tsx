import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CategoryFilter from '@/components/CategoryFilter'
import ContactBar from '@/components/ContactBar'
import EmptyState from '@/components/EmptyState'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SearchBar from '@/components/SearchBar'
import ProductDetail from '@/components/ProductDetail'
import ProductGrid from '@/components/ProductGrid'
import TopBar from '@/components/TopBar'
import WelcomeSection from '@/components/WelcomeSection'
import { usePartsFilter } from '@/hooks/usePartsFilter'
import type { Category, Part } from '@/types/part'
import { apiFetch, resolveMediaUrl } from '@/config/api'

type ApiProduct = {
  id: number
  name: string
  categoryName: string | null
  imageSrc: string | null
  description: string
  inStock: boolean
  sellingPrice: number
  brandName: string | null
  vehicleModelName: string | null
  vehicleModelYear: number | null
}

export default function CatalogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)

  useEffect(() => {
    apiFetch('/api/products')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load products from the server.')
        return response.json() as Promise<ApiProduct[]>
      })
      .then((products) => setParts(products.map((product) => ({
        id: String(product.id),
        name: product.name,
        category: product.categoryName ?? '',
        image: resolveMediaUrl(product.imageSrc),
        description: product.description,
        inStock: product.inStock,
        sellingPrice: product.sellingPrice,
        brand: product.brandName ?? '',
        vehicleModel: product.vehicleModelName
          ? `${product.vehicleModelName}${product.vehicleModelYear ? ` — ${product.vehicleModelYear}` : ''}`
          : '',
      }))))
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : 'Unable to load products.'))
      .finally(() => setLoading(false))
  }, [])

  const { search, setSearch, category, setCategory, filteredParts, totalCount, filteredCount } =
    usePartsFilter({ parts })

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {}

    for (const part of parts) {
      counts[part.category] = (counts[part.category] ?? 0) + 1
    }

    return {
      All: parts.length,
      ...counts,
    } as Record<Category | 'All', number>
  }, [parts])

  const categories = useMemo(() => Object.keys(categoryCounts).filter((item) => item !== 'All').sort(), [categoryCounts])

  useEffect(() => {
    if (!id) {
      setSelectedPart(null)
      return
    }

    const part = parts.find((item) => item.id === id) ?? null
    setSelectedPart(part)
  }, [id])

  const handleSelectPart = (part: Part) => {
    setSelectedPart(part)
    navigate(`/part/${part.id}`)
  }

  const handleCloseDetail = () => {
    setSelectedPart(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-24">
      <TopBar />
      <Header />
      <Hero totalCount={totalCount} filteredCount={filteredCount} />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <WelcomeSection />

        <SearchBar search={search} onSearchChange={setSearch} />

        <section id="catalog" className="scroll-mt-24 space-y-6">
          <div className="border-b border-slate-800 pb-4 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Browse our professional spare parts catalog
            </p>
          </div>

          <CategoryFilter
            selected={category}
            onChange={setCategory}
            counts={categoryCounts}
            categories={categories}
          />

          {loading ? (
            <p className="py-16 text-center text-slate-400">Loading products…</p>
          ) : loadError ? (
            <p className="border border-red-500/40 bg-red-950/40 p-4 text-red-200">{loadError}</p>
          ) : filteredParts.length > 0 ? (
            <ProductGrid parts={filteredParts} onSelect={handleSelectPart} />
          ) : (
            <EmptyState search={search} />
          )}
        </section>
      </main>

      <Footer />
      <ContactBar />

      {selectedPart && <ProductDetail part={selectedPart} onClose={handleCloseDetail} />}
    </div>
  )
}

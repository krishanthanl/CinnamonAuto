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
import partsData from '@/data/parts.json'
import { CATEGORIES } from '@/data/categories'
import { usePartsFilter } from '@/hooks/usePartsFilter'
import type { Category, Part } from '@/types/part'

const parts = partsData as Part[]

export default function CatalogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)

  const { search, setSearch, category, setCategory, filteredParts, totalCount, filteredCount } =
    usePartsFilter({ parts })

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(CATEGORIES.map((cat) => [cat, 0])) as Record<
      Category,
      number
    >

    for (const part of parts) {
      counts[part.category] += 1
    }

    return {
      All: parts.length,
      ...counts,
    } as Record<Category | 'All', number>
  }, [])

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
          <div className="border-b border-neutral-200 pb-4 text-center sm:text-left">
            <h2 className="font-display text-2xl font-semibold text-kardone-dark sm:text-3xl">
              Featured products
            </h2>
            <p className="mt-2 text-sm text-kardone-muted">
              Browse our professional spare parts catalog
            </p>
          </div>

          <CategoryFilter
            selected={category}
            onChange={setCategory}
            counts={categoryCounts}
          />

          {filteredParts.length > 0 ? (
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

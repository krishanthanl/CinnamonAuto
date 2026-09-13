import { useEffect, useState } from 'react'
import { AlertCircle, Boxes, CheckCircle2, PackageSearch, Pencil, Save, Search, SlidersHorizontal, Trash2, X } from 'lucide-react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactBar from '@/components/ContactBar'
import { formatPrice } from '@/utils/currency'
import { apiFetch, resolveMediaUrl } from '@/config/api'

type Category = {
  id: number
  name: string
}
type Brand = { id: number; name: string }
type VehicleModel = { id: number; name: string; year: number; brandId: number }

type Product = {
  id: number
  name: string
  categoryId: number
  categoryName: string | null
  brandId: number | null
  brandName: string | null
  vehicleModelId: number | null
  vehicleModelName: string | null
  vehicleModelYear: number | null
  imageSrc: string | null
  description: string
  reorderLevel: number
  reorderAmount: number
  currentQuantity: number
  costPrice: number
  sellingPrice: number
  inStock: boolean
}

type ProductEdit = Pick<Product, 'id' | 'name' | 'categoryId' | 'brandId' | 'vehicleModelId' | 'description' | 'reorderLevel' | 'reorderAmount' | 'currentQuantity' | 'costPrice' | 'sellingPrice' | 'imageSrc'> & {
  imageBase64?: string
  imageExtension?: string
}

async function apiError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string; title?: string }
    return body.error || body.title || 'Unable to load products.'
  } catch {
    return 'Unable to load products.'
  }
}

export default function ProductListPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ProductEdit | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    apiFetch('/api/categories')
      .then(async (response) => {
        if (!response.ok) throw new Error(await apiError(response))
        return response.json() as Promise<Category[]>
      })
      .then(setCategories)
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load categories.')
      })
  }, [])

  useEffect(() => {
    Promise.all([
      apiFetch('/api/brands').then((response) => response.json() as Promise<Brand[]>),
      apiFetch('/api/vehicle-models').then((response) => response.json() as Promise<VehicleModel[]>),
    ]).then(([brandData, modelData]) => {
      setBrands(brandData)
      setVehicleModels(modelData)
    }).catch(() => setError('Unable to load vehicle brands and models.'))
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError(null)
      const parameters = new URLSearchParams()
      if (search.trim()) parameters.set('search', search.trim())
      if (categoryId !== '') parameters.set('categoryId', String(categoryId))

      try {
        const query = parameters.toString()
        const response = await apiFetch(`/api/products${query ? `?${query}` : ''}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(await apiError(response))
        setProducts((await response.json()) as Product[])
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load products.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [categoryId, search])

  const startEdit = (product: Product) => {
    setEditing({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      brandId: product.brandId,
      vehicleModelId: product.vehicleModelId,
      description: product.description,
      reorderLevel: product.reorderLevel,
      reorderAmount: product.reorderAmount,
      currentQuantity: product.currentQuantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      imageSrc: product.imageSrc,
    })
    setError(null)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateEdit = <K extends keyof ProductEdit>(field: K, value: ProductEdit[K]) => {
    setEditing((current) => current ? { ...current, [field]: value } : current)
  }

  const saveEdit = async () => {
    if (!editing) return
    if (!editing.name.trim() || !editing.description.trim()) {
      setError('Product name and description are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const response = await apiFetch(`/api/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, name: editing.name.trim(), description: editing.description.trim() }),
      })
      if (!response.ok) throw new Error(await apiError(response))
      const updated = (await response.json()) as Product
      setProducts((current) => current.map((product) => product.id === updated.id ? updated : product))
      setEditing(null)
      setMessage('Product updated successfully.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update product.')
    } finally {
      setSaving(false)
    }
  }

  const selectEditImage = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Product image must be smaller than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageBase64 = reader.result as string
      setEditing((current) => current ? {
        ...current,
        imageSrc: imageBase64,
        imageBase64,
        imageExtension: file.name.split('.').pop()?.toLowerCase() || 'jpeg',
      } : current)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete “${product.name}”? It will be hidden but retained in the database.`)) return
    setDeletingId(product.id)
    setError(null)
    setMessage(null)
    try {
      const response = await apiFetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(await apiError(response))
      setProducts((current) => current.filter((item) => item.id !== product.id))
      if (editing?.id === product.id) setEditing(null)
      setMessage('Product deleted successfully.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass = 'mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500'

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <TopBar />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Inventory browser</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-white">Product List</h1>
            <p className="mt-2 text-sm text-slate-400">Search the live database inventory by product details or category.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Boxes className="h-5 w-5 text-cyan-400" />
            <span><strong className="text-white">{products.length}</strong> products found</span>
          </div>
        </div>

        <section className="mb-8 grid gap-4 border border-slate-800 bg-slate-900/70 p-5 shadow-xl md:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <div>
            <label htmlFor="product-search" className="font-display text-xs font-bold uppercase tracking-wider text-slate-300">Search products</label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input id="product-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500" placeholder="Name, description, or category…" />
            </div>
          </div>
          <div>
            <label htmlFor="product-category" className="font-display text-xs font-bold uppercase tracking-wider text-slate-300">Category</label>
            <div className="relative mt-2">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <select id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value === '' ? '' : Number(event.target.value))} className="w-full appearance-none border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-500">
                <option value="">All categories</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 flex gap-3 border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-6 flex gap-3 border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-200">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {editing && (
          <section className="mb-8 border border-cyan-500/40 bg-slate-900 p-6 shadow-xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Editing product #{editing.id}</p>
                <h2 className="mt-1 font-display text-xl font-bold text-white">Product Details</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="p-2 text-slate-400 hover:text-white" aria-label="Cancel editing"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="aspect-[4/3] overflow-hidden border border-slate-700 bg-slate-950">
                  {editing.imageSrc ? <img src={editing.imageSrc.startsWith('data:') ? editing.imageSrc : resolveMediaUrl(editing.imageSrc)} alt="Product preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><PackageSearch className="h-10 w-10 text-slate-700" /></div>}
                </div>
                <label className="cursor-pointer border border-dashed border-slate-600 p-5 text-center transition hover:border-cyan-500 hover:bg-slate-800/60">
                  <span className="block text-sm font-bold text-white">Change product image</span>
                  <span className="mt-1 block text-xs text-slate-500">JPEG, PNG or WEBP, maximum 5MB</span>
                  <input type="file" accept="image/*" onChange={(event) => selectEditImage(event.target.files?.[0])} className="hidden" />
                </label>
              </div>
              <label className="text-xs font-bold uppercase text-slate-400">Name<input value={editing.name} onChange={(event) => updateEdit('name', event.target.value)} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Category<select value={editing.categoryId} onChange={(event) => updateEdit('categoryId', Number(event.target.value))} className={inputClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label className="text-xs font-bold uppercase text-slate-400">Brand<select value={editing.brandId ?? ''} onChange={(event) => { updateEdit('brandId', event.target.value === '' ? null : Number(event.target.value)); updateEdit('vehicleModelId', null) }} className={inputClass}><option value="">No brand</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
              <label className="text-xs font-bold uppercase text-slate-400">Vehicle Model<select value={editing.vehicleModelId ?? ''} disabled={editing.brandId === null} onChange={(event) => updateEdit('vehicleModelId', event.target.value === '' ? null : Number(event.target.value))} className={inputClass}><option value="">No model</option>{vehicleModels.filter((model) => model.brandId === editing.brandId).map((model) => <option key={model.id} value={model.id}>{model.name} — {model.year}</option>)}</select></label>
              <label className="text-xs font-bold uppercase text-slate-400 md:col-span-2">Description<textarea rows={3} value={editing.description} onChange={(event) => updateEdit('description', event.target.value)} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Available Quantity<input type="number" min={0} value={editing.currentQuantity} onChange={(event) => updateEdit('currentQuantity', Number(event.target.value))} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Reorder Level<input type="number" min={0} value={editing.reorderLevel} onChange={(event) => updateEdit('reorderLevel', Number(event.target.value))} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Reorder Amount<input type="number" min={0} value={editing.reorderAmount} onChange={(event) => updateEdit('reorderAmount', Number(event.target.value))} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Cost Price (NZD)<input type="number" min={0} step="0.01" value={editing.costPrice} onChange={(event) => updateEdit('costPrice', Number(event.target.value))} className={inputClass} /></label>
              <label className="text-xs font-bold uppercase text-slate-400">Selling Price (NZD)<input type="number" min={0} step="0.01" value={editing.sellingPrice} onChange={(event) => updateEdit('sellingPrice', Number(event.target.value))} className={inputClass} /></label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="border border-slate-700 px-5 py-2.5 text-xs font-bold uppercase text-slate-300 hover:bg-slate-800">Cancel</button>
              <button type="button" onClick={() => void saveEdit()} disabled={saving} className="flex items-center gap-2 bg-cyan-500 px-5 py-2.5 text-xs font-bold uppercase text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Product'}</button>
            </div>
          </section>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400">Searching products…</div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-slate-700 py-20 text-center">
            <PackageSearch className="mx-auto h-12 w-12 text-slate-600" />
            <h2 className="mt-4 font-display text-lg font-bold text-white">No products found</h2>
            <p className="mt-2 text-sm text-slate-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg transition hover:-translate-y-1 hover:border-cyan-500/40">
                <div className="relative aspect-[4/3] bg-slate-950">
                  {product.imageSrc ? (
                    <img src={resolveMediaUrl(product.imageSrc)} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><PackageSearch className="h-12 w-12 text-slate-700" /></div>
                  )}
                  <span className={`absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.inStock ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                  <div className="absolute right-3 top-3 flex gap-2">
                    <button type="button" onClick={() => startEdit(product)} className="bg-slate-950/90 p-2 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950" aria-label={`Edit ${product.name}`}><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => void deleteProduct(product)} disabled={deletingId === product.id} className="bg-slate-950/90 p-2 text-red-300 hover:bg-red-500 hover:text-white disabled:opacity-50" aria-label={`Delete ${product.name}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">{product.categoryName ?? 'Uncategorized'}</p>
                  <h2 className="mt-2 line-clamp-2 font-display text-sm font-bold text-white">{product.name}</h2>
                  <div className="mt-2 min-h-10 text-xs text-slate-500">
                    <p>Brand: <span className="text-slate-300">{product.brandName ?? ''}</span></p>
                    <p>Model: <span className="text-slate-300">{product.vehicleModelName ? `${product.vehicleModelName}${product.vehicleModelYear ? ` — ${product.vehicleModelYear}` : ''}` : ''}</span></p>
                  </div>
                  <p className="mt-3 line-clamp-3 min-h-15 text-xs leading-5 text-slate-400">{product.description}</p>
                  <p className="mt-4 font-display text-lg font-bold text-cyan-400">{formatPrice(product.sellingPrice)}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800 pt-4 text-center">
                    <div><strong className="block text-sm text-white">{product.currentQuantity}</strong><span className="text-[10px] uppercase text-slate-500">Quantity</span></div>
                    <div><strong className="block text-sm text-white">{product.reorderLevel}</strong><span className="text-[10px] uppercase text-slate-500">Reorder at</span></div>
                    <div><strong className="block text-sm text-white">{product.reorderAmount}</strong><span className="text-[10px] uppercase text-slate-500">Order qty</span></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ContactBar />
    </div>
  )
}

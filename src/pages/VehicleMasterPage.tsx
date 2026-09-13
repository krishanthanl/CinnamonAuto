import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, CarFront, CheckCircle2, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactBar from '@/components/ContactBar'
import { apiFetch } from '@/config/api'

type Brand = { id: number; name: string }
type VehicleModel = { id: number; name: string; year: number; brandId: number; brandName: string }
type ModelForm = { name: string; year: number; brandId: number | '' }

async function getError(response: Response) {
  try { const body = (await response.json()) as { error?: string; title?: string }; return body.error || body.title || 'The operation failed.' }
  catch { return 'The operation failed.' }
}

export default function VehicleMasterPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [brandSearch, setBrandSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  const [modelBrandFilter, setModelBrandFilter] = useState<number | ''>('')
  const [brandName, setBrandName] = useState('')
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null)
  const [modelForm, setModelForm] = useState<ModelForm>({ name: '', year: new Date().getFullYear(), brandId: '' })
  const [editingModelId, setEditingModelId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadBrands = useCallback(async () => {
    const query = brandSearch.trim() ? `?search=${encodeURIComponent(brandSearch.trim())}` : ''
    const response = await apiFetch(`/api/brands${query}`)
    if (!response.ok) throw new Error(await getError(response))
    setBrands((await response.json()) as Brand[])
  }, [brandSearch])

  const loadModels = useCallback(async () => {
    const params = new URLSearchParams()
    if (modelSearch.trim()) params.set('search', modelSearch.trim())
    if (modelBrandFilter !== '') params.set('brandId', String(modelBrandFilter))
    const response = await apiFetch(`/api/vehicle-models${params.size ? `?${params}` : ''}`)
    if (!response.ok) throw new Error(await getError(response))
    setModels((await response.json()) as VehicleModel[])
  }, [modelBrandFilter, modelSearch])

  useEffect(() => { const timer = setTimeout(() => void loadBrands().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load brands.')), 250); return () => clearTimeout(timer) }, [loadBrands])
  useEffect(() => { const timer = setTimeout(() => void loadModels().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load models.')), 250); return () => clearTimeout(timer) }, [loadModels])

  const saveBrand = async () => {
    if (!brandName.trim()) { setError('Brand name is required.'); return }
    setBusy(true); setError(null); setMessage(null)
    try {
      const response = await apiFetch(editingBrandId ? `/api/brands/${editingBrandId}` : '/api/brands', { method: editingBrandId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: brandName.trim() }) })
      if (!response.ok) throw new Error(await getError(response))
      setBrandName(''); setEditingBrandId(null); setMessage(editingBrandId ? 'Brand updated.' : 'Brand created.'); await loadBrands(); await loadModels()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save brand.') } finally { setBusy(false) }
  }

  const saveModel = async () => {
    if (!modelForm.name.trim() || modelForm.brandId === '') { setError('Model name and brand are required.'); return }
    setBusy(true); setError(null); setMessage(null)
    try {
      const response = await apiFetch(editingModelId ? `/api/vehicle-models/${editingModelId}` : '/api/vehicle-models', { method: editingModelId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...modelForm, name: modelForm.name.trim() }) })
      if (!response.ok) throw new Error(await getError(response))
      setModelForm({ name: '', year: new Date().getFullYear(), brandId: '' }); setEditingModelId(null); setMessage(editingModelId ? 'Model updated.' : 'Model created.'); await loadModels()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save model.') } finally { setBusy(false) }
  }

  const remove = async (kind: 'brand' | 'model', id: number, name: string) => {
    if (!confirm(`Delete “${name}”? It will be hidden but retained in the database.`)) return
    setBusy(true); setError(null); setMessage(null)
    try {
      const response = await apiFetch(kind === 'brand' ? `/api/brands/${id}` : `/api/vehicle-models/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(await getError(response))
      setMessage(`${kind === 'brand' ? 'Brand' : 'Model'} deleted.`); await loadBrands(); await loadModels()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to delete item.') } finally { setBusy(false) }
  }

  const input = 'w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500'

  return <div className="min-h-screen bg-slate-950 pb-24"><TopBar /><Header />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-cyan-400">Master data</p><h1 className="mt-2 font-display text-3xl font-extrabold text-white">Brands & Vehicle Models</h1><p className="mt-2 text-sm text-slate-400">Manage vehicle manufacturers and year-specific models.</p></div>
      {error && <div className="mb-5 flex gap-3 border border-red-500/40 bg-red-950/40 p-4 text-red-200"><AlertCircle className="h-5 w-5" />{error}</div>}
      {message && <div className="mb-5 flex gap-3 border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-200"><CheckCircle2 className="h-5 w-5" />{message}</div>}
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center gap-3"><CarFront className="text-cyan-400" /><h2 className="font-display text-xl font-bold text-white">Brands</h2></div>
          <div className="mb-4 flex gap-2"><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className={input} placeholder="e.g. Toyota" /><button disabled={busy} onClick={() => void saveBrand()} className="flex items-center gap-2 bg-cyan-500 px-4 text-xs font-bold uppercase text-slate-950">{editingBrandId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingBrandId ? 'Save' : 'Add'}</button>{editingBrandId && <button onClick={() => { setEditingBrandId(null); setBrandName('') }} className="p-2 text-slate-400"><X /></button>}</div>
          <div className="relative mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} className={`${input} pl-10`} placeholder="Search brands" /></div>
          <div className="divide-y divide-slate-800">{brands.map((brand) => <div key={brand.id} className="flex items-center justify-between py-3"><span className="font-semibold text-white">{brand.name}</span><div className="flex gap-1"><button onClick={() => { setEditingBrandId(brand.id); setBrandName(brand.name) }} className="p-2 text-cyan-300"><Pencil className="h-4 w-4" /></button><button disabled={busy} onClick={() => void remove('brand', brand.id, brand.name)} className="p-2 text-red-300"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
        </section>
        <section className="border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-5 flex items-center gap-3"><CarFront className="text-cyan-400" /><h2 className="font-display text-xl font-bold text-white">Models</h2></div>
          <div className="mb-4 grid gap-2 sm:grid-cols-3"><input value={modelForm.name} onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })} className={input} placeholder="e.g. C-HR" /><input type="number" min={1886} max={new Date().getFullYear() + 2} value={modelForm.year} onChange={(e) => setModelForm({ ...modelForm, year: Number(e.target.value) })} className={input} /><select value={modelForm.brandId} onChange={(e) => setModelForm({ ...modelForm, brandId: e.target.value === '' ? '' : Number(e.target.value) })} className={input}><option value="">Select brand</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div className="mb-5 flex gap-2"><button disabled={busy} onClick={() => void saveModel()} className="flex items-center gap-2 bg-cyan-500 px-5 py-2.5 text-xs font-bold uppercase text-slate-950">{editingModelId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingModelId ? 'Save model' : 'Add model'}</button>{editingModelId && <button onClick={() => { setEditingModelId(null); setModelForm({ name: '', year: new Date().getFullYear(), brandId: '' }) }} className="p-2 text-slate-400"><X /></button>}</div>
          <div className="mb-4 grid gap-2 sm:grid-cols-2"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} className={`${input} pl-10`} placeholder="Search model, brand, or year" /></div><select value={modelBrandFilter} onChange={(e) => setModelBrandFilter(e.target.value === '' ? '' : Number(e.target.value))} className={input}><option value="">All brands</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          <div className="divide-y divide-slate-800">{models.map((model) => <div key={model.id} className="flex items-center justify-between py-3"><div><span className="font-semibold text-white">{model.name} — {model.year}</span><p className="text-xs text-cyan-400">{model.brandName}</p></div><div className="flex gap-1"><button onClick={() => { setEditingModelId(model.id); setModelForm({ name: model.name, year: model.year, brandId: model.brandId }) }} className="p-2 text-cyan-300"><Pencil className="h-4 w-4" /></button><button disabled={busy} onClick={() => void remove('model', model.id, `${model.brandName} ${model.name} ${model.year}`)} className="p-2 text-red-300"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
        </section>
      </div>
    </main><Footer /><ContactBar /></div>
}

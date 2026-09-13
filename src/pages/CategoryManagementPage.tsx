import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, FolderTree, Pencil, Plus, Trash2, X } from 'lucide-react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactBar from '@/components/ContactBar'
import { apiFetch, resolveMediaUrl } from '@/config/api'

type Category = {
  id: number
  name: string
  parentId: number | null
  imageSrc: string | null
}

type CategoryForm = {
  name: string
  parentId: number | ''
  imageSrc: string
}

const emptyForm: CategoryForm = { name: '', parentId: '', imageSrc: '' }

async function getApiError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string; title?: string }
    return body.error || body.title || 'The category operation failed.'
  } catch {
    return 'The category operation failed.'
  }
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/categories')
      if (!response.ok) throw new Error(await getApiError(response))
      setCategories((await response.json()) as Category[])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const beginEdit = (category: Category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      parentId: category.parentId ?? '',
      imageSrc: category.imageSrc ?? '',
    })
    setError(null)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Category name is required.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const response = await apiFetch(
        editingId === null ? '/api/categories' : `/api/categories/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            parentId: form.parentId === '' ? null : form.parentId,
            imageSrc: form.imageSrc.trim() || null,
          }),
        },
      )

      if (!response.ok) throw new Error(await getApiError(response))
      setMessage(editingId === null ? 'Category created successfully.' : 'Category updated successfully.')
      resetForm()
      await loadCategories()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete “${category.name}”? It will be hidden but retained in the database.`)) return

    setDeletingId(category.id)
    setError(null)
    setMessage(null)
    try {
      const response = await apiFetch(`/api/categories/${category.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(await getApiError(response))
      if (editingId === category.id) resetForm()
      setMessage('Category deleted successfully.')
      await loadCategories()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete category.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-950">
      <TopBar />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Catalog administration</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white">Manage Categories</h1>
          <p className="mt-2 text-sm text-slate-400">Create, organize, rename, and safely remove product categories.</p>
        </div>

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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="border border-slate-800 bg-slate-900/70 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-white">Existing Categories</h2>
                <p className="mt-1 text-xs text-slate-500">{categories.length} active categories</p>
              </div>
              <FolderTree className="h-6 w-6 text-cyan-400" />
            </div>

            {loading ? (
              <p className="p-8 text-center text-slate-400">Loading categories…</p>
            ) : categories.length === 0 ? (
              <p className="p-8 text-center text-slate-400">No categories yet. Create the first one using the form.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-800/50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-slate-700 bg-slate-950">
                      {category.imageSrc ? (
                        <img src={resolveMediaUrl(category.imageSrc)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FolderTree className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-white">{category.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.parentId ? `Parent: ${categoryNames.get(category.parentId) ?? 'Unavailable'}` : 'Top-level category'}
                      </p>
                    </div>
                    <button type="button" onClick={() => beginEdit(category)} className="p-2 text-slate-400 transition hover:bg-cyan-950 hover:text-cyan-300" aria-label={`Edit ${category.name}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => void handleDelete(category)} disabled={deletingId === category.id} className="p-2 text-slate-400 transition hover:bg-red-950 hover:text-red-300 disabled:opacity-50" aria-label={`Delete ${category.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="h-fit border border-slate-800 bg-slate-900/70 p-6 shadow-xl lg:sticky lg:top-28">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white">{editingId === null ? 'New Category' : 'Edit Category'}</h2>
                <p className="mt-1 text-xs text-slate-500">Fields marked with * are required.</p>
              </div>
              {editingId !== null && (
                <button type="button" onClick={resetForm} className="p-2 text-slate-400 hover:text-white" aria-label="Cancel editing"><X className="h-5 w-5" /></button>
              )}
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
              <div>
                <label htmlFor="category-name" className="font-display text-xs font-bold uppercase tracking-wider text-slate-300">Name *</label>
                <input id="category-name" required maxLength={200} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500" placeholder="e.g. Brake Parts" />
              </div>
              <div>
                <label htmlFor="category-parent" className="font-display text-xs font-bold uppercase tracking-wider text-slate-300">Parent category</label>
                <select id="category-parent" value={form.parentId} onChange={(event) => setForm({ ...form, parentId: event.target.value === '' ? '' : Number(event.target.value) })} className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500">
                  <option value="">None (top level)</option>
                  {categories.filter((category) => category.id !== editingId).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="category-image" className="font-display text-xs font-bold uppercase tracking-wider text-slate-300">Image URL</label>
                <input id="category-image" type="text" maxLength={500} value={form.imageSrc} onChange={(event) => setForm({ ...form, imageSrc: event.target.value })} className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500" placeholder="https://example.com/category.jpg or /parts/image.jpg" />
              </div>
              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 bg-cyan-500 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-600">
                {editingId === null ? <Plus className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {saving ? 'Saving…' : editingId === null ? 'Create Category' : 'Save Changes'}
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
      <ContactBar />
    </div>
  )
}

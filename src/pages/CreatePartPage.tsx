import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Upload, CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactBar from '@/components/ContactBar'
import { CATEGORIES } from '@/types/part'

export default function CreatePartPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState<string>('Headlights')
  const [description, setDescription] = useState('')
  const [inStock, setInStock] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageExtension, setImageExtension] = useState<string>('jpeg')

  // UI status states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [createdPartId, setCreatedPartId] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.')
      return
    }

    setError(null)
    const extension = file.name.split('.').pop() || 'jpeg'
    setImageExtension(extension.toLowerCase())

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
      setImageBase64(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    setError(null)
    const extension = file.name.split('.').pop() || 'jpeg'
    setImageExtension(extension.toLowerCase())

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImagePreview(base64String)
      setImageBase64(base64String)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageBase64(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Product Name is required.')
      return
    }

    if (!description.trim()) {
      setError('Product Description is required.')
      return
    }

    if (!imageBase64) {
      setError('Product Image is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          inStock,
          imageBase64,
          imageExtension,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        setCreatedPartId(data.part.id)
        // Reset form
        setName('')
        setDescription('')
        setInStock(true)
        setImagePreview(null)
        setImageBase64(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(data.error || 'Failed to save part.')
      }
    } catch (err: any) {
      setError('An error occurred while connecting to the server. Please ensure Vite is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pb-24 bg-neutral-100">
      <TopBar />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-kardone-muted hover:text-brand-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-kardone-dark">
              Add New Part
            </h1>
            <p className="mt-1 text-sm text-kardone-muted">
              Publish a new component into the catalog system.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-8 border-l-4 border-emerald-500 bg-emerald-50 p-4 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-emerald-800">
                  Part Successfully Created!
                </h3>
                <p className="mt-1 text-sm text-emerald-700">
                  The part was generated with ID <span className="font-mono font-bold">{createdPartId}</span> and saved directly to the database.
                </p>
                <div className="mt-3 flex gap-4">
                  <Link
                    to={`/part/${createdPartId}`}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-900 hover:text-emerald-950 underline"
                  >
                    View Part Details
                  </Link>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-900 hover:text-emerald-950 underline"
                  >
                    Create Another Part
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-8 border-l-4 border-brand-600 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-800">
                  Validation Error
                </h3>
                <p className="mt-1 text-sm text-brand-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-md border border-neutral-200">
              <h2 className="font-display text-xl font-bold text-kardone-dark border-b border-neutral-100 pb-3">
                Part Information
              </h2>

              {/* Name */}
              <div>
                <label htmlFor="part-name" className="block font-display text-xs font-bold uppercase tracking-wider text-kardone-dark">
                  Product Name *
                </label>
                <input
                  id="part-name"
                  type="text"
                  required
                  placeholder="e.g. LED Smoked Projector Headlight Set"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="part-category" className="block font-display text-xs font-bold uppercase tracking-wider text-kardone-dark">
                  Category *
                </label>
                <select
                  id="part-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="part-description" className="block font-display text-xs font-bold uppercase tracking-wider text-kardone-dark">
                  Description *
                </label>
                <textarea
                  id="part-description"
                  required
                  rows={4}
                  placeholder="Provide detailed information, specifications, vehicle compatibility..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>

              {/* In Stock */}
              <div className="flex items-center gap-3">
                <input
                  id="part-instock"
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4 border-neutral-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="part-instock" className="font-display text-xs font-bold uppercase tracking-wider text-kardone-dark cursor-pointer select-none">
                  Available in Stock
                </label>
              </div>

              {/* Image Upload Zone */}
              <div>
                <label className="block font-display text-xs font-bold uppercase tracking-wider text-kardone-dark mb-1.5">
                  Product Image *
                </label>

                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center hover:border-brand-500 hover:bg-neutral-100/50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-neutral-400 mb-3" />
                    <p className="text-sm font-semibold text-neutral-700">
                      Drag and drop your image here, or <span className="text-brand-500 underline">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      JPEG, PNG or WEBP up to 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative border border-neutral-200 p-2 bg-neutral-50">
                    <img
                      src={imagePreview}
                      alt="Uploaded part preview"
                      className="max-h-64 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-kardone-dark text-white shadow-md hover:bg-brand-600 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mt-2 text-center text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                      Selected File Type: {imageExtension.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Submission Button */}
              <div className="border-t border-neutral-100 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-brand-600 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:bg-neutral-400 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving Part...
                    </>
                  ) : (
                    'Publish Part'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 shadow-md border border-neutral-200">
              <h2 className="font-display text-xl font-bold text-kardone-dark border-b border-neutral-100 pb-3 mb-4">
                Live Catalog Preview
              </h2>
              <p className="text-xs text-kardone-muted mb-6">
                This is a real-time preview of how this product card will look inside the main store catalog.
              </p>

              {/* Preview Card */}
              <div className="group relative flex flex-col border border-neutral-200 bg-white transition-all shadow-sm">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`inline-block px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-white ${inStock ? 'bg-kardone-dark' : 'bg-neutral-400'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Category Badge Right */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-block bg-brand-600 px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-widest text-white">
                    {category}
                  </span>
                </div>

                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={name || 'Part preview'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-neutral-400 p-4">
                      <ShoppingBag className="h-10 w-10 mb-2 stroke-1" />
                      <span className="text-xs uppercase tracking-wider font-semibold">No Image Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-bold text-kardone-dark group-hover:text-brand-500 transition-colors line-clamp-1">
                    {name || 'Product Title / Name'}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-kardone-muted line-clamp-2">
                    {description || 'Provide a detailed description of the auto spare part. Customers will read this summary directly from the main store catalog search and filter interface.'}
                  </p>

                  <div className="mt-4 border-t border-neutral-100 pt-3">
                    <button
                      type="button"
                      disabled
                      className="w-full bg-kardone-dark py-2 font-display text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-600 transition-colors"
                    >
                      Inquire / Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ContactBar />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { getPendingRequestCount, subscribeToApiActivity } from '@/config/api'

export default function ApiLoadingIndicator() {
  const [pending, setPending] = useState(getPendingRequestCount())
  const [visible, setVisible] = useState(false)

  useEffect(() => subscribeToApiActivity(setPending), [])

  useEffect(() => {
    if (pending === 0) {
      setVisible(false)
      return
    }

    const timer = window.setTimeout(() => setVisible(true), 250)
    return () => window.clearTimeout(timer)
  }, [pending])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[100] flex justify-center px-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-full border border-cyan-400/40 bg-slate-950/95 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-cyan-950/60 backdrop-blur-md">
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" />
          <LoaderCircle className="relative h-7 w-7 animate-spin text-cyan-400" />
        </span>
        <span>Loading data…</span>
      </div>
    </div>
  )
}

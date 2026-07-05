import { PackageSearch } from 'lucide-react'

type EmptyStateProps = {
  search: string
}

export default function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center bg-neutral-100 text-neutral-500">
        <PackageSearch className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-semibold text-kardone-dark">No parts found</h3>
      <p className="mt-2 max-w-md text-sm text-kardone-muted">
        {search
          ? `We couldn't find anything matching "${search}". Try another search term or category.`
          : 'Try selecting a different category to browse more parts.'}
      </p>
    </div>
  )
}

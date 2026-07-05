import { Search } from 'lucide-react'

type SearchBarProps = {
  search: string
  onSearchChange: (value: string) => void
}

export default function SearchBar({ search, onSearchChange }: SearchBarProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search parts by name, category, or ID..."
        className="w-full border border-neutral-300 bg-white py-3 pl-12 pr-4 text-sm text-kardone-dark outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
      />
    </label>
  )
}

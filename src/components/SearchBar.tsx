import { Search } from 'lucide-react'

type SearchBarProps = {
  search: string
  onSearchChange: (value: string) => void
}

export default function SearchBar({ search, onSearchChange }: SearchBarProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search parts by name, category, or ID..."
        className="w-full border border-slate-800 bg-slate-900/60 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl"
      />
    </label>
  )
}

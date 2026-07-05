export const CATEGORIES = [
  'Headlights',
  'Tail Lights',
  'Exhaust & Performance',
  'Bumpers & Body',
  'Accessories',
  'Showcase',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Part = {
  id: string
  name: string
  category: Category
  image: string
  description: string
  inStock: boolean
}

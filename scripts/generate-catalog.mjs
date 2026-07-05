import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const partsDir = path.join(__dirname, '../public/parts')
const outputPath = path.join(__dirname, '../src/data/parts.json')

const CATEGORIES = [
  'Headlights',
  'Tail Lights',
  'Exhaust & Performance',
  'Bumpers & Body',
  'Accessories',
  'Showcase',
]

const CATEGORY_RANGES = [
  { start: 1, end: 70, category: 'Headlights' },
  { start: 71, end: 80, category: 'Tail Lights' },
  { start: 81, end: 85, category: 'Exhaust & Performance' },
  { start: 86, end: 90, category: 'Bumpers & Body' },
  { start: 91, end: 95, category: 'Accessories' },
  { start: 96, end: 100, category: 'Showcase' },
]

const NAME_TEMPLATES = {
  Headlights: [
    'LED Projector Headlight Assembly',
    'Smoked LED Headlight Set',
    'Chrome Accent Headlight Unit',
    'Black Housing LED Headlight',
    'Sequential DRL Headlight Assembly',
  ],
  'Tail Lights': [
    'Smoked LED Tail Light Set',
    'Black Housing Tail Light Pair',
    'Modern LED Rear Light Assembly',
    'Tinted Tail Light Set (L/R)',
  ],
  'Exhaust & Performance': [
    'Gloss Black Exhaust Tip',
    'Custom Cutout Exhaust Tip',
    'Stainless Performance Exhaust Tip',
  ],
  'Bumpers & Body': [
    'Off-Road Steel Front Bumper',
    'Wide Fender Flare Set',
    'Heavy-Duty Side Step Bars',
  ],
  Accessories: [
    'LED Driving Light Pair',
    'Roof Cargo Box',
    'Snorkel Air Intake Kit',
    'Mirror Cap with LED Signal',
  ],
  Showcase: [
    'Full Build Showcase — Off-Road Pickup',
    'Custom Vehicle Lighting Package',
    'Complete Exterior Upgrade Kit',
  ],
}

const DESCRIPTIONS = {
  Headlights:
    'Premium aftermarket headlight with LED daytime running lights and modern projector lens. Direct-fit replacement with a sleek black housing.',
  'Tail Lights':
    'Pair of smoked LED tail lights with a contemporary design. Enhances rear visibility and gives your vehicle a bold, updated look.',
  'Exhaust & Performance':
    'High-quality exhaust tip with a durable finish and precision-cut design. Adds a sporty, custom appearance to your vehicle.',
  'Bumpers & Body':
    'Rugged exterior body component built for durability and style. Ideal for off-road and street customization projects.',
  Accessories:
    'Practical aftermarket accessory to improve function and appearance. Easy to install with a factory-quality finish.',
  Showcase:
    'Reference photo of a fully customized vehicle build featuring multiple premium spare parts and accessories.',
}

function getCategory(index) {
  const match = CATEGORY_RANGES.find(
    (range) => index >= range.start && index <= range.end,
  )
  return match?.category ?? 'Headlights'
}

function getName(category, index) {
  const templates = NAME_TEMPLATES[category]
  const template = templates[index % templates.length]
  const num = String(index).padStart(3, '0')
  return `${template} #${num}`
}

function generateParts() {
  const files = fs
    .readdirSync(partsDir)
    .filter((file) => /\.jpe?g$/i.test(file))
    .sort()

  return files.map((file, fileIndex) => {
    const index = fileIndex + 1
    const id = `part-${String(index).padStart(3, '0')}`
    const category = getCategory(index)
    const name = getName(category, index)
    const description = DESCRIPTIONS[category]

    return {
      id,
      name,
      category,
      image: `/parts/${file}`,
      description,
      inStock: true,
    }
  })
}

const parts = generateParts()
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(parts, null, 2))

console.log(`Generated ${parts.length} parts in ${outputPath}`)
console.log(
  'Categories:',
  CATEGORIES.map((cat) => `${cat}: ${parts.filter((p) => p.category === cat).length}`).join(', '),
)

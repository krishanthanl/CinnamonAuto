import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: '/parts/part-001.jpeg',
    line1: 'Your Wheels Are In',
    line2: 'GOOD HANDS!',
  },
  {
    image: '/parts/part-015.jpeg',
    line1: 'Your Wheels Are In',
    line2: 'GOOD HANDS!',
  },
  {
    image: '/parts/part-030.jpeg',
    line1: 'Your Wheels Are In',
    line2: 'GOOD HANDS!',
  },
  {
    image: '/parts/part-045.jpeg',
    line1: 'Your Wheels Are In',
    line2: 'GOOD HANDS!',
  },
]

type HeroProps = {
  totalCount: number
  filteredCount: number
}

export default function Hero({ totalCount, filteredCount }: HeroProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setActive((index + slides.length) % slides.length)
  }

  const slide = slides[active]

  return (
    <section className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[520px]">
      {slides.map((item, index) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== active}
        >
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      ))}

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <p className="font-display text-xl font-normal uppercase tracking-[0.2em] text-white/90 sm:text-2xl lg:text-3xl">
          {slide.line1}
        </p>
        <h2 className="mt-1 font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl lg:text-7xl">
          {slide.line2}
        </h2>
        <a
          href="#catalog"
          className="mt-8 inline-block bg-brand-600 px-8 py-3 font-display text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-brand-700"
        >
          Read more
        </a>
        <p className="mt-6 text-xs text-white/70 sm:text-sm">
          Showing <span className="font-semibold text-white">{filteredCount}</span> of{' '}
          <span className="font-semibold text-white">{totalCount}</span> parts in stock
        </p>
      </div>

      <button
        type="button"
        onClick={() => goTo(active - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60 sm:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2 w-2 rounded-full transition ${
              index === active ? 'bg-brand-500 w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

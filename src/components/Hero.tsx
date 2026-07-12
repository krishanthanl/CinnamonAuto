import { Car } from 'lucide-react'

type HeroProps = {
  totalCount: number
  filteredCount: number
}

export default function Hero({ totalCount, filteredCount }: HeroProps) {
  return (
    <section className="relative min-h-[600px] lg:min-h-[720px] flex flex-col justify-between items-center py-12 px-4 overflow-hidden bg-slate-950">
      {/* Background Image with Futuristic City and Blue Sports Car */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out hover:scale-105"
        style={{ backgroundImage: "url('/dream_car_hero.png')" }}
      />
      {/* Premium Cyber/Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950" />

      {/* Decorative Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Dream Car */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2 mt-4 animate-fade-in-down">
        {/* Car Silhouette Icon */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Car className="h-5 w-5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-400">Drive your</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          Dream  <span className="text-[#ff8c00] drop-shadow-[0_0_12px_rgba(255,140,0,0.3)]">Truck</span>With Pride And Joy
        </h1>
      </div>

      {/* Middle Banner: Auto Deals with Floating Tire */}
      <div className="relative z-10 flex flex-col items-center text-center my-8 max-w-lg">
        <p className="text-sm font-semibold tracking-[0.15em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] mb-2 font-display italic">
          Unmatched Prices on all Parts !!
        </p>

        {/* Logo and Tire Stack Container */}
        <div className="relative select-none py-4 px-8">
          <h2 className="font-display text-7xl sm:text-9xl font-black tracking-wider text-white leading-none uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            MOD
          </h2>
          <h2 className="font-display text-7xl sm:text-9xl font-black tracking-wider text-white leading-none uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mt-2">
            DEALS
          </h2>
        </div>
      </div>

      {/* Bottom Banner: Footer details & CTA */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-md w-full">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm tracking-[0.2em] font-medium text-slate-300 uppercase">
            Unimaginable Deals
          </p>
          <p className="text-xs sm:text-sm tracking-[0.2em] font-medium text-slate-400 uppercase">
            Guaranteed Best Experience
          </p>
        </div>

        <a
          href="https://www.autodeals.nl"
          target="_blank"
          rel="noreferrer"
          className="text-xs sm:text-sm font-display tracking-[0.25em] text-cyan-400 hover:text-cyan-300 transition duration-300 uppercase"
        >
          www.4x4mods.nz
        </a>

        {/* CTA Button to scroll to Catalog */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <a
            href="#catalog"
            className="inline-block bg-gradient-to-r from-[#ff8c00] to-[#ff5100] px-8 py-3.5 rounded-full font-display text-xs font-bold uppercase tracking-[0.2em] text-white hover:from-[#ffa033] hover:to-[#ff6a22] transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            Explore Catalog
          </a>

          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            Showing <span className="font-semibold text-cyan-400">{filteredCount}</span> of{' '}
            <span className="font-semibold text-slate-300">{totalCount}</span> parts in stock
          </p>
        </div>
      </div>
    </section>
  )
}

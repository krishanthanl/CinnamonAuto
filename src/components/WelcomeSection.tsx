import { vendor } from '@/config/vendor'

export default function WelcomeSection() {
  return (
    <section className="relative overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md px-6 py-10 text-center sm:px-12 sm:py-14 rounded-2xl shadow-xl shadow-cyan-950/10">
      <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl translate-x-12 translate-y-12"></div>
      
      <h2 className="font-display text-2xl font-bold tracking-wider text-white sm:text-3xl bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
        Welcome to our store!
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
        {vendor.tagline} Browse our catalog below to find headlights, body parts, exhaust systems,
        and more.
      </p>
      <a
        href="#catalog"
        className="mt-6 inline-block border-b-2 border-cyan-400 pb-0.5 font-display text-sm font-semibold uppercase tracking-widest text-cyan-400 transition hover:border-amber-400 hover:text-amber-400 hover:scale-105"
      >
        Read more
      </a>
    </section>
  )
}

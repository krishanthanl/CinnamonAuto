import { vendor } from '@/config/vendor'

export default function WelcomeSection() {
  return (
    <section className="border border-neutral-200 bg-white px-6 py-10 text-center sm:px-12 sm:py-14">
      <h2 className="font-display text-2xl font-semibold text-kardone-dark sm:text-3xl">
        Welcome to our store!
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-kardone-muted sm:text-base">
        {vendor.tagline} Browse our catalog below to find headlights, body parts, exhaust systems,
        and more.
      </p>
      <a
        href="#catalog"
        className="mt-6 inline-block border-b-2 border-brand-600 pb-0.5 font-display text-sm font-medium uppercase tracking-wider text-brand-600 transition hover:border-brand-700 hover:text-brand-700"
      >
        Read more
      </a>
    </section>
  )
}

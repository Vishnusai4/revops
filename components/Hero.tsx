import AnimateIn from './AnimateIn'

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h1 className="font-heading text-3xl tracking-tight text-ink sm:text-4xl lg:text-5xl">
            The data-spine of your revenue engine.
          </h1>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="mt-6 text-xl leading-relaxed text-ink-muted max-w-2xl">
            Stop building fragile dashboards. Most dashboards break. Teravictus is different. It is a solid spine for all your data. It connects every tool you use. Now, you can ask AI for the truth. Get fast answers on NRR, leaks, or your pipeline. No more waiting. No more errors. Clear results when you need them.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#beta"
              className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Learn about our beta program
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>
            <a
              href="/stress-test"
              className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Try the free Revenue Plan Stress Test
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

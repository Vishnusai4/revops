import AnimateIn from './AnimateIn'

export default function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h1 className="font-heading text-5xl tracking-tight text-ink sm:text-6xl lg:text-7xl max-w-3xl">
            Revenue Systems, Rebuilt
          </h1>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="mt-6 text-xl leading-relaxed text-ink-muted max-w-2xl">
            One correct revenue number across your CRM, billing, and finance systems.
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}

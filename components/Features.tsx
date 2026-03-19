import AnimateIn from './AnimateIn'

const painPoints = [
  {
    heading: 'Your numbers don\u2019t match.',
    body: 'Your CRM says one number. Billing says another. Finance says a third. We make them agree.',
  },
  {
    heading: 'Your data can\u2019t be trusted.',
    body: 'Custom fields, broken syncs, manual workarounds: your revenue stack has years of accumulated mess. We make it trustable.',
  },
  {
    heading: 'It breaks again every quarter.',
    body: 'Reconciliation is not a one-time fix. We make sure your systems stay in agreement, without the monthly fire drill.',
  },
  {
    heading: 'Your team waits for answers.',
    body: 'Clean, structured revenue data your team or any AI can query directly. No analyst bottleneck, no waiting for reports.',
  },
]

const steps = [
  { label: '1', title: 'Assess', description: 'We map where your revenue data lives and where it breaks.' },
  { label: '2', title: 'Fix', description: 'We resolve the gaps between systems and make the numbers agree.' },
  { label: '3', title: 'Maintain', description: 'We make sure it stays that way.' },
]

export default function Features() {
  return (
    <section id="what-we-do" className="bg-surface-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-2xl">
            Fix the disconnect between your revenue systems.
          </h2>
        </AnimateIn>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-14">
          {painPoints.map((item, i) => (
            <AnimateIn key={item.heading} delay={i * 0.1} className={i % 2 === 1 ? 'sm:mt-12' : ''}>
              <div>
                <span className="block h-px w-8 bg-brand-500 mb-5" />
                <h3 className="text-lg font-semibold text-ink">
                  {item.heading}
                </h3>
                <p className="mt-2 text-ink-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* How we work */}
        <AnimateIn>
          <div className="mt-20 pt-16 border-t border-ink/5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
              How we work
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
              {steps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <span className="text-2xl font-heading text-brand-300">{step.label}</span>
                  <div>
                    <h4 className="font-semibold text-ink">{step.title}</h4>
                    <p className="mt-1 text-sm text-ink-muted leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

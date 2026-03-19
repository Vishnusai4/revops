import AnimateIn from './AnimateIn'

const steps = [
  {
    label: '01',
    title: 'Connect',
    description:
      'We plug into your existing CRM, billing, and finance systems. No rip and replace. Works with your current stack.',
  },
  {
    label: '02',
    title: 'Reconcile',
    description:
      'We identify and fix mismatches between systems: discrepancies, missing records, sync failures. One trusted revenue number.',
  },
  {
    label: '03',
    title: 'Query',
    description:
      'Your revenue data becomes a single trusted source, queryable by your team or via AI. Decisions come from data, not debates.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-lg">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-ink-muted max-w-xl">
            From disconnected systems to one trusted revenue number.
          </p>
        </AnimateIn>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {steps.map((step, i) => (
            <AnimateIn key={step.title} delay={i * 0.1}>
              <div>
                <span className="text-5xl font-heading text-brand-200">{step.label}</span>
                <h3 className="mt-4 text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-ink-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

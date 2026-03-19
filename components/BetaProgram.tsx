import AnimateIn from './AnimateIn'

const outcomes = [
  { outcome: 'Unlock 300+ hours per month', context: 'Feels like gaining a team' },
  { outcome: 'Recover 2 full-time employees worth of output', context: 'Very tangible' },
  { outcome: 'Turn weekly reporting into real-time decisions', context: 'Strategic' },
  { outcome: 'Remove delays in revenue decisions', context: 'CRO-level pain' },
]

const beforeAfter = [
  {
    before: 'CRM says one number, billing says another',
    after: 'One correct revenue number across all systems',
  },
  {
    before: 'Monthly fire drills reconciling spreadsheets',
    after: 'Automated reconciliation that stays in sync',
  },
  {
    before: 'Weeks waiting for ad hoc revenue reports',
    after: 'Revenue data queryable instantly, by humans or AI',
  },
]

export default function BetaProgram() {
  return (
    <section id="beta" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-2xl">
            Beta Program
          </h2>
          <p className="mt-4 text-lg text-ink-muted max-w-xl">
            A hands-on engagement over 4 to 5 months. We overhaul your revenue systems end to end.
          </p>
        </AnimateIn>

        {/* Impact - at the top */}
        <AnimateIn delay={0.1}>
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Impact</h3>
            <p className="mt-2 text-sm text-ink-body">What changes when your revenue systems work.</p>
            <div className="mt-6 space-y-0">
              {outcomes.map((item, i) => (
                <div key={item.outcome} className={`grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8 py-4 ${i < outcomes.length - 1 ? 'border-b border-ink/5' : ''}`}>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-ink">{item.outcome}</p>
                  </div>
                  <div className="md:col-span-1 md:flex md:items-center">
                    <p className="text-sm text-ink-faint">{item.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* What we look for */}
        <AnimateIn delay={0.15}>
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">What we look for</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You value reliability and clear ROI over flashy features that shift every quarter.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You want to build and compound together long term, not churn through vendors.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You help us tailor solutions to your challenges. We return the investment through exclusive terms.</span>
              </li>
            </ul>
          </div>
        </AnimateIn>

        {/* Before / After comparison */}
        <AnimateIn delay={0.2}>
          <div className="mt-14 rounded-2xl border border-ink/5 bg-white overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-6 py-4 bg-surface-muted border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Before</span>
              </div>
              <div className="px-6 py-4 border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">After</span>
              </div>
            </div>
            {beforeAfter.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 ${i < beforeAfter.length - 1 ? 'border-b border-ink/5' : ''}`}>
                <div className="px-6 py-5 bg-surface-muted text-ink-muted">
                  {row.before}
                </div>
                <div className="px-6 py-5 text-ink">
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Terms row */}
        <AnimateIn delay={0.25}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Pricing</h3>
              <p className="mt-2 text-sm text-ink-body leading-relaxed">
                You pay us monthly. Discounted for beta partners. Details shared over conversation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Guarantee</h3>
              <p className="mt-2 text-sm text-ink-body leading-relaxed">
                If we do not deliver clear improvements, you do not pay.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Infrastructure</h3>
              <p className="mt-2 text-sm text-ink-body leading-relaxed">
                We bill separately, or you provide your own. Your choice.
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Ask us to learn more
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

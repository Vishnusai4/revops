import AnimateIn from './AnimateIn'

const rows = [
  {
    label: 'Works best for',
    agency: 'One-time migrations and strategic consulting',
    diy: "Stable stacks with one engineer who won't leave",
    teravictus: 'Teams deploying AI agents on top of GTM data',
  },
  {
    label: 'Data freshness',
    agency: 'Snapshots — weekly or monthly',
    diy: 'Continuous — until something breaks silently',
    teravictus: 'Continuous — normalized, always',
  },
  {
    label: 'When you add a new tool',
    agency: 'New SOW, new timeline, new invoice',
    diy: 'Weeks of custom transforms by the same engineer',
    teravictus: 'Automatic connector, no engineering work',
  },
  {
    label: 'Cost model',
    agency: '$150–300/hr, scope creep risk',
    diy: "'Free' — until you count the engineer's time",
    teravictus: 'Fixed monthly fee, predictable budget',
  },
  {
    label: 'AI-ready?',
    agency: '✗ Clean data decays between engagements',
    diy: '⚠ Works until schema drift or engineer turnover',
    teravictus: '✓ Built for it — clean context, fewer hallucinations',
  },
]

export default function WhyNotAgencyDiy() {
  return (
    <section id="why-not-agency-diy" className="py-20 md:py-28 border-t border-ink/5">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-2xl">
            Why not just hire an agency or build it yourself?
          </h2>
          <p className="mt-4 text-lg text-ink-muted max-w-xl">
            Three ways to unify your GTM data. Only one was built for AI agents.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          {/* Desktop table */}
          <div className="mt-14 hidden md:block rounded-2xl border border-ink/5 bg-white overflow-hidden">
            <div className="grid grid-cols-4 border-b border-ink/5">
              <div className="px-6 py-4 bg-surface-muted" />
              <div className="px-6 py-4 border-l border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Agency</span>
              </div>
              <div className="px-6 py-4 border-l border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">DIY (Fivetran + dbt)</span>
              </div>
              <div className="px-6 py-4 border-l border-brand-200 bg-brand-50">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Teravictus</span>
              </div>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 ${i < rows.length - 1 ? 'border-b border-ink/5' : ''}`}
              >
                <div className="px-6 py-5 bg-surface-muted flex items-start">
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">{row.label}</span>
                </div>
                <div className="px-6 py-5 border-l border-ink/5 text-sm text-ink-body leading-relaxed">
                  {row.agency}
                </div>
                <div className="px-6 py-5 border-l border-ink/5 text-sm text-ink-body leading-relaxed">
                  {row.diy}
                </div>
                <div className="px-6 py-5 border-l border-brand-200 bg-brand-50/40 text-sm text-ink-body leading-relaxed">
                  {row.teravictus}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="mt-14 md:hidden space-y-5">
            <div className="rounded-2xl border border-ink/5 bg-white overflow-hidden">
              <div className="px-5 py-3 bg-surface-muted border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Agency</span>
              </div>
              {rows.map((row, i) => (
                <div key={i} className={`px-5 py-4 ${i < rows.length - 1 ? 'border-b border-ink/5' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-1">{row.label}</p>
                  <p className="text-sm text-ink-body leading-relaxed">{row.agency}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-ink/5 bg-white overflow-hidden">
              <div className="px-5 py-3 bg-surface-muted border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">DIY (Fivetran + dbt)</span>
              </div>
              {rows.map((row, i) => (
                <div key={i} className={`px-5 py-4 ${i < rows.length - 1 ? 'border-b border-ink/5' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-1">{row.label}</p>
                  <p className="text-sm text-ink-body leading-relaxed">{row.diy}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-brand-200 overflow-hidden">
              <div className="px-5 py-3 bg-brand-50 border-b border-brand-200">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Teravictus</span>
              </div>
              {rows.map((row, i) => (
                <div key={i} className={`px-5 py-4 bg-brand-50/40 ${i < rows.length - 1 ? 'border-b border-brand-100' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-1">{row.label}</p>
                  <p className="text-sm text-ink-body leading-relaxed">{row.teravictus}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

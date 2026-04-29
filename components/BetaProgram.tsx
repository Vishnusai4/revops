import Image from 'next/image'
import AnimateIn from './AnimateIn'

const beforeAfter = [
  {
    before: 'Five systems, five partial pictures',
    after: 'One reconciled read across all five, every Monday',
    evidence: 'Liu et al. "Lost in the Middle" (TACL 2024) — signals that live in the relationship between data sources are invisible to single-stream retrieval',
  },
  {
    before: 'Deal status reflects what was entered, not what happened',
    after: 'Deal signals include CRM, billing, usage, and what was said on the last call',
    evidence: 'Baumeister et al. — negative signals are systematically softened as they travel upward through organizations',
  },
  {
    before: 'RevOps spends the week reconciling data',
    after: 'RevOps spends the week designing systems and optimizing GTM performance',
    evidence: 'Forrester — RevOps teams lose the equivalent of 1 to 2 days per week normalizing data across disconnected systems',
  },
  {
    before: 'AI makes live tool calls at query time, slow, expensive, token-heavy',
    after: 'Pre-reconciled data means faster answers, lower token burn, and longer session limits',
    evidence: 'Du et al. "Context Length Alone Hurts LLM Performance Despite Perfect Retrieval" (EMNLP 2025)',
  },
  {
    before: 'Each person queries their own slice of the stack',
    after: 'Shared context means the entire revenue team operates from the same ground truth',
    evidence: 'Organizational behavior research on information cascades',
  },
  {
    before: 'Answers wait for the next analyst run',
    after: 'Ask Claude directly. Get the answer now.',
    evidence: '',
  },
  {
    before: '100+ hours/month spent assembling the picture',
    after: '100+ hours/month redirected to decisions and execution',
    evidence: 'Forrester — RevOps teams spend 60 to 70% of their time on data reconciliation rather than analysis',
  },
]

const impactItems = [
  'CROs and VP Revenue get a reconciled read of their entire revenue machine every Monday morning. CRM stage, billing state, product usage, support health, and what was actually said on the last call. All five systems. One picture. Before the week starts.',
  'RevOps Directors and Managers shift from data assembly to system intelligence. With full visibility into how every part of the GTM stack performs end-to-end, they can design better processes, identify where the machine leaks, and build systems that compound over time.',
  'AEs and SDRs see the full context of every account. Engagement trends, usage signals, billing history, and conversation patterns. Without chasing five tools to piece it together manually.',
  'No dashboards. No reports. Every person on your revenue team understands data differently. With Teravictus, they simply ask Claude in their own words and get an answer that fits how they think.',
  'Faster, more accurate answers because the work is already done. Most AI tools make live tool calls at query time, burning tokens and introducing lag. Teravictus pre-reconciles and structures your data before any question is asked. Claude answers faster, with higher accuracy, at a fraction of the cost. And as we move toward shared context, your entire revenue team operates from the same ground truth simultaneously.',
  'The entire revenue team reclaims 100+ hours every month. Redirected from assembly to decisions, strategy, and execution.',
]

export default function BetaProgram() {
  return (
    <section id="beta" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-2xl">
            Pilot Program
          </h2>
          <p className="mt-4 text-lg text-ink-muted max-w-xl">
            We&apos;re working with a small number of B2B SaaS revenue teams to build and validate the core product together. You get the full system at pilot pricing. Pilot partners carry forward discounted lifetime terms as the product scales. We&apos;re looking for teams who want to compound, not just try.
          </p>
        </AnimateIn>

        {/* What it looks like */}
        <AnimateIn delay={0.15}>
          <div className="mt-14">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">What it looks like</h3>
            <div className="mt-6">
              <Image
                src="/before-after-teravictus.png"
                alt="Before and after Teravictus — pipeline report versus Claude-powered reconciled view"
                width={1200}
                height={800}
                className="w-full rounded-2xl border border-ink/5"
              />
            </div>
          </div>
        </AnimateIn>

        {/* Before / After / Evidence table */}
        <AnimateIn delay={0.2}>
          <div className="mt-14 rounded-2xl border border-ink/5 bg-white overflow-hidden">
            <div className="grid grid-cols-3">
              <div className="px-6 py-4 bg-surface-muted border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Before Teravictus</span>
              </div>
              <div className="px-6 py-4 border-b border-ink/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">After Teravictus</span>
              </div>
              <div className="px-6 py-4 border-b border-ink/5 bg-surface-muted/50">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Evidence</span>
              </div>
            </div>
            {beforeAfter.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < beforeAfter.length - 1 ? 'border-b border-ink/5' : ''}`}>
                <div className="px-6 py-5 bg-surface-muted text-ink-muted text-sm leading-relaxed">
                  {row.before}
                </div>
                <div className="px-6 py-5 text-ink text-sm leading-relaxed">
                  {row.after}
                </div>
                <div className="px-6 py-5 bg-surface-muted/50 text-ink-faint text-xs leading-relaxed">
                  {row.evidence}
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>

        {/* Impact */}
        <AnimateIn delay={0.25}>
          <div className="mt-14">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Impact</h3>
            <p className="mt-2 text-sm text-ink-body">What becomes possible when your GTM machine speaks one language.</p>
            <div className="mt-8 space-y-0">
              {impactItems.map((item, i) => (
                <div key={i} className={`flex gap-6 py-5 ${i < impactItems.length - 1 ? 'border-b border-ink/5' : ''}`}>
                  <span className="text-sm font-heading text-brand-300 flex-shrink-0 w-5">{i + 1}</span>
                  <p className="text-sm text-ink-body leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* Apply button */}
        <AnimateIn delay={0.3}>
          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Apply for the Pilot
            </a>
          </div>
        </AnimateIn>

        {/* Terms row */}
        <AnimateIn delay={0.35}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Pricing</h3>
              <p className="mt-2 text-sm text-ink-body leading-relaxed">
                You pay monthly. Discounted for pilot partners. Details shared over conversation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Infrastructure</h3>
              <p className="mt-2 text-sm text-ink-body leading-relaxed">
                We bill separately, or you provide your own. Your choice. We stay frugal and keep you informed.
              </p>
            </div>
          </div>
        </AnimateIn>

        {/* What we look for */}
        <AnimateIn delay={0.4}>
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">What we look for</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You want a stable, compounding system, not another tool to evaluate every quarter.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You&apos;re willing to go deep with us on your real data and workflows.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 block h-px w-5 bg-brand-500 flex-shrink-0" />
                <span className="text-sm text-ink-body leading-relaxed">You play long-term games with long-term partners.</span>
              </li>
            </ul>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

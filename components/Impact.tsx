import AnimateIn from './AnimateIn'

const items = [
  'CROs and VP Revenue get a reconciled read of their entire revenue machine every Monday morning. CRM stage, billing state, product usage, support health, and what was actually said on the last call. All five systems. One picture. Before the week starts.',
  'RevOps Directors and Managers shift from data assembly to system intelligence. With full visibility into how every part of the GTM stack performs end-to-end, they can design better processes, identify where the machine leaks, and build systems that compound over time.',
  'AEs and SDRs see the full context of every account. Engagement trends, usage signals, billing history, and conversation patterns. Without chasing five tools to piece it together manually.',
  'No dashboards. No reports. Every person on your revenue team understands data differently. With Teravictus, they simply ask Claude in their own words and get an answer that fits how they think.',
  'Faster, more accurate answers because the work is already done. Most AI tools make live tool calls at query time, burning tokens and introducing lag. Teravictus pre-reconciles and structures your data before any question is asked. Claude answers faster, with higher accuracy, at a fraction of the cost. And as we move toward shared context, your entire revenue team operates from the same ground truth simultaneously.',
  'The entire revenue team reclaims 100+ hours every month. Redirected from assembly to decisions, strategy, and execution.',
]

export default function Impact() {
  return (
    <section id="impact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Impact</h3>
          <p className="mt-2 text-lg text-ink-body max-w-2xl">
            What becomes possible when your GTM machine speaks one language.
          </p>
        </AnimateIn>

        <div className="mt-12 space-y-0">
          {items.map((item, i) => (
            <AnimateIn key={i} delay={i * 0.08}>
              <div className={`flex gap-6 py-6 ${i < items.length - 1 ? 'border-b border-ink/5' : ''}`}>
                <span className="text-sm font-heading text-brand-300 flex-shrink-0 w-5">{i + 1}</span>
                <p className="text-ink-body leading-relaxed">{item}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

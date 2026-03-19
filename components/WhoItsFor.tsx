'use client'

import { useState } from 'react'
import AnimateIn from './AnimateIn'

const tabs = [
  {
    name: 'RevOps',
    content:
      'For RevOps teams who spend too much time reconciling data between systems instead of building the processes that drive revenue.',
  },
  {
    name: 'Sales Ops',
    content:
      'For Sales Ops teams who need forecast numbers that match what billing actually collected, not a separate spreadsheet reality.',
  },
  {
    name: 'Finance',
    content:
      'For finance and accounting teams who need clean, reconciled revenue data they can trust for reporting, audit, and compliance, without chasing down CRM discrepancies.',
  },
]

export default function WhoItsFor() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="built-for" className="bg-surface-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-lg">
            Built For Revenue Teams
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="mt-10 flex gap-6 border-b border-ink/10">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === index
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-ink-muted hover:text-ink-body'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <p className="mt-8 text-lg leading-relaxed text-ink-muted max-w-2xl">
            {tabs[activeTab].content}
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}

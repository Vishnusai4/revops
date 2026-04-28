'use client'

import { FormEvent, useState, useRef } from 'react'
import type { CompanyProfileInput, ARRBand, SalesMotion, ACVBand, SalesCycleBand, TargetPeriod, NewARRTargetBand } from '@/lib/stress-test/types'
import { RadioGroup, SliderField, FormGrid } from './shared'

interface Props {
  values: Partial<CompanyProfileInput>
  onChange: (v: Partial<CompanyProfileInput>) => void
  onNext: () => void
  onBack: () => void
}

function set<K extends keyof CompanyProfileInput>(
  values: Partial<CompanyProfileInput>,
  onChange: (v: Partial<CompanyProfileInput>) => void,
  key: K,
  val: CompanyProfileInput[K],
) {
  onChange({ ...values, [key]: val })
}

export default function StepCompanyProfile({ values, onChange, onNext, onBack }: Props) {
  const s = <K extends keyof CompanyProfileInput>(key: K, val: CompanyProfileInput[K]) =>
    set(values, onChange, key, val)

  const [attempted, setAttempted] = useState(false)

  const refs = {
    arrBand:          useRef<HTMLDivElement>(null),
    salesMotion:      useRef<HTMLDivElement>(null),
    acvBand:          useRef<HTMLDivElement>(null),
    salesCycleBand:   useRef<HTMLDivElement>(null),
    targetPeriod:     useRef<HTMLDivElement>(null),
    newARRTargetBand: useRef<HTMLDivElement>(null),
  }

  const required: (keyof typeof refs)[] = [
    'arrBand', 'salesMotion', 'acvBand', 'salesCycleBand', 'targetPeriod', 'newARRTargetBand',
  ]

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const missing = required.filter((k) => !values[k])
    if (missing.length > 0) {
      setAttempted(true)
      refs[missing[0]].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const err = (key: keyof typeof refs) => attempted && !values[key]

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>

        <div ref={refs.arrBand}>
          <RadioGroup<ARRBand>
            label="Current ARR"
            error={err('arrBand')}
            options={[
              { value: 'under-1m', label: 'Under $1M' },
              { value: '1m-5m', label: '$1M–$5M' },
              { value: '5m-15m', label: '$5M–$15M' },
              { value: '15m-30m', label: '$15M–$30M' },
              { value: '30m-75m', label: '$30M–$75M' },
              { value: '75m-150m', label: '$75M–$150M' },
              { value: 'over-150m', label: 'Over $150M' },
            ]}
            value={values.arrBand}
            onChange={(v) => s('arrBand', v)}
            columns={4}
          />
        </div>

        <div ref={refs.salesMotion}>
          <RadioGroup<SalesMotion>
            label="Primary sales motion"
            error={err('salesMotion')}
            options={[
              { value: 'smb', label: 'SMB', description: 'Fast, high-volume deals' },
              { value: 'midmarket', label: 'Mid-Market', description: 'Moderate complexity' },
              { value: 'enterprise', label: 'Enterprise', description: 'Long cycles, many stakeholders' },
              { value: 'plg-assisted', label: 'PLG + Sales', description: 'Product-led with a sales layer' },
              { value: 'hybrid', label: 'Hybrid', description: 'Mix of segments' },
            ]}
            value={values.salesMotion}
            onChange={(v) => s('salesMotion', v)}
            columns={3}
          />
        </div>

        <div ref={refs.acvBand}>
          <RadioGroup<ACVBand>
            label="Average new ACV"
            error={err('acvBand')}
            options={[
              { value: 'under-5k', label: 'Under $5K' },
              { value: '5k-25k', label: '$5K–$25K' },
              { value: '25k-75k', label: '$25K–$75K' },
              { value: '75k-200k', label: '$75K–$200K' },
              { value: 'over-200k', label: 'Over $200K' },
            ]}
            value={values.acvBand}
            onChange={(v) => s('acvBand', v)}
            columns={3}
          />
        </div>

        <div ref={refs.salesCycleBand}>
          <RadioGroup<SalesCycleBand>
            label="Typical sales cycle"
            error={err('salesCycleBand')}
            options={[
              { value: 'under-30d', label: 'Under 30 days' },
              { value: '30-60d', label: '30–60 days' },
              { value: '60-90d', label: '60–90 days' },
              { value: '90-180d', label: '90–180 days' },
              { value: 'over-180d', label: '180+ days' },
            ]}
            value={values.salesCycleBand}
            onChange={(v) => s('salesCycleBand', v)}
            columns={3}
          />
        </div>

        <div ref={refs.targetPeriod}>
          <RadioGroup<TargetPeriod>
            label="Plan period"
            error={err('targetPeriod')}
            options={[
              { value: 'quarterly', label: 'One quarter' },
              { value: 'annual', label: 'Full year' },
            ]}
            value={values.targetPeriod}
            onChange={(v) => s('targetPeriod', v)}
            columns={2}
          />
        </div>

        <div ref={refs.newARRTargetBand}>
          <RadioGroup<NewARRTargetBand>
            label="New ARR target for this period"
            error={err('newARRTargetBand')}
            options={[
              { value: 'under-500k', label: 'Under $500K' },
              { value: '500k-1m', label: '$500K–$1M' },
              { value: '1m-2.5m', label: '$1M–$2.5M' },
              { value: '2.5m-5m', label: '$2.5M–$5M' },
              { value: '5m-10m', label: '$5M–$10M' },
              { value: '10m-25m', label: '$10M–$25M' },
              { value: 'over-25m', label: 'Over $25M' },
            ]}
            value={values.newARRTargetBand}
            onChange={(v) => s('newARRTargetBand', v)}
            columns={4}
          />
        </div>

        <SliderField
          label="Expansion contribution"
          hint="% of target from existing customer upsells"
          value={values.expansionContributionPct ?? 15}
          onChange={(v) => s('expansionContributionPct', v)}
          min={0}
          max={60}
          step={5}
          format={(v) => `${v}%`}
        />

      </FormGrid>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-ink/15 px-5 py-3 text-sm font-medium text-ink-body hover:bg-surface-muted transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </form>
  )
}

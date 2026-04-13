'use client'

import { FormEvent } from 'react'
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (
      values.arrBand &&
      values.salesMotion &&
      values.acvBand &&
      values.salesCycleBand &&
      values.targetPeriod &&
      values.newARRTargetBand
    ) {
      onNext()
    }
  }

  const isValid =
    values.arrBand && values.salesMotion && values.acvBand &&
    values.salesCycleBand && values.targetPeriod && values.newARRTargetBand

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>

        <RadioGroup<ARRBand>
          label="Current annual revenue (ARR)"
          hint="ARR is the total subscription revenue your company collects in a year. If you're not sure, pick the closest range — an estimate is fine."
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

        <RadioGroup<SalesMotion>
          label="How does your sales team primarily sell?"
          hint="Pick the model that describes most of your deals. This helps the model apply the right benchmarks for win rates, deal cycles, and team capacity."
          options={[
            { value: 'smb', label: 'SMB', description: 'Small businesses — fast, high-volume deals' },
            { value: 'midmarket', label: 'Mid-Market', description: 'Mid-size companies — moderate complexity' },
            { value: 'enterprise', label: 'Enterprise', description: 'Large orgs — long cycles, many stakeholders' },
            { value: 'plg-assisted', label: 'PLG + Sales', description: 'Product-led growth with a sales layer' },
            { value: 'hybrid', label: 'Hybrid', description: 'Mix of segments or deal types' },
          ]}
          value={values.salesMotion}
          onChange={(v) => s('salesMotion', v)}
          columns={3}
        />

        <RadioGroup<ACVBand>
          label="Average new deal size (per year)"
          hint="This is the average annual contract value of a new customer deal — not lifetime value, not total revenue. Just the first-year contract amount for a typical new customer."
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

        <RadioGroup<SalesCycleBand>
          label="How long does it take to close a deal?"
          hint="Count from the first meaningful sales conversation to a signed contract. If deal length varies, pick the range that covers most of your deals."
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

        <RadioGroup<TargetPeriod>
          label="What time period is this plan for?"
          hint="Choose quarterly to stress-test a single quarter, or annual for a full-year plan. This changes how the model interprets your revenue target, hiring plan, and ramp times."
          options={[
            { value: 'quarterly', label: 'One quarter (3 months)' },
            { value: 'annual', label: 'Full year (12 months)' },
          ]}
          value={values.targetPeriod}
          onChange={(v) => s('targetPeriod', v)}
          columns={2}
        />

        <RadioGroup<NewARRTargetBand>
          label="Total new revenue target for this period"
          hint="Enter the total new revenue your team is expected to close — including both new customer deals and any upsell or expansion from existing customers. This is the number the model stress-tests."
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

        <SliderField
          label="How much of that target comes from existing customers?"
          hint="Expansion revenue is additional revenue from customers you already have — through upsells, add-ons, or seat growth. The model treats the rest as new business your reps must close. Example: if your $5M target includes $1M from existing customers, set this to 20%."
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
          disabled={!isValid}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </form>
  )
}

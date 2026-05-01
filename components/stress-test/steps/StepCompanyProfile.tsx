'use client'

import { FormEvent } from 'react'
import type { CompanyProfileInput, ARRBand, SalesMotion, NewARRTargetBand } from '@/lib/stress-test/types'
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
    if (values.arrBand && values.salesMotion && values.newARRTargetBand) {
      onNext()
    }
  }

  const isValid = values.arrBand && values.salesMotion && values.newARRTargetBand

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>

        <RadioGroup<ARRBand>
          label="Current ARR"
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
          label="Primary sales motion"
          options={[
            { value: 'smb', label: 'SMB' },
            { value: 'midmarket', label: 'Mid-Market' },
            { value: 'enterprise', label: 'Enterprise' },
            { value: 'plg-assisted', label: 'PLG + Sales' },
            { value: 'hybrid', label: 'Hybrid' },
          ]}
          value={values.salesMotion}
          onChange={(v) => s('salesMotion', v)}
          columns={3}
        />

        <RadioGroup<NewARRTargetBand>
          label="New revenue target this year"
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
          label="Expansion % of that target"
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

'use client'

import { FormEvent, useState, useRef } from 'react'
import type {
  TeamInput,
  QuotaBand,
  RampTimeBand,
  AttainmentBand,
  AttritionBand,
  ManagerSpanBand,
  TerritoryModel,
} from '@/lib/stress-test/types'
import { RadioGroup, NumberField, FormGrid, SectionDivider } from './shared'

interface Props {
  values: Partial<TeamInput>
  onChange: (v: Partial<TeamInput>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepTeamCoverage({ values, onChange, onNext, onBack }: Props) {
  const s = <K extends keyof TeamInput>(key: K, val: TeamInput[K]) =>
    onChange({ ...values, [key]: val })

  const [attempted, setAttempted] = useState(false)

  const refs = {
    totalReps:         useRef<HTMLDivElement>(null),
    quotaPerRepBand:   useRef<HTMLDivElement>(null),
    avgAttainmentBand: useRef<HTMLDivElement>(null),
    rampTimeBand:      useRef<HTMLDivElement>(null),
    annualAttritionBand: useRef<HTMLDivElement>(null),
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const missing = (Object.keys(refs) as (keyof typeof refs)[]).filter((k) => {
      if (k === 'totalReps') return !values.totalReps || values.totalReps < 1
      return !values[k as keyof TeamInput]
    })
    if (missing.length > 0) {
      setAttempted(true)
      refs[missing[0]].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const err = (key: keyof typeof refs) => {
    if (!attempted) return false
    if (key === 'totalReps') return !values.totalReps || values.totalReps < 1
    return !values[key as keyof TeamInput]
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <SectionDivider label="Headcount" />

        <div ref={refs.totalReps} className="grid grid-cols-2 gap-4">
          <NumberField
            label="Quota-carrying reps"
            hint="AEs and closers only — not SDRs or SEs"
            error={err('totalReps')}
            value={values.totalReps ?? ''}
            onChange={(v) => s('totalReps', v)}
            min={1}
            max={5000}
            placeholder="e.g. 12"
          />
          <NumberField
            label="SDRs / BDRs"
            hint="Enter 0 if none"
            value={values.sdrCount ?? ''}
            onChange={(v) => s('sdrCount', v)}
            min={0}
            max={2000}
            placeholder="e.g. 4"
          />
        </div>

        <NumberField
          label="Net new hires planned this period"
          value={values.plannedHiresTotal ?? ''}
          onChange={(v) => s('plannedHiresTotal', v)}
          min={0}
          max={1000}
          placeholder="e.g. 3"
        />

        <SectionDivider label="Targets & performance" />

        <div ref={refs.quotaPerRepBand}>
          <RadioGroup<QuotaBand>
            label="Annual quota per rep"
            error={err('quotaPerRepBand')}
            options={[
              { value: 'under-400k', label: 'Under $400K' },
              { value: '400k-600k', label: '$400K–$600K' },
              { value: '600k-900k', label: '$600K–$900K' },
              { value: '900k-1.2m', label: '$900K–$1.2M' },
              { value: '1.2m-2m', label: '$1.2M–$2M' },
              { value: 'over-2m', label: 'Over $2M' },
            ]}
            value={values.quotaPerRepBand}
            onChange={(v) => s('quotaPerRepBand', v)}
            columns={3}
          />
        </div>

        <div ref={refs.avgAttainmentBand}>
          <RadioGroup<AttainmentBand>
            label="Average quota attainment"
            hint="Team average — not your top rep"
            error={err('avgAttainmentBand')}
            options={[
              { value: 'under-60pct', label: 'Under 60%' },
              { value: '60-70pct', label: '60–70%' },
              { value: '70-80pct', label: '70–80%' },
              { value: '80-90pct', label: '80–90%' },
              { value: 'over-90pct', label: 'Over 90%' },
            ]}
            value={values.avgAttainmentBand}
            onChange={(v) => s('avgAttainmentBand', v)}
            columns={3}
          />
        </div>

        <SectionDivider label="Ramp & attrition" />

        <div ref={refs.rampTimeBand}>
          <RadioGroup<RampTimeBand>
            label="Time to full productivity for a new hire"
            error={err('rampTimeBand')}
            options={[
              { value: '1-2-months', label: '1–2 months' },
              { value: '2-3-months', label: '2–3 months' },
              { value: '3-6-months', label: '3–6 months' },
              { value: '6-9-months', label: '6–9 months' },
              { value: 'over-9-months', label: '9+ months' },
            ]}
            value={values.rampTimeBand}
            onChange={(v) => s('rampTimeBand', v)}
            columns={3}
          />
        </div>

        <div ref={refs.annualAttritionBand}>
          <RadioGroup<AttritionBand>
            label="Annual rep attrition"
            error={err('annualAttritionBand')}
            options={[
              { value: 'under-10pct', label: 'Under 10%' },
              { value: '10-15pct', label: '10–15%' },
              { value: '15-20pct', label: '15–20%' },
              { value: '20-25pct', label: '20–25%' },
              { value: 'over-25pct', label: 'Over 25%' },
            ]}
            value={values.annualAttritionBand}
            onChange={(v) => s('annualAttritionBand', v)}
            columns={3}
          />
        </div>

        <SectionDivider label="Structure" />

        <RadioGroup<ManagerSpanBand>
          label="Reps per frontline manager"
          options={[
            { value: '4-5', label: '4–5 reps' },
            { value: '6-7', label: '6–7 reps' },
            { value: '8-10', label: '8–10 reps' },
            { value: 'over-10', label: '10+ reps' },
          ]}
          value={values.managerSpanBand ?? '6-7'}
          onChange={(v) => s('managerSpanBand', v)}
          columns={4}
        />

        <RadioGroup<TerritoryModel>
          label="Territory model"
          options={[
            { value: 'geographic', label: 'Geographic', description: 'By region' },
            { value: 'named-account', label: 'Named Account', description: 'Specific account lists' },
            { value: 'vertical', label: 'Vertical', description: 'By industry' },
            { value: 'hybrid', label: 'Hybrid', description: 'Mix of above' },
            { value: 'round-robin', label: 'Round Robin', description: 'Evenly distributed' },
          ]}
          value={values.territoryModel ?? 'hybrid'}
          onChange={(v) => s('territoryModel', v)}
          columns={3}
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

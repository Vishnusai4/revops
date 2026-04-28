'use client'

import { FormEvent, useState, useRef } from 'react'
import type { PipelineInput, WinRateBand, ForecastMaturity, InspectionCadence } from '@/lib/stress-test/types'
import { RadioGroup, SliderField, FormGrid, SectionDivider } from './shared'

interface Props {
  values: Partial<PipelineInput>
  onChange: (v: Partial<PipelineInput>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepPipeline({ values, onChange, onNext, onBack }: Props) {
  const s = <K extends keyof PipelineInput>(key: K, val: PipelineInput[K]) =>
    onChange({ ...values, [key]: val })

  const [attempted, setAttempted] = useState(false)

  const refs = {
    winRateBand:      useRef<HTMLDivElement>(null),
    forecastMaturity: useRef<HTMLDivElement>(null),
    inspectionCadence: useRef<HTMLDivElement>(null),
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const missing = (Object.keys(refs) as (keyof typeof refs)[]).filter((k) => !values[k as keyof PipelineInput])
    if (missing.length > 0) {
      setAttempted(true)
      refs[missing[0]].current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const err = (key: keyof typeof refs) => attempted && !values[key as keyof PipelineInput]

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <SectionDivider label="Pipeline" />

        <SliderField
          label="Pipeline coverage"
          hint="Pipeline value ÷ target. Healthy range is 3–4×."
          value={values.pipelineCoverageRatio ?? 3.0}
          onChange={(v) => s('pipelineCoverageRatio', v)}
          min={1.0}
          max={7.0}
          step={0.5}
          format={(v) => `${v.toFixed(1)}×`}
        />

        <div ref={refs.winRateBand}>
          <RadioGroup<WinRateBand>
            label="Win rate on qualified deals"
            error={err('winRateBand')}
            options={[
              { value: 'under-10pct', label: 'Under 10%' },
              { value: '10-15pct', label: '10–15%' },
              { value: '15-20pct', label: '15–20%' },
              { value: '20-25pct', label: '20–25%' },
              { value: '25-35pct', label: '25–35%' },
              { value: 'over-35pct', label: '35%+' },
            ]}
            value={values.winRateBand}
            onChange={(v) => s('winRateBand', v)}
            columns={3}
          />
        </div>

        <SectionDivider label="Forecast" />

        <div ref={refs.forecastMaturity}>
          <RadioGroup<ForecastMaturity>
            label="How you call the number"
            error={err('forecastMaturity')}
            options={[
              { value: 'basic', label: 'Gut feel', description: 'Manager experience and instinct' },
              { value: 'intermediate', label: 'CRM + judgment', description: 'Stages tracked; managers adjust' },
              { value: 'advanced', label: 'Weighted pipeline', description: 'Historical close rates by stage' },
              { value: 'ai-assisted', label: 'AI-assisted', description: 'Predictive software on deal signals' },
            ]}
            value={values.forecastMaturity}
            onChange={(v) => s('forecastMaturity', v)}
            columns={2}
          />
        </div>

        <div ref={refs.inspectionCadence}>
          <RadioGroup<InspectionCadence>
            label="Pipeline review cadence"
            error={err('inspectionCadence')}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'biweekly', label: 'Every 2 weeks' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Once a quarter' },
            ]}
            value={values.inspectionCadence}
            onChange={(v) => s('inspectionCadence', v)}
            columns={4}
          />
        </div>

        <SectionDivider label="Concentration risk" />

        <SliderField
          label="Forecast concentration in top deals"
          hint="% of forecast value from your top 3–5 deals"
          value={values.concentrationRiskPct ?? 20}
          onChange={(v) => s('concentrationRiskPct', v)}
          min={0}
          max={70}
          step={5}
          format={(v) => `${v}%`}
        />

        {(values.concentrationRiskPct ?? 20) >= 40 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-medium text-amber-800">
              High deal concentration — losing a single large deal will materially miss the number.
            </p>
          </div>
        )}
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

'use client'

import { FormEvent } from 'react'
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isValid) onNext()
  }

  const isValid =
    values.pipelineCoverageRatio !== undefined &&
    values.winRateBand &&
    values.forecastMaturity &&
    values.inspectionCadence

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <SectionDivider label="Your current pipeline" />

        <SliderField
          label="How much open pipeline do you have vs. your target?"
          hint="Pipeline is the total value of deals your team is actively working. If your target is $1M and you have $3M worth of active deals in progress, your coverage is 3x. The model uses your win rate to calculate how much pipeline you actually need to hit the target."
          value={values.pipelineCoverageRatio ?? 3.0}
          onChange={(v) => s('pipelineCoverageRatio', v)}
          min={1.0}
          max={7.0}
          step={0.5}
          format={(v) => `${v.toFixed(1)}x`}
        />

        <RadioGroup<WinRateBand>
          label="Out of every 10 qualified deals, how many does your team close?"
          hint="A qualified deal is one that has been formally evaluated — not a cold lead or early conversation. Example: if your team closes 2–3 out of every 10 deals that reach the proposal or evaluation stage, your win rate is roughly 20–25%. The model uses this to determine how much pipeline you need to hit your target."
          options={[
            { value: 'under-10pct', label: 'Under 10%', description: '1 in 10 or fewer' },
            { value: '10-15pct', label: '10–15%', description: '1–2 in 10' },
            { value: '15-20pct', label: '15–20%', description: 'About 2 in 10' },
            { value: '20-25pct', label: '20–25%', description: '2 in 10 reliably' },
            { value: '25-35pct', label: '25–35%', description: '2–3 in 10' },
            { value: 'over-35pct', label: '35%+', description: '3–4 in 10 or more' },
          ]}
          value={values.winRateBand}
          onChange={(v) => s('winRateBand', v)}
          columns={3}
        />

        <SectionDivider label="How you forecast" />

        <RadioGroup<ForecastMaturity>
          label="How does your team predict whether you'll hit the number?"
          hint="Be honest — a more sophisticated answer here does not improve your score unless it is accurate. This affects how much uncertainty the model assumes in your forecast."
          options={[
            { value: 'basic', label: 'Gut feel', description: 'Manager calls the number from experience and instinct' },
            { value: 'intermediate', label: 'CRM + judgment', description: 'Deal stages tracked in CRM; managers review and adjust' },
            { value: 'advanced', label: 'Weighted pipeline', description: 'Historical close rates applied by deal stage and rep' },
            { value: 'ai-assisted', label: 'AI-assisted', description: 'Software predicts outcomes based on deal activity signals' },
          ]}
          value={values.forecastMaturity}
          onChange={(v) => s('forecastMaturity', v)}
          columns={2}
        />

        <RadioGroup<InspectionCadence>
          label="How often does leadership formally review the pipeline?"
          hint="More frequent reviews mean slipping deals get caught earlier — leaving more time to recover. If deals tend to slip without warning and you scramble at quarter-end, you are likely reviewing too infrequently."
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

        <SectionDivider label="Deal risk" />

        <SliderField
          label="How much of your forecast depends on your biggest few deals?"
          hint="If 3–5 large deals account for most of your expected revenue this period, losing one deal will materially miss the number. Example: if you have 10 deals in your forecast and the top 3 account for 60% of the total value, set this to 60%. If revenue is spread across many smaller deals, set it lower."
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
              More than 40% of your forecast is riding on a small number of large deals. If any one of them slips or falls through, it will materially impact your results. This significantly increases your plan fragility score.
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
          disabled={!isValid}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </form>
  )
}

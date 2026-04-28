'use client'

import { FormEvent } from 'react'
import type { StressScenariosInput } from '@/lib/stress-test/types'
import { Toggle, SliderField, FormGrid, SectionDivider } from './shared'

interface Props {
  values: Partial<StressScenariosInput>
  onChange: (v: Partial<StressScenariosInput>) => void
  onSubmit: () => Promise<void>
  onBack: () => void
  submitting: boolean
}

function defaults(v: Partial<StressScenariosInput>): StressScenariosInput {
  return {
    hiringDelayed: v.hiringDelayed ?? false,
    hiringDelayQuarters: v.hiringDelayQuarters ?? 1,
    winRateDropPct: v.winRateDropPct ?? 10,
    salesCycleExpansionPct: v.salesCycleExpansionPct ?? 15,
    aspDeclinePct: v.aspDeclinePct ?? 10,
    pipelineDropPct: v.pipelineDropPct ?? 20,
    attritionIncreasePct: v.attritionIncreasePct ?? 5,
  }
}

export default function StepStressScenarios({ values, onChange, onSubmit, onBack, submitting }: Props) {
  const d = defaults(values)

  function s<K extends keyof StressScenariosInput>(key: K, val: StressScenariosInput[K]) {
    onChange({ ...d, [key]: val })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <SectionDivider label="Hiring" />

        <Toggle
          label="Planned hires arrive late"
          checked={d.hiringDelayed}
          onChange={(v) => s('hiringDelayed', v)}
        />

        {d.hiringDelayed && (
          <div className="ml-12 flex gap-2">
            {([1, 2] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => s('hiringDelayQuarters', q)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  d.hiringDelayQuarters === q
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink/10 bg-white text-ink-body hover:border-brand-300'
                }`}
              >
                {q} quarter{q > 1 ? 's' : ''} late
              </button>
            ))}
          </div>
        )}

        <SectionDivider label="Sales performance" />

        <SliderField
          label="Win rate drops"
          value={d.winRateDropPct}
          onChange={(v) => s('winRateDropPct', v)}
          min={0}
          max={35}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SliderField
          label="Sales cycles expand"
          value={d.salesCycleExpansionPct}
          onChange={(v) => s('salesCycleExpansionPct', v)}
          min={0}
          max={60}
          step={5}
          format={(v) => v === 0 ? 'Off' : `+${v}%`}
        />

        <SliderField
          label="Average deal size shrinks"
          value={d.aspDeclinePct}
          onChange={(v) => s('aspDeclinePct', v)}
          min={0}
          max={35}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SectionDivider label="Pipeline" />

        <SliderField
          label="New pipeline generation drops"
          value={d.pipelineDropPct}
          onChange={(v) => s('pipelineDropPct', v)}
          min={0}
          max={60}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SectionDivider label="Team" />

        <SliderField
          label="Attrition increases"
          value={d.attritionIncreasePct}
          onChange={(v) => s('attritionIncreasePct', v)}
          min={0}
          max={25}
          step={5}
          format={(v) => v === 0 ? 'Off' : `+${v}%`}
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
          disabled={submitting}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Running…
            </span>
          ) : (
            'View Results →'
          )}
        </button>
      </div>
    </form>
  )
}

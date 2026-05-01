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

  const anyStressActive =
    d.hiringDelayed ||
    d.winRateDropPct > 0 ||
    d.salesCycleExpansionPct > 0 ||
    d.aspDeclinePct > 0 ||
    d.pipelineDropPct > 0 ||
    d.attritionIncreasePct > 0

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-lg border border-brand-100 bg-brand-50/50 px-4 py-3">
        <p className="text-xs text-brand-700 leading-relaxed">
          These are optional "what if" scenarios. The model calculates your base results first, then shows what happens if one or more of these risks materializes. Toggle on the ones most relevant to your situation.
        </p>
      </div>

      <FormGrid>
        <SectionDivider label="Hiring scenarios" />

        <Toggle
          label="What if new hires get delayed?"
          description="Models the impact if your planned new salespeople join later than expected — due to budget approval delays, slow recruiting, or a headcount freeze."
          checked={d.hiringDelayed}
          onChange={(v) => s('hiringDelayed', v)}
        />

        {d.hiringDelayed && (
          <div className="ml-12">
            <p className="text-sm font-medium text-ink mb-1">How long is the delay?</p>
            <p className="text-xs text-ink-faint mb-2">The model shifts your planned hires forward by this many quarters.</p>
            <div className="flex gap-2">
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
                  {q} quarter{q > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        <SectionDivider label="Sales performance scenarios" />

        <SliderField
          label="What if fewer deals close than usual?"
          hint="This models the effect if your team wins a lower percentage of deals — due to stronger competition, tougher economic conditions, or longer buying processes. Example: if your normal close rate is 25% and you set this to −10%, the model tests what happens at a 22.5% close rate."
          value={d.winRateDropPct}
          onChange={(v) => s('winRateDropPct', v)}
          min={0}
          max={35}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SliderField
          label="What if deals take longer to close?"
          hint="When deals take longer than expected, fewer of them close within the plan period — even if they eventually do close. This models deals slipping to the next quarter or year. Example: a 20% expansion means a 3-month deal takes about 3.5 months instead."
          value={d.salesCycleExpansionPct}
          onChange={(v) => s('salesCycleExpansionPct', v)}
          min={0}
          max={60}
          step={5}
          format={(v) => v === 0 ? 'Off' : `+${v}%`}
        />

        <SliderField
          label="What if your average deal size shrinks?"
          hint="This models the effect of closing deals at lower prices than planned — due to discounting, customers buying smaller packages, or negotiating down from your target price. Example: a 15% decline means a $100K deal averages $85K instead."
          value={d.aspDeclinePct}
          onChange={(v) => s('aspDeclinePct', v)}
          min={0}
          max={35}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SectionDivider label="Pipeline scenarios" />

        <SliderField
          label="What if your team generates less new pipeline than planned?"
          hint="Pipeline is the pool of active deals your team is working. Less pipeline means fewer opportunities to close — even if the team executes well. This could happen if outbound campaigns underperform, inbound leads slow down, or your meeting-booking team is under-resourced."
          value={d.pipelineDropPct}
          onChange={(v) => s('pipelineDropPct', v)}
          min={0}
          max={60}
          step={5}
          format={(v) => v === 0 ? 'Off' : `−${v}%`}
        />

        <SectionDivider label="Team scenarios" />

        <SliderField
          label="What if more salespeople leave than expected?"
          hint="This adds extra turnover on top of the rate you entered earlier. Example: if you entered 15% annual turnover and add +10% here, the stressed scenario models 25% total — which shrinks your effective team size and reduces selling capacity."
          value={d.attritionIncreasePct}
          onChange={(v) => s('attritionIncreasePct', v)}
          min={0}
          max={25}
          step={5}
          format={(v) => v === 0 ? 'Off' : `+${v}%`}
        />
      </FormGrid>

      {!anyStressActive && (
        <div className="mt-4 rounded-lg border border-ink/10 bg-surface-muted px-4 py-3">
          <p className="text-xs text-ink-muted">
            All scenarios are off. Your report will include a base case, an optimistic case, and a pessimistic case only. Toggle scenarios on above to also model your worst case.
          </p>
        </div>
      )}

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
              Running your assessment…
            </span>
          ) : (
            'Generate My Report →'
          )}
        </button>
      </div>
    </form>
  )
}

'use client'

import { FormEvent } from 'react'
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isValid) onNext()
  }

  const isValid =
    values.totalReps !== undefined &&
    values.totalReps >= 1 &&
    values.quotaPerRepBand &&
    values.rampTimeBand &&
    values.avgAttainmentBand &&
    values.annualAttritionBand

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <SectionDivider label="Your sales team" />

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Salespeople with a revenue target"
            hint="Count every rep who has a personal number to hit — account executives, field reps, inside sales. Do not include SDRs, sales engineers, or customer success unless they carry a quota."
            value={values.totalReps ?? ''}
            onChange={(v) => s('totalReps', v)}
            min={1}
            max={5000}
            placeholder="e.g. 12"
          />
          <NumberField
            label="Meeting-booking team (SDRs / BDRs)"
            hint="SDRs and BDRs find and qualify leads, then pass them to closers. They don't close deals themselves. Enter 0 if you don't have this role."
            value={values.sdrCount ?? ''}
            onChange={(v) => s('sdrCount', v)}
            min={0}
            max={2000}
            placeholder="e.g. 4"
          />
        </div>

        <NumberField
          label="New salespeople you plan to hire this period"
          hint="Enter the number of new quota-carrying reps you plan to add — not backfills for people who left, but net new additions. The model accounts for the time it takes them to get up to full speed."
          value={values.plannedHiresTotal ?? ''}
          onChange={(v) => s('plannedHiresTotal', v)}
          min={0}
          max={1000}
          placeholder="e.g. 3"
        />

        <SectionDivider label="Revenue targets & performance" />

        <RadioGroup<QuotaBand>
          label="Annual revenue target per salesperson"
          hint="This is the individual revenue goal assigned to each rep — how much each person is expected to close in a year. If targets vary, use the most common amount. Not sure? Check what's in your CRM or comp plan documents."
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

        <RadioGroup<AttainmentBand>
          label="On average, what % of their target do your reps actually hit?"
          hint="Very few teams hit 100% across the board. This is the team average — not your best rep, not your worst. Example: if reps are each assigned $1M but average $750K in actual revenue closed, enter 70–80%. The model uses this to calculate realistic output, not theoretical maximum."
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

        <SectionDivider label="New hire speed & team turnover" />

        <RadioGroup<RampTimeBand>
          label="How long until a new hire is closing deals at full speed?"
          hint="New salespeople need time to learn the product, understand the market, and build their pipeline before they start closing consistently. Pick the range that reflects how long this typically takes at your company. The model uses this to calculate how much a new hire will actually contribute during the plan period — not just in theory."
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

        <RadioGroup<AttritionBand>
          label="What % of your sales team leaves in a typical year?"
          hint="Include both voluntary departures (resignations) and involuntary exits (performance, restructuring). Example: if 2 out of 10 reps leave per year, enter 20%. The model uses this to estimate how many current reps will still be active — and how many planned hires are actually just replacing people who left."
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

        <SectionDivider label="Management structure" />

        <RadioGroup<ManagerSpanBand>
          label="How many reps does each frontline sales manager oversee?"
          hint="A typical frontline manager effectively coaches 5–8 reps. Managers carrying too many people have less time per rep, which increases execution risk. Pick the range that applies to most of your managers."
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
          label="How are accounts or leads assigned to reps?"
          hint="Pick the option that best describes how your team is organized. This helps the model understand your go-to-market structure."
          options={[
            { value: 'geographic', label: 'Geographic', description: 'By region or location' },
            { value: 'named-account', label: 'Named Account', description: 'Each rep owns a specific account list' },
            { value: 'vertical', label: 'Vertical / Industry', description: 'By industry or company type' },
            { value: 'hybrid', label: 'Hybrid', description: 'Mix of the above' },
            { value: 'round-robin', label: 'Round Robin', description: 'Leads distributed evenly' },
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
          disabled={!isValid}
          className="flex-1 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </form>
  )
}

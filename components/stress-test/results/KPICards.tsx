'use client'

import type { AssessmentOutput } from '@/lib/stress-test/types'

interface Props {
  output: AssessmentOutput
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

interface KPICardProps {
  label: string
  value: string
  sub?: string
  status?: 'good' | 'warning' | 'risk' | 'neutral'
  large?: boolean
}

function KPICard({ label, value, sub, status = 'neutral', large }: KPICardProps) {
  const colors = {
    good: 'bg-green-50 border-green-100',
    warning: 'bg-amber-50 border-amber-100',
    risk: 'bg-red-50 border-red-100',
    neutral: 'bg-white border-ink/8',
  }
  const valueColors = {
    good: 'text-green-700',
    warning: 'text-amber-700',
    risk: 'text-red-700',
    neutral: 'text-ink',
  }

  return (
    <div className={`rounded-xl border p-4 ${colors[status]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p className={`mt-1.5 tabular-nums font-bold leading-none ${large ? 'text-3xl' : 'text-2xl'} ${valueColors[status]}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-faint leading-snug">{sub}</p>}
    </div>
  )
}

export default function KPICards({ output }: Props) {
  const {
    newARRTarget,
    productiveCapacityBase,
    gapToTarget,
    gapToTargetPct,
    headcountRequired,
    headcountCurrent,
    headcountGap,
    effectiveRepsBase,
    rampAdjustedRepsBase,
    coverageSufficiency,
    pipelineCoverageRatio,
    impliedWinRate,
  } = output

  const gapStatus = gapToTarget <= 0 ? 'good' : gapToTargetPct > 0.20 ? 'risk' : 'warning'
  const coverageStatus = coverageSufficiency >= 1.0 ? 'good' : coverageSufficiency >= 0.8 ? 'warning' : 'risk'
  const headcountStatus = headcountGap <= 0 ? 'good' : headcountGap > 3 ? 'risk' : 'warning'

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Key Metrics — Base Case
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          label="New ARR Target"
          value={fmt(newARRTarget)}
          sub="Plan target for period"
          status="neutral"
        />
        <KPICard
          label="Implied Capacity"
          value={fmt(productiveCapacityBase)}
          sub={`${effectiveRepsBase.toFixed(1)} effective reps`}
          status={gapToTarget <= 0 ? 'good' : 'warning'}
        />
        <KPICard
          label="Gap to Target"
          value={gapToTarget <= 0 ? `${fmt(Math.abs(gapToTarget))} buffer` : fmt(gapToTarget)}
          sub={gapToTarget <= 0 ? 'Capacity exceeds target' : `${Math.round(gapToTargetPct * 100)}% of plan at risk`}
          status={gapStatus}
        />
        <KPICard
          label="Coverage Sufficiency"
          value={`${Math.round(coverageSufficiency * 100)}%`}
          sub={`${pipelineCoverageRatio.toFixed(1)}x pipeline at ${Math.round(impliedWinRate * 100)}% win rate`}
          status={coverageStatus}
        />
        <KPICard
          label="Reps Required"
          value={`${headcountRequired}`}
          sub="Fully productive reps to hit target"
          status="neutral"
        />
        <KPICard
          label="Current Effective Reps"
          value={effectiveRepsBase.toFixed(1)}
          sub={`${headcountCurrent} total − attrition − ramp`}
          status={headcountGap <= 0 ? 'good' : 'warning'}
        />
        <KPICard
          label="Headcount Gap"
          value={headcountGap <= 0 ? `${Math.abs(headcountGap)} buffer` : `${headcountGap} short`}
          sub={headcountGap <= 0 ? 'Capacity surplus at base case' : 'Additional quota-carriers needed'}
          status={headcountStatus}
        />
        <KPICard
          label="Ramp-Ceiling Capacity"
          value={fmt(rampAdjustedRepsBase * output.resolved.quotaPerRep * output.resolved.avgAttainment)}
          sub={`${rampAdjustedRepsBase.toFixed(1)} reps at full productivity`}
          status="neutral"
        />
      </div>
    </div>
  )
}

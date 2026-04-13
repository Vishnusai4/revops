'use client'

import type { AssessmentOutput } from '@/lib/stress-test/types'

interface Props {
  output: AssessmentOutput
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${Math.abs(n).toFixed(0)}`
}

export default function ScenarioTable({ output }: Props) {
  const { scenarios } = output

  const scenarioCols = [
    { key: 'Base Case', color: 'text-brand-600', bg: 'bg-brand-50' },
    { key: 'Upside', color: 'text-green-600', bg: 'bg-green-50' },
    { key: 'Downside', color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'Stressed Downside', color: 'text-red-600', bg: 'bg-red-50' },
  ]

  const rows: { label: string; format: (s: (typeof scenarios)[0]) => string; highlight?: boolean }[] = [
    { label: 'Effective Reps', format: (s) => s.effectiveReps.toFixed(1) },
    { label: 'Productive Capacity', format: (s) => fmt(s.productiveCapacity), highlight: true },
    { label: 'Gap to New-Logo Target', format: (s) => {
      if (s.gapToTarget <= 0) return `+${fmt(Math.abs(s.gapToTarget))} buffer`
      return `−${fmt(s.gapToTarget)} short`
    }},
    { label: 'Pipeline Coverage', format: (s) => `${s.pipelineCoverageRatio.toFixed(1)}x` },
    { label: 'Win Rate', format: (s) => `${Math.round(s.winRate * 100)}%` },
    { label: 'Coverage Sufficiency', format: (s) => `${Math.round(s.coverageSufficiency * 100)}%` },
    { label: 'Plan Reachable', format: (s) => s.reachable ? '✓ Yes' : '✗ At risk' },
  ]

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Scenario Comparison
      </h3>

      <div className="overflow-x-auto rounded-xl border border-ink/8">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-ink/8 bg-surface-muted">
              <th className="py-3 px-4 text-left text-xs font-semibold text-ink-muted w-48">Metric</th>
              {scenarioCols.map((col) => {
                const scenario = scenarios.find((s) => s.label === col.key)
                return (
                  <th key={col.key} className="py-3 px-4 text-center text-xs font-semibold">
                    <span className={col.color}>{col.key}</span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={`border-b border-ink/5 ${row.highlight ? 'bg-surface-muted/50' : 'bg-white'} ${
                  i === rows.length - 1 ? 'border-0' : ''
                }`}
              >
                <td className="py-3 px-4 text-xs text-ink-muted font-medium">{row.label}</td>
                {scenarioCols.map((col) => {
                  const scenario = scenarios.find((s) => s.label === col.key)
                  if (!scenario) return <td key={col.key} className="py-3 px-4 text-center text-ink-faint text-xs">—</td>

                  const value = row.format(scenario)
                  const isReachable = row.label === 'Plan Reachable'
                  const isGap = row.label === 'Gap to New-Logo Target'
                  const isCapacity = row.label === 'Productive Capacity'

                  let cellColor = 'text-ink'
                  if (isReachable) cellColor = scenario.reachable ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                  if (isGap) cellColor = scenario.gapToTarget <= 0 ? 'text-green-600' : 'text-red-600'
                  if (isCapacity) cellColor = `${col.color} font-semibold`

                  return (
                    <td key={col.key} className={`py-3 px-4 text-center text-xs tabular-nums ${cellColor}`}>
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

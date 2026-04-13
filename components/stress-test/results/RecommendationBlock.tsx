'use client'

import type { AssessmentOutput } from '@/lib/stress-test/types'

interface Props {
  output: AssessmentOutput
}

const urgencyConfig = {
  immediate: { label: 'Immediate', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500' },
  'near-term': { label: 'Near-Term', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
  strategic: { label: 'Strategic', bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-100', dot: 'bg-brand-500' },
}

function RiskDrivers({ output }: Props) {
  if (!output.topRiskDrivers.length) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Top Risk Drivers
      </h3>
      <div className="space-y-3">
        {output.topRiskDrivers.map((driver, i) => {
          const sev = driver.severity
          const colors = {
            high: { bg: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-100 text-red-700' },
            medium: { bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' },
            low: { bg: 'bg-surface-muted', border: 'border-ink/8', badge: 'bg-ink/8 text-ink-muted' },
          }[sev]

          return (
            <div key={i} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
              <div className="flex items-start gap-3">
                <span className="text-base font-bold text-ink-muted tabular-nums shrink-0 mt-0.5 w-5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-ink">{driver.label}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${colors.badge}`}>
                      {driver.severity}
                    </span>
                  </div>
                  <p className="text-xs text-ink-body leading-relaxed">{driver.description}</p>
                  <p className="mt-1.5 text-xs text-ink-muted italic">{driver.impact}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Recommendations({ output }: Props) {
  if (!output.recommendations.length) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Priority Actions
      </h3>
      <div className="space-y-4">
        {output.recommendations.map((rec, i) => {
          const cfg = urgencyConfig[rec.urgency]
          return (
            <div key={i} className="rounded-xl border border-ink/8 bg-white overflow-hidden">
              <div className={`px-4 py-2.5 flex items-center gap-2.5 ${cfg.bg} border-b ${cfg.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                <p className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</p>
                <span className="text-ink-faint text-xs ml-auto">Action {i + 1}</span>
              </div>
              <div className="px-4 py-4">
                <h4 className="text-sm font-semibold text-ink leading-snug mb-2">{rec.title}</h4>
                <p className="text-xs text-ink-body leading-relaxed">{rec.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BenchmarkTable({ output }: Props) {
  const statusConfig = {
    good: { icon: '✓', text: 'text-green-600', bg: 'bg-green-50' },
    warning: { icon: '⚠', text: 'text-amber-600', bg: 'bg-amber-50' },
    risk: { icon: '✗', text: 'text-red-600', bg: 'bg-red-50' },
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Benchmark Comparison
      </h3>
      <div className="rounded-xl border border-ink/8 overflow-hidden">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-surface-muted border-b border-ink/8">
              <th className="py-2.5 px-4 text-left font-semibold text-ink-muted">Metric</th>
              <th className="py-2.5 px-4 text-center font-semibold text-ink-muted">Your Input</th>
              <th className="py-2.5 px-4 text-left font-semibold text-ink-muted">Benchmark</th>
              <th className="py-2.5 px-4 text-center font-semibold text-ink-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {output.benchmarks.map((b, i) => {
              const cfg = statusConfig[b.status]
              return (
                <tr key={i} className="border-b border-ink/5 bg-white last:border-0">
                  <td className="py-3 px-4 font-medium text-ink-body">{b.metric}</td>
                  <td className="py-3 px-4 text-center font-semibold text-ink tabular-nums">{b.yourValue}</td>
                  <td className="py-3 px-4 text-ink-muted">{b.benchmarkRange}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block rounded px-1.5 py-0.5 font-semibold ${cfg.text} ${cfg.bg}`}>
                      {cfg.icon}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function RecommendationBlock({ output }: Props) {
  return (
    <div className="space-y-8">
      <RiskDrivers output={output} />
      <Recommendations output={output} />
      <BenchmarkTable output={output} />
    </div>
  )
}

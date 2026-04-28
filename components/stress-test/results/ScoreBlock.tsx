'use client'

import type { AssessmentOutput } from '@/lib/stress-test/types'

interface Props {
  output: AssessmentOutput
  companyName?: string
}

function getStatusConfig(status: AssessmentOutput['statusLabel']) {
  switch (status) {
    case 'Stable':
      return { bg: 'bg-green-50', border: 'border-green-200', ring: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-100 text-green-800' }
    case 'Watchlist':
      return { bg: 'bg-amber-50', border: 'border-amber-200', ring: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' }
    case 'Fragile':
      return { bg: 'bg-orange-50', border: 'border-orange-200', ring: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' }
    case 'Exposed':
      return { bg: 'bg-red-50', border: 'border-red-200', ring: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800' }
  }
}

function ScoreDial({ score, color }: { score: number; color: string }) {
  // SVG arc dial — 270° sweep
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const arcLength = (circumference * 270) / 360
  const offset = arcLength - (score / 100) * arcLength

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
      {/* Track */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="10"
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
      />
      {/* Progress */}
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
        className={color}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      {/* Score text */}
      <text x="70" y="66" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="700" fill="#1A1A1A">
        {score}
      </text>
      <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#6B7280">
        / 100
      </text>
    </svg>
  )
}

export default function ScoreBlock({ output, companyName }: Props) {
  const cfg = getStatusConfig(output.statusLabel)

  const subScores = [
    { label: 'Confidence', score: output.confidenceScore, hint: 'Revenue plan achievability' },
    { label: 'Capacity', score: output.capacityScore, hint: 'Team headcount sufficiency' },
    { label: 'Resilience', score: 100 - output.fragilityScore, hint: 'Plan durability under pressure' },
  ]

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 md:p-8`}>
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
        {/* Dial + status */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <ScoreDial score={output.overallScore} color={`text-${output.statusLabel === 'Stable' ? 'green' : output.statusLabel === 'Watchlist' ? 'amber' : output.statusLabel === 'Fragile' ? 'orange' : 'red'}-500`} />
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.ring}`} />
            {output.statusLabel}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1.5">
            Revenue Plan Confidence Score
          </p>
          <h2 className="font-heading text-2xl md:text-3xl tracking-tight text-ink mb-3">
            {output.statusLabel === 'Stable'
              ? 'Your plan looks achievable with manageable risk.'
              : output.statusLabel === 'Watchlist'
              ? 'Your plan is workable, but a few weak spots could slow execution.'
              : output.statusLabel === 'Fragile'
              ? 'Your plan is executable, but exposed to compounding risk.'
              : 'Your target depends on too many things going right.'}
          </h2>
          <p className="text-sm text-ink-body leading-relaxed">
            {output.executiveSummary}
          </p>

          {/* Sub-scores */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {subScores.map(({ label, score, hint }) => (
              <div key={label} className="rounded-xl bg-white/70 border border-white px-3 py-3">
                <p className="text-xl font-bold text-ink tabular-nums">{score}</p>
                <p className="text-xs font-semibold text-ink mt-0.5">{label}</p>
                <p className="text-xs text-ink-faint leading-snug mt-0.5">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

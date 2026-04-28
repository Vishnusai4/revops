'use client'

import { useState, useEffect, FormEvent } from 'react'
import Image from 'next/image'
import type { AssessmentOutput, AssessmentInput, StatusLabel } from '@/lib/stress-test/types'

// ─── Score-band template ──────────────────────────────────────
// All user-facing copy is driven by StatusLabel so future lead magnets
// can swap content by adding/editing a single entry here.
interface BandConfig {
  label: StatusLabel
  headline: string            // one-sentence aha moment
  interpretation: string
  detail: string
  dialStroke: string          // hex — SVG only, not Tailwind
  heroBg: string
  heroBorder: string
  badgeBg: string
  badgeText: string
  dotBg: string
}

export const SCORE_BAND_CONFIG: Record<StatusLabel, BandConfig> = {
  Stable: {
    label: 'Stable',
    headline: 'Your plan is on solid ground.',
    interpretation: 'Your plan looks achievable with manageable risk.',
    detail: 'Your team has the capacity, pipeline, and resilience to hit the number under most conditions. Focus on execution consistency.',
    dialStroke: '#22c55e',
    heroBg: 'bg-green-50',
    heroBorder: 'border-green-200',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
    dotBg: 'bg-green-500',
  },
  Watchlist: {
    label: 'Watchlist',
    headline: 'Your plan works — a few things need attention.',
    interpretation: 'Your plan is workable, but a few weak spots could slow execution.',
    detail: 'There are structural risks worth addressing before the quarter starts. Left unresolved, they compound quickly under pressure.',
    dialStroke: '#f59e0b',
    heroBg: 'bg-amber-50',
    heroBorder: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    dotBg: 'bg-amber-500',
  },
  Fragile: {
    label: 'Fragile',
    headline: 'Your plan has real execution risk right now.',
    interpretation: 'Your plan is executable, but exposed to compounding risk.',
    detail: 'Small execution misses in pipeline, hiring, or attainment can cascade. Address the highest-risk areas before the quarter starts.',
    dialStroke: '#f97316',
    heroBg: 'bg-orange-50',
    heroBorder: 'border-orange-200',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    dotBg: 'bg-orange-500',
  },
  Exposed: {
    label: 'Exposed',
    headline: 'Your plan needs structural fixes before this quarter.',
    interpretation: 'Your target depends on too many things going right.',
    detail: 'The plan has material structural gaps. Without intervention, hitting the number requires near-perfect execution across every lever simultaneously.',
    dialStroke: '#ef4444',
    heroBg: 'bg-red-50',
    heroBorder: 'border-red-200',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
    dotBg: 'bg-red-500',
  },
}

// ─── Helpers ─────────────────────────────────────────────────
function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// ─── Score dial ───────────────────────────────────────────────
function ScoreDial({ score, stroke }: { score: number; stroke: string }) {
  const r = 52
  const arc = (2 * Math.PI * r * 270) / 360
  const circ = 2 * Math.PI * r
  return (
    <svg width="120" height="120" viewBox="0 0 140 140" className="shrink-0">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" transform="rotate(135 70 70)" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={stroke} strokeWidth="10"
        strokeDasharray={`${arc} ${circ}`} strokeDashoffset={arc * (1 - score / 100)}
        strokeLinecap="round" transform="rotate(135 70 70)"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      <text x="70" y="64" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="700" fill="#1A1A1A">{score}</text>
      <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#9CA3AF">/ 100</text>
    </svg>
  )
}

// ─── Email gate ───────────────────────────────────────────────
function EmailGate({ onUnlock }: { onUnlock: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateEmail(email)) { setError('Enter a valid work email.'); return }
    setError('')
    setLoading(true)
    try { await onUnlock(email.trim()) } finally { setLoading(false) }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-6 text-center">
        <p className="text-base font-semibold text-ink mb-1">Unlock your full results</p>
        <p className="text-sm text-ink-muted mb-5">
          Enter your email to see all recommendations and receive your PDF report.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
          <input
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            className="flex-1 rounded-lg border border-ink/10 px-4 py-3 text-sm text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {loading ? 'Sending…' : 'View full results →'}
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <p className="mt-3 text-xs text-ink-faint">No spam. No extra form fields.</p>
      </div>
    </div>
  )
}

// ─── Blurred recommendations teaser ──────────────────────────
function LockedRecommendationTeaser() {
  const items = [
    'Improve pipeline coverage before increasing headcount',
    'Reduce reliance on top-deal concentration',
    'Tighten forecast reviews and stage assumptions',
  ]
  return (
    <div className="relative rounded-2xl border border-ink/10 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-ink/6">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Recommendations</p>
      </div>
      <div className="px-5 py-4 space-y-3 blur-sm select-none pointer-events-none">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-ink/8 bg-surface-muted px-4 py-3">
            <span className="text-xs font-bold text-ink-muted shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-sm text-ink">{item}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white/95 flex items-end justify-center pb-5">
        <p className="text-xs font-semibold text-ink-muted">Enter your email above to unlock</p>
      </div>
    </div>
  )
}

// ─── Full recommendations (unlocked) ─────────────────────────
function FullRecommendations({ output, band }: { output: AssessmentOutput; band: BandConfig }) {
  const urgencyLabel = { immediate: 'Immediate', 'near-term': 'Near-term', strategic: 'Strategic' }
  const urgencyColor = {
    immediate:  { bg: 'bg-red-50',    border: 'border-red-100',    dot: 'bg-red-500',    text: 'text-red-700' },
    'near-term':{ bg: 'bg-amber-50',  border: 'border-amber-100',  dot: 'bg-amber-500',  text: 'text-amber-700' },
    strategic:  { bg: 'bg-brand-50',  border: 'border-brand-100',  dot: 'bg-brand-500',  text: 'text-brand-700' },
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/6">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Priority Actions</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {output.recommendations.map((rec, i) => {
            const c = urgencyColor[rec.urgency]
            return (
              <div key={i} className="rounded-xl border border-ink/8 bg-white overflow-hidden">
                <div className={`px-4 py-2 flex items-center gap-2 ${c.bg} border-b ${c.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
                  <span className={`text-xs font-semibold ${c.text}`}>{urgencyLabel[rec.urgency]}</span>
                  <span className="text-xs text-ink-faint ml-auto">#{i + 1}</span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-ink mb-1">{rec.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed">{rec.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint pt-1">
        Want to walk through this together?{' '}
        <a
          href="https://calendar.app.google/Nhpt6uNLE5Da7Szw7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2 transition-colors"
        >
          Book a free 20-min call →
        </a>
      </p>
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────
interface Props {
  output: AssessmentOutput
  input?: AssessmentInput
  onRestart: () => void
}

export default function ResultsDashboard({ output, input: _input, onRestart }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pdfStatus, setPdfStatus]   = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }, [])

  const band = SCORE_BAND_CONFIG[output.statusLabel]

  // Find scenario data
  const scenarioOrder: Record<string, number> = { Upside: 0, 'Base Case': 1, Downside: 2, 'Stressed Downside': 3 }
  const scenarioColors = ['bg-green-400', 'bg-brand-500', 'bg-amber-400', 'bg-red-400']
  const scenarioLabels = ['Upside', 'Base', 'Downside', 'Stressed']
  const sorted = [...output.scenarios].sort((a, b) => (scenarioOrder[a.label] ?? 9) - (scenarioOrder[b.label] ?? 9))
  const maxCapacity = Math.max(...sorted.map((s) => s.productiveCapacity), 1)

  const topRisk = output.topRiskDrivers[0]
  const riskSevColor = {
    high:   { bg: 'bg-red-50',   border: 'border-red-100',   icon: 'text-red-500' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-500' },
    low:    { bg: 'bg-surface-muted', border: 'border-ink/8', icon: 'text-ink-muted' },
  }

  async function handleUnlock(email: string) {
    // Notify lead
    fetch('/api/stress-test/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    // Send PDF report email (uses simplified input with just email)
    fetch('/api/stress-test/email-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: { lead: { email } }, output }),
    }).catch(() => {})
    setIsUnlocked(true)
  }

  async function downloadPDF() {
    setPdfStatus('loading')
    try {
      const res = await fetch('/api/stress-test/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output, lead: { email: '' } }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'teravictus-revenue-stress-test.pdf'; a.click()
      URL.revokeObjectURL(url)
      setPdfStatus('idle')
    } catch {
      setPdfStatus('error')
      setTimeout(() => setPdfStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-surface-warm">

      {/* Header */}
      <div className="bg-white border-b border-ink/8 sticky top-0 z-30">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Image src="/teravictus-logo.png" alt="Teravictus" width={24} height={24} className="h-6 w-auto" />
            <span className="text-sm font-semibold text-ink">Teravictus</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="text-xs text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-muted"
            >
              Start over
            </button>
            {isUnlocked && (
              <button
                onClick={downloadPDF}
                disabled={pdfStatus === 'loading'}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
              >
                {pdfStatus === 'loading' ? 'Generating…' : pdfStatus === 'error' ? 'Error — retry' : '↓ PDF'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-5">

        {/* ── 1. Score hero ── */}
        <div className={`rounded-2xl border ${band.heroBorder} ${band.heroBg} p-5`}>
          <p className="font-heading text-2xl tracking-tight text-ink mb-4">{band.headline}</p>
          <div className="flex items-center gap-5">
            <ScoreDial score={output.overallScore} stroke={band.dialStroke} />
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2 ${band.badgeBg} ${band.badgeText}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${band.dotBg}`} />
                {band.label}
              </span>
              <p className="text-sm text-ink-muted leading-snug mb-3">{band.interpretation}</p>
              {isUnlocked && (
                <p className="text-xs text-ink-muted leading-relaxed">{band.detail}</p>
              )}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'Confidence', val: output.confidenceScore },
                  { label: 'Capacity',   val: output.capacityScore },
                  { label: 'Resilience', val: 100 - output.fragilityScore },
                ].map(({ label, val }) => (
                  <div key={label} className="rounded-lg bg-white/80 border border-white px-2.5 py-2">
                    <p className="text-lg font-bold text-ink tabular-nums">{val}</p>
                    <p className="text-xs text-ink-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Scenario forecast ── */}
        <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-ink/6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">ARR Forecast</p>
            <p className="text-xs text-ink-faint">Target: <span className="font-semibold text-ink">{fmt(output.newARRTarget)}</span></p>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-4 gap-2">
              {sorted.map((s, i) => {
                const tileStyle = [
                  { val: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-100' },
                  { val: 'text-brand-600', bg: 'bg-brand-50',  border: 'border-brand-100' },
                  { val: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-100' },
                  { val: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-100'   },
                ][i]
                return (
                  <div key={s.label} className={`rounded-xl border ${tileStyle.border} ${tileStyle.bg} px-2 py-3 text-center`}>
                    <p className={`text-lg font-bold tabular-nums ${tileStyle.val}`}>{fmt(s.productiveCapacity)}</p>
                    <p className="text-xs text-ink-faint mt-0.5">{scenarioLabels[i]}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── 3. Top risk ── */}
        {topRisk && (
          <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-ink/6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Top Risk</p>
            </div>
            <div className="px-5 py-4">
              <div className={`flex items-start gap-3 rounded-xl border ${riskSevColor[topRisk.severity].border} ${riskSevColor[topRisk.severity].bg} px-4 py-3`}>
                <span className={`text-base shrink-0 mt-0.5 ${riskSevColor[topRisk.severity].icon}`}>▲</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{topRisk.label}</p>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{topRisk.description}</p>
                  {isUnlocked && (
                    <p className="text-xs text-ink-faint italic mt-1.5">{topRisk.impact}</p>
                  )}
                </div>
              </div>
              {!isUnlocked && output.topRiskDrivers.length > 1 && (
                <p className="text-xs text-ink-faint mt-2.5 text-center">
                  + {output.topRiskDrivers.length - 1} more risk{output.topRiskDrivers.length > 2 ? 's' : ''} in full results
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── 4. Locked: email gate + teaser / Unlocked: full recommendations ── */}
        {isUnlocked ? (
          <FullRecommendations output={output} band={band} />
        ) : (
          <>
            <EmailGate onUnlock={handleUnlock} />
            <LockedRecommendationTeaser />
          </>
        )}

      </div>
    </div>
  )
}

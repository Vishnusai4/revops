'use client'

import { useReducer, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type {
  AssessmentState,
  AssessmentPhase,
  LeadInput,
  CompanyProfileInput,
  TeamInput,
  PipelineInput,
  StressScenariosInput,
  AssessmentOutput,
} from '@/lib/stress-test/types'
import StepIndicator from './StepIndicator'
import StepCompanyProfile from './steps/StepCompanyProfile'
import StepTeamCoverage from './steps/StepTeamCoverage'
import StepPipeline from './steps/StepPipeline'
import StepStressScenarios from './steps/StepStressScenarios'
import ResultsDashboard from './results/ResultsDashboard'

// ─── State defaults ───────────────────────────────────────────
const DEFAULT_STRESS: Partial<StressScenariosInput> = {
  hiringDelayed: false,
  hiringDelayQuarters: 1,
  winRateDropPct: 10,
  salesCycleExpansionPct: 15,
  aspDeclinePct: 10,
  pipelineDropPct: 20,
  attritionIncreasePct: 5,
}

const INITIAL_STATE: AssessmentState = {
  phase: 'intro',
  lead: { email: '' },
  company: {},
  team: {},
  pipeline: { pipelineCoverageRatio: 3.0, concentrationRiskPct: 20 },
  stress: DEFAULT_STRESS,
  output: null,
  error: null,
}

// ─── Reducer ─────────────────────────────────────────────────
type Action =
  | { type: 'SET_PHASE'; phase: AssessmentPhase }
  | { type: 'SET_LEAD'; lead: LeadInput }
  | { type: 'SET_COMPANY'; company: Partial<CompanyProfileInput> }
  | { type: 'SET_TEAM'; team: Partial<TeamInput> }
  | { type: 'SET_PIPELINE'; pipeline: Partial<PipelineInput> }
  | { type: 'SET_STRESS'; stress: Partial<StressScenariosInput> }
  | { type: 'SET_OUTPUT'; output: AssessmentOutput }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' }

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case 'SET_PHASE':     return { ...state, phase: action.phase, error: null }
    case 'SET_LEAD':      return { ...state, lead: action.lead }
    case 'SET_COMPANY':   return { ...state, company: action.company }
    case 'SET_TEAM':      return { ...state, team: action.team }
    case 'SET_PIPELINE':  return { ...state, pipeline: action.pipeline }
    case 'SET_STRESS':    return { ...state, stress: action.stress }
    case 'SET_OUTPUT':    return { ...state, output: action.output, phase: 'results', error: null }
    case 'SET_ERROR':     return { ...state, error: action.error, phase: 'step-5' }
    case 'RESET':         return { ...INITIAL_STATE }
    default:              return state
  }
}

// ─── Session persistence ──────────────────────────────────────
const SESSION_KEY = 'tv-stress-test'

function loadSession(): AssessmentState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AssessmentState) : null
  } catch {
    return null
  }
}

function saveSession(state: AssessmentState) {
  try {
    // Don't persist the results page state — always recalculate
    if (state.phase === 'results') return
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    // sessionStorage unavailable (e.g. private browsing with storage blocked) — no-op
  }
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch { /* no-op */ }
}

// ─── Step meta ────────────────────────────────────────────────
const STEP_PHASES: AssessmentPhase[] = ['step-2', 'step-3', 'step-4', 'step-5']

function phaseToStep(phase: AssessmentPhase): number {
  const idx = STEP_PHASES.indexOf(phase)
  return idx === -1 ? 0 : idx + 1
}

// ─── Wrapper layout for steps ────────────────────────────────
function StepLayout({
  title,
  subtitle,
  children,
  step,
  onBack,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  step: number
  onBack?: () => void
}) {
  return (
    <div className="min-h-screen bg-surface-warm flex flex-col">
      {/* Mini header */}
      <div className="bg-white border-b border-ink/8">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/teravictus-logo.png" alt="Teravictus" width={28} height={28} className="h-7 w-auto" />
            <span className="text-sm font-semibold text-ink">Teravictus</span>
            {onBack && (
              <>
                <span className="text-ink/20 text-sm">/</span>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
          <span className="text-xs text-ink-faint">Revenue Plan Stress Test</span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <StepIndicator currentStep={step} totalSteps={4} />
          </div>

          {/* Step card */}
          <div className="bg-white rounded-2xl border border-ink/8 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-ink/6 bg-surface-muted/40">
              <h1 className="font-heading text-xl tracking-tight text-ink">{title}</h1>
              <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
            </div>
            <div className="px-6 py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function AssessmentFlow() {
  const [state, dispatch] = useReducer(
    reducer,
    INITIAL_STATE,
    // Initializer: restore from sessionStorage on first render (SSR-safe)
    (init: AssessmentState): AssessmentState => {
      if (typeof window === 'undefined') return init
      const saved = loadSession()
      // Don't restore 'calculating' — always go back to step-5
      if (saved && saved.phase === 'calculating') return { ...saved, phase: 'step-5' }
      return saved ?? init
    },
  )

  // Persist to sessionStorage on every state change
  useEffect(() => {
    saveSession(state)
  }, [state])

  // ── Final submit (Step 5)
  const handleFinalSubmit = useCallback(async () => {
    dispatch({ type: 'SET_PHASE', phase: 'calculating' })

    // Fill in any optional defaults before submitting
    const fullInput = {
      lead: state.lead,
      company: {
        expansionContributionPct: 15,
        acvBand: '25k-75k',
        salesCycleBand: '60-90d',
        targetPeriod: 'annual',
        ...state.company,
      },
      team: {
        sdrCount: 0,
        plannedHiresTotal: 0,
        managerSpanBand: '6-7',
        territoryModel: 'hybrid',
        ...state.team,
      },
      pipeline: {
        pipelineCoverageRatio: 3.0,
        concentrationRiskPct: 20,
        ...state.pipeline,
      },
      stress: {
        hiringDelayed: false,
        hiringDelayQuarters: 1,
        winRateDropPct: 10,
        salesCycleExpansionPct: 15,
        aspDeclinePct: 10,
        pipelineDropPct: 20,
        attritionIncreasePct: 5,
        ...state.stress,
      },
    }

    try {
      const res = await fetch('/api/stress-test/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullInput),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        dispatch({ type: 'SET_ERROR', error: json.error ?? 'Calculation failed. Please try again.' })
        return
      }
      clearSession() // Clear session — results don't need persistence
      dispatch({ type: 'SET_OUTPUT', output: json.output as AssessmentOutput })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Network error. Please check your connection and try again.' })
    }
  }, [state])

  const handleReset = useCallback(() => {
    clearSession()
    dispatch({ type: 'RESET' })
  }, [])

  // ── Render: intro
  if (state.phase === 'intro') {
    return (
      <div className="min-h-screen bg-surface-warm flex flex-col">
        <div className="bg-white border-b border-ink/8">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Image src="/teravictus-logo.png" alt="Teravictus" width={36} height={36} className="h-9 w-auto" />
              <span className="text-lg font-semibold text-ink">Teravictus</span>
            </a>
            <a href="/" className="text-sm text-ink-muted hover:text-ink transition-colors">← Back to site</a>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: text + CTA */}
            <div className="lg:w-[420px] shrink-0 text-center lg:text-left">
              <span className="inline-block rounded-full bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 mb-5 uppercase tracking-wide">
                Free · 3 minutes
              </span>
              <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-ink mb-4 leading-tight">
                Revenue Plan<br />Stress Test
              </h1>
              <p className="text-base text-ink leading-relaxed mb-8">
                Know where your plan is fragile — before the quarter exposes it.
              </p>

              <button
                onClick={() => dispatch({ type: 'SET_PHASE', phase: 'step-2' })}
                className="rounded-lg bg-brand-500 px-8 py-4 text-sm font-semibold text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Begin Free Assessment →
              </button>
              <p className="mt-3 text-sm text-ink font-medium">
                No emails. No credit card. No company secrets.
              </p>
            </div>

            {/* Right: sample report preview */}
            <div className="flex-1 w-full min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3 text-center lg:text-left">
                Sample report
              </p>
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/8">

                {/* Branded header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#a5b4fc' }}>Teravictus</p>
                    <p className="text-sm font-semibold text-white">Revenue Plan Stress Test</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-white/90">Acme Corp</p>
                    <p className="text-[10px]" style={{ color: '#a5b4fc' }}>Q2 2026</p>
                  </div>
                </div>

                {/* Score + sub-scores */}
                <div className="px-5 pt-5 pb-4 border-b border-amber-100" style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
                  {/* Top row: dial + headline */}
                  <div className="flex items-center gap-4 mb-4">
                    <svg width="80" height="80" viewBox="0 0 140 140" className="shrink-0">
                      <circle cx="70" cy="70" r="52" fill="none" stroke="#FDE68A" strokeWidth="13"
                        strokeDasharray={`${(2 * Math.PI * 52 * 270) / 360} ${2 * Math.PI * 52}`}
                        strokeLinecap="round" transform="rotate(135 70 70)" />
                      <circle cx="70" cy="70" r="52" fill="none" stroke="#F59E0B" strokeWidth="13"
                        strokeDasharray={`${(2 * Math.PI * 52 * 270) / 360} ${2 * Math.PI * 52}`}
                        strokeDashoffset={(2 * Math.PI * 52 * 270) / 360 * (1 - 0.63)}
                        strokeLinecap="round" transform="rotate(135 70 70)" />
                      <text x="70" y="64" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="800" fill="#1A1A1A">63</text>
                      <text x="70" y="83" textAnchor="middle" fontSize="10" fill="#9CA3AF">/100</text>
                    </svg>
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold px-2.5 py-1 mb-1.5" style={{ background: '#F59E0B', color: '#fff' }}>
                        ⚠ Fragile
                      </span>
                      <p className="text-sm font-bold text-ink leading-snug">Your plan has real execution risk this quarter.</p>
                    </div>
                  </div>
                  {/* Sub-scores row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Confidence', val: 71, color: '#6366F1' },
                      { label: 'Capacity',   val: 58, color: '#F59E0B' },
                      { label: 'Resilience', val: 62, color: '#10B981' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="rounded-xl bg-white border border-white/80 px-3 py-2.5 shadow-sm">
                        <span className="text-xl font-extrabold tabular-nums" style={{ color }}>{val}</span>
                        <p className="text-[10px] text-ink-muted font-medium mt-0.5">{label}</p>
                        <div className="mt-1.5 h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forecast range */}
                <div className="bg-white px-5 py-4 border-b border-black/6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint mb-3">ARR Forecast Range</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Best',     value: '$5.8M', pct: 97, color: '#16A34A', bg: '#DCFCE7' },
                      { label: 'Plan',     value: '$4.2M', pct: 70, color: '#6366F1', bg: '#EEF2FF', bold: true },
                      { label: 'Low',      value: '$3.1M', pct: 52, color: '#D97706', bg: '#FEF3C7' },
                      { label: 'Stressed', value: '$1.9M', pct: 32, color: '#DC2626', bg: '#FEE2E2' },
                    ].map(({ label, value, pct, color, bg, bold }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className={`text-[10px] w-14 shrink-0 ${bold ? 'font-bold text-ink' : 'text-ink-muted'}`}>{label}</span>
                        <div className="flex-1 h-6 rounded-lg overflow-hidden bg-gray-50 relative">
                          <div className="h-full rounded-lg" style={{ width: `${pct}%`, background: bg }} />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums shrink-0 w-10 text-right" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk + CTA */}
                <div className="bg-white px-5 py-4">
                  <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 mb-3 bg-red-50 border border-red-100">
                    <span className="text-red-500 shrink-0 text-base leading-none mt-0.5">▲</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-0.5">Critical risk</p>
                      <p className="text-xs font-medium text-red-900">Pipeline coverage below the 3× safety threshold</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-brand-600 text-center">4 prioritized actions in your report →</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ── Render: results
  if (state.phase === 'results' && state.output) {
    const fullInput = {
      lead: state.lead,
      company: { expansionContributionPct: 15, ...state.company } as CompanyProfileInput,
      team: { sdrCount: 0, plannedHiresTotal: 0, managerSpanBand: '6-7' as const, territoryModel: 'hybrid' as const, ...state.team } as TeamInput,
      pipeline: { pipelineCoverageRatio: 3.0, concentrationRiskPct: 20, ...state.pipeline } as PipelineInput,
      stress: { hiringDelayed: false, hiringDelayQuarters: 1 as const, winRateDropPct: 10, salesCycleExpansionPct: 15, aspDeclinePct: 10, pipelineDropPct: 20, attritionIncreasePct: 5, ...state.stress } as StressScenariosInput,
    }
    return (
      <ResultsDashboard
        output={state.output}
        input={fullInput}
        onRestart={handleReset}
      />
    )
  }

  // ── Render: calculating
  if (state.phase === 'calculating') {
    return (
      <div className="min-h-screen bg-surface-warm flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="relative h-16 w-16">
              <svg className="animate-spin h-16 w-16 text-brand-200" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <svg className="animate-spin h-16 w-16 text-brand-500 absolute inset-0" style={{ animationDuration: '0.75s' }} fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
              </svg>
            </div>
          </div>
          <h2 className="font-heading text-2xl text-ink mb-2">Running your assessment</h2>
          <p className="text-sm text-ink-muted">Modeling scenarios, scoring your plan, and generating recommendations…</p>
        </div>
      </div>
    )
  }

  // ── Render: step forms
  return (
    <>
      {state.phase === 'step-2' && (
        <StepLayout
          step={1}
          title="About your company and plan"
          subtitle="Tell us what you're trying to hit and how your business sells. Estimates are fine."
          onBack={() => dispatch({ type: 'SET_PHASE', phase: 'intro' })}
        >
          <StepCompanyProfile
            values={state.company}
            onChange={(company) => dispatch({ type: 'SET_COMPANY', company })}
            onNext={() => dispatch({ type: 'SET_PHASE', phase: 'step-3' })}
            onBack={() => dispatch({ type: 'SET_PHASE', phase: 'intro' })}
          />
        </StepLayout>
      )}

      {state.phase === 'step-3' && (
        <StepLayout
          step={2}
          title="Your sales team"
          subtitle="Tell us about the people responsible for hitting the revenue target."
        >
          <StepTeamCoverage
            values={state.team}
            onChange={(team) => dispatch({ type: 'SET_TEAM', team })}
            onNext={() => dispatch({ type: 'SET_PHASE', phase: 'step-4' })}
            onBack={() => dispatch({ type: 'SET_PHASE', phase: 'step-2' })}
          />
        </StepLayout>
      )}

      {state.phase === 'step-4' && (
        <StepLayout
          step={3}
          title="Your pipeline and forecast"
          subtitle="Tell us about the deals in progress and how you predict whether you'll hit the number."
        >
          <StepPipeline
            values={state.pipeline}
            onChange={(pipeline) => dispatch({ type: 'SET_PIPELINE', pipeline })}
            onNext={() => dispatch({ type: 'SET_PHASE', phase: 'step-5' })}
            onBack={() => dispatch({ type: 'SET_PHASE', phase: 'step-3' })}
          />
        </StepLayout>
      )}

      {state.phase === 'step-5' && (
        <StepLayout
          step={4}
          title="What-if scenarios"
          subtitle="Choose the risks you want to model. The report will show what happens if these materialize."
        >
          {state.error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700 font-medium">{state.error}</p>
            </div>
          )}
          <StepStressScenarios
            values={state.stress}
            onChange={(stress) => dispatch({ type: 'SET_STRESS', stress })}
            onSubmit={handleFinalSubmit}
            onBack={() => dispatch({ type: 'SET_PHASE', phase: 'step-4' })}
            submitting={false}
          />
        </StepLayout>
      )}
    </>
  )
}

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
import StepLeadCapture from './steps/StepLeadCapture'
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
const STEP_PHASES: AssessmentPhase[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5']

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
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  step: number
}) {
  return (
    <div className="min-h-screen bg-surface-warm flex flex-col">
      {/* Mini header */}
      <div className="bg-white border-b border-ink/8">
        <div className="mx-auto max-w-2xl px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Image src="/teravictus-logo.png" alt="Teravictus" width={28} height={28} className="h-7 w-auto" />
            <span className="text-sm font-semibold text-ink">Teravictus</span>
          </a>
          <span className="text-xs text-ink-faint">Revenue Plan Stress Test</span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <StepIndicator currentStep={step} totalSteps={5} />
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

  // ── Lead capture submit (Step 1)
  const handleLeadSubmit = useCallback(async (lead: LeadInput) => {
    dispatch({ type: 'SET_LEAD', lead })
    // Fire lead API — non-blocking: we advance even if it fails
    fetch('/api/stress-test/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch((err) => console.error('[AssessmentFlow] Lead API error:', err))

    dispatch({ type: 'SET_PHASE', phase: 'step-2' })
  }, [])

  // ── Final submit (Step 5)
  const handleFinalSubmit = useCallback(async () => {
    dispatch({ type: 'SET_PHASE', phase: 'calculating' })

    // Fill in any optional defaults before submitting
    const fullInput = {
      lead: state.lead,
      company: {
        expansionContributionPct: 15,
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

      // Non-blocking: generate and email the PDF report to the user
      fetch('/api/stress-test/email-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: fullInput, output: json.output }),
      }).catch((err) => console.error('[AssessmentFlow] Email-PDF error:', err))
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

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-2xl w-full text-center">
            <span className="inline-block rounded-full bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 mb-6 uppercase tracking-wide">
              Free Assessment
            </span>
            <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-ink mb-4">
              Revenue Plan Stress Test
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed mb-8 max-w-xl mx-auto">
              Pressure-test your growth plan, headcount capacity, and forecast resilience in under 10 minutes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              {[
                { icon: '◎', title: 'Confidence score', body: 'Revenue plan achievability rated 0–100 with breakdown' },
                { icon: '◈', title: '4-scenario model', body: 'Base, upside, downside, and stressed downside cases' },
                { icon: '◉', title: 'Strategic report', body: 'Downloadable PDF with charts, benchmarks, and actions' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-ink/8 bg-white px-4 py-4">
                  <span className="text-brand-500 text-lg">{f.icon}</span>
                  <p className="mt-2 text-sm font-semibold text-ink">{f.title}</p>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => dispatch({ type: 'SET_PHASE', phase: 'step-1' })}
              className="rounded-lg bg-brand-500 px-8 py-4 text-sm font-semibold text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Begin the Assessment →
            </button>
            <p className="mt-3 text-xs text-ink-faint">
              For CROs, VP RevOps, and GTM leaders. No credit card.
            </p>
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
  const stepNum = phaseToStep(state.phase)

  return (
    <>
      {state.phase === 'step-1' && (
        <StepLayout
          step={1}
          title="Let's get started"
          subtitle="Enter your email to begin. We'll send your completed report here."
        >
          <StepLeadCapture
            values={state.lead}
            onSubmit={handleLeadSubmit}
          />
        </StepLayout>
      )}

      {state.phase === 'step-2' && (
        <StepLayout
          step={2}
          title="About your company and plan"
          subtitle="Tell us what you're trying to hit and how your business sells. Estimates are fine."
        >
          <StepCompanyProfile
            values={state.company}
            onChange={(company) => dispatch({ type: 'SET_COMPANY', company })}
            onNext={() => dispatch({ type: 'SET_PHASE', phase: 'step-3' })}
            onBack={() => dispatch({ type: 'SET_PHASE', phase: 'step-1' })}
          />
        </StepLayout>
      )}

      {state.phase === 'step-3' && (
        <StepLayout
          step={3}
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
          step={4}
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
          step={5}
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

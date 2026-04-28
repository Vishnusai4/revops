'use client'

import { useReducer, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { AssessmentOutput } from '@/lib/stress-test/types'
import type { QuizARRBand, QuizAmbition, QuizAttainment, QuizPipelineHealth } from '@/lib/stress-test/quiz-types'
import { scoreQuiz } from '@/lib/stress-test/quiz-scoring'
import StepIndicator from './StepIndicator'
import QuizStep from './steps/QuizStep'
import ResultsDashboard from './results/ResultsDashboard'

// ─── Analytics ────────────────────────────────────────────────
function trackPage(url: string, title: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).umami?.track((props: Record<string, unknown>) => ({ ...props, url, title }))
  } catch {}
}

// ─── State ───────────────────────────────────────────────────
type QuizPhase = 'intro' | 'step-1' | 'step-2' | 'step-3' | 'results'

interface QuizState {
  phase: QuizPhase
  arrBand:       QuizARRBand       | null
  ambition:      QuizAmbition      | null
  attainment:    QuizAttainment    | null
  pipelineHealth:QuizPipelineHealth| null
  output:        AssessmentOutput  | null
}

const INITIAL: QuizState = {
  phase: 'intro',
  arrBand: null, ambition: null, attainment: null, pipelineHealth: null,
  output: null,
}

type Action =
  | { type: 'SET_PHASE'; phase: QuizPhase }
  | { type: 'SET_ARR'; arrBand: QuizARRBand }
  | { type: 'SET_AMBITION'; ambition: QuizAmbition }
  | { type: 'SET_ATTAINMENT'; attainment: QuizAttainment }
  | { type: 'SET_PIPELINE'; pipelineHealth: QuizPipelineHealth }
  | { type: 'SET_OUTPUT'; output: AssessmentOutput }
  | { type: 'RESET' }

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'SET_PHASE':      return { ...state, phase: action.phase }
    case 'SET_ARR':        return { ...state, arrBand: action.arrBand }
    case 'SET_AMBITION':   return { ...state, ambition: action.ambition }
    case 'SET_ATTAINMENT': return { ...state, attainment: action.attainment }
    case 'SET_PIPELINE':   return { ...state, pipelineHealth: action.pipelineHealth }
    case 'SET_OUTPUT':     return { ...state, output: action.output, phase: 'results' }
    case 'RESET':          return { ...INITIAL }
    default:               return state
  }
}

// ─── Session storage ──────────────────────────────────────────
const SESSION_KEY = 'tv-quiz-v2'

function loadSession(): QuizState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as QuizState) : null
  } catch { return null }
}

function saveSession(s: QuizState) {
  try {
    if (s.phase === 'results') return
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch {}
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch {}
}

// ─── Umami page map ───────────────────────────────────────────
const PAGE_MAP: Record<QuizPhase, { url: string; title: string }> = {
  intro:    { url: '/stress-test',            title: 'Stress Test – Intro' },
  'step-1': { url: '/stress-test/q1-size',    title: 'Stress Test – Q1: Company size' },
  'step-2': { url: '/stress-test/q2-ambition',title: 'Stress Test – Q2: Growth ambition' },
  'step-3': { url: '/stress-test/q3-team',    title: 'Stress Test – Q3: Team & pipeline' },
  results:  { url: '/stress-test/results',    title: 'Stress Test – Results' },
}

// ─── Step shell ───────────────────────────────────────────────
function QuizShell({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-warm flex flex-col">
      <div className="bg-white border-b border-ink/8">
        <div className="mx-auto max-w-xl px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Image src="/teravictus-logo.png" alt="Teravictus" width={28} height={28} className="h-7 w-auto" />
            <span className="text-sm font-semibold text-ink">Teravictus</span>
          </a>
          <span className="text-xs text-ink-faint">Revenue Plan Stress Test</span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-10">
            <StepIndicator currentStep={step} totalSteps={3} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function AssessmentFlow() {
  const [state, dispatch] = useReducer(reducer, INITIAL, (init) => {
    if (typeof window === 'undefined') return init
    return loadSession() ?? init
  })

  useEffect(() => { saveSession(state) }, [state])

  useEffect(() => {
    const p = PAGE_MAP[state.phase]
    if (p) trackPage(p.url, p.title)
  }, [state.phase])

  const handleReset = useCallback(() => {
    clearSession()
    dispatch({ type: 'RESET' })
  }, [])

  // ── Compute results client-side (no API call)
  const handleViewResults = useCallback(() => {
    const { arrBand, ambition, attainment, pipelineHealth } = state
    if (!arrBand || !ambition || !attainment || !pipelineHealth) return
    const output = scoreQuiz({ arrBand, ambition, attainment, pipelineHealth })
    clearSession()
    dispatch({ type: 'SET_OUTPUT', output })
  }, [state])

  // ── Intro (untouched) ──────────────────────────────────────
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
                Free · 2 minutes
              </span>
              <h1 className="font-heading text-4xl md:text-5xl tracking-tight text-ink mb-4 leading-tight">
                Revenue Plan<br />Stress Test
              </h1>
              <p className="text-base text-ink leading-relaxed mb-8">
                Know where your plan is fragile — before the quarter exposes it.
              </p>

              <button
                onClick={() => dispatch({ type: 'SET_PHASE', phase: 'step-1' })}
                className="rounded-lg bg-brand-500 px-8 py-4 text-sm font-semibold text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Begin Free Assessment →
              </button>
              <p className="mt-3 text-sm text-ink font-medium">
                No credit card. No company secrets required.
              </p>
            </div>

            {/* Right: sample report preview */}
            <div className="flex-1 w-full min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-3 text-center lg:text-left">
                Sample report
              </p>
              <div className="rounded-2xl border border-ink/10 bg-white shadow-md overflow-hidden">

                {/* Score block */}
                <div className="bg-amber-50 border-b border-amber-100 px-5 py-5">
                  <div className="flex items-center gap-5">
                    <svg width="88" height="88" viewBox="0 0 140 140" className="shrink-0">
                      <circle cx="70" cy="70" r="52" fill="none" stroke="#E5E7EB" strokeWidth="10"
                        strokeDasharray={`${(2 * Math.PI * 52 * 270) / 360} ${2 * Math.PI * 52}`}
                        strokeLinecap="round" transform="rotate(135 70 70)" />
                      <circle cx="70" cy="70" r="52" fill="none" stroke="#F59E0B" strokeWidth="10"
                        strokeDasharray={`${(2 * Math.PI * 52 * 270) / 360} ${2 * Math.PI * 52}`}
                        strokeDashoffset={(2 * Math.PI * 52 * 270) / 360 * (1 - 0.63)}
                        strokeLinecap="round" transform="rotate(135 70 70)" />
                      <text x="70" y="66" textAnchor="middle" dominantBaseline="middle" fontSize="30" fontWeight="700" fill="#1A1A1A">63</text>
                      <text x="70" y="86" textAnchor="middle" fontSize="11" fill="#6B7280">/ 100</text>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Fragile
                      </span>
                      <p className="text-sm font-semibold text-ink leading-snug">Your plan is executable but exposed to compounding risk.</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[{ label: 'Confidence', val: 71 }, { label: 'Capacity', val: 58 }, { label: 'Resilience', val: 62 }].map(({ label, val }) => (
                          <div key={label} className="rounded-lg bg-white/80 border border-amber-100 px-2.5 py-2">
                            <p className="text-base font-bold text-ink">{val}</p>
                            <p className="text-xs text-ink-muted">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scenario tiles */}
                <div className="px-5 py-4 border-b border-ink/6">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Best',  value: '$5.8M', val: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-100' },
                      { label: 'Plan',  value: '$4.2M', val: 'text-brand-600', bg: 'bg-brand-50',  border: 'border-brand-100' },
                      { label: 'Low',   value: '$3.1M', val: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-100' },
                      { label: 'Worst', value: '$1.9M', val: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-100'   },
                    ].map(({ label, value, val, bg, border }) => (
                      <div key={label} className={`rounded-xl border ${border} ${bg} px-2 py-3 text-center`}>
                        <p className={`text-base font-bold tabular-nums ${val}`}>{value}</p>
                        <p className="text-xs text-ink-faint mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top risk */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-100 px-3.5 py-3">
                    <span className="text-red-500 text-sm shrink-0">▲</span>
                    <p className="text-xs font-semibold text-ink">Pipeline too thin to hit the base case</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-600 mt-3 text-center">4 recommendations in your report →</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────
  if (state.phase === 'results' && state.output) {
    return (
      <ResultsDashboard
        output={state.output}
        onRestart={handleReset}
      />
    )
  }

  // ── Step 1: Company size ───────────────────────────────────
  if (state.phase === 'step-1') {
    return (
      <QuizShell step={1}>
        <QuizStep<QuizARRBand>
          question="How big is your business today?"
          options={[
            { value: 'under-1m', label: 'Under $1M ARR' },
            { value: '1m-5m',   label: '$1M–$5M ARR' },
            { value: '5m-20m',  label: '$5M–$20M ARR' },
            { value: '20m-50m', label: '$20M–$50M ARR' },
            { value: '50m-plus',label: '$50M+ ARR' },
          ]}
          value={state.arrBand}
          onChange={(v) => dispatch({ type: 'SET_ARR', arrBand: v })}
          autoAdvance
          onAdvance={() => dispatch({ type: 'SET_PHASE', phase: 'step-2' })}
        />
      </QuizShell>
    )
  }

  // ── Step 2: Growth ambition ────────────────────────────────
  if (state.phase === 'step-2') {
    return (
      <QuizShell step={2}>
        <QuizStep<QuizAmbition>
          question="How ambitious is your growth target right now?"
          options={[
            { value: 'conservative',    label: 'Conservative',    description: 'We can likely hit it with our current setup' },
            { value: 'moderate',        label: 'Moderate',        description: "It's a stretch, but realistic" },
            { value: 'aggressive',      label: 'Aggressive',      description: 'We need several things to go right' },
            { value: 'very-aggressive', label: 'Very aggressive', description: 'It depends on near-perfect execution' },
          ]}
          value={state.ambition}
          onChange={(v) => dispatch({ type: 'SET_AMBITION', ambition: v })}
          autoAdvance
          onAdvance={() => dispatch({ type: 'SET_PHASE', phase: 'step-3' })}
        />
      </QuizShell>
    )
  }

  // ── Step 3: Attainment + pipeline ─────────────────────────
  if (state.phase === 'step-3') {
    const bothAnswered = state.attainment !== null && state.pipelineHealth !== null
    return (
      <QuizShell step={3}>
        <div className="space-y-10">
          <QuizStep<QuizAttainment>
            question="How often does your team hit its sales goal?"
            options={[
              { value: 'rarely',         label: 'Rarely' },
              { value: 'sometimes',      label: 'Sometimes' },
              { value: 'often',          label: 'Often' },
              { value: 'most',           label: 'Most months / quarters' },
              { value: 'almost-always',  label: 'Almost always' },
            ]}
            value={state.attainment}
            onChange={(v) => dispatch({ type: 'SET_ATTAINMENT', attainment: v })}
          />

          <QuizStep<QuizPipelineHealth>
            question="How healthy does your pipeline feel right now?"
            options={[
              { value: 'clearly-short',   label: "We're clearly short on future deals" },
              { value: 'thin',            label: 'We have some pipeline, but it feels thin' },
              { value: 'probably-enough', label: 'We probably have enough if deals move as expected' },
              { value: 'solid',           label: 'We have solid coverage' },
              { value: 'more-than-enough',label: 'We have more than enough pipeline for the target' },
            ]}
            value={state.pipelineHealth}
            onChange={(v) => dispatch({ type: 'SET_PIPELINE', pipelineHealth: v })}
          />

          <button
            onClick={handleViewResults}
            disabled={!bothAnswered}
            className="w-full rounded-xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            View Results →
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'step-2' })}
            className="w-full text-center text-sm text-ink-muted hover:text-ink transition-colors py-1"
          >
            ← Back
          </button>
        </div>
      </QuizShell>
    )
  }

  return null
}

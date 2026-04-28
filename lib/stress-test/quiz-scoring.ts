// ─── Client-side scoring for the 4-question quiz ─────────────
// Takes qualitative answers → produces AssessmentOutput
// No API call needed; all logic is deterministic and fast.

import type {
  AssessmentOutput,
  StatusLabel,
  ScenarioResult,
  RiskDriver,
  Recommendation,
} from './types'
import type {
  QuizARRBand,
  QuizAmbition,
  QuizAttainment,
  QuizPipelineHealth,
  QuizInput,
} from './quiz-types'

// ─── Base ARR by band ($) ─────────────────────────────────────
const BASE_ARR: Record<QuizARRBand, number> = {
  'under-1m': 500_000,
  '1m-5m':    2_500_000,
  '5m-20m':  10_000_000,
  '20m-50m': 30_000_000,
  '50m-plus':75_000_000,
}

// ─── Growth rate by ambition ──────────────────────────────────
const GROWTH_RATE: Record<QuizAmbition, number> = {
  conservative:    0.15,
  moderate:        0.30,
  aggressive:      0.50,
  'very-aggressive': 0.75,
}

// ─── Attainment multiplier (fraction of capacity realized) ────
const ATTAINMENT_MULT: Record<QuizAttainment, number> = {
  rarely:          0.42,
  sometimes:       0.62,
  often:           0.78,
  most:            0.88,
  'almost-always': 0.96,
}

// ─── Pipeline adjustment ──────────────────────────────────────
const PIPELINE_ADJ: Record<QuizPipelineHealth, number> = {
  'clearly-short':   0.62,
  thin:              0.80,
  'probably-enough': 1.00,
  solid:             1.14,
  'more-than-enough':1.30,
}

// ─── Score helpers (clamped to 0–100) ────────────────────────
function clamp(n: number) { return Math.round(Math.max(5, Math.min(100, n))) }

function confidenceScore(ambition: QuizAmbition, attainment: QuizAttainment, pipeline: QuizPipelineHealth): number {
  let s = 70
  s += { conservative: 18, moderate: 5, aggressive: -12, 'very-aggressive': -28 }[ambition]
  s += { rarely: -28, sometimes: -14, often: 0, most: 8, 'almost-always': 15 }[attainment]
  s += { 'clearly-short': -22, thin: -10, 'probably-enough': 0, solid: 8, 'more-than-enough': 15 }[pipeline]
  return clamp(s)
}

function capacityScore(ambition: QuizAmbition, attainment: QuizAttainment, pipeline: QuizPipelineHealth): number {
  let s = 68
  s += { rarely: -32, sometimes: -18, often: -5, most: 8, 'almost-always': 18 }[attainment]
  s += { conservative: 12, moderate: 2, aggressive: -8, 'very-aggressive': -20 }[ambition]
  s += { 'clearly-short': -12, thin: -5, 'probably-enough': 3, solid: 8, 'more-than-enough': 12 }[pipeline]
  return clamp(s)
}

function fragilityScore(ambition: QuizAmbition, attainment: QuizAttainment, pipeline: QuizPipelineHealth): number {
  let s = 30
  s += { 'clearly-short': 35, thin: 20, 'probably-enough': 5, solid: -5, 'more-than-enough': -15 }[pipeline]
  s += { conservative: -10, moderate: 0, aggressive: 12, 'very-aggressive': 25 }[ambition]
  s += { rarely: 20, sometimes: 10, often: 0, most: -8, 'almost-always': -15 }[attainment]
  return clamp(s)
}

function overallScore(conf: number, cap: number, frag: number): number {
  return clamp(conf * 0.40 + cap * 0.35 + (100 - frag) * 0.25)
}

function statusLabel(score: number): StatusLabel {
  if (score >= 80) return 'Stable'
  if (score >= 60) return 'Watchlist'
  if (score >= 40) return 'Fragile'
  return 'Exposed'
}

// ─── Risk drivers ─────────────────────────────────────────────
function buildRisks(ambition: QuizAmbition, attainment: QuizAttainment, pipeline: QuizPipelineHealth): RiskDriver[] {
  const risks: RiskDriver[] = []

  if (pipeline === 'clearly-short') {
    risks.push({
      label: 'Pipeline is critically thin',
      severity: 'high',
      description: 'You currently have far fewer active deals than needed to hit the target, even under optimistic assumptions.',
      impact: 'Without significant pipeline generation now, the target is not achievable.',
    })
  } else if (pipeline === 'thin') {
    risks.push({
      label: 'Pipeline coverage is below the safe threshold',
      severity: 'medium',
      description: 'Your pipeline has some deals, but not enough buffer to absorb slippage or lost deals.',
      impact: 'Losing one or two deals will materially affect whether you hit the number.',
    })
  }

  if (attainment === 'rarely' || attainment === 'sometimes') {
    risks.push({
      label: 'Team is not consistently hitting quota',
      severity: attainment === 'rarely' ? 'high' : 'medium',
      description: 'When reps routinely fall short of their individual targets, the collective shortfall compounds quickly.',
      impact: 'Low attainment is a capacity problem — your plan needs more output than your team currently delivers.',
    })
  }

  if (ambition === 'very-aggressive') {
    risks.push({
      label: 'Plan depends on near-perfect execution',
      severity: 'high',
      description: 'At this level of ambition, every lever needs to perform at or above expectations simultaneously.',
      impact: 'Any meaningful miss in pipeline, attainment, or timing creates a compounding shortfall.',
    })
  } else if (ambition === 'aggressive') {
    risks.push({
      label: 'Plan has limited margin for error',
      severity: 'medium',
      description: 'An aggressive target requires most things to go right. A few simultaneous misses can cascade.',
      impact: 'Build contingency plans for the two or three most likely execution misses.',
    })
  }

  // Always add a general risk if nothing specific
  if (risks.length === 0) {
    risks.push({
      label: 'Forecast accuracy risk',
      severity: 'low',
      description: 'Even well-structured plans carry execution risk. The gap between plan and actual is typically 10–20%.',
      impact: 'Monitor pipeline health weekly and tighten assumptions early in the period.',
    })
  }

  return risks.slice(0, 3)
}

// ─── Recommendations ─────────────────────────────────────────
function buildRecommendations(ambition: QuizAmbition, attainment: QuizAttainment, pipeline: QuizPipelineHealth): Recommendation[] {
  const recs: Recommendation[] = []
  let priority = 1

  if (pipeline === 'clearly-short' || pipeline === 'thin') {
    recs.push({
      priority: priority++,
      title: pipeline === 'clearly-short'
        ? 'Urgently rebuild pipeline before committing to the target'
        : 'Add at least 50% more pipeline coverage now',
      description: pipeline === 'clearly-short'
        ? 'Your current pipeline cannot support the target under any realistic scenario. Prioritize pipeline generation above all else before the quarter starts.'
        : 'At current coverage, a single deal slip will materially miss the number. Increase inbound, outbound, or both before the period begins.',
      urgency: pipeline === 'clearly-short' ? 'immediate' : 'near-term',
    })
  }

  if (attainment === 'rarely' || attainment === 'sometimes') {
    recs.push({
      priority: priority++,
      title: 'Identify and close the attainment gap',
      description: 'Find your top 20% of reps and understand exactly what they do differently. Systematically replicate those behaviours across the team — coaching, deal reviews, and qualification discipline.',
      urgency: 'immediate',
    })
  }

  if (ambition === 'very-aggressive' || ambition === 'aggressive') {
    recs.push({
      priority: priority++,
      title: 'Build a scenario response plan now',
      description: 'Define your response in advance: what do you do if pipeline drops 20%? If a key rep leaves? Answering these now means you execute faster when it matters.',
      urgency: 'near-term',
    })
  }

  // Always add a strategic recommendation
  recs.push({
    priority: priority++,
    title: 'Tighten forecast hygiene and review cadence',
    description: 'Weekly pipeline reviews with clear stage criteria reduce late-quarter surprises. Even small improvements in forecast accuracy compound into meaningful gains over time.',
    urgency: 'strategic',
  })

  if (pipeline === 'probably-enough' || pipeline === 'solid' || pipeline === 'more-than-enough') {
    recs.push({
      priority: priority++,
      title: 'Protect your pipeline health as you scale',
      description: 'Strong pipeline is your biggest advantage. Avoid pulling resources away from prospecting as the quarter progresses — teams that protect top-of-funnel activity close better.',
      urgency: 'strategic',
    })
  }

  return recs.slice(0, 4)
}

// ─── Executive summary ────────────────────────────────────────
function buildSummary(label: StatusLabel, attainment: QuizAttainment, pipeline: QuizPipelineHealth): string {
  const pipelineStr = {
    'clearly-short': 'critically thin pipeline',
    thin: 'below-threshold pipeline coverage',
    'probably-enough': 'adequate pipeline coverage',
    solid: 'solid pipeline coverage',
    'more-than-enough': 'strong pipeline coverage',
  }[pipeline]

  const attainmentStr = {
    rarely: 'low team attainment',
    sometimes: 'inconsistent attainment',
    often: 'moderate attainment',
    most: 'good attainment',
    'almost-always': 'strong attainment',
  }[attainment]

  switch (label) {
    case 'Stable':
      return `Your plan is structurally sound with ${pipelineStr} and ${attainmentStr}. Focus on execution consistency and early warning signals.`
    case 'Watchlist':
      return `Your plan is workable but has a few structural risks. ${pipelineStr} and ${attainmentStr} are the key variables to watch.`
    case 'Fragile':
      return `The combination of ${pipelineStr} and ${attainmentStr} creates meaningful compounding risk. Address the top two items before the period begins.`
    case 'Exposed':
      return `Your plan has multiple structural vulnerabilities. ${pipelineStr} and ${attainmentStr} individually would be concerns — together, they make the target very difficult to achieve without intervention.`
  }
}

// ─── Main scoring function ────────────────────────────────────
export function scoreQuiz(quiz: Required<QuizInput>): AssessmentOutput {
  const { arrBand, ambition, attainment, pipelineHealth } = quiz

  const baseARR  = BASE_ARR[arrBand]
  const target   = baseARR * GROWTH_RATE[ambition]
  const realMult = ATTAINMENT_MULT[attainment] * PIPELINE_ADJ[pipelineHealth]

  const conf  = confidenceScore(ambition, attainment, pipelineHealth)
  const cap   = capacityScore(ambition, attainment, pipelineHealth)
  const frag  = fragilityScore(ambition, attainment, pipelineHealth)
  const total = overallScore(conf, cap, frag)
  const label = statusLabel(total)

  const baseCapacity = target * realMult
  const upsideCapacity  = Math.min(target * 1.35, target * realMult * 1.30)
  const downsideCapacity = baseCapacity * 0.70
  const stressedCapacity = baseCapacity * 0.42

  const scenarios: ScenarioResult[] = [
    {
      label: 'Upside',
      effectiveReps: 0, rampAdjustedReps: 0,
      productiveCapacity: Math.round(upsideCapacity),
      gapToTarget: target - upsideCapacity, gapPct: (target - upsideCapacity) / target,
      coverageSufficiency: PIPELINE_ADJ[pipelineHealth] * 1.3,
      pipelineCoverageRatio: 4.5, winRate: 0.25, reachable: upsideCapacity >= target,
      quarterlyRun: [],
    },
    {
      label: 'Base Case',
      effectiveReps: 0, rampAdjustedReps: 0,
      productiveCapacity: Math.round(baseCapacity),
      gapToTarget: target - baseCapacity, gapPct: (target - baseCapacity) / target,
      coverageSufficiency: PIPELINE_ADJ[pipelineHealth],
      pipelineCoverageRatio: 3.0, winRate: 0.22, reachable: baseCapacity >= target,
      quarterlyRun: [],
    },
    {
      label: 'Downside',
      effectiveReps: 0, rampAdjustedReps: 0,
      productiveCapacity: Math.round(downsideCapacity),
      gapToTarget: target - downsideCapacity, gapPct: (target - downsideCapacity) / target,
      coverageSufficiency: PIPELINE_ADJ[pipelineHealth] * 0.70,
      pipelineCoverageRatio: 2.2, winRate: 0.18, reachable: false,
      quarterlyRun: [],
    },
    {
      label: 'Stressed Downside',
      effectiveReps: 0, rampAdjustedReps: 0,
      productiveCapacity: Math.round(stressedCapacity),
      gapToTarget: target - stressedCapacity, gapPct: (target - stressedCapacity) / target,
      coverageSufficiency: PIPELINE_ADJ[pipelineHealth] * 0.42,
      pipelineCoverageRatio: 1.4, winRate: 0.14, reachable: false,
      quarterlyRun: [],
    },
  ]

  return {
    confidenceScore: conf,
    capacityScore:   cap,
    fragilityScore:  frag,
    overallScore:    total,
    statusLabel:     label,
    effectiveRepsBase: 0,
    rampAdjustedRepsBase: 0,
    productiveCapacityBase: Math.round(baseCapacity),
    newARRTarget: Math.round(target),
    gapToTarget: Math.round(target - baseCapacity),
    gapToTargetPct: (target - baseCapacity) / target,
    headcountRequired: 0,
    headcountCurrent: 0,
    headcountGap: 0,
    coverageSufficiency: PIPELINE_ADJ[pipelineHealth],
    pipelineCoverageRatio: 3.0,
    impliedWinRate: 0.22,
    scenarios,
    topRiskDrivers: buildRisks(ambition, attainment, pipelineHealth),
    recommendations: buildRecommendations(ambition, attainment, pipelineHealth),
    executiveSummary: buildSummary(label, attainment, pipelineHealth),
    benchmarks: [],
    resolved: {
      arrBase: Math.round(baseARR),
      newARRTarget: Math.round(target),
      newLogoTarget: Math.round(target * 0.85),
      winRate: 0.22,
      salesCycleMonths: 3,
      rampMonths: 4,
      avgAttainment: ATTAINMENT_MULT[attainment],
      annualAttritionRate: 0.15,
      quotaPerRep: 600_000,
      acvBase: 50_000,
    },
  }
}

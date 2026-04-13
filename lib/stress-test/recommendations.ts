// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// recommendations.ts — Rule-based recommendation engine
//
// *** EDIT THIS FILE TO CHANGE RECOMMENDATION COPY ***
//
// Each recommendation has:
//   - A condition function (returns true when this rec applies)
//   - A priority (lower = shown first)
//   - A title (short, actionable)
//   - A description (strategic, specific to their numbers)
//   - An urgency level
//
// To add new recommendations, add a new entry to RECOMMENDATION_RULES.
// To change copy, edit the `title` and `description` fields.
// ============================================================

import type {
  AssessmentInput,
  AssessmentOutput,
  ResolvedInputs,
  RiskDriver,
  Recommendation,
  ScenarioResult,
} from './types'
import { FORECAST_MATURITY_CONFIG, INSPECTION_CADENCE_CONFIG, SALES_MOTION_CONTEXT } from './config'

// ─────────────────────────────────────────────────────────────
// RISK DRIVER IDENTIFICATION
// ─────────────────────────────────────────────────────────────

export function identifyRiskDrivers(
  input: AssessmentInput,
  base: ScenarioResult,
  resolved: ResolvedInputs,
  requiredReps: number,
): RiskDriver[] {
  const { pipeline, team, company } = input
  const drivers: RiskDriver[] = []

  // ── Capacity gap
  if (base.gapPct > 0.10) {
    const gapM = (base.gapToTarget / 1_000_000).toFixed(1)
    drivers.push({
      label: 'Headcount-driven revenue gap',
      severity: base.gapPct > 0.25 ? 'high' : 'medium',
      description: `At current team size and attainment, your implied booking capacity is $${gapM}M short of your new-logo target.`,
      impact: `${Math.round(base.gapPct * 100)}% of plan is at risk`,
    })
  }

  // ── Coverage insufficiency
  if (base.coverageSufficiency < 0.9) {
    const coveragePct = Math.round(base.coverageSufficiency * 100)
    const neededCoverage = (1 / base.winRate).toFixed(1)
    drivers.push({
      label: 'Insufficient pipeline coverage',
      severity: base.coverageSufficiency < 0.75 ? 'high' : 'medium',
      description: `At a ${Math.round(base.winRate * 100)}% win rate, you need ${neededCoverage}x coverage. Your ${pipeline.pipelineCoverageRatio}x means coverage is only ${coveragePct}% sufficient.`,
      impact: 'Pipeline alone cannot support full target even if team executes perfectly',
    })
  }

  // ── High attrition
  if (team.annualAttritionBand === 'over-25pct' || team.annualAttritionBand === '20-25pct') {
    const attritionPct = Math.round(resolved.annualAttritionRate * 100)
    const attritionReps = Math.round(team.totalReps * resolved.annualAttritionRate)
    drivers.push({
      label: 'Attrition creating a capacity treadmill',
      severity: team.annualAttritionBand === 'over-25pct' ? 'high' : 'medium',
      description: `At ${attritionPct}% annual attrition, you're replacing ~${attritionReps} rep(s) per year before adding any net-new capacity. Planned hires are largely absorbed by backfill.`,
      impact: `~${attritionReps} of your planned hires are backfill, not growth`,
    })
  }

  // ── Long ramp time
  if (team.rampTimeBand === 'over-9-months' || team.rampTimeBand === '6-9-months') {
    const rampMonths = Math.round(resolved.rampMonths)
    drivers.push({
      label: 'Long ramp drag',
      severity: team.rampTimeBand === 'over-9-months' ? 'high' : 'medium',
      description: `With a ${rampMonths}-month ramp, new hires contribute less than 60% of their quota in the plan period. Hiring gains are deferred beyond this quarter's numbers.`,
      impact: 'New hire ROI is back-weighted; Q1–Q2 capacity is structurally constrained',
    })
  }

  // ── Deal concentration
  if (pipeline.concentrationRiskPct >= 30) {
    const topDealPct = pipeline.concentrationRiskPct
    drivers.push({
      label: 'High deal concentration risk',
      severity: pipeline.concentrationRiskPct >= 50 ? 'high' : 'medium',
      description: `${topDealPct}% of your forecast revenue is concentrated in a small number of large deals. A single slip materially misses the quarter.`,
      impact: 'Coverage appears adequate, but concentration makes the forecast fragile',
    })
  }

  // ── Weak forecast methodology
  if (pipeline.forecastMaturity === 'basic') {
    drivers.push({
      label: 'Immature forecast methodology',
      severity: 'medium',
      description: 'A spreadsheet or gut-based forecast has high variance. Confidence intervals are wide and call accuracy tends to be poor, especially as the team grows.',
      impact: 'Forecast error amplifies every other risk in this plan',
    })
  }

  // ── Low inspection cadence
  if (pipeline.inspectionCadence === 'monthly' || pipeline.inspectionCadence === 'quarterly') {
    drivers.push({
      label: 'Infrequent pipeline inspection',
      severity: 'low',
      description: `${INSPECTION_CADENCE_CONFIG[pipeline.inspectionCadence].label} pipeline reviews mean deal risks surface late. By the time slippage is visible, it is often too late to recover in-quarter.`,
      impact: 'Leads to end-of-quarter scrambles and unplanned discount pressure',
    })
  }

  // ── Insufficient headcount for target
  if (requiredReps > base.effectiveReps * 1.1) {
    const repGap = Math.ceil(requiredReps - base.effectiveReps)
    drivers.push({
      label: 'Team too small for target',
      severity: 'high',
      description: `Your new-logo target requires approximately ${Math.ceil(requiredReps)} fully productive reps. Current effective capacity is ${base.effectiveReps.toFixed(1)}. You are ${repGap} rep(s) short.`,
      impact: `${repGap} additional quota-carrying reps needed to make the math work`,
    })
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 }
  return drivers.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

// ─────────────────────────────────────────────────────────────
// EXECUTIVE SUMMARY GENERATOR
// ─────────────────────────────────────────────────────────────

export function generateExecutiveSummary(
  input: AssessmentInput,
  output: Partial<AssessmentOutput>,
  base: ScenarioResult,
  resolved: ResolvedInputs,
  requiredReps: number,
): string {
  const { company, team, pipeline } = input
  const motionLabel = SALES_MOTION_CONTEXT[company.salesMotion].label
  const targetM = (resolved.newARRTarget / 1_000_000).toFixed(1)
  const gapM = (Math.abs(base.gapToTarget) / 1_000_000).toFixed(1)
  const statusLabel = output.statusLabel ?? 'Fragile'
  const confidenceScore = output.confidenceScore ?? 50

  // Determine the dominant constraint
  const isCapacityConstrained = base.gapPct > 0.10
  const isPipelineConstrained = base.coverageSufficiency < 0.85
  const isAttritionDriven = team.annualAttritionBand === 'over-25pct' || team.annualAttritionBand === '20-25pct'
  const isConcentrationRisk = pipeline.concentrationRiskPct >= 35

  let primaryConstraint = ''
  if (isCapacityConstrained && isPipelineConstrained) {
    primaryConstraint = `constrained on both headcount capacity and pipeline coverage`
  } else if (isCapacityConstrained) {
    primaryConstraint = `primarily hiring-constrained — not pipeline-constrained`
  } else if (isPipelineConstrained) {
    primaryConstraint = `pipeline-constrained more than team-constrained`
  } else if (isConcentrationRisk) {
    primaryConstraint = `vulnerable to deal concentration risk despite adequate coverage`
  } else {
    primaryConstraint = `structurally sound at current inputs`
  }

  // Build the summary
  const coverageStr = base.coverageSufficiency >= 1.0
    ? `pipeline coverage appears sufficient`
    : `pipeline coverage is ${Math.round(base.coverageSufficiency * 100)}% sufficient for the plan`

  const gapStr = base.gapPct > 0
    ? `a $${gapM}M gap to plan at base-case assumptions`
    : `a $${gapM}M buffer above plan at base-case assumptions`

  const attritionStr = isAttritionDriven
    ? ` At current attrition rates, a significant portion of planned hires are backfill rather than net-new capacity, which defers the real capacity build.`
    : ''

  return `This ${motionLabel} revenue plan targets $${targetM}M in new ARR and carries a confidence score of ${confidenceScore}/100, rated ${statusLabel}. The plan is ${primaryConstraint}, with ${gapStr}. With ${team.totalReps} quota-carrying reps and ${team.plannedHiresTotal} planned hires, effective selling capacity is ${base.effectiveReps.toFixed(1)} reps after ramp and attrition discounts. ${coverageStr.charAt(0).toUpperCase() + coverageStr.slice(1)} at the current ${(base.winRate * 100).toFixed(0)}% win rate.${attritionStr} The most material levers to improve plan defensibility are: closing the headcount gap, improving pipeline inspection cadence, and reducing concentration risk in the forecast.`
}

// ─────────────────────────────────────────────────────────────
// RECOMMENDATION RULES ENGINE
// ─────────────────────────────────────────────────────────────

interface RecommendationRule {
  condition: (input: AssessmentInput, base: ScenarioResult, resolved: ResolvedInputs, requiredReps: number) => boolean
  priority: number
  title: string
  description: (input: AssessmentInput, base: ScenarioResult, resolved: ResolvedInputs, requiredReps: number) => string
  urgency: Recommendation['urgency']
}

// *** EDIT THESE RULES TO CHANGE RECOMMENDATION COPY AND LOGIC ***
const RECOMMENDATION_RULES: RecommendationRule[] = [
  // ── HIGH PRIORITY: Capacity gap
  {
    condition: (input, base) => base.gapPct > 0.15,
    priority: 1,
    title: 'Address the headcount-driven revenue gap before the quarter starts',
    description: (input, base, resolved, requiredReps) => {
      const repGap = Math.ceil(requiredReps - base.effectiveReps)
      const gapM = (base.gapToTarget / 1_000_000).toFixed(1)
      return `Your plan is hiring-constrained, not pipeline-constrained. At current team size and attainment, you are $${gapM}M short. You need approximately ${repGap} additional quota-carrying rep(s) to make the capacity math work. If headcount is off the table, the only levers are quota reduction, target reduction, or material uplift in attainment — each carries its own trade-off.`
    },
    urgency: 'immediate',
  },

  // ── HIGH PRIORITY: Pipeline coverage gap
  {
    condition: (input, base) => base.coverageSufficiency < 0.80,
    priority: 2,
    title: 'Pipeline is structurally thin relative to win rate — close the coverage gap now',
    description: (input, base, resolved) => {
      const neededCoverage = (1 / base.winRate).toFixed(1)
      const shortfall = (1.0 - base.coverageSufficiency) * 100
      return `At your current ${(base.winRate * 100).toFixed(0)}% win rate, you need ${neededCoverage}x pipeline coverage to support your target. You are currently at ${input.pipeline.pipelineCoverageRatio}x, creating a ${shortfall.toFixed(0)}% coverage shortfall. Before Q1 closes, prioritize inbound volume, outbound sequences, and SDR capacity. Without closing this gap, even perfect rep execution leaves you short.`
    },
    urgency: 'immediate',
  },

  // ── HIGH PRIORITY: Attrition treadmill
  {
    condition: (input) => input.team.annualAttritionBand === 'over-25pct' || input.team.annualAttritionBand === '20-25pct',
    priority: 3,
    title: 'Attrition is absorbing your hiring capacity — fix the treadmill',
    description: (input, _base, resolved) => {
      const attritionReps = Math.round(input.team.totalReps * resolved.annualAttritionRate)
      return `Mid-market and enterprise SaaS attrition benchmarks are 12–18%. At your current rate, you are replacing approximately ${attritionReps} rep(s) annually before adding net-new capacity. Planned hires are de facto backfill. Audit compensation competitiveness, career pathing, and manager quality before increasing headcount targets — you will not grow capacity until you slow the churn.`
    },
    urgency: 'immediate',
  },

  // ── NEAR-TERM: Deal concentration
  {
    condition: (input) => input.pipeline.concentrationRiskPct >= 30,
    priority: 4,
    title: 'Concentration risk makes your forecast brittle — diversify the close pipeline',
    description: (input) => {
      const topDealPct = input.pipeline.concentrationRiskPct
      return `${topDealPct}% of your forecast revenue is concentrated in a small number of large deals. Coverage appears adequate, but concentration risk means the forecast is fragile — one slip misses the number. The strategic fix is building a broader base of mid-tier deals that independently support the target, reducing dependency on any single close.`
    },
    urgency: 'near-term',
  },

  // ── NEAR-TERM: Long ramp time
  {
    condition: (input) => input.team.rampTimeBand === 'over-9-months' || input.team.rampTimeBand === '6-9-months',
    priority: 5,
    title: 'Ramp drag is your primary constraint in the next 2 quarters',
    description: (input, _base, resolved) => {
      const rampMonths = Math.round(resolved.rampMonths)
      return `With a ${rampMonths}-month ramp, new hires carry minimal quota in the near term. Mid-market ramp drag is typically a product of onboarding structure, territory readiness, and deal complexity — not just rep quality. Invest in structured onboarding, pre-qualified pipeline transfer, and deal shadowing programs that compress ramp without cutting corners on product knowledge.`
    },
    urgency: 'near-term',
  },

  // ── NEAR-TERM: Weak forecast methodology
  {
    condition: (input) => input.pipeline.forecastMaturity === 'basic',
    priority: 6,
    title: 'Upgrade forecast methodology — high variance is masking real risk',
    description: (input) => {
      return `A basic forecast process inflates variance. You cannot accurately identify gap risk or coverage problems until they become visible — at which point recovery options are limited. Implement stage-weighted pipeline methodology, require consistent opportunity field hygiene in CRM, and introduce weekly call accuracy reviews. This is a 6–8 week fix that meaningfully improves your ability to manage the plan in-flight.`
    },
    urgency: 'near-term',
  },

  // ── STRATEGIC: Low inspection cadence
  {
    condition: (input) => input.pipeline.inspectionCadence === 'monthly' || input.pipeline.inspectionCadence === 'quarterly',
    priority: 7,
    title: 'Move to weekly pipeline inspection — lag time is your hidden risk',
    description: (input) => {
      return `${INSPECTION_CADENCE_CONFIG[input.pipeline.inspectionCadence].label} inspection cadence means deal slippage surfaces too late to act. High-performing revenue teams inspect pipeline weekly, categorize deals with explicit commit/upside/risk labels, and surface call accuracy weekly. The operational cost is low; the benefit to forecast predictability is high.`
    },
    urgency: 'strategic',
  },

  // ── STRATEGIC: Good shape
  {
    condition: (input, base, resolved, requiredReps) =>
      base.gapPct <= 0.05 && base.coverageSufficiency >= 1.0 && requiredReps <= base.effectiveReps,
    priority: 8,
    title: 'Plan is defensible — shift focus to execution risk and mid-year resilience',
    description: (input, base) => {
      return `Your plan is structurally sound at base-case assumptions. Capacity and pipeline coverage are aligned with target. The next priority is stress-testing execution quality: inspect the deal concentration profile, model the impact of a 10–15% win rate decline, and ensure your forecast methodology can surface risk in real time — before it becomes unrecoverable.`
    },
    urgency: 'strategic',
  },
]

// ─────────────────────────────────────────────────────────────
// PUBLIC FUNCTION: Generate recommendations
// ─────────────────────────────────────────────────────────────

export function generateRecommendations(
  input: AssessmentInput,
  base: ScenarioResult,
  resolved: ResolvedInputs,
  requiredReps: number,
): Recommendation[] {
  const recs: Recommendation[] = []

  for (const rule of RECOMMENDATION_RULES) {
    if (rule.condition(input, base, resolved, requiredReps)) {
      recs.push({
        priority: rule.priority,
        title: rule.title,
        description: rule.description(input, base, resolved, requiredReps),
        urgency: rule.urgency,
      })
      // Max 3 recommendations in output
      if (recs.length >= 3) break
    }
  }

  return recs.sort((a, b) => a.priority - b.priority)
}

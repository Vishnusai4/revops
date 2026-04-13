// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// engine.ts — Core calculation engine
//
// *** THIS IS THE PRIMARY FILE TO EDIT FOR FORMULA CHANGES ***
//
// Architecture:
//  1. resolveInputs()   — convert band selections to numeric values
//  2. calcBaseCase()    — compute base scenario
//  3. calcScenario()    — apply multipliers to any input set
//  4. runAllScenarios() — produce base/upside/downside/stressed
//
// All formulas are deterministic and explicitly commented.
// Numbers are denominated in USD.
// ============================================================

import type {
  AssessmentInput,
  ResolvedInputs,
  ScenarioResult,
} from './types'

import {
  ARR_BANDS,
  NEW_ARR_TARGET_BANDS,
  ACV_BANDS,
  SALES_CYCLE_BANDS,
  QUOTA_BANDS,
  RAMP_TIME_BANDS,
  ATTAINMENT_BANDS,
  ATTRITION_BANDS,
  WIN_RATE_BANDS,
  SCENARIO_ADJUSTMENTS,
  getAverageRampProductivity,
} from './config'

// ─────────────────────────────────────────────────────────────
// STEP 1: Resolve band inputs → numeric midpoints
// ─────────────────────────────────────────────────────────────

export function resolveInputs(input: AssessmentInput): ResolvedInputs {
  const { company, team, pipeline } = input

  const arrBase = ARR_BANDS[company.arrBand].base
  const newARRTarget = NEW_ARR_TARGET_BANDS[company.newARRTargetBand].base
  const acvBase = ACV_BANDS[company.acvBand].base
  const salesCycleMonths = SALES_CYCLE_BANDS[company.salesCycleBand].base
  const quotaPerRep = QUOTA_BANDS[team.quotaPerRepBand].base
  const rampMonths = RAMP_TIME_BANDS[team.rampTimeBand].base
  const avgAttainment = ATTAINMENT_BANDS[team.avgAttainmentBand].base
  const annualAttritionRate = ATTRITION_BANDS[team.annualAttritionBand].base
  const winRate = WIN_RATE_BANDS[pipeline.winRateBand].base

  // Expansion contribution: % of total target coming from expansion revenue.
  // New-logo target is what the sales team must close from net-new.
  const expansionContributionFraction = company.expansionContributionPct / 100
  const newLogoTarget = newARRTarget * (1 - expansionContributionFraction)

  return {
    arrBase,
    newARRTarget,
    newLogoTarget,
    acvBase,
    salesCycleMonths,
    quotaPerRep,
    rampMonths,
    avgAttainment,
    annualAttritionRate,
    winRate,
  }
}

// ─────────────────────────────────────────────────────────────
// STEP 2: Effective selling capacity calculation
// ─────────────────────────────────────────────────────────────

/**
 * Effective rep count after accounting for attrition and new hire ramp.
 *
 * Formula:
 *   attritionLoss = totalReps × annualAttritionRate × 0.5
 *     → Multiply by 0.5 because attrition is distributed across the year;
 *       on average, departing reps were productive for half the period.
 *
 *   existingCapacity = totalReps - attritionLoss
 *
 *   newHireContribution = plannedHires × avgRampProductivity
 *     → avgRampProductivity < 1.0 because new hires don't contribute
 *       at full quota during their ramp period.
 *
 *   effectiveReps = existingCapacity + newHireContribution
 */
export function calcEffectiveReps(
  totalReps: number,
  plannedHires: number,
  annualAttritionRate: number,
  rampMonths: number,
): { effectiveReps: number; rampAdjustedReps: number; attritionLoss: number; newHireContrib: number } {
  // Mid-year attrition: lost reps still contributed on average for half the period
  const attritionLoss = totalReps * annualAttritionRate * 0.5

  // Existing reps who stayed — they operate at full attainment
  const existingCapacity = Math.max(0, totalReps - attritionLoss)

  // New hire contribution: average productivity fraction during the target period
  const avgRampProductivity = getAverageRampProductivity(rampMonths)
  const newHireContrib = plannedHires * avgRampProductivity

  const effectiveReps = existingCapacity + newHireContrib

  // rampAdjustedReps: what you'd have if all hires were fully ramped
  // (useful for showing the "true ceiling" without ramp drag)
  const rampAdjustedReps = existingCapacity + plannedHires

  return { effectiveReps, rampAdjustedReps, attritionLoss, newHireContrib }
}

/**
 * Productive capacity in dollars.
 *
 * Formula:
 *   productiveCapacity = effectiveReps × quotaPerRep × avgAttainment
 *
 * Note: quotaPerRep is the assigned quota, avgAttainment discounts
 * for the reality that teams rarely achieve 100% of quota on average.
 */
export function calcProductiveCapacity(
  effectiveReps: number,
  quotaPerRep: number,
  avgAttainment: number,
): number {
  return effectiveReps * quotaPerRep * avgAttainment
}

/**
 * Headcount required to hit the new-logo target.
 *
 * Formula:
 *   requiredReps = newLogoTarget / (quotaPerRep × avgAttainment)
 *
 * This is the number of fully productive reps you'd need at current
 * quota and attainment assumptions to close the new-logo portion.
 */
export function calcRequiredReps(
  newLogoTarget: number,
  quotaPerRep: number,
  avgAttainment: number,
): number {
  if (quotaPerRep * avgAttainment === 0) return 0
  return newLogoTarget / (quotaPerRep * avgAttainment)
}

// ─────────────────────────────────────────────────────────────
// STEP 3: Pipeline coverage analysis
// ─────────────────────────────────────────────────────────────

/**
 * Coverage sufficiency ratio.
 *
 * At a given win rate, you need (1 / winRate) pipeline coverage to close 100%.
 * E.g., 25% win rate → need 4x coverage to theoretically close 100% of target.
 *
 * Formula:
 *   requiredCoverage = 1 / winRate
 *   coverageSufficiency = actualCoverage / requiredCoverage
 *                       = actualCoverage × winRate
 *
 *   > 1.0 → pipeline is sufficient to cover target
 *   < 1.0 → coverage gap; you can only close (sufficiency × 100%) of target
 */
export function calcCoverageSufficiency(
  pipelineCoverageRatio: number,
  winRate: number,
): number {
  if (winRate === 0) return 0
  return pipelineCoverageRatio * winRate
}

// ─────────────────────────────────────────────────────────────
// STEP 4: Quarterly capacity build (for chart)
// ─────────────────────────────────────────────────────────────

/**
 * Model quarterly implied bookings capacity across 4 quarters.
 * Assumes new hires ramp evenly and attrition is distributed uniformly.
 */
export function calcQuarterlyCapacity(
  totalReps: number,
  plannedHires: number,
  annualAttritionRate: number,
  rampMonths: number,
  quotaPerRep: number,
  avgAttainment: number,
): number[] {
  const quarterlyAttrition = totalReps * annualAttritionRate * 0.25
  const hiresPerQuarter = plannedHires / 4

  return [1, 2, 3, 4].map((q) => {
    // Reps lost to attrition by this quarter (cumulative, approximation)
    const cumulativeAttrition = quarterlyAttrition * q * 0.5 // mid-period weighting

    // Existing reps still active
    const existingActive = Math.max(0, totalReps - cumulativeAttrition)

    // Cumulative new hires by this quarter, weighted by ramp curve
    // Hires in Q1 have more ramp time by Q3/Q4 than hires in Q4
    let cumulativeHireContrib = 0
    for (let hireQ = 1; hireQ <= q; hireQ++) {
      const monthsElapsed = (q - hireQ) * 3 + 1.5 // avg months since that cohort joined
      const rampFraction = Math.min(1, monthsElapsed / rampMonths)
      cumulativeHireContrib += hiresPerQuarter * rampFraction
    }

    // Quarterly capacity = quarterly quota × attainment
    const quarterlyQuota = quotaPerRep / 4
    return (existingActive + cumulativeHireContrib) * quarterlyQuota * avgAttainment
  })
}

// ─────────────────────────────────────────────────────────────
// STEP 5: Build a single scenario
// ─────────────────────────────────────────────────────────────

export interface ScenarioInputs {
  label: 'Base Case' | 'Upside' | 'Downside' | 'Stressed Downside'
  totalReps: number
  plannedHires: number
  annualAttritionRate: number
  rampMonths: number
  quotaPerRep: number
  avgAttainment: number
  pipelineCoverageRatio: number
  winRate: number
  newARRTarget: number
  newLogoTarget: number
}

export function calcScenario(inputs: ScenarioInputs): ScenarioResult {
  const {
    label,
    totalReps,
    plannedHires,
    annualAttritionRate,
    rampMonths,
    quotaPerRep,
    avgAttainment,
    pipelineCoverageRatio,
    winRate,
    newARRTarget,
    newLogoTarget,
  } = inputs

  const { effectiveReps, rampAdjustedReps } = calcEffectiveReps(
    totalReps,
    plannedHires,
    annualAttritionRate,
    rampMonths,
  )

  const productiveCapacity = calcProductiveCapacity(effectiveReps, quotaPerRep, avgAttainment)
  const coverageSufficiency = calcCoverageSufficiency(pipelineCoverageRatio, winRate)

  // Gap to the new-logo target (the portion reps must close)
  // Positive = shortfall (plan is at risk), Negative = surplus (plan has buffer)
  const gapToTarget = newLogoTarget - productiveCapacity
  const gapPct = newLogoTarget > 0 ? gapToTarget / newLogoTarget : 0

  const quarterlyRun = calcQuarterlyCapacity(
    totalReps,
    plannedHires,
    annualAttritionRate,
    rampMonths,
    quotaPerRep,
    avgAttainment,
  )

  // "Reachable" means both capacity AND pipeline coverage can support the target
  const reachable = gapPct <= 0 && coverageSufficiency >= 0.9

  return {
    label,
    effectiveReps: Math.round(effectiveReps * 10) / 10,
    rampAdjustedReps: Math.round(rampAdjustedReps * 10) / 10,
    productiveCapacity: Math.round(productiveCapacity),
    gapToTarget: Math.round(gapToTarget),
    gapPct: Math.round(gapPct * 1000) / 1000,
    coverageSufficiency: Math.round(coverageSufficiency * 100) / 100,
    pipelineCoverageRatio,
    winRate,
    reachable,
    quarterlyRun: quarterlyRun.map((v) => Math.round(v)),
  }
}

// ─────────────────────────────────────────────────────────────
// STEP 6: Run all four scenarios
// ─────────────────────────────────────────────────────────────

export function runAllScenarios(
  input: AssessmentInput,
  resolved: ResolvedInputs,
): ScenarioResult[] {
  const { team, pipeline, stress } = input
  const {
    quotaPerRep,
    rampMonths,
    avgAttainment,
    annualAttritionRate,
    winRate,
    newARRTarget,
    newLogoTarget,
  } = resolved

  const baseInputs: Omit<ScenarioInputs, 'label'> = {
    totalReps: team.totalReps,
    plannedHires: team.plannedHiresTotal,
    annualAttritionRate,
    rampMonths,
    quotaPerRep,
    avgAttainment,
    pipelineCoverageRatio: pipeline.pipelineCoverageRatio,
    winRate,
    newARRTarget,
    newLogoTarget,
  }

  const adj = SCENARIO_ADJUSTMENTS

  // ── Base case — exactly what was input
  const base = calcScenario({ label: 'Base Case', ...baseInputs })

  // ── Upside — better win rate, more pipeline, higher attainment, lower attrition
  const upside = calcScenario({
    label: 'Upside',
    ...baseInputs,
    winRate: winRate * adj.upside.winRateMultiplier,
    pipelineCoverageRatio: pipeline.pipelineCoverageRatio * adj.upside.pipelineCoverageMultiplier,
    avgAttainment: Math.min(1.0, avgAttainment * adj.upside.attainmentMultiplier),
    annualAttritionRate: annualAttritionRate * adj.upside.attritionMultiplier,
  })

  // ── Downside — lower win rate, less pipeline, lower attainment, higher attrition
  const downside = calcScenario({
    label: 'Downside',
    ...baseInputs,
    winRate: winRate * adj.downside.winRateMultiplier,
    pipelineCoverageRatio: pipeline.pipelineCoverageRatio * adj.downside.pipelineCoverageMultiplier,
    avgAttainment: Math.max(0.2, avgAttainment * adj.downside.attainmentMultiplier),
    annualAttritionRate: Math.min(0.6, annualAttritionRate * adj.downside.attritionMultiplier),
  })

  // ── Stressed Downside — downside + user-selected stress factors stacked
  // Stress factors are applied multiplicatively on top of downside multipliers.
  const stressedWinRate =
    downside.winRate * (1 - stress.winRateDropPct / 100)
  const stressedPipeline =
    downside.pipelineCoverageRatio * (1 - stress.pipelineDropPct / 100)

  // Sales cycle expansion reduces bookings in the period (deals slip out)
  // Approximation: if cycle expands by X%, ~X/2 % of expected closings slip out of period
  const salesCycleSlippage = 1 - (stress.salesCycleExpansionPct / 100) * 0.5

  // ASP decline reduces effective quota value
  const aspFactor = 1 - stress.aspDeclinePct / 100

  // Additional attrition
  const stressedAttritionRate = Math.min(
    0.7,
    (annualAttritionRate * adj.downside.attritionMultiplier) + stress.attritionIncreasePct / 100,
  )

  // Hiring delay: remove proportional quarters of planned hires
  const stressedHires = stress.hiringDelayed
    ? Math.max(0, team.plannedHiresTotal * (1 - stress.hiringDelayQuarters / 4))
    : team.plannedHiresTotal

  const stressedDownside = calcScenario({
    label: 'Stressed Downside',
    ...baseInputs,
    winRate: Math.max(0.01, stressedWinRate),
    pipelineCoverageRatio: Math.max(0.5, stressedPipeline),
    avgAttainment: Math.max(0.15, avgAttainment * adj.downside.attainmentMultiplier * aspFactor * salesCycleSlippage),
    annualAttritionRate: stressedAttritionRate,
    plannedHires: stressedHires,
  })

  return [base, upside, downside, stressedDownside]
}

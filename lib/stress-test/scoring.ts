// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// scoring.ts — Scoring and status algorithms
//
// *** EDIT THIS FILE TO CHANGE SCORE CALCULATIONS ***
//
// Scoring philosophy:
//   Three independent dimensions → one weighted composite.
//   1. Confidence (0–100): probability the plan closes the gap
//   2. Capacity (0–100): whether the team can physically deliver
//   3. Fragility (0–100): how brittle the plan is (higher = worse)
//
// The overall score is:
//   overall = confidence × 0.40 + capacity × 0.35 + (100 - fragility) × 0.25
// ============================================================

import type { AssessmentInput, AssessmentOutput, ScenarioResult, BenchmarkComparison } from './types'
import {
  SCORING_WEIGHTS,
  STATUS_THRESHOLDS,
  BENCHMARK_RANGES,
  FORECAST_MATURITY_CONFIG,
  INSPECTION_CADENCE_CONFIG,
  MANAGER_SPAN_CONFIG,
  SALES_MOTION_CONTEXT,
} from './config'
import { calcRequiredReps } from './engine'

// ─────────────────────────────────────────────────────────────
// 1. Revenue Plan Confidence Score (0–100)
// ─────────────────────────────────────────────────────────────
/**
 * Measures how likely the plan is to be achievable given current inputs.
 *
 * Penalty drivers (each reduces the score):
 *   - Capacity gap (how much more $ is needed vs what team can produce)
 *   - Coverage insufficiency (pipeline × win rate < 1.0)
 *   - High attrition (depletes capacity faster than plan assumes)
 *   - Long ramp (new hires contribute less in the plan period)
 */
export function calcConfidenceScore(
  base: ScenarioResult,
  attritionRate: number,
  rampMonths: number,
): number {
  let score = 100

  // ── Gap penalty
  // Each 1% of gap reduces confidence by 1.4 points (steep but fair)
  if (base.gapPct > 0) {
    score -= Math.min(60, base.gapPct * 140)
  } else {
    // Bonus for surplus buffer — up to +5 for a strong surplus
    score = Math.min(100, score + Math.abs(base.gapPct) * 20)
  }

  // ── Coverage penalty
  // If coverage sufficiency < 1.0, the pipeline alone can't support the plan
  if (base.coverageSufficiency < 1.0) {
    const coverageGap = 1.0 - base.coverageSufficiency
    score -= Math.min(25, coverageGap * 50)
  }

  // ── Attrition drag
  // Above 20%, attrition starts creating a capacity treadmill
  if (attritionRate > 0.20) {
    score -= Math.min(10, (attritionRate - 0.20) * 80)
  }

  // ── Ramp drag
  // Long ramps mean new hires contribute minimally in the plan period
  if (rampMonths > 6) {
    score -= Math.min(8, (rampMonths - 6) * 1.2)
  }

  return Math.round(Math.max(5, Math.min(100, score)))
}

// ─────────────────────────────────────────────────────────────
// 2. Capacity Sufficiency Score (0–100)
// ─────────────────────────────────────────────────────────────
/**
 * How well does the current team + planned hires cover the required headcount?
 *
 *   score = (effectiveReps / requiredReps) × 100, capped at 100
 *
 * If effectiveReps ≥ requiredReps, score = 100.
 * If effectiveReps = 0, score = 0.
 */
export function calcCapacityScore(
  base: ScenarioResult,
  requiredReps: number,
): number {
  if (requiredReps <= 0) return 100
  const ratio = base.effectiveReps / requiredReps
  return Math.round(Math.max(5, Math.min(100, ratio * 100)))
}

// ─────────────────────────────────────────────────────────────
// 3. Forecast Fragility Score (0–100, higher = more fragile)
// ─────────────────────────────────────────────────────────────
/**
 * A composite of structural risks that make the forecast unreliable
 * even if the capacity and pipeline numbers look OK.
 *
 * Fragility drivers:
 *   - Deal concentration (% from top deals)
 *   - Forecast methodology maturity
 *   - Inspection cadence
 *   - Pipeline coverage ratio
 *   - Coverage sufficiency
 *   - Manager span (coaching capacity)
 */
export function calcFragilityScore(input: AssessmentInput, base: ScenarioResult): number {
  let score = 10 // baseline — no plan is fragility-free

  const { pipeline, team } = input

  // ── Deal concentration risk
  // Each 10% of revenue concentrated in top deals adds fragility
  // At 30%+, it becomes a meaningful cliff risk
  if (pipeline.concentrationRiskPct >= 30) {
    score += 20
  } else if (pipeline.concentrationRiskPct >= 20) {
    score += 10
  } else if (pipeline.concentrationRiskPct >= 10) {
    score += 5
  }
  // Additional steep penalty above 50%
  if (pipeline.concentrationRiskPct >= 50) {
    score += 15
  }

  // ── Forecast methodology
  score += FORECAST_MATURITY_CONFIG[pipeline.forecastMaturity].fragilityPenalty

  // ── Inspection cadence
  score += INSPECTION_CADENCE_CONFIG[pipeline.inspectionCadence].fragilityPenalty

  // ── Pipeline coverage: thin coverage = fragile even if team is big
  if (pipeline.pipelineCoverageRatio < 2.5) {
    score += 20
  } else if (pipeline.pipelineCoverageRatio < 3.0) {
    score += 12
  } else if (pipeline.pipelineCoverageRatio < 3.5) {
    score += 6
  }

  // ── Coverage sufficiency
  if (base.coverageSufficiency < 0.75) {
    score += 15
  } else if (base.coverageSufficiency < 0.90) {
    score += 8
  }

  // ── Manager span: over-span managers cannot coach effectively
  const spanImpact = MANAGER_SPAN_CONFIG[team.managerSpanBand].fragilityImpact
  if (spanImpact === 'high') score += 10
  else if (spanImpact === 'medium') score += 5

  return Math.round(Math.max(5, Math.min(95, score)))
}

// ─────────────────────────────────────────────────────────────
// 4. Overall Score + Status Label
// ─────────────────────────────────────────────────────────────

export function calcOverallScore(
  confidenceScore: number,
  capacityScore: number,
  fragilityScore: number,
): number {
  const resilienceScore = 100 - fragilityScore // invert fragility to resilience
  const weighted =
    confidenceScore * SCORING_WEIGHTS.confidence +
    capacityScore * SCORING_WEIGHTS.capacity +
    resilienceScore * SCORING_WEIGHTS.fragility

  return Math.round(Math.max(5, Math.min(100, weighted)))
}

export function getStatusLabel(
  overallScore: number,
): AssessmentOutput['statusLabel'] {
  if (overallScore >= STATUS_THRESHOLDS.defensible) return 'Defensible'
  if (overallScore >= STATUS_THRESHOLDS.fragile) return 'Fragile'
  if (overallScore >= STATUS_THRESHOLDS.atRisk) return 'At Risk'
  return 'Critical Risk'
}

// ─────────────────────────────────────────────────────────────
// 5. Benchmark Comparisons
// ─────────────────────────────────────────────────────────────

export function buildBenchmarks(
  input: AssessmentInput,
  base: ScenarioResult,
): BenchmarkComparison[] {
  const { pipeline, team, company } = input
  const motionCtx = SALES_MOTION_CONTEXT[company.salesMotion]

  const winRatePct = Math.round(base.winRate * 100)
  const winRateBench = BENCHMARK_RANGES.winRate[
    company.salesMotion === 'smb' || company.salesMotion === 'plg-assisted'
      ? 'smb'
      : company.salesMotion === 'enterprise'
      ? 'enterprise'
      : 'midmarket'
  ]

  const benchmarks: BenchmarkComparison[] = [
    {
      metric: 'Pipeline Coverage Ratio',
      yourValue: `${pipeline.pipelineCoverageRatio.toFixed(1)}x`,
      benchmarkRange: `Good: ${BENCHMARK_RANGES.pipelineCoverage.good}`,
      status:
        pipeline.pipelineCoverageRatio >= 3.5
          ? 'good'
          : pipeline.pipelineCoverageRatio >= 2.5
          ? 'warning'
          : 'risk',
    },
    {
      metric: 'Win Rate',
      yourValue: `${winRatePct}%`,
      benchmarkRange: `Good (${motionCtx.label}): ${winRateBench.good}`,
      status:
        base.winRate >= (motionCtx.typicalWinRate * 0.9)
          ? 'good'
          : base.winRate >= (motionCtx.typicalWinRate * 0.65)
          ? 'warning'
          : 'risk',
    },
    {
      metric: 'Annual Rep Attrition',
      yourValue: {
        'under-10pct': '<10%',
        '10-15pct': '10–15%',
        '15-20pct': '15–20%',
        '20-25pct': '20–25%',
        'over-25pct': '>25%',
      }[team.annualAttritionBand] ?? team.annualAttritionBand,
      benchmarkRange: `Good: ${BENCHMARK_RANGES.attrition.good}`,
      status:
        team.annualAttritionBand === 'under-10pct'
          ? 'good'
          : team.annualAttritionBand === '10-15pct' || team.annualAttritionBand === '15-20pct'
          ? 'warning'
          : 'risk',
    },
    {
      metric: 'Avg Attainment',
      yourValue: `${Math.round(
        {
          'under-60pct': 50,
          '60-70pct': 65,
          '70-80pct': 75,
          '80-90pct': 85,
          'over-90pct': 93,
        }[team.avgAttainmentBand] ?? 75,
      )}%`,
      benchmarkRange: `Good: ${BENCHMARK_RANGES.attainment.good}`,
      status:
        team.avgAttainmentBand === 'over-90pct' || team.avgAttainmentBand === '80-90pct'
          ? 'good'
          : team.avgAttainmentBand === '70-80pct'
          ? 'warning'
          : 'risk',
    },
    {
      metric: 'Coverage Sufficiency',
      yourValue: `${(base.coverageSufficiency * 100).toFixed(0)}%`,
      benchmarkRange: `Good: ${BENCHMARK_RANGES.coverageSufficiency.good}`,
      status:
        base.coverageSufficiency >= 1.0
          ? 'good'
          : base.coverageSufficiency >= 0.8
          ? 'warning'
          : 'risk',
    },
    {
      metric: 'Rep Ramp Time',
      yourValue: {
        '1-2-months': '~1.5 months',
        '2-3-months': '~2.5 months',
        '3-6-months': '~4.5 months',
        '6-9-months': '~7.5 months',
        'over-9-months': '9+ months',
      }[team.rampTimeBand] ?? team.rampTimeBand,
      benchmarkRange: `Good: ${BENCHMARK_RANGES.rampTime.good}`,
      status:
        team.rampTimeBand === '1-2-months' || team.rampTimeBand === '2-3-months'
          ? 'good'
          : team.rampTimeBand === '3-6-months'
          ? 'warning'
          : 'risk',
    },
  ]

  return benchmarks
}

// Re-export calcRequiredReps for use in the main orchestrator
export { calcRequiredReps }

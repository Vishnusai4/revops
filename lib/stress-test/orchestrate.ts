// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// orchestrate.ts — Main assessment orchestrator
//
// Ties together: engine → scoring → recommendations → output
// Called from the /api/stress-test/calculate route.
// ============================================================

import type { AssessmentInput, AssessmentOutput } from './types'
import { resolveInputs, runAllScenarios } from './engine'
import {
  calcConfidenceScore,
  calcCapacityScore,
  calcFragilityScore,
  calcOverallScore,
  getStatusLabel,
  buildBenchmarks,
  calcRequiredReps,
} from './scoring'
import { identifyRiskDrivers, generateRecommendations, generateExecutiveSummary } from './recommendations'

export function runAssessment(input: AssessmentInput): AssessmentOutput {
  // ── Step 1: Resolve all band inputs to numeric midpoints
  const resolved = resolveInputs(input)

  // ── Step 2: Run all four scenarios
  const scenarios = runAllScenarios(input, resolved)
  const base = scenarios[0] // 'Base Case' is always index 0

  // ── Step 3: Compute headcount requirements
  const requiredReps = calcRequiredReps(resolved.newLogoTarget, resolved.quotaPerRep, resolved.avgAttainment)
  const headcountGap = Math.ceil(requiredReps - base.effectiveReps)

  // ── Step 4: Scores
  const confidenceScore = calcConfidenceScore(base, resolved.annualAttritionRate, resolved.rampMonths)
  const capacityScore = calcCapacityScore(base, requiredReps)
  const fragilityScore = calcFragilityScore(input, base)
  const overallScore = calcOverallScore(confidenceScore, capacityScore, fragilityScore)
  const statusLabel = getStatusLabel(overallScore)

  // ── Step 5: Risk drivers
  const topRiskDrivers = identifyRiskDrivers(input, base, resolved, requiredReps)

  // ── Step 6: Recommendations
  const recommendations = generateRecommendations(input, base, resolved, requiredReps)

  // ── Step 7: Benchmarks
  const benchmarks = buildBenchmarks(input, base)

  // ── Step 8: Executive summary (needs partial output for labels)
  const partialOutput = { confidenceScore, statusLabel }
  const executiveSummary = generateExecutiveSummary(input, partialOutput, base, resolved, requiredReps)

  return {
    // Scores
    confidenceScore,
    capacityScore,
    fragilityScore,
    overallScore,
    statusLabel,

    // KPIs
    effectiveRepsBase: base.effectiveReps,
    rampAdjustedRepsBase: base.rampAdjustedReps,
    productiveCapacityBase: base.productiveCapacity,
    newARRTarget: resolved.newARRTarget,
    gapToTarget: base.gapToTarget,
    gapToTargetPct: base.gapPct,
    headcountRequired: Math.ceil(requiredReps),
    headcountCurrent: input.team.totalReps,
    headcountGap,
    coverageSufficiency: base.coverageSufficiency,
    pipelineCoverageRatio: input.pipeline.pipelineCoverageRatio,
    impliedWinRate: resolved.winRate,

    // All scenarios
    scenarios,

    // Intelligence
    topRiskDrivers,
    recommendations,
    executiveSummary,
    benchmarks,

    // Raw resolved inputs (for PDF display)
    resolved,
  }
}

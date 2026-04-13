// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// config.ts — Business assumptions, band mappings, benchmarks
//
// *** THIS IS THE PRIMARY FILE TO EDIT FOR TUNING ***
//
// All numeric assumptions live here. To adjust:
//   - Band midpoints: update the `base` values in BAND_MAPS
//   - Score thresholds: update SCORING_THRESHOLDS
//   - Status labels: update STATUS_THRESHOLDS
//   - Benchmark ranges: update BENCHMARK_RANGES
//   - Scenario multipliers: update SCENARIO_ADJUSTMENTS
// ============================================================

import type {
  ARRBand,
  NewARRTargetBand,
  ACVBand,
  SalesCycleBand,
  QuotaBand,
  RampTimeBand,
  AttainmentBand,
  AttritionBand,
  WinRateBand,
  SalesMotion,
  ForecastMaturity,
  InspectionCadence,
  ManagerSpanBand,
} from './types'

/** A range used for scenario modeling. Base is the midpoint used in calculations. */
export interface BandRange {
  low: number
  base: number
  high: number
  label: string
}

// ─── ARR BAND → DOLLAR MIDPOINTS ────────────────────────────
export const ARR_BANDS: Record<ARRBand, BandRange> = {
  'under-1m':   { low: 200_000,   base: 600_000,   high: 1_000_000,   label: 'Under $1M ARR' },
  '1m-5m':      { low: 1_000_000, base: 3_000_000,  high: 5_000_000,   label: '$1M–$5M ARR' },
  '5m-15m':     { low: 5_000_000, base: 10_000_000, high: 15_000_000,  label: '$5M–$15M ARR' },
  '15m-30m':    { low: 15_000_000,base: 22_500_000, high: 30_000_000,  label: '$15M–$30M ARR' },
  '30m-75m':    { low: 30_000_000,base: 52_500_000, high: 75_000_000,  label: '$30M–$75M ARR' },
  '75m-150m':   { low: 75_000_000,base: 112_500_000,high: 150_000_000, label: '$75M–$150M ARR' },
  'over-150m':  { low: 150_000_000,base: 225_000_000,high: 350_000_000,label: 'Over $150M ARR' },
}

// ─── NEW ARR TARGET BAND → DOLLAR MIDPOINTS ─────────────────
export const NEW_ARR_TARGET_BANDS: Record<NewARRTargetBand, BandRange> = {
  'under-500k': { low: 100_000,   base: 350_000,   high: 500_000,   label: 'Under $500K' },
  '500k-1m':    { low: 500_000,   base: 750_000,   high: 1_000_000, label: '$500K–$1M' },
  '1m-2.5m':    { low: 1_000_000, base: 1_750_000, high: 2_500_000, label: '$1M–$2.5M' },
  '2.5m-5m':    { low: 2_500_000, base: 3_750_000, high: 5_000_000, label: '$2.5M–$5M' },
  '5m-10m':     { low: 5_000_000, base: 7_500_000, high: 10_000_000,label: '$5M–$10M' },
  '10m-25m':    { low: 10_000_000,base: 17_500_000,high: 25_000_000,label: '$10M–$25M' },
  'over-25m':   { low: 25_000_000,base: 40_000_000,high: 60_000_000,label: 'Over $25M' },
}

// ─── ACV BAND → DOLLAR MIDPOINTS ────────────────────────────
export const ACV_BANDS: Record<ACVBand, BandRange> = {
  'under-5k':    { low: 1_000,   base: 3_500,   high: 5_000,    label: 'Under $5K ACV' },
  '5k-25k':      { low: 5_000,   base: 15_000,  high: 25_000,   label: '$5K–$25K ACV' },
  '25k-75k':     { low: 25_000,  base: 50_000,  high: 75_000,   label: '$25K–$75K ACV' },
  '75k-200k':    { low: 75_000,  base: 137_500, high: 200_000,  label: '$75K–$200K ACV' },
  'over-200k':   { low: 200_000, base: 350_000, high: 600_000,  label: 'Over $200K ACV' },
}

// ─── SALES CYCLE BAND → MONTHS ──────────────────────────────
export const SALES_CYCLE_BANDS: Record<SalesCycleBand, BandRange> = {
  'under-30d':  { low: 0.5,  base: 0.75, high: 1.0, label: 'Under 30 days' },
  '30-60d':     { low: 1.0,  base: 1.5,  high: 2.0, label: '30–60 days' },
  '60-90d':     { low: 2.0,  base: 2.5,  high: 3.0, label: '60–90 days' },
  '90-180d':    { low: 3.0,  base: 4.5,  high: 6.0, label: '90–180 days' },
  'over-180d':  { low: 6.0,  base: 8.0,  high: 12.0,label: 'Over 180 days' },
}

// ─── QUOTA PER REP BAND → DOLLAR MIDPOINTS ──────────────────
export const QUOTA_BANDS: Record<QuotaBand, BandRange> = {
  'under-400k':  { low: 150_000, base: 300_000,   high: 400_000,   label: 'Under $400K' },
  '400k-600k':   { low: 400_000, base: 500_000,   high: 600_000,   label: '$400K–$600K' },
  '600k-900k':   { low: 600_000, base: 750_000,   high: 900_000,   label: '$600K–$900K' },
  '900k-1.2m':   { low: 900_000, base: 1_050_000, high: 1_200_000, label: '$900K–$1.2M' },
  '1.2m-2m':     { low: 1_200_000,base: 1_600_000,high: 2_000_000, label: '$1.2M–$2M' },
  'over-2m':     { low: 2_000_000,base: 2_750_000,high: 4_000_000, label: 'Over $2M' },
}

// ─── RAMP TIME BAND → MONTHS TO FULL PRODUCTIVITY ───────────
// "Months to full productivity" = when a new hire reaches quota attainment
export const RAMP_TIME_BANDS: Record<RampTimeBand, BandRange> = {
  '1-2-months':    { low: 1.0, base: 1.5, high: 2.0,  label: '1–2 months' },
  '2-3-months':    { low: 2.0, base: 2.5, high: 3.0,  label: '2–3 months' },
  '3-6-months':    { low: 3.0, base: 4.5, high: 6.0,  label: '3–6 months' },
  '6-9-months':    { low: 6.0, base: 7.5, high: 9.0,  label: '6–9 months' },
  'over-9-months': { low: 9.0, base: 11.0,high: 15.0, label: 'Over 9 months' },
}

// ─── AVERAGE ATTAINMENT BAND → MULTIPLIER ───────────────────
// Used to discount quota: effectiveCapacity = reps × quota × attainment
export const ATTAINMENT_BANDS: Record<AttainmentBand, BandRange> = {
  'under-60pct': { low: 0.35, base: 0.50, high: 0.60, label: 'Under 60%' },
  '60-70pct':    { low: 0.60, base: 0.65, high: 0.70, label: '60–70%' },
  '70-80pct':    { low: 0.70, base: 0.75, high: 0.80, label: '70–80%' },
  '80-90pct':    { low: 0.80, base: 0.85, high: 0.90, label: '80–90%' },
  'over-90pct':  { low: 0.90, base: 0.93, high: 1.00, label: 'Over 90%' },
}

// ─── ANNUAL ATTRITION BAND → RATE ───────────────────────────
export const ATTRITION_BANDS: Record<AttritionBand, BandRange> = {
  'under-10pct': { low: 0.03, base: 0.07,  high: 0.10, label: 'Under 10%' },
  '10-15pct':    { low: 0.10, base: 0.125, high: 0.15, label: '10–15%' },
  '15-20pct':    { low: 0.15, base: 0.175, high: 0.20, label: '15–20%' },
  '20-25pct':    { low: 0.20, base: 0.225, high: 0.25, label: '20–25%' },
  'over-25pct':  { low: 0.25, base: 0.32,  high: 0.45, label: 'Over 25%' },
}

// ─── WIN RATE BAND → RATE ────────────────────────────────────
export const WIN_RATE_BANDS: Record<WinRateBand, BandRange> = {
  'under-10pct': { low: 0.03, base: 0.08,  high: 0.10, label: 'Under 10%' },
  '10-15pct':    { low: 0.10, base: 0.125, high: 0.15, label: '10–15%' },
  '15-20pct':    { low: 0.15, base: 0.175, high: 0.20, label: '15–20%' },
  '20-25pct':    { low: 0.20, base: 0.225, high: 0.25, label: '20–25%' },
  '25-35pct':    { low: 0.25, base: 0.30,  high: 0.35, label: '25–35%' },
  'over-35pct':  { low: 0.35, base: 0.42,  high: 0.60, label: 'Over 35%' },
}

// ─── SALES MOTION CONTEXT ────────────────────────────────────
// Used for benchmark comparisons. These are approximate industry midpoints.
export const SALES_MOTION_CONTEXT: Record<SalesMotion, {
  label: string
  typicalWinRate: number
  typicalRampMonths: number
  typicalQuota: number
  typicalCycleMonths: number
}> = {
  smb:          { label: 'SMB', typicalWinRate: 0.28, typicalRampMonths: 2.5, typicalQuota: 450_000,   typicalCycleMonths: 1.5 },
  midmarket:    { label: 'Mid-Market', typicalWinRate: 0.22, typicalRampMonths: 4.5, typicalQuota: 750_000,   typicalCycleMonths: 3.5 },
  enterprise:   { label: 'Enterprise', typicalWinRate: 0.17, typicalRampMonths: 8.0, typicalQuota: 1_200_000, typicalCycleMonths: 7.0 },
  'plg-assisted':{ label: 'PLG-Assisted', typicalWinRate: 0.32, typicalRampMonths: 2.0, typicalQuota: 600_000,   typicalCycleMonths: 1.5 },
  hybrid:       { label: 'Hybrid', typicalWinRate: 0.24, typicalRampMonths: 4.0, typicalQuota: 750_000,   typicalCycleMonths: 3.0 },
}

// ─── FORECAST MATURITY ADJUSTMENTS ──────────────────────────
// These affect fragility scoring; more mature = lower fragility penalty
export const FORECAST_MATURITY_CONFIG: Record<ForecastMaturity, {
  label: string
  fragilityPenalty: number // added to fragility score
  forecastErrorFactor: number // multiplier on forecast variance
}> = {
  basic:         { label: 'Basic (spreadsheet/gut)', fragilityPenalty: 25, forecastErrorFactor: 0.25 },
  intermediate:  { label: 'Intermediate (CRM stages, manager judgment)', fragilityPenalty: 15, forecastErrorFactor: 0.18 },
  advanced:      { label: 'Advanced (weighted pipeline, historical data)', fragilityPenalty: 7, forecastErrorFactor: 0.12 },
  'ai-assisted': { label: 'AI-Assisted (predictive)', fragilityPenalty: 3, forecastErrorFactor: 0.08 },
}

// ─── INSPECTION CADENCE ADJUSTMENTS ─────────────────────────
export const INSPECTION_CADENCE_CONFIG: Record<InspectionCadence, {
  label: string
  fragilityPenalty: number
}> = {
  weekly:    { label: 'Weekly', fragilityPenalty: 0 },
  biweekly:  { label: 'Bi-weekly', fragilityPenalty: 5 },
  monthly:   { label: 'Monthly', fragilityPenalty: 12 },
  quarterly: { label: 'Quarterly', fragilityPenalty: 20 },
}

// ─── MANAGER SPAN CONFIGURATION ─────────────────────────────
export const MANAGER_SPAN_CONFIG: Record<ManagerSpanBand, {
  label: string
  fragilityImpact: 'low' | 'medium' | 'high'
}> = {
  '4-5':   { label: '4–5 reps per manager', fragilityImpact: 'low' },
  '6-7':   { label: '6–7 reps per manager', fragilityImpact: 'low' },
  '8-10':  { label: '8–10 reps per manager', fragilityImpact: 'medium' },
  'over-10':{ label: 'Over 10 reps per manager', fragilityImpact: 'high' },
}

// ─── SCENARIO MULTIPLIERS ────────────────────────────────────
// Applied to base-case values to build each scenario.
// Edit these to change how optimistic/pessimistic your scenarios are.
export const SCENARIO_ADJUSTMENTS = {
  upside: {
    winRateMultiplier: 1.12,       // win rate +12% relative
    pipelineCoverageMultiplier: 1.20, // coverage +20%
    attainmentMultiplier: 1.08,    // attainment +8%
    attritionMultiplier: 0.80,     // attrition -20%
  },
  downside: {
    winRateMultiplier: 0.88,       // win rate -12%
    pipelineCoverageMultiplier: 0.85,
    attainmentMultiplier: 0.92,
    attritionMultiplier: 1.20,
  },
  // Stressed downside adds the user-selected stress factors on top of downside
} as const

// ─── SCORING THRESHOLDS ──────────────────────────────────────
// Edit these to change how the scoring engine interprets each factor.
// All weights should sum to 1.0.
export const SCORING_WEIGHTS = {
  confidence: 0.40,     // Revenue plan confidence
  capacity: 0.35,       // Headcount/capacity sufficiency
  fragility: 0.25,      // Plan resilience (inverted: 100 - fragilityScore)
} as const

// ─── STATUS LABEL THRESHOLDS ─────────────────────────────────
// overallScore → status label
export const STATUS_THRESHOLDS = {
  defensible: 72,  // ≥72 → Defensible
  fragile: 50,     // 50–71 → Fragile
  atRisk: 30,      // 30–49 → At Risk
  // <30 → Critical Risk
} as const

// ─── BENCHMARK RANGES ────────────────────────────────────────
// Used in the benchmark comparison table. Edit to update best-practice ranges.
export const BENCHMARK_RANGES = {
  pipelineCoverage: { good: '3.5x–5x', acceptable: '2.5x–3.5x', risk: 'Under 2.5x' },
  winRate: {
    smb: { good: '25%+', acceptable: '18–25%', risk: 'Under 18%' },
    midmarket: { good: '20%+', acceptable: '15–20%', risk: 'Under 15%' },
    enterprise: { good: '18%+', acceptable: '12–18%', risk: 'Under 12%' },
  },
  rampTime: { good: 'Under 3 months', acceptable: '3–6 months', risk: 'Over 6 months' },
  attrition: { good: 'Under 12%', acceptable: '12–20%', risk: 'Over 20%' },
  attainment: { good: 'Over 80%', acceptable: '65–80%', risk: 'Under 65%' },
  coverageSufficiency: { good: '≥1.0', acceptable: '0.8–1.0', risk: 'Under 0.8' },
} as const

// ─── RAMP PRODUCTIVITY CURVE ─────────────────────────────────
// What fraction of full productivity does a new hire deliver in each month post-hire?
// Used to calculate how much of the target period new hires actually contribute.
// Index 0 = month 1, index 1 = month 2, etc.
// Edit this array to change the ramp curve assumption.
export const RAMP_PRODUCTIVITY_BY_MONTH: number[] = [
  0.05, // Month 1 — onboarding, minimal contribution
  0.15, // Month 2
  0.30, // Month 3
  0.45, // Month 4
  0.60, // Month 5
  0.72, // Month 6
  0.82, // Month 7
  0.88, // Month 8
  0.93, // Month 9
  0.96, // Month 10
  0.98, // Month 11
  1.00, // Month 12
]

/** Given ramp time in months, return average productivity in year 1 */
export function getAverageRampProductivity(rampMonths: number): number {
  // Linear interpolation: in the ramp period, avg productivity = 50% of full
  // After ramp period, productivity = 100%
  const rampContribution = 0.50 * (rampMonths / 12)
  const postRampContribution = 1.00 * ((12 - rampMonths) / 12)
  return rampContribution + postRampContribution
}

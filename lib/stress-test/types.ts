// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// types.ts — All TypeScript interfaces and enums
//
// This file defines the data contracts flowing through the
// entire assessment: form inputs → calculation engine → output.
// ============================================================

// ─── FORM INPUTS ────────────────────────────────────────────

export interface LeadInput {
  email: string
  firstName?: string
  company?: string
  role?: RoleOption
}

export type RoleOption =
  | 'CRO'
  | 'VP RevOps'
  | 'RevOps'
  | 'Sales Ops'
  | 'Founder/CEO'
  | 'Finance'
  | 'Other'

// Banded inputs — converted to low/base/high numerics in config.ts
export type ARRBand =
  | 'under-1m'
  | '1m-5m'
  | '5m-15m'
  | '15m-30m'
  | '30m-75m'
  | '75m-150m'
  | 'over-150m'

export type NewARRTargetBand =
  | 'under-500k'
  | '500k-1m'
  | '1m-2.5m'
  | '2.5m-5m'
  | '5m-10m'
  | '10m-25m'
  | 'over-25m'

export type SalesMotion = 'smb' | 'midmarket' | 'enterprise' | 'plg-assisted' | 'hybrid'

export type ACVBand = 'under-5k' | '5k-25k' | '25k-75k' | '75k-200k' | 'over-200k'

export type SalesCycleBand = 'under-30d' | '30-60d' | '60-90d' | '90-180d' | 'over-180d'

export type TargetPeriod = 'quarterly' | 'annual'

export type QuotaBand =
  | 'under-400k'
  | '400k-600k'
  | '600k-900k'
  | '900k-1.2m'
  | '1.2m-2m'
  | 'over-2m'

export type RampTimeBand =
  | '1-2-months'
  | '2-3-months'
  | '3-6-months'
  | '6-9-months'
  | 'over-9-months'

export type AttainmentBand =
  | 'under-60pct'
  | '60-70pct'
  | '70-80pct'
  | '80-90pct'
  | 'over-90pct'

export type AttritionBand =
  | 'under-10pct'
  | '10-15pct'
  | '15-20pct'
  | '20-25pct'
  | 'over-25pct'

export type WinRateBand =
  | 'under-10pct'
  | '10-15pct'
  | '15-20pct'
  | '20-25pct'
  | '25-35pct'
  | 'over-35pct'

export type ForecastMaturity = 'basic' | 'intermediate' | 'advanced' | 'ai-assisted'

export type InspectionCadence = 'weekly' | 'biweekly' | 'monthly' | 'quarterly'

export type ManagerSpanBand = '4-5' | '6-7' | '8-10' | 'over-10'

export type TerritoryModel =
  | 'geographic'
  | 'named-account'
  | 'vertical'
  | 'hybrid'
  | 'round-robin'

// ─── STEP INPUT STRUCTS ──────────────────────────────────────

export interface CompanyProfileInput {
  arrBand: ARRBand
  salesMotion: SalesMotion
  acvBand: ACVBand
  salesCycleBand: SalesCycleBand
  targetPeriod: TargetPeriod
  newARRTargetBand: NewARRTargetBand
  expansionContributionPct: number // 0–50 — % of target from expansion
}

export interface TeamInput {
  totalReps: number // integer
  sdrCount: number // integer
  quotaPerRepBand: QuotaBand
  plannedHiresTotal: number // new quota-carriers in target period
  rampTimeBand: RampTimeBand
  avgAttainmentBand: AttainmentBand
  annualAttritionBand: AttritionBand
  managerSpanBand: ManagerSpanBand
  territoryModel: TerritoryModel
}

export interface PipelineInput {
  pipelineCoverageRatio: number // 1.0–6.0
  winRateBand: WinRateBand
  concentrationRiskPct: number // 0–60: % of revenue from top 3 deals
  forecastMaturity: ForecastMaturity
  inspectionCadence: InspectionCadence
}

export interface StressScenariosInput {
  hiringDelayed: boolean
  hiringDelayQuarters: 1 | 2
  winRateDropPct: number // 0–30
  salesCycleExpansionPct: number // 0–50
  aspDeclinePct: number // 0–30
  pipelineDropPct: number // 0–50
  attritionIncreasePct: number // 0–20
}

/** The complete assessment submission */
export interface AssessmentInput {
  lead: LeadInput
  company: CompanyProfileInput
  team: TeamInput
  pipeline: PipelineInput
  stress: StressScenariosInput
}

// ─── CALCULATION INTERNALS ───────────────────────────────────

/** Resolved numeric values after band → midpoint conversion */
export interface ResolvedInputs {
  arrBase: number
  newARRTarget: number
  newLogoTarget: number // target minus expansion
  acvBase: number
  salesCycleMonths: number
  quotaPerRep: number
  rampMonths: number
  avgAttainment: number
  annualAttritionRate: number
  winRate: number
}

// ─── SCENARIO & OUTPUT ───────────────────────────────────────

export type ScenarioLabel = 'Base Case' | 'Upside' | 'Downside' | 'Stressed Downside'

export interface ScenarioResult {
  label: ScenarioLabel
  effectiveReps: number
  rampAdjustedReps: number
  productiveCapacity: number // $
  gapToTarget: number // $ — negative = surplus, positive = shortfall
  gapPct: number // fraction — negative = surplus
  coverageSufficiency: number // ratio — ≥1.0 means adequate
  pipelineCoverageRatio: number
  winRate: number
  reachable: boolean // can this scenario hit target?
  quarterlyRun: number[] // Q1–Q4 implied bookings
}

export type RiskSeverity = 'high' | 'medium' | 'low'
export type RecommendationUrgency = 'immediate' | 'near-term' | 'strategic'
export type StatusLabel = 'Stable' | 'Watchlist' | 'Fragile' | 'Exposed'

export interface RiskDriver {
  label: string
  severity: RiskSeverity
  description: string
  impact: string // one-liner on revenue impact
}

export interface Recommendation {
  priority: number
  title: string
  description: string
  urgency: RecommendationUrgency
}

export interface BenchmarkComparison {
  metric: string
  yourValue: string
  benchmarkRange: string
  status: 'good' | 'warning' | 'risk'
}

export interface AssessmentOutput {
  // ── Scores (all 0–100)
  confidenceScore: number // Revenue plan confidence
  capacityScore: number // Team capacity sufficiency
  fragilityScore: number // Forecast fragility (higher = worse)
  overallScore: number // Weighted composite
  statusLabel: StatusLabel

  // ── KPIs
  effectiveRepsBase: number
  rampAdjustedRepsBase: number
  productiveCapacityBase: number
  newARRTarget: number
  gapToTarget: number
  gapToTargetPct: number
  headcountRequired: number // total quota-carriers needed to hit target
  headcountCurrent: number
  headcountGap: number // positive = need more, negative = have buffer
  coverageSufficiency: number
  pipelineCoverageRatio: number
  impliedWinRate: number

  // ── Scenarios
  scenarios: ScenarioResult[]

  // ── Risk intelligence
  topRiskDrivers: RiskDriver[]
  recommendations: Recommendation[]
  executiveSummary: string

  // ── Benchmarks
  benchmarks: BenchmarkComparison[]

  // ── Raw resolved inputs (for PDF display)
  resolved: ResolvedInputs
}

// ─── FORM STATE (client-side) ─────────────────────────────────

export type AssessmentPhase =
  | 'intro'
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'step-5'
  | 'calculating'
  | 'results'

export interface AssessmentState {
  phase: AssessmentPhase
  lead: LeadInput
  company: Partial<CompanyProfileInput>
  team: Partial<TeamInput>
  pipeline: Partial<PipelineInput>
  stress: Partial<StressScenariosInput>
  output: AssessmentOutput | null
  error: string | null
}

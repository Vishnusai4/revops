// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// schema.ts — Zod validation schemas
//
// Used server-side in API routes to validate incoming data.
// Client-side validation mirrors these rules in the form steps.
// ============================================================

import { z } from 'zod'

// ─── STEP 1: LEAD ────────────────────────────────────────────

export const LeadSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  firstName: z.string().max(100).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  role: z
    .enum(['CRO', 'VP RevOps', 'RevOps', 'Sales Ops', 'Founder/CEO', 'Finance', 'Other'])
    .optional(),
})

// ─── STEP 2: COMPANY PROFILE ─────────────────────────────────

export const CompanyProfileSchema = z.object({
  arrBand: z.enum([
    'under-1m', '1m-5m', '5m-15m', '15m-30m', '30m-75m', '75m-150m', 'over-150m',
  ]),
  salesMotion: z.enum(['smb', 'midmarket', 'enterprise', 'plg-assisted', 'hybrid']),
  acvBand: z.enum(['under-5k', '5k-25k', '25k-75k', '75k-200k', 'over-200k']),
  salesCycleBand: z.enum(['under-30d', '30-60d', '60-90d', '90-180d', 'over-180d']),
  targetPeriod: z.enum(['quarterly', 'annual']),
  newARRTargetBand: z.enum([
    'under-500k', '500k-1m', '1m-2.5m', '2.5m-5m', '5m-10m', '10m-25m', 'over-25m',
  ]),
  expansionContributionPct: z.number().min(0).max(60),
})

// ─── STEP 3: TEAM ────────────────────────────────────────────

export const TeamSchema = z.object({
  totalReps: z.number().int().min(1).max(10_000),
  sdrCount: z.number().int().min(0).max(10_000),
  quotaPerRepBand: z.enum([
    'under-400k', '400k-600k', '600k-900k', '900k-1.2m', '1.2m-2m', 'over-2m',
  ]),
  plannedHiresTotal: z.number().int().min(0).max(10_000),
  rampTimeBand: z.enum([
    '1-2-months', '2-3-months', '3-6-months', '6-9-months', 'over-9-months',
  ]),
  avgAttainmentBand: z.enum([
    'under-60pct', '60-70pct', '70-80pct', '80-90pct', 'over-90pct',
  ]),
  annualAttritionBand: z.enum([
    'under-10pct', '10-15pct', '15-20pct', '20-25pct', 'over-25pct',
  ]),
  managerSpanBand: z.enum(['4-5', '6-7', '8-10', 'over-10']),
  territoryModel: z.enum([
    'geographic', 'named-account', 'vertical', 'hybrid', 'round-robin',
  ]),
})

// ─── STEP 4: PIPELINE ────────────────────────────────────────

export const PipelineSchema = z.object({
  pipelineCoverageRatio: z.number().min(0.5).max(10),
  winRateBand: z.enum([
    'under-10pct', '10-15pct', '15-20pct', '20-25pct', '25-35pct', 'over-35pct',
  ]),
  concentrationRiskPct: z.number().min(0).max(100),
  forecastMaturity: z.enum(['basic', 'intermediate', 'advanced', 'ai-assisted']),
  inspectionCadence: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']),
})

// ─── STEP 5: STRESS SCENARIOS ────────────────────────────────

export const StressScenariosSchema = z.object({
  hiringDelayed: z.boolean(),
  hiringDelayQuarters: z.union([z.literal(1), z.literal(2)]),
  winRateDropPct: z.number().min(0).max(50),
  salesCycleExpansionPct: z.number().min(0).max(100),
  aspDeclinePct: z.number().min(0).max(60),
  pipelineDropPct: z.number().min(0).max(80),
  attritionIncreasePct: z.number().min(0).max(50),
})

// ─── FULL ASSESSMENT ─────────────────────────────────────────

export const AssessmentInputSchema = z.object({
  lead: LeadSchema,
  company: CompanyProfileSchema,
  team: TeamSchema,
  pipeline: PipelineSchema,
  stress: StressScenariosSchema,
})

export type LeadSchemaType = z.infer<typeof LeadSchema>
export type AssessmentInputSchemaType = z.infer<typeof AssessmentInputSchema>

// ============================================================
// TERAVICTUS — /api/stress-test/calculate
//
// Called when the user submits all 5 steps.
// Validates the full assessment input and runs the calculation engine.
// Returns AssessmentOutput as JSON.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { AssessmentInputSchema } from '@/lib/stress-test/schema'
import { runAssessment } from '@/lib/stress-test/orchestrate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate all five steps with Zod
    const parseResult = AssessmentInputSchema.safeParse(body)
    if (!parseResult.success) {
      console.error('[stress-test/calculate] Validation failed:', parseResult.error.flatten())
      return NextResponse.json(
        { ok: false, error: 'Invalid assessment input', details: parseResult.error.flatten() },
        { status: 400 },
      )
    }

    const input = parseResult.data

    // Run the calculation engine
    const output = runAssessment(input)

    console.log('[stress-test/calculate] Assessment complete for:', input.lead.email, '| Score:', output.overallScore, '| Status:', output.statusLabel)

    return NextResponse.json({ ok: true, output })
  } catch (err) {
    console.error('[stress-test/calculate] Unexpected error:', err)
    return NextResponse.json(
      { ok: false, error: 'Calculation failed — please try again' },
      { status: 500 },
    )
  }
}

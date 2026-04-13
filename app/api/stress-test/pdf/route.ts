// ============================================================
// TERAVICTUS — /api/stress-test/pdf
//
// Generates a polished PDF report using @react-pdf/renderer.
// This is a pure Node.js PDF (no browser/Puppeteer required).
// Returns the PDF as application/pdf for direct download.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { AssessmentInputSchema } from '@/lib/stress-test/schema'
import { runAssessment } from '@/lib/stress-test/orchestrate'
import type { AssessmentOutput, AssessmentInput } from '@/lib/stress-test/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parseResult = AssessmentInputSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input for PDF generation' },
        { status: 400 },
      )
    }

    const input = parseResult.data as AssessmentInput

    // Re-run assessment to ensure freshness (or accept pre-computed output)
    let output: AssessmentOutput
    if (body.output) {
      output = body.output as AssessmentOutput
    } else {
      output = runAssessment(input)
    }

    // Dynamically import @react-pdf/renderer only in this API route
    // This ensures it is never bundled for the browser side.
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { buildReportDocument } = await import('@/components/stress-test/pdf/ReportDocument')

    const doc = buildReportDocument(input, output)
    const pdfBuffer = await renderToBuffer(doc)

    const companySlug = (input.lead.company || 'report')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const filename = `teravictus-revenue-stress-test-${companySlug}.pdf`

    // Convert Buffer to Uint8Array so NextResponse accepts it as BodyInit
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[stress-test/pdf] PDF generation failed:', err)
    return NextResponse.json(
      { ok: false, error: 'PDF generation failed — please try again' },
      { status: 500 },
    )
  }
}

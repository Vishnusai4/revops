import { NextRequest, NextResponse } from 'next/server'
import type { AssessmentOutput } from '@/lib/stress-test/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const output: AssessmentOutput | undefined = body.output
    if (!output) {
      return NextResponse.json({ ok: false, error: 'Missing output' }, { status: 400 })
    }

    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { buildReportDocument } = await import('@/components/stress-test/pdf/ReportDocument')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = { lead: { email: '', company: body.company, firstName: body.firstName } }
    const doc = buildReportDocument(input, output)
    const pdfBuffer = await renderToBuffer(doc)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="teravictus-revenue-stress-test.pdf"',
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

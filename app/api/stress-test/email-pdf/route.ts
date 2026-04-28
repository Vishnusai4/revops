// ============================================================
// TERAVICTUS — /api/stress-test/email-pdf
//
// Called after a successful assessment calculation.
// Generates the full PDF report and delivers it to the user
// as an email attachment via Resend.
//
// NOTE: The FROM_EMAIL address must be on a domain verified in
// your Resend account. If you want to send from vishnu@teravictus.com,
// verify the teravictus.com root domain in Resend settings in addition
// to the inbound.teravictus.com subdomain already in use.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import type { AssessmentOutput } from '@/lib/stress-test/types'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const email: string | undefined = body.input?.lead?.email || body.email
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 })
    }

    // Build a minimal lead object for template rendering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input: any = { lead: { email, firstName: body.input?.lead?.firstName, company: body.input?.lead?.company } }
    const output: AssessmentOutput | undefined = body.output

    if (!output) {
      return NextResponse.json(
        { ok: false, error: 'Missing assessment output' },
        { status: 400 },
      )
    }

    if (!resend) {
      console.warn('[stress-test/email-pdf] RESEND_API_KEY not configured — email skipped')
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Generate the PDF report
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { buildReportDocument } = await import('@/components/stress-test/pdf/ReportDocument')

    const doc = buildReportDocument(input, output)
    const pdfBuffer = await renderToBuffer(doc)

    const companySlug = (input.lead.company || 'report')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const filename = `teravictus-revenue-stress-test-${companySlug}.pdf`

    const fromAddress = process.env.FROM_EMAIL ?? 'Teravictus <noreply@inbound.teravictus.com>'
    const greeting = input.lead.firstName ? `Hi ${input.lead.firstName},` : 'Hi,'
    const statusLabel = output.statusLabel ?? 'Fragile'
    const score = output.overallScore ?? 0

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#FFFFFF;border-radius:12px;border:1px solid #E5E7EB;overflow:hidden;">
    <!-- Header -->
    <div style="background:#6366F1;padding:28px 32px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#FFFFFF;letter-spacing:0.05em;text-transform:uppercase;">Teravictus</p>
      <p style="margin:6px 0 0;font-size:18px;font-weight:600;color:#EEF2FF;">Revenue Plan Stress Test</p>
    </div>
    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#1C1C1C;">${greeting}</p>
      <p style="margin:0 0 16px;font-size:15px;color:#4B4B4B;line-height:1.6;">
        Your Revenue Plan Stress Test is complete. Your report is attached to this email as a PDF.
      </p>

      <!-- Score callout -->
      <div style="margin:20px 0;padding:16px 20px;background:#F5F5F4;border-radius:8px;border-left:3px solid #6366F1;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6366F1;text-transform:uppercase;letter-spacing:0.05em;">Overall confidence score</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:#1C1C1C;">${score}<span style="font-size:16px;color:#6B7280;">/100</span> &nbsp;<span style="font-size:15px;font-weight:600;color:#4B4B4B;">— ${statusLabel}</span></p>
      </div>

      <p style="margin:16px 0;font-size:14px;color:#4B4B4B;line-height:1.6;">
        The report covers your base case, upside, downside, and stressed scenarios, along with capacity benchmarks and the top actions we'd recommend.
      </p>
      <p style="margin:16px 0 0;font-size:14px;color:#4B4B4B;line-height:1.6;">
        If you'd like to walk through the findings together, reply to <a href="mailto:vishnu@teravictus.com" style="color:#6366F1;text-decoration:none;">vishnu@teravictus.com</a> or <a href="https://calendar.app.google/Nhpt6uNLE5Da7Szw7" style="color:#6366F1;text-decoration:none;">book a 20-min call directly</a>.
      </p>
    </div>
    <!-- Footer -->
    <div style="padding:16px 32px 24px;border-top:1px solid #F0F0EE;">
      <p style="margin:0;font-size:12px;color:#9CA3AF;">
        Teravictus &nbsp;·&nbsp; Revenue Operations &nbsp;·&nbsp;
        <a href="https://rev.teravictus.com" style="color:#6366F1;text-decoration:none;">rev.teravictus.com</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()

    const text = `
${greeting}

Your Revenue Plan Stress Test is complete. Your report is attached to this email as a PDF.

Overall Confidence Score: ${score}/100 — ${statusLabel}

The report covers your base case, upside, downside, and stressed scenarios, along with capacity benchmarks and the top actions we'd recommend.

If you'd like to walk through the findings together, reply to vishnu@teravictus.com or visit https://rev.teravictus.com.

— Teravictus
    `.trim()

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [input.lead.email],
      replyTo: 'vishnu@teravictus.com',
      subject: `Your Revenue Plan Stress Test Report — Score: ${score}/100`,
      html,
      text,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBuffer),
        },
      ],
    })

    if (error) {
      console.error('[stress-test/email-pdf] Failed to send report email:', error)
      return NextResponse.json(
        { ok: false, error: 'Email delivery failed' },
        { status: 500 },
      )
    }

    console.log('[stress-test/email-pdf] Report emailed to', input.lead.email, '— id:', data?.id, '| file:', filename)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[stress-test/email-pdf] Unexpected error:', err)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}

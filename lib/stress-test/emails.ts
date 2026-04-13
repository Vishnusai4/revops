// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// emails.ts — Email HTML templates
//
// *** EDIT THIS FILE TO CHANGE EMAIL COPY AND DESIGN ***
//
// Two templates:
//   1. notificationEmail() — sent to you (internal lead alert)
//   2. confirmationEmail() — sent to the user (assessment started)
// ============================================================

import type { LeadInput } from './types'

const BRAND_COLOR = '#6366F1'
const BRAND_DARK = '#4F46E5'
const SURFACE = '#FAFAF8'

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Teravictus</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e5e5e0;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_COLOR};padding:28px 36px;">
              <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">Teravictus</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">rev.teravictus.com</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #e5e5e0;background:${SURFACE};">
              <p style="margin:0;color:#9CA3AF;font-size:12px;">
                Made by Teravictus — <a href="https://rev.teravictus.com" style="color:#6366F1;text-decoration:none;">rev.teravictus.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function field(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #F0F0EC;">
      <span style="color:#6B7280;font-size:13px;font-weight:500;">${label}</span>
      <span style="display:block;color:#1A1A1A;font-size:14px;font-weight:600;margin-top:2px;">${value || '—'}</span>
    </td>
  </tr>`
}

// ─────────────────────────────────────────────────────────────
// 1. INTERNAL LEAD NOTIFICATION (sent to vishnu@teravictus.com)
// ─────────────────────────────────────────────────────────────

export function notificationEmail(lead: LeadInput, timestamp: string): string {
  const name = lead.firstName ? lead.firstName : '(no name)'
  const company = lead.company || '(no company)'
  const role = lead.role || '(not specified)'

  const content = `
    <h1 style="margin:0 0 8px;color:#1A1A1A;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
      New Stress Test Lead
    </h1>
    <p style="margin:0 0 28px;color:#6B7280;font-size:14px;">
      Someone just started the Revenue Plan Stress Test.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #F0F0EC;">
      ${field('Email', `<a href="mailto:${lead.email}" style="color:${BRAND_COLOR};text-decoration:none;">${lead.email}</a>`)}
      ${field('First Name', name)}
      ${field('Company', company)}
      ${field('Role', role)}
      ${field('Source', 'Revenue Plan Stress Test')}
      ${field('Timestamp', timestamp)}
    </table>

    <div style="margin-top:28px;padding:16px;background:#EEF2FF;border-radius:8px;border-left:3px solid ${BRAND_COLOR};">
      <p style="margin:0;color:#3730A3;font-size:13px;font-weight:500;">
        Follow up within 24–48 hours after they download their report for highest conversion.
      </p>
    </div>

    <div style="margin-top:24px;">
      <a href="mailto:${lead.email}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">
        Reply to ${name}
      </a>
    </div>
  `

  return emailWrapper(content)
}

export function notificationEmailText(lead: LeadInput, timestamp: string): string {
  return `New Stress Test Lead

Email: ${lead.email}
Name: ${lead.firstName || '(not provided)'}
Company: ${lead.company || '(not provided)'}
Role: ${lead.role || '(not provided)'}
Source: Revenue Plan Stress Test
Timestamp: ${timestamp}

Follow up after they download their report.`
}

// ─────────────────────────────────────────────────────────────
// 2. USER CONFIRMATION EMAIL (sent to the lead)
// ─────────────────────────────────────────────────────────────

export function confirmationEmail(lead: LeadInput): string {
  const firstName = lead.firstName ? `, ${lead.firstName}` : ''

  const content = `
    <h1 style="margin:0 0 8px;color:#1A1A1A;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
      Your assessment is ready
    </h1>
    <p style="margin:0 0 24px;color:#6B7280;font-size:15px;line-height:1.6;">
      Hi${firstName}, thanks for starting the Revenue Plan Stress Test. Your personalized report is being generated as you complete the assessment.
    </p>

    <div style="padding:20px 24px;background:${SURFACE};border-radius:10px;border:1px solid #E5E5E0;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">What you'll receive</p>
      <ul style="margin:8px 0 0;padding-left:18px;color:#374151;font-size:14px;line-height:1.8;">
        <li>Revenue plan confidence score (0–100)</li>
        <li>4-scenario financial model: base, upside, downside, stressed</li>
        <li>Top risk drivers ranked by severity</li>
        <li>3 strategic recommendations specific to your plan</li>
        <li>Downloadable PDF report with charts and benchmarks</li>
      </ul>
    </div>

    <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.6;">
      Complete the remaining steps and your full report will be ready in seconds. When you're done, you can download the PDF or book a strategy call to walk through the results with the Teravictus team.
    </p>

    <a href="https://rev.teravictus.com/stress-test" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
      Continue Your Assessment →
    </a>

    <p style="margin:28px 0 0;color:#9CA3AF;font-size:13px;line-height:1.6;">
      Questions? Reply to this email or book a call at
      <a href="https://rev.teravictus.com" style="color:${BRAND_COLOR};text-decoration:none;">rev.teravictus.com</a>.
    </p>
  `

  return emailWrapper(content)
}

export function confirmationEmailText(lead: LeadInput): string {
  const firstName = lead.firstName ? `, ${lead.firstName}` : ''
  return `Hi${firstName},

Thanks for starting the Revenue Plan Stress Test. Complete the remaining steps to get your personalized report.

You'll receive:
- Revenue plan confidence score (0–100)
- 4-scenario financial model
- Top risk drivers ranked by severity
- Strategic recommendations
- Downloadable PDF report

Continue at: https://rev.teravictus.com/stress-test

Questions? Reply to this email.

— Teravictus
rev.teravictus.com`
}

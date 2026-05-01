// ============================================================
// TERAVICTUS — /api/stress-test/lead
//
// Called when the user completes Step 1 (email capture).
// Responsibilities:
//   1. Validate the lead input with Zod
//   2. Basic spam/duplicate guard (in-memory, per cold start)
//   3. Send internal notification email via Resend
//   4. Optionally send confirmation email to the user
//   5. Log everything; never block the user on email failure
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { LeadSchema } from '@/lib/stress-test/schema'
import { notificationEmail, notificationEmailText, confirmationEmail, confirmationEmailText } from '@/lib/stress-test/emails'

// ─── Resend client ───────────────────────────────────────────
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// ─── Simple in-memory deduplication ──────────────────────────
// Resets on cold start; prevents double-submits within the same function instance.
// Replace with Redis/KV for persistent deduplication in high-volume scenarios.
const recentSubmissions = new Set<string>()
const DEDUP_WINDOW_MS = 60_000 // 1 minute

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

function isDuplicate(email: string): boolean {
  return recentSubmissions.has(normalizeEmail(email))
}

function registerSubmission(email: string): void {
  const key = normalizeEmail(email)
  recentSubmissions.add(key)
  // Auto-clear after dedup window
  setTimeout(() => recentSubmissions.delete(key), DEDUP_WINDOW_MS)
}

// ─── Handler ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod
    const parseResult = LeadSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid input', details: parseResult.error.flatten() },
        { status: 400 },
      )
    }

    const lead = parseResult.data
    const timestamp = new Date().toISOString()

    // Duplicate check
    if (isDuplicate(lead.email ?? '')) {
      // Return success to the user — no UX penalty — but skip re-sending emails
      console.log(`[stress-test/lead] Duplicate submission skipped: ${lead.email}`)
      return NextResponse.json({ ok: true, duplicate: true })
    }

    registerSubmission(lead.email ?? "")

    // Log to console (captured by Vercel logs)
    console.log('=== Stress Test Lead ===')
    console.log('Email:', lead.email)
    console.log('Name:', lead.firstName ?? '(not provided)')
    console.log('Company:', lead.company ?? '(not provided)')
    console.log('Role:', lead.role ?? '(not provided)')
    console.log('Timestamp:', timestamp)
    console.log('========================')

    // ── Send emails (non-blocking: failures are logged, not thrown)
    const fromAddress = process.env.FROM_EMAIL ?? 'Teravictus <noreply@inbound.teravictus.com>'
    const notifyAddress = process.env.NOTIFICATION_EMAIL ?? 'vishnu@teravictus.com'

    if (resend) {
      // 1. Internal notification
      const { data: notifData, error: notifError } = await resend.emails.send({
        from: fromAddress,
        to: [notifyAddress],
        subject: `New Stress Test Lead: ${lead.email}${lead.company ? ` — ${lead.company}` : ''}`,
        html: notificationEmail(lead, timestamp),
        text: notificationEmailText(lead, timestamp),
      })
      if (notifError) {
        console.error('[stress-test/lead] Notification email failed:', notifError)
      } else {
        console.log('[stress-test/lead] Notification email sent to', notifyAddress, '— id:', notifData?.id)
      }

      // 2. Confirmation email to user
      const { data: confirmData, error: confirmError } = await resend.emails.send({
        from: fromAddress,
        to: [lead.email!],
        replyTo: 'vishnu@teravictus.com',
        subject: 'Your Revenue Plan Stress Test is starting',
        html: confirmationEmail(lead),
        text: confirmationEmailText(lead),
      })
      if (confirmError) {
        console.error('[stress-test/lead] Confirmation email failed:', confirmError)
      } else {
        console.log('[stress-test/lead] Confirmation email sent to', lead.email, '— id:', confirmData?.id)
      }
    } else {
      console.warn('[stress-test/lead] RESEND_API_KEY not configured — emails skipped')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[stress-test/lead] Unexpected error:', err)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}

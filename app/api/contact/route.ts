import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactFormData {
  name: string
  email: string
  company: string
  role: string
  message: string
}

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.company || !data.role) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the submission
    console.log('=== Contact Form Submission ===')
    console.log('Name:', data.name)
    console.log('Email:', data.email)
    console.log('Company:', data.company)
    console.log('Role:', data.role)
    console.log('Message:', data.message || '(no message)')
    console.log('Timestamp:', new Date().toISOString())
    console.log('==============================')

    // Send email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'RevOps Signups <onboarding@resend.dev>', // Use your verified domain in production
          to: ['vishnu@teravictus.com'],
          subject: `New RevOps Signup: ${data.name} from ${data.company}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Role:</strong> ${data.role}</p>
            <p><strong>Message:</strong> ${data.message || '(no message)'}</p>
            <hr/>
            <p><em>Submitted at ${new Date().toISOString()} from rev.teravictus.com</em></p>
          `,
          text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role}
Message: ${data.message || '(no message)'}

Submitted at ${new Date().toISOString()} from rev.teravictus.com
          `.trim(),
        })
        console.log('Email sent successfully via Resend')
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError)
        // Don't fail the request if email fails - still log the submission
      }
    } else {
      console.log('RESEND_API_KEY not configured - email not sent')
    }

    // ===== OPTIONAL INTEGRATIONS =====

    // HubSpot Form Submission
    // Set HUBSPOT_PORTAL_ID and HUBSPOT_FORM_ID to enable
    if (process.env.HUBSPOT_FORM_ID && process.env.HUBSPOT_PORTAL_ID) {
      try {
        await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_ID}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: [
                { name: 'firstname', value: data.name },
                { name: 'email', value: data.email },
                { name: 'company', value: data.company },
                { name: 'jobtitle', value: data.role },
                { name: 'message', value: data.message },
              ],
            }),
          }
        )
      } catch (hubspotError) {
        console.error('HubSpot submission failed:', hubspotError)
      }
    }

    // Slack Webhook
    // Set SLACK_WEBHOOK_URL to enable
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `New RevOps signup from ${data.name} (${data.email}) at ${data.company}`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*New RevOps Signup*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Role:* ${data.role}\n*Message:* ${data.message || '(none)'}`,
                },
              },
            ],
          }),
        })
      } catch (slackError) {
        console.error('Slack notification failed:', slackError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

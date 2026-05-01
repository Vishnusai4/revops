'use client'

import { useState, FormEvent } from 'react'
import type { LeadInput, RoleOption } from '@/lib/stress-test/types'

interface Props {
  values: LeadInput
  onSubmit: (lead: LeadInput) => Promise<void>
}

const ROLES: RoleOption[] = ['CRO', 'VP RevOps', 'RevOps', 'Sales Ops', 'Founder/CEO', 'Finance', 'Other']

function validateEmail(email: string): boolean {
  // RFC 5322 simplified; accepts all domains including personal emails
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function StepLeadCapture({ values, onSubmit }: Props) {
  const [form, setForm] = useState<LeadInput>(values)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState('')

  function set<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'email') setEmailError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateEmail(form.email ?? '')) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Email — required */}
        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-ink">
            Email address <span className="text-brand-500">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            className={`${inputCls} ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
          />
          {emailError ? (
            <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-faint">
              Use any email you'd like the report sent to.
            </p>
          )}
        </div>

        {/* First name — optional */}
        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-ink">
            First name <span className="text-ink-faint font-normal">(optional)</span>
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="given-name"
            placeholder="Your first name"
            value={form.firstName ?? ''}
            onChange={(e) => set('firstName', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Company — optional */}
        <div>
          <label htmlFor="lead-company" className="block text-sm font-medium text-ink">
            Company <span className="text-ink-faint font-normal">(optional)</span>
          </label>
          <input
            id="lead-company"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
            value={form.company ?? ''}
            onChange={(e) => set('company', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Role — optional */}
        <div>
          <label htmlFor="lead-role" className="block text-sm font-medium text-ink">
            Role <span className="text-ink-faint font-normal">(optional)</span>
          </label>
          <select
            id="lead-role"
            value={form.role ?? ''}
            onChange={(e) => set('role', e.target.value as RoleOption || undefined)}
            className={inputCls}
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Starting your assessment…' : 'Start the Assessment →'}
        </button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Takes under 10 minutes. No credit card. No sales pitch.
        </p>
      </div>
    </form>
  )
}

'use client'

import { useState, FormEvent } from 'react'
import AnimateIn from './AnimateIn'

interface FormData {
  name: string
  email: string
  company: string
  role: string
  message: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', company: '', role: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://calendar.app.google/RFAVCBpXK7AWYxt67'

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <AnimateIn>
          <h2 className="font-heading text-4xl tracking-tight text-ink sm:text-5xl max-w-lg">
            Start a Conversation
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            If this sounds like your problem, let&apos;s talk.
          </p>
        </AnimateIn>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form: 3/5 */}
          <AnimateIn className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-ink">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-ink">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-ink focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">Select your role</option>
                    <option value="RevOps">RevOps</option>
                    <option value="Sales Ops">Sales Ops</option>
                    <option value="Head of Sales">Head of Sales</option>
                    <option value="Founder/CEO">Founder/CEO</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="message" className="block text-sm font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1.5 block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none"
                  placeholder="Tell us about your RevOps challenges..."
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Submit contact form"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {status === 'success' && (
                <p className="mt-4 text-green-600 font-medium text-sm">
                  Thanks! We will be in touch soon.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-red-600 font-medium text-sm">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          </AnimateIn>

          {/* Sidebar: 2/5 */}
          <AnimateIn delay={0.15} className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
                  Book a Call
                </h3>
                <p className="mt-2 text-ink-body leading-relaxed">
                  Prefer a conversation? Schedule a call with the founder directly.
                </p>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Schedule a call
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
                  LinkedIn
                </h3>
                <p className="mt-2 text-ink-body leading-relaxed">
                  Send a quick DM if that is easier.
                </p>
                <a
                  href="https://www.linkedin.com/in/vishnusaiy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Message on LinkedIn
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, FormEvent } from 'react'

interface FormData {
  name: string
  email: string
  company: string
  role: string
  message: string
}

export default function Hero() {
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

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBookCall = () => {
    const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://calendar.app.google/RFAVCBpXK7AWYxt67'
    window.open(calendarUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              RevOps Workflow Engine
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              Enforce pipeline integrity. Surface risk early. Make your CRM a system you can trust.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBookCall}
                className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                Book a Call with Founder
              </button>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center rounded-lg border-2 border-teal-500 px-6 py-3 text-base font-semibold text-teal-500 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                See What We Do
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative lg:ml-auto w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
                Get in Touch
              </h2>
              <p className="mt-2 text-sm text-slate-600 text-center">
                Have questions? Drop us a line.
              </p>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="hero-name" className="block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="hero-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500 focus:outline-none text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="hero-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500 focus:outline-none text-sm"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-company" className="block text-sm font-medium text-slate-700">
                      Company
                    </label>
                    <input
                      type="text"
                      id="hero-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500 focus:outline-none text-sm"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-role" className="block text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select
                      id="hero-role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-teal-500 focus:outline-none text-sm"
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
                <div className="mt-4">
                  <label htmlFor="hero-message" className="block text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    id="hero-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500 focus:outline-none resize-none text-sm"
                    placeholder="Tell us about your RevOps challenges..."
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-lg bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Submit contact form"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

                {status === 'success' && (
                  <p className="mt-3 text-center text-green-600 font-medium text-sm">
                    Thanks! We&apos;ll be in touch soon.
                  </p>
                )}
                {status === 'error' && (
                  <p className="mt-3 text-center text-red-600 font-medium text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

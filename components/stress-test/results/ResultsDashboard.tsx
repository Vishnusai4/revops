'use client'

import { useState, useRef } from 'react'
import type { AssessmentOutput, AssessmentInput } from '@/lib/stress-test/types'
import ScoreBlock from './ScoreBlock'
import KPICards from './KPICards'
import ScenarioTable from './ScenarioTable'
import { ScenarioBarChart, QuarterlyCapacityChart, RiskContributionChart } from './Charts'
import RecommendationBlock from './RecommendationBlock'

interface Props {
  output: AssessmentOutput
  input?: AssessmentInput
  onRestart: () => void
}

const CALENDAR_URL =
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CALENDAR_URL
    ? process.env.NEXT_PUBLIC_CALENDAR_URL
    : 'https://calendar.app.google/Nhpt6uNLE5Da7Szw7'

export default function ResultsDashboard({ output, input, onRestart }: Props) {
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [emailInput, setEmailInput] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)

  async function downloadPDF() {
    setPdfStatus('loading')
    try {
      const res = await fetch('/api/stress-test/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'teravictus-revenue-stress-test.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setPdfStatus('idle')
    } catch {
      setPdfStatus('error')
      setTimeout(() => setPdfStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-surface-warm">
      {/* Top nav strip */}
      <div className="bg-white border-b border-ink/8 sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-600 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Teravictus
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="text-xs text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-muted"
            >
              Start over
            </button>
            <button
              onClick={downloadPDF}
              disabled={pdfStatus === 'loading'}
              className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60 transition-colors"
            >
              {pdfStatus === 'loading' ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating…
                </>
              ) : pdfStatus === 'error' ? (
                'Error — try again'
              ) : (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-10 space-y-10">

        {/* Score hero */}
        <ScoreBlock output={output} companyName={input?.lead?.company} />

        {/* KPI cards */}
        <KPICards output={output} />

        {/* Charts section */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
            Scenario & Capacity Analysis
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-ink/8 p-5">
              <ScenarioBarChart output={output} />
            </div>
            <div className="bg-white rounded-xl border border-ink/8 p-5">
              <QuarterlyCapacityChart output={output} />
            </div>
          </div>
          <div className="mt-6 bg-white rounded-xl border border-ink/8 p-5">
            <RiskContributionChart output={output} />
          </div>
        </section>

        {/* Scenario comparison table */}
        <ScenarioTable output={output} />

        {/* Risk drivers + recommendations + benchmarks */}
        <RecommendationBlock output={output} />


        {/* Email report */}
        <div className="bg-white rounded-xl border border-ink/8 px-5 py-5">
          <p className="text-sm font-medium text-ink mb-3">Email this report to yourself</p>
          <div className="flex gap-2">
            <input
              ref={emailRef}
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-ink/10 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
            <button
              onClick={async () => {
                const email = emailRef.current?.value || emailInput
                if (!email) return
                setEmailStatus('loading')
                try {
                  const res = await fetch('/api/stress-test/email-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, output }),
                  })
                  if (!res.ok) throw new Error('Failed')
                  setEmailStatus('sent')
                  setTimeout(() => setEmailStatus('idle'), 4000)
                } catch {
                  setEmailStatus('error')
                  setTimeout(() => setEmailStatus('idle'), 3000)
                }
              }}
              disabled={emailStatus === 'loading' || emailStatus === 'sent'}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/80 disabled:opacity-50 transition-colors"
            >
              {emailStatus === 'loading' ? 'Sending…' : emailStatus === 'sent' ? 'Sent ✓' : emailStatus === 'error' ? 'Error — retry' : 'Send'}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            We'll send the PDF report to this address.
          </p>
        </div>

        {/* Soft contact CTA */}
        <div className="border-t border-ink/6 pt-8 pb-4 text-center">
          <p className="text-sm font-semibold text-ink mb-1">
            Want to go deeper on where your pipeline is breaking?
          </p>
          <p className="text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            If you want specific strategies for your situation — not generic advice — we can walk through it together. Reply to{' '}
            <a href="mailto:vishnu@teravictus.com" className="text-brand-500 hover:underline">vishnu@teravictus.com</a>
            {' '}or{' '}
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">book a 20-min call</a>.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-ink-faint pb-4">
          Made by Teravictus — rev.teravictus.com &nbsp;|&nbsp; Results based on inputs provided. For strategic use only.
        </p>
      </div>
    </div>
  )
}

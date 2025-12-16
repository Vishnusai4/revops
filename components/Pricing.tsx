'use client'

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://calendar.app.google/RFAVCBpXK7AWYxt67'
const FALLBACK_EMAIL = 'vishnu@teravictus.com'

export default function Pricing() {
  const handleBookCall = () => {
    if (CALENDAR_URL) {
      window.open(CALENDAR_URL, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=RevOps%20Pilot%20Inquiry`
    }
  }

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pilot Pricing
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            Starting at <span className="font-semibold text-slate-900">$2k/month</span> — design partner discounts available.
          </p>
          <div className="mt-8">
            <button
              onClick={handleBookCall}
              className="inline-flex items-center justify-center rounded-lg bg-teal-500 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              aria-label="Book a discovery call"
            >
              Book 15-minute call
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No commitment. Let&apos;s see if we&apos;re a fit.
          </p>
        </div>
      </div>
    </section>
  )
}

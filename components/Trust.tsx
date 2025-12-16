export default function Trust() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-semibold text-teal-500">
            Founder-built. Designed for RevOps.
          </p>

          {/* Placeholder logos */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center justify-center w-32 h-12 rounded bg-slate-100 text-slate-400 text-sm font-medium">
              Partner 1
            </div>
            <div className="flex items-center justify-center w-32 h-12 rounded bg-slate-100 text-slate-400 text-sm font-medium">
              Partner 2
            </div>
            <div className="flex items-center justify-center w-32 h-12 rounded bg-slate-100 text-slate-400 text-sm font-medium">
              Partner 3
            </div>
          </div>

          {/* Privacy note */}
          <div className="mt-12 rounded-xl bg-slate-50 p-6">
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-sm font-medium">
                No customer message storage. Metadata-only. OAuth + read-only where possible.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

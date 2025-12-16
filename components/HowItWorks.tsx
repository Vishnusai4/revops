const steps = [
  {
    number: '1',
    title: 'Connect',
    description: 'Integrate your CRM (HubSpot/Salesforce) and define the rules that match how leadership thinks the system should work.',
  },
  {
    number: '2',
    title: 'Enforce',
    description: 'Deterministic gates block bad data at the source. SLAs and handoff rules run automatically with full audit trails.',
  },
  {
    number: '3',
    title: 'Decide',
    description: 'Get decision-ready packs for every review. Metrics computed from enforced data, not spreadsheet debates.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From messy CRM to trusted operating system.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-teal-200" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600 max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

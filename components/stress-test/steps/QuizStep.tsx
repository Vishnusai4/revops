'use client'

interface Option<T extends string> {
  value: T
  label: string
  description?: string
}

interface Props<T extends string> {
  question: string
  options: Option<T>[]
  value: T | null
  onChange: (v: T) => void
  autoAdvance?: boolean   // auto-call onAdvance after selection (for single-Q steps)
  onAdvance?: () => void
}

export default function QuizStep<T extends string>({
  question,
  options,
  value,
  onChange,
  autoAdvance,
  onAdvance,
}: Props<T>) {
  function handleSelect(v: T) {
    onChange(v)
    if (autoAdvance && onAdvance) {
      setTimeout(onAdvance, 160) // brief visual feedback before advancing
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-heading text-2xl md:text-3xl tracking-tight text-ink mb-8 leading-snug">
        {question}
      </h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left rounded-xl border px-5 py-4 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                selected
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : 'border-ink/10 bg-white hover:border-brand-300 hover:bg-brand-50/40'
              }`}
            >
              <span className={`block text-sm font-semibold leading-snug ${selected ? 'text-brand-700' : 'text-ink'}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className={`block text-xs mt-0.5 leading-relaxed ${selected ? 'text-brand-600' : 'text-ink-muted'}`}>
                  {opt.description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

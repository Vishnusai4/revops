// ============================================================
// Shared UI primitives for step forms
// ============================================================

'use client'

import { ReactNode } from 'react'

// ─── Radio pill group (button-style selectors) ───────────────
interface RadioOption<T extends string> {
  value: T
  label: string
  description?: string
}

interface RadioGroupProps<T extends string> {
  label: string
  hint?: string
  error?: boolean
  options: RadioOption<T>[]
  value: T | undefined
  onChange: (v: T) => void
  columns?: 2 | 3 | 4
}

export function RadioGroup<T extends string>({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  columns = 3,
}: RadioGroupProps<T>) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns]

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-ink">{label}</label>
        {error && <span className="text-xs font-medium text-red-500">Required</span>}
      </div>
      {hint && <p className="text-xs text-ink-faint mb-2">{hint}</p>}
      <div className={`grid ${colClass} gap-2`}>
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`text-left rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${
                selected
                  ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                  : 'border-ink/10 bg-white text-ink-body hover:border-brand-300 hover:bg-brand-50/50'
              }`}
            >
              <span className="block font-medium text-xs leading-tight">{opt.label}</span>
              {opt.description && (
                <span className="block text-ink-faint text-xs mt-0.5 leading-tight">{opt.description}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Number input ────────────────────────────────────────────
interface NumberFieldProps {
  label: string
  hint?: string
  error?: boolean
  value: number | ''
  onChange: (v: number) => void
  min?: number
  max?: number
  placeholder?: string
  suffix?: string
}

export function NumberField({ label, hint, error, value, onChange, min = 0, max, placeholder, suffix }: NumberFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-ink">{label}</label>
        {error && <span className="text-xs font-medium text-red-500">Required</span>}
      </div>
      {hint && <p className="text-xs text-ink-faint mb-2">{hint}</p>}
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          placeholder={placeholder ?? '0'}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10)
            if (!isNaN(v)) onChange(v)
          }}
          className="block w-full rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder-ink-faint focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none pr-12"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Range slider ────────────────────────────────────────────
interface SliderFieldProps {
  label: string
  hint?: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format?: (v: number) => string
}

export function SliderField({ label, hint, value, onChange, min, max, step = 1, format }: SliderFieldProps) {
  const displayValue = format ? format(value) : String(value)
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="text-sm font-semibold text-brand-600 tabular-nums">{displayValue}</span>
      </div>
      {hint && <p className="text-xs text-ink-faint mb-2">{hint}</p>}
      <div className="relative mt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-500"
          style={{
            background: `linear-gradient(to right, #6366F1 ${pct}%, #E5E7EB ${pct}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-ink-faint">{format ? format(min) : min}</span>
          <span className="text-xs text-ink-faint">{format ? format(max) : max}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────
interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 flex-shrink-0 h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 ${
          checked ? 'bg-brand-500' : 'bg-ink/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-faint mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

// ─── Section divider ─────────────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-ink/8" />
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</span>
      <div className="flex-1 h-px bg-ink/8" />
    </div>
  )
}

// ─── Form field wrapper ──────────────────────────────────────
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>
}

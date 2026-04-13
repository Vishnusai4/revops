'use client'

interface StepIndicatorProps {
  currentStep: number // 1–5
  totalSteps: number
}

const STEP_LABELS = [
  'You',
  'Company',
  'Team',
  'Pipeline',
  'Scenarios',
]

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1
          const isComplete = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          return (
            <div
              key={stepNum}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                isComplete
                  ? 'bg-brand-500'
                  : isCurrent
                  ? 'bg-brand-300'
                  : 'bg-ink/10'
              }`}
            />
          )
        })}
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-muted">
          Step {currentStep} of {totalSteps} &mdash; {STEP_LABELS[currentStep - 1]}
        </p>
        <p className="text-xs text-ink-faint">
          {Math.round(((currentStep - 1) / totalSteps) * 100)}% complete
        </p>
      </div>
    </div>
  )
}

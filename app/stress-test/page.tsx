import type { Metadata } from 'next'
import AssessmentFlow from '@/components/stress-test/AssessmentFlow'

export const metadata: Metadata = {
  title: 'Revenue Plan Stress Test | Teravictus',
  description:
    'Pressure-test your growth plan, headcount capacity, and forecast resilience in under 10 minutes. Get a downloadable PDF report with scenario analysis and strategic recommendations.',
  openGraph: {
    title: 'Revenue Plan Stress Test | Teravictus',
    description:
      'Pressure-test your growth plan, headcount capacity, and forecast resilience in under 10 minutes.',
    url: 'https://rev.teravictus.com/stress-test',
    siteName: 'Teravictus',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function StressTestPage() {
  return <AssessmentFlow />
}

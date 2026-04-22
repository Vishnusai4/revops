import type { Metadata } from 'next'
import ContextSimulator from '@/components/ContextSimulator'
import './simulator.css'

export const metadata: Metadata = {
  title: 'Context Quality Simulator | Teravictus',
  description:
    'See how the same AI model produces weaker answers from raw MCP tool outputs and sharper answers from one normalized account object. A visual explainer for revenue teams.',
  openGraph: {
    title: 'Context Quality Simulator | Teravictus',
    description:
      'The same AI model. The same question. Different context quality — and dramatically different answers.',
    url: 'https://rev.teravictus.com/context-simulator',
    siteName: 'Teravictus',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Context Quality Simulator | Teravictus',
    description:
      'The same AI model. The same question. Different context quality — and dramatically different answers.',
  },
  robots: { index: true, follow: true },
}

export default function ContextSimulatorPage() {
  return <ContextSimulator />
}

'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import type { AssessmentOutput } from '@/lib/stress-test/types'

interface Props {
  output: AssessmentOutput
}

function fmtM(v: number) {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

function fmtMTick(v: number) {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return String(v)
}

// ─── Tooltip styling ─────────────────────────────────────────
const CustomTooltipStyle: React.CSSProperties = {
  background: '#1A1A1A',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '12px',
  color: '#fff',
}

function MoneyTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={CustomTooltipStyle}>
      <p className="font-semibold text-white text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {fmtM(p.value)}
        </p>
      ))}
    </div>
  )
}

// ─── Chart 1: Scenario Comparison Bar Chart ──────────────────
export function ScenarioBarChart({ output }: Props) {
  const data = output.scenarios.map((s) => ({
    name: s.label === 'Stressed Downside' ? 'Stressed' : s.label,
    'Productive Capacity': s.productiveCapacity,
    Target: output.newARRTarget,
  }))

  const COLORS = ['#6366F1', '#22c55e', '#f59e0b', '#ef4444']

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
        Productive Capacity vs. Target by Scenario
      </h4>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtMTick}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Bar dataKey="Productive Capacity" radius={[4, 4, 0, 0]} maxBarSize={64}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i] ?? '#6366F1'} />
            ))}
          </Bar>
          <ReferenceLine
            y={output.newARRTarget}
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'Target', position: 'right', fontSize: 10, fill: '#374151' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Chart 2: Quarterly Capacity Build ──────────────────────
export function QuarterlyCapacityChart({ output }: Props) {
  const base = output.scenarios[0]
  const upside = output.scenarios[1]
  const downside = output.scenarios[2]
  const stressed = output.scenarios[3]

  const quarterlyTarget = output.newARRTarget / 4

  const data = ['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => ({
    quarter: q,
    'Base Case': base.quarterlyRun[i] ?? 0,
    Upside: upside.quarterlyRun[i] ?? 0,
    Downside: downside.quarterlyRun[i] ?? 0,
    Target: quarterlyTarget,
  }))

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
        Quarterly Implied Bookings Capacity
      </h4>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" vertical={false} />
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtMTick}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<MoneyTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#6B7280', paddingTop: '8px' }}
          />
          <ReferenceLine
            y={quarterlyTarget}
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Line type="monotone" dataKey="Base Case" stroke="#6366F1" strokeWidth={2} dot={{ r: 3, fill: '#6366F1' }} />
          <Line type="monotone" dataKey="Upside" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          <Line type="monotone" dataKey="Downside" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Chart 3: Risk Contribution Chart ────────────────────────
export function RiskContributionChart({ output }: Props) {
  const drivers = output.topRiskDrivers.slice(0, 5)

  if (drivers.length === 0) {
    return (
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Risk Driver Analysis
        </h4>
        <div className="flex items-center justify-center h-48 text-sm text-ink-faint">
          No material risk drivers identified at current inputs.
        </div>
      </div>
    )
  }

  const severityScore = { high: 90, medium: 60, low: 30 }
  const severityColor = { high: '#ef4444', medium: '#f59e0b', low: '#6366F1' }

  const data = drivers.map((d) => ({
    name: d.label.length > 30 ? d.label.slice(0, 28) + '…' : d.label,
    fullLabel: d.label,
    score: severityScore[d.severity],
    severity: d.severity,
  }))

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
        Top Risk Drivers — Severity
      </h4>
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 52)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 32, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            width={180}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div style={CustomTooltipStyle}>
                  <p className="font-semibold text-xs mb-0.5">{d.fullLabel}</p>
                  <p className="text-xs capitalize" style={{ color: severityColor[d.severity as keyof typeof severityColor] }}>
                    {d.severity} severity
                  </p>
                </div>
              )
            }}
            cursor={{ fill: 'rgba(99,102,241,0.05)' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((d, i) => (
              <Cell key={i} fill={severityColor[d.severity as keyof typeof severityColor]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

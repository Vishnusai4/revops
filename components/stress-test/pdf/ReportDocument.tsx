// ============================================================
// TERAVICTUS — Revenue Plan Stress Test
// ReportDocument.tsx — PDF template using @react-pdf/renderer
//
// This file is imported ONLY in the server-side PDF API route.
// It is never bundled for the browser.
//
// Typography: Helvetica (built-in, no download needed)
// Colors: match the site design system
// Layout: A4 portrait, margins 48pt sides / 40pt top-bottom
//
// To change the PDF design, edit this file.
// To change report copy, edit lib/stress-test/recommendations.ts
// ============================================================

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Rect,
  Line,
  G,
  Font,
  Link,
} from '@react-pdf/renderer'
import type { AssessmentInput, AssessmentOutput, ScenarioResult } from '@/lib/stress-test/types'

// ─── Colors (matching site palette) ──────────────────────────
const C = {
  brand: '#6366F1',
  brandDark: '#4338CA',
  brandLight: '#EEF2FF',
  ink: '#1A1A1A',
  inkBody: '#374151',
  inkMuted: '#6B7280',
  inkFaint: '#9CA3AF',
  surface: '#FAFAF8',
  surfaceMuted: '#F5F5F0',
  border: '#E5E5E0',
  white: '#FFFFFF',
  green: '#16a34a',
  greenLight: '#dcfce7',
  amber: '#d97706',
  amberLight: '#fef3c7',
  orange: '#ea580c',
  orangeLight: '#ffedd5',
  red: '#dc2626',
  redLight: '#fee2e2',
}

// ─── Styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 9,
    color: C.inkBody,
    lineHeight: 1.5,
  },
  // ── Cover page
  coverPage: {
    fontFamily: 'Helvetica',
    backgroundColor: C.brand,
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 56,
    color: C.white,
  },
  coverLogo: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 4 },
  coverSub: { fontSize: 11, color: 'rgba(255,255,255,0.70)', marginBottom: 80 },
  coverTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.2, marginBottom: 12 },
  coverSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.5, marginBottom: 60 },
  coverMeta: { fontSize: 9, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 },
  coverFooter: {
    position: 'absolute', bottom: 40, left: 56, right: 56,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)',
    paddingTop: 12,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  coverFooterText: { fontSize: 9, color: 'rgba(255,255,255,0.55)' },

  // ── Headings
  h1: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 6 },
  h2: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 4 },
  h3: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 3 },
  sectionLabel: {
    fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.inkFaint,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8,
  },

  // ── Text
  body: { fontSize: 9, color: C.inkBody, lineHeight: 1.6 },
  muted: { fontSize: 8, color: C.inkMuted },
  small: { fontSize: 7.5, color: C.inkFaint },

  // ── Layout primitives
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  spacer: { marginBottom: 20 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 16, marginTop: 4 },

  // ── Score block (on report pages)
  scoreBox: {
    backgroundColor: C.brandLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreNumber: { fontSize: 40, fontFamily: 'Helvetica-Bold', color: C.brand, lineHeight: 1 },
  scoreLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.inkMuted, marginBottom: 2 },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start', marginTop: 4,
  },
  statusText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },

  // ── KPI card
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  kpiCard: {
    width: '23%',
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 6,
    padding: 10,
  },
  kpiValue: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 1 },
  kpiLabel: { fontSize: 7, color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiSub: { fontSize: 7, color: C.inkFaint, marginTop: 1 },

  // ── Table
  table: { width: '100%', borderWidth: 1, borderColor: C.border, borderRadius: 6, overflow: 'hidden' },
  tableHeader: { backgroundColor: C.surfaceMuted, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0EC' },
  tableLastRow: { flexDirection: 'row' },
  tableCell: { padding: 7, fontSize: 8, color: C.inkBody, flex: 1 },
  tableHeaderCell: { padding: 7, fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },

  // ── Recommendation card
  recCard: {
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  recHeader: { paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  recBody: { paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4 },

  // ── CTA
  ctaBox: {
    backgroundColor: C.brandLight,
    borderWidth: 1, borderColor: '#C7D2FE',
    borderRadius: 8,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
  },

  // ── Page footer
  pageFooter: {
    position: 'absolute', bottom: 20, left: 48, right: 48,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  pageFooterText: { fontSize: 7, color: C.inkFaint },
})

// ─── Helpers ─────────────────────────────────────────────────
function fmtM(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`
}

function statusColors(status: AssessmentOutput['statusLabel']) {
  switch (status) {
    case 'Stable':    return { bg: C.greenLight,  text: C.green }
    case 'Watchlist': return { bg: C.amberLight,  text: C.amber }
    case 'Fragile':   return { bg: C.orangeLight, text: C.orange }
    case 'Exposed':   return { bg: C.redLight,    text: C.red }
  }
}

function urgencyColors(urgency: string) {
  switch (urgency) {
    case 'immediate': return { bg: C.redLight, text: C.red }
    case 'near-term': return { bg: C.amberLight, text: C.amber }
    default:          return { bg: C.brandLight, text: C.brand }
  }
}

function PageFooter({ pageLabel }: { pageLabel: string }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.pageFooterText}>Teravictus — Revenue Plan Stress Test</Text>
      <Text style={s.pageFooterText}>{pageLabel}</Text>
      <Text style={s.pageFooterText}>rev.teravictus.com</Text>
    </View>
  )
}

// ─── SVG Bar Chart (for scenarios) ───────────────────────────
function SVGBarChart({
  scenarios,
  target,
  width = 460,
  height = 160,
}: {
  scenarios: ScenarioResult[]
  target: number
  width?: number
  height?: number
}) {
  const COLORS = [C.brand, C.green, C.amber, C.red]
  const labels = ['Base', 'Upside', 'Downside', 'Stressed']
  const leftPad = 52
  const rightPad = 16
  const topPad = 16
  const bottomPad = 24
  const chartW = width - leftPad - rightPad
  const chartH = height - topPad - bottomPad

  const allValues = [...scenarios.map((s) => s.productiveCapacity), target]
  const maxVal = Math.max(...allValues) * 1.1

  const barW = Math.floor((chartW / scenarios.length) * 0.55)
  const gap = Math.floor(chartW / scenarios.length)

  // Y-axis ticks (4 ticks)
  const ticks = [0, 0.25, 0.5, 0.75, 1.0].map((t) => Math.round(maxVal * t))

  function yPos(v: number): number {
    return topPad + chartH - (v / maxVal) * chartH
  }

  const targetY = yPos(target)

  return (
    <Svg width={width} height={height}>
      {/* Y-axis ticks and grid lines */}
      {ticks.map((tick) => {
        const y = yPos(tick)
        return (
          <G key={tick}>
            <Line x1={leftPad} y1={y} x2={leftPad + chartW} y2={y} stroke="#E5E5E0" strokeWidth={0.5} />
            <Text
              x={leftPad - 4}
              y={y + 3}
              style={{ fontSize: 6, fill: C.inkFaint, textAnchor: 'end' }}
            >
              {fmtM(tick)}
            </Text>
          </G>
        )
      })}

      {/* Bars */}
      {scenarios.map((sc, i) => {
        const barH = (sc.productiveCapacity / maxVal) * chartH
        const x = leftPad + i * gap + (gap - barW) / 2
        const y = topPad + chartH - barH
        return (
          <G key={i}>
            <Rect x={x} y={y} width={barW} height={barH} fill={COLORS[i] ?? C.brand} rx={3} />
            <Text
              x={x + barW / 2}
              y={topPad + chartH + 10}
              style={{ fontSize: 6.5, fill: C.inkMuted, textAnchor: 'middle' }}
            >
              {labels[i]}
            </Text>
          </G>
        )
      })}

      {/* Target line */}
      <Line
        x1={leftPad}
        y1={targetY}
        x2={leftPad + chartW}
        y2={targetY}
        stroke={C.ink}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <Text
        x={leftPad + chartW + 3}
        y={targetY + 3}
        style={{ fontSize: 6, fill: C.inkMuted }}
      >
        Target
      </Text>
    </Svg>
  )
}

// ─── SVG Quarterly Line Chart ─────────────────────────────────
function SVGQuarterlyChart({
  scenarios,
  target,
  width = 460,
  height = 140,
}: {
  scenarios: ScenarioResult[]
  target: number
  width?: number
  height?: number
}) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const base = scenarios[0]
  const upside = scenarios[1]
  const downside = scenarios[2]

  const leftPad = 52
  const rightPad = 16
  const topPad = 12
  const bottomPad = 22
  const chartW = width - leftPad - rightPad
  const chartH = height - topPad - bottomPad

  const quarterlyTarget = target / 4
  const allVals = [...base.quarterlyRun, ...upside.quarterlyRun, ...downside.quarterlyRun, quarterlyTarget]
  const maxVal = Math.max(...allVals) * 1.15

  function xPos(i: number): number {
    return leftPad + (i / 3) * chartW
  }
  function yPos(v: number): number {
    return topPad + chartH - (v / maxVal) * chartH
  }

  function makePolyline(data: number[], color: string, dashed = false): React.ReactElement {
    const points = data.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')
    return (
      <Line
        key={color + dashed}
        x1={xPos(0)} y1={yPos(data[0])}
        x2={xPos(1)} y2={yPos(data[1])}
        stroke={color}
        strokeWidth={dashed ? 1 : 1.5}
        strokeDasharray={dashed ? '3,2' : undefined}
      />
    )
  }

  // Draw individual segments for each line (react-pdf SVG doesn't support polyline)
  function lineSegments(data: number[], color: string, dashed = false) {
    return data.slice(0, -1).map((v, i) => (
      <Line
        key={`${color}-${i}`}
        x1={xPos(i)} y1={yPos(v)}
        x2={xPos(i + 1)} y2={yPos(data[i + 1])}
        stroke={color}
        strokeWidth={dashed ? 1 : 1.5}
        strokeDasharray={dashed ? '3,2' : undefined}
      />
    ))
  }

  const targetY = yPos(quarterlyTarget)

  return (
    <Svg width={width} height={height}>
      {/* Grid */}
      {[0, 0.5, 1.0].map((t) => {
        const y = yPos(maxVal * t)
        return (
          <G key={t}>
            <Line x1={leftPad} y1={y} x2={leftPad + chartW} y2={y} stroke="#E5E5E0" strokeWidth={0.5} />
            <Text x={leftPad - 4} y={y + 3} style={{ fontSize: 6, fill: C.inkFaint, textAnchor: 'end' }}>
              {fmtM(maxVal * t)}
            </Text>
          </G>
        )
      })}

      {/* Lines */}
      {lineSegments(base.quarterlyRun, C.brand)}
      {lineSegments(upside.quarterlyRun, C.green, true)}
      {lineSegments(downside.quarterlyRun, C.amber, true)}

      {/* Target line */}
      <Line x1={leftPad} y1={targetY} x2={leftPad + chartW} y2={targetY} stroke={C.ink} strokeWidth={0.8} strokeDasharray="3,2" />

      {/* X-axis labels */}
      {quarters.map((q, i) => (
        <Text key={q} x={xPos(i)} y={topPad + chartH + 12} style={{ fontSize: 7, fill: C.inkMuted, textAnchor: 'middle' }}>
          {q}
        </Text>
      ))}

      {/* Dots for base */}
      {base.quarterlyRun.map((v, i) => (
        <Rect key={i} x={xPos(i) - 2.5} y={yPos(v) - 2.5} width={5} height={5} rx={2.5} fill={C.brand} />
      ))}
    </Svg>
  )
}

// ─── Pages ───────────────────────────────────────────────────

function CoverPage({ input, output }: { input: AssessmentInput; output: AssessmentOutput }) {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const cfg = statusColors(output.statusLabel)

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Logo */}
      <Text style={s.coverLogo}>Teravictus</Text>
      <Text style={s.coverSub}>rev.teravictus.com</Text>

      {/* Title */}
      <Text style={s.coverTitle}>Revenue Plan{'\n'}Stress Test</Text>
      <Text style={s.coverSubtitle}>
        Pressure-test your growth plan, headcount capacity, and{'\n'}
        forecast resilience.
      </Text>

      {/* Meta */}
      <View style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: 16, marginBottom: 20 }}>
        {input.lead.company && (
          <Text style={s.coverMeta}>Company: {input.lead.company}</Text>
        )}
        {input.lead.firstName && (
          <Text style={s.coverMeta}>Prepared for: {input.lead.firstName}</Text>
        )}
        <Text style={s.coverMeta}>Date: {date}</Text>
        <Text style={s.coverMeta}>Assessment: {output.statusLabel} — {output.overallScore}/100</Text>
      </View>

      {/* Score preview */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[
          { label: 'Confidence', value: `${output.confidenceScore}` },
          { label: 'Capacity', value: `${output.capacityScore}` },
          { label: 'Resilience', value: `${100 - output.fragilityScore}` },
          { label: 'Overall', value: `${output.overallScore}` },
        ].map((m) => (
          <View key={m.label} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, padding: 12, flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.white }}>{m.value}</Text>
            <Text style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.70)', marginTop: 2 }}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={s.coverFooter}>
        <Text style={s.coverFooterText}>Made by Teravictus — rev.teravictus.com</Text>
        <Text style={s.coverFooterText}>Confidential</Text>
      </View>
    </Page>
  )
}

function SummaryPage({ input, output }: { input: AssessmentInput; output: AssessmentOutput }) {
  const cfg = statusColors(output.statusLabel)

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Executive Summary</Text>
      <Text style={s.h1}>Revenue Plan Assessment</Text>
      <View style={s.divider} />

      {/* Score block */}
      <View style={s.scoreBox}>
        <View style={{ alignItems: 'center', minWidth: 80 }}>
          <Text style={s.scoreNumber}>{output.overallScore}</Text>
          <Text style={{ fontSize: 7, color: C.inkMuted, marginTop: 2 }}>/ 100</Text>
          <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[s.statusText, { color: cfg.text }]}>{output.statusLabel}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.h3}>Plan Confidence Score</Text>
          <Text style={[s.body, { marginTop: 4 }]}>{output.executiveSummary}</Text>
          {/* Sub-scores */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {[
              { label: 'Confidence', value: output.confidenceScore },
              { label: 'Capacity', value: output.capacityScore },
              { label: 'Resilience', value: 100 - output.fragilityScore },
            ].map((sc) => (
              <View key={sc.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4, padding: 8 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.ink }}>{sc.value}</Text>
                <Text style={{ fontSize: 7, color: C.inkMuted, marginTop: 1 }}>{sc.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* KPI grid */}
      <Text style={[s.sectionLabel, { marginTop: 4 }]}>Key Metrics — Base Case</Text>
      <View style={s.kpiGrid}>
        {[
          { label: 'New ARR Target', value: fmtM(output.newARRTarget) },
          { label: 'Implied Capacity', value: fmtM(output.productiveCapacityBase) },
          { label: 'Gap to Target', value: output.gapToTarget <= 0 ? `+${fmtM(Math.abs(output.gapToTarget))}` : `-${fmtM(output.gapToTarget)}` },
          { label: 'Coverage Sufficiency', value: `${Math.round(output.coverageSufficiency * 100)}%` },
          { label: 'Effective Reps', value: output.effectiveRepsBase.toFixed(1) },
          { label: 'Reps Required', value: `${output.headcountRequired}` },
          { label: 'Headcount Gap', value: output.headcountGap <= 0 ? `${Math.abs(output.headcountGap)} buffer` : `${output.headcountGap} short` },
          { label: 'Pipeline Coverage', value: `${output.pipelineCoverageRatio.toFixed(1)}x` },
        ].map((kpi) => (
          <View key={kpi.label} style={s.kpiCard}>
            <Text style={s.kpiValue}>{kpi.value}</Text>
            <Text style={s.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      <PageFooter pageLabel="Executive Summary" />
    </Page>
  )
}

function ScenariosPage({ input, output }: { input: AssessmentInput; output: AssessmentOutput }) {
  const scenarios = output.scenarios

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Scenario Analysis</Text>
      <Text style={s.h1}>Four-Scenario Model</Text>
      <View style={s.divider} />

      {/* Bar chart */}
      <Text style={s.sectionLabel}>Productive Capacity vs. Target</Text>
      <SVGBarChart scenarios={scenarios} target={output.newARRTarget} width={500} height={160} />

      <View style={{ marginBottom: 14 }} />

      {/* Quarterly chart */}
      <Text style={s.sectionLabel}>Quarterly Implied Bookings</Text>
      <SVGQuarterlyChart scenarios={scenarios} target={output.newARRTarget} width={500} height={130} />

      <View style={{ marginBottom: 14 }} />

      {/* Scenario table */}
      <Text style={s.sectionLabel}>Scenario Comparison</Text>
      <View style={s.table}>
        <View style={s.tableHeader}>
          {['Metric', 'Base Case', 'Upside', 'Downside', 'Stressed'].map((h) => (
            <Text key={h} style={s.tableHeaderCell}>{h}</Text>
          ))}
        </View>
        {[
          { label: 'Eff. Reps', format: (sc: ScenarioResult) => sc.effectiveReps.toFixed(1) },
          { label: 'Capacity', format: (sc: ScenarioResult) => fmtM(sc.productiveCapacity) },
          { label: 'Gap', format: (sc: ScenarioResult) => sc.gapToTarget <= 0 ? `+${fmtM(Math.abs(sc.gapToTarget))}` : `-${fmtM(sc.gapToTarget)}` },
          { label: 'Coverage', format: (sc: ScenarioResult) => `${(sc.coverageSufficiency * 100).toFixed(0)}%` },
          { label: 'Win Rate', format: (sc: ScenarioResult) => fmtPct(sc.winRate) },
          { label: 'Reachable', format: (sc: ScenarioResult) => sc.reachable ? 'Yes' : 'At risk' },
        ].map((row, rowIdx) => (
          <View key={row.label} style={rowIdx < 5 ? s.tableRow : s.tableLastRow}>
            <Text style={[s.tableCell, { fontFamily: 'Helvetica-Bold', color: C.inkMuted, flex: 1 }]}>{row.label}</Text>
            {scenarios.map((sc, i) => (
              <Text key={i} style={[s.tableCell, { textAlign: 'center' }]}>{row.format(sc)}</Text>
            ))}
          </View>
        ))}
      </View>

      <PageFooter pageLabel="Scenario Analysis" />
    </Page>
  )
}

function RisksPage({ input, output }: { input: AssessmentInput; output: AssessmentOutput }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Risk Analysis</Text>
      <Text style={s.h1}>Top Risk Drivers</Text>
      <View style={s.divider} />

      {output.topRiskDrivers.length === 0 ? (
        <Text style={s.body}>No material risk drivers identified at current inputs.</Text>
      ) : (
        output.topRiskDrivers.map((driver, i) => {
          const sevColor = driver.severity === 'high' ? C.red : driver.severity === 'medium' ? C.amber : C.inkMuted
          const sevBg = driver.severity === 'high' ? C.redLight : driver.severity === 'medium' ? C.amberLight : C.surfaceMuted
          return (
            <View key={i} style={[s.recCard, { marginBottom: 10 }]}>
              <View style={[s.recHeader, { backgroundColor: sevBg }]}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: sevColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {driver.severity} severity
                </Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.ink, flex: 1, marginLeft: 8 }}>
                  {driver.label}
                </Text>
              </View>
              <View style={s.recBody}>
                <Text style={[s.body, { marginBottom: 3 }]}>{driver.description}</Text>
                <Text style={[s.muted, { fontStyle: 'italic' }]}>{driver.impact}</Text>
              </View>
            </View>
          )
        })
      )}

      <View style={[s.spacer, { marginTop: 8 }]} />
      <Text style={s.sectionLabel}>Priority Actions</Text>

      {output.recommendations.map((rec, i) => {
        const cfg = urgencyColors(rec.urgency)
        return (
          <View key={i} style={[s.recCard, { marginBottom: 10 }]}>
            <View style={[s.recHeader, { backgroundColor: cfg.bg }]}>
              <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: cfg.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {rec.urgency}
              </Text>
              <Text style={{ fontSize: 7.5, color: C.inkMuted, marginLeft: 'auto' }}>
                Action {i + 1}
              </Text>
            </View>
            <View style={s.recBody}>
              <Text style={[s.h3, { marginBottom: 4 }]}>{rec.title}</Text>
              <Text style={s.body}>{rec.description}</Text>
            </View>
          </View>
        )
      })}

      <PageFooter pageLabel="Risk Analysis & Actions" />
    </Page>
  )
}

function BenchmarksPage({ input, output }: { input: AssessmentInput; output: AssessmentOutput }) {
  const statusIcon = { good: '✓', warning: '!', risk: '✗' }
  const statusColor = { good: C.green, warning: C.amber, risk: C.red }

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Benchmarks</Text>
      <Text style={s.h1}>Where You Stand vs. Best Practice</Text>
      <View style={s.divider} />

      <View style={s.table}>
        <View style={s.tableHeader}>
          {['Metric', 'Your Input', 'Benchmark Range', 'Status'].map((h) => (
            <Text key={h} style={s.tableHeaderCell}>{h}</Text>
          ))}
        </View>
        {output.benchmarks.map((b, i) => (
          <View key={i} style={i < output.benchmarks.length - 1 ? s.tableRow : s.tableLastRow}>
            <Text style={[s.tableCell, { fontFamily: 'Helvetica-Bold', color: C.inkBody }]}>{b.metric}</Text>
            <Text style={[s.tableCell, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{b.yourValue}</Text>
            <Text style={[s.tableCell, { color: C.inkMuted }]}>{b.benchmarkRange}</Text>
            <Text style={[s.tableCell, { textAlign: 'center', fontFamily: 'Helvetica-Bold', color: statusColor[b.status] }]}>
              {statusIcon[b.status]}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={s.ctaBox}>
        <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 6, textAlign: 'center' }}>
          Talk through your results
        </Text>
        <Text style={{ fontSize: 9, color: C.inkBody, textAlign: 'center', marginBottom: 10, lineHeight: 1.5, maxWidth: 360 }}>
          Schedule a short 20-minute call to talk through your current revenue stack and where visibility breaks down in pipeline, forecasting, and reporting.
        </Text>
        <Link
          src="https://calendar.app.google/Nhpt6uNLE5Da7Szw7"
          style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.brand, textDecoration: 'none' }}
        >
          Book a 20-min call → calendar.app.google/Nhpt6uNLE5Da7Szw7
        </Link>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={s.small}>
          Made by Teravictus — rev.teravictus.com{'\n'}
          This report is based on inputs provided and uses a rules-based simulation engine. Results are estimates for strategic planning purposes only.
        </Text>
      </View>

      <PageFooter pageLabel="Benchmarks & Next Steps" />
    </Page>
  )
}

// ─── Document builder (called from the API route) ────────────

export function buildReportDocument(
  input: AssessmentInput,
  output: AssessmentOutput,
): React.ReactElement {
  return (
    <Document
      title={`Teravictus Revenue Plan Stress Test${input.lead.company ? ` — ${input.lead.company}` : ''}`}
      author="Teravictus"
      subject="Revenue Plan Stress Test"
      keywords="RevOps, revenue plan, GTM capacity, stress test"
      creator="Teravictus — rev.teravictus.com"
    >
      <CoverPage input={input} output={output} />
      <SummaryPage input={input} output={output} />
      <ScenariosPage input={input} output={output} />
      <RisksPage input={input} output={output} />
      <BenchmarksPage input={input} output={output} />
    </Document>
  )
}

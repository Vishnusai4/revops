'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function ContextSimulator() {
  useEffect(() => {
    const t = setTimeout(() => {
      const ml = document.getElementById('sim-ml')
      const mr = document.getElementById('sim-mr')
      const hbar = document.getElementById('sim-hbar')
      if (ml) ml.style.width = '84%'
      if (mr) mr.style.width = '12%'
      if (hbar) hbar.style.width = '42%'
    }, 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="sim-root">

      {/* HEADER */}
      <header className="sim-header">
        <div className="sim-logo-group">
          <Image src="/teravictus-logo.png" alt="Teravictus" width={120} height={32} className="sim-logo-img" />
        </div>
        <div className="sim-hdr-sep" />
        <span className="sim-view-title">Context Quality Simulator</span>
        <span className="sim-demo-badge">Conceptual Demo</span>
        <div className="sim-question-bar">
          <span className="sim-q-icon">▸</span>
          <span className="sim-q-text"><em>Which accounts are most at risk this quarter, and why?</em></span>
        </div>
        <div className="sim-hdr-right">
          <div className="sim-hdr-meta">Model <span>Claude / GPT-class</span></div>
          <div className="sim-toggle-group">
            <button className="sim-toggle-btn active">Side-by-Side</button>
            <button className="sim-toggle-btn">Single</button>
          </div>
          <div className="sim-hdr-meta">Last refresh <span>2m ago</span></div>
        </div>
      </header>

      {/* COMPARISON STRIP */}
      <div className="sim-strip">
        <div className="sim-strip-item"><span className="sim-strip-dot" /> Same model</div>
        <div className="sim-strip-sep" />
        <div className="sim-strip-item"><span className="sim-strip-dot" /> Same question</div>
        <div className="sim-strip-sep" />
        <div className="sim-strip-item"><span className="sim-strip-dot" /> Different context</div>
        <div className="sim-strip-sep" />
        <div className="sim-strip-item">
          <span className="sim-strip-dot" style={{background:'var(--ok-green)'}} /> Different context quality
          <span className="sim-savings-badge">348 fewer tokens &nbsp;−41%</span>
        </div>
      </div>

      {/* TWO-PANE LAYOUT */}
      <div className="sim-layout">

        {/* ═══ LEFT PANE ═══ */}
        <div className="sim-pane left">
          <div className="sim-pane-header">
            <div className="sim-mode-badge raw"><span className="sim-mode-dot" />Raw MCP Context Mode</div>
          </div>

          {/* MCP SOURCE FEED */}
          <div className="sim-sec-label">MCP Source Feed</div>
          <div className="sim-panel" style={{marginBottom:'10px'}}>
            <div className="sim-mcp-feed">

              {/* Salesforce */}
              <div className="sim-mcp-card">
                <div className="sim-mcp-head">
                  <span className="sim-mcp-name">mcp.salesforce.query</span>
                  <span className="sim-tag muted">Raw payload</span>
                </div>
                <div className="sim-mcp-body">{`\
`}<span className="c">{'// 3 account records — mixed entity names'}</span>{`
`}<span className="k">&quot;Id&quot;</span>{`: `}<span className="s">&quot;001abc123&quot;</span>{`,  `}<span className="k">&quot;Name&quot;</span>{`: `}<span className="s">&quot;Acme Inc&quot;</span>{`,
`}<span className="k">&quot;Stage&quot;</span>{`: `}<span className="s">&quot;Renewal&quot;</span>{`,  `}<span className="k">&quot;ARR&quot;</span>{`: `}<span className="n">48000</span>{`,
`}<span className="k">&quot;Renewal_Date&quot;</span>{`: `}<span className="s">&quot;2026-05-18&quot;</span>{`,
`}<span className="k">&quot;Health_Status&quot;</span>{`: `}<span className="s">&quot;Green&quot;</span>{`  `}<span className="c">{'// stale — 47d ago'}</span>
                </div>
                <div className="sim-entity-warn">⚠ Unresolved entity: &quot;Acme Inc&quot; &nbsp;·&nbsp; <span className="sim-tag err" style={{display:'inline',fontSize:'9px'}}>Duplicate entity</span></div>
              </div>

              {/* Gong */}
              <div className="sim-mcp-card">
                <div className="sim-mcp-head">
                  <span className="sim-mcp-name">mcp.gong.transcript</span>
                  <span className="sim-tag warn">Transcript-heavy</span>
                </div>
                <div className="sim-mcp-body">{`\
`}<span className="k">&quot;meeting_title&quot;</span>{`: `}<span className="s">&quot;Acme Corp - Renewal Review&quot;</span>{`,
`}<span className="k">&quot;duration_sec&quot;</span>{`: `}<span className="n">735</span>{`,
`}<span className="k">&quot;speaker_turns&quot;</span>{`: `}<span className="n">47</span>{`,
`}<span className="k">&quot;transcript&quot;</span>{`: `}<span className="s">{`"...rollout has been slower than planned...
  only 20% of seats active... executive attention
  is low this cycle... invoice delay causing
  concern... procurement is evaluating
  alternatives from two other vendors...
  onboarding blockers still unresolved..."`}</span>{`
`}<span className="c">{'// +4,800 chars of raw transcript continues below'}</span>{`
`}<span className="c">{'// entity: "Acme Corp" — conflicts with SF "Acme Inc"'}</span>
                </div>
                <div className="sim-entity-warn red">⚡ Schema mismatch — &quot;Acme Corp&quot; ≠ &quot;Acme Inc&quot;</div>
              </div>

              {/* Mixpanel */}
              <div className="sim-mcp-card">
                <div className="sim-mcp-head">
                  <span className="sim-mcp-name">mcp.mixpanel.events</span>
                  <span className="sim-tag muted">Raw payload</span>
                </div>
                <div className="sim-mcp-body">{`\
`}<span className="k">&quot;workspace&quot;</span>{`: `}<span className="s">&quot;acme-prod&quot;</span>{`,
`}<span className="k">&quot;wau&quot;</span>{`: `}<span className="n">14</span>{`,  `}<span className="k">&quot;wau_prev&quot;</span>{`: `}<span className="n">22</span>{`,
`}<span className="k">&quot;modules_active&quot;</span>{`: `}<span className="n">2</span>{`,  `}<span className="k">&quot;modules_total&quot;</span>{`: `}<span className="n">5</span>{`,
`}<span className="k">&quot;last_admin_login_days_ago&quot;</span>{`: `}<span className="n">9</span>
                </div>
              </div>

              {/* Zendesk */}
              <div className="sim-mcp-card">
                <div className="sim-mcp-head">
                  <span className="sim-mcp-name">mcp.zendesk.tickets</span>
                  <span className="sim-tag warn">Source conflict</span>
                </div>
                <div className="sim-mcp-body">{`\
`}<span className="k">&quot;open_tickets&quot;</span>{`: `}<span className="n">4</span>{`,  `}<span className="k">&quot;escalations_10d&quot;</span>{`: `}<span className="n">3</span>{`,
`}<span className="k">&quot;avg_frt&quot;</span>{`: `}<span className="s">&quot;11h24m&quot;</span>{`,  `}<span className="k">&quot;csat_trend&quot;</span>{`: `}<span className="s">&quot;6.8-&gt;5.9&quot;</span>{`,
`}<span className="k">&quot;themes&quot;</span>{`: [`}<span className="s">&quot;onboarding&quot;</span>{`, `}<span className="s">&quot;crm_sync&quot;</span>{`]`}
                </div>
              </div>

              {/* Stripe */}
              <div className="sim-mcp-card">
                <div className="sim-mcp-head">
                  <span className="sim-mcp-name">mcp.stripe.invoices</span>
                  <span className="sim-tag err">Overdue signal</span>
                </div>
                <div className="sim-mcp-body">{`\
`}<span className="k">&quot;invoice_status&quot;</span>{`: `}<span className="s">&quot;overdue&quot;</span>{`,
`}<span className="k">&quot;days_overdue&quot;</span>{`: `}<span className="n">12</span>{`,
`}<span className="k">&quot;last_payment&quot;</span>{`: `}<span className="s">&quot;2026-03-31&quot;</span>{`,
`}<span className="k">&quot;contract_status&quot;</span>{`: `}<span className="s">&quot;active&quot;</span>
                </div>
              </div>

            </div>
            <div className="sim-feed-footer">5 sources · 3 accounts · unresolved entities · no cross-source reconciliation</div>
          </div>

          {/* CONTEXT WINDOW ASSEMBLY */}
          <div className="sim-sec-label">Context Window Assembly</div>
          <div className="sim-panel" style={{borderColor:'rgba(220,38,38,0.15)'}}>
            <div className="sim-panel-head" style={{background:'#FFF8F8'}}>
              <span className="sim-panel-title">Context Window Assembly</span>
              <span className="sim-conf-badge low">● Low confidence</span>
            </div>
            <div className="sim-panel-body">
              <div className="sim-stats-grid">
                <div className="sim-stat-box"><div className="sim-stat-lbl">Documents retrieved</div><div className="sim-stat-val warn">27</div></div>
                <div className="sim-stat-box"><div className="sim-stat-lbl">Characters</div><div className="sim-stat-val bad">48,920</div></div>
                <div className="sim-stat-box"><div className="sim-stat-lbl">Entity resolution</div><div className="sim-stat-val bad">Incomplete</div></div>
                <div className="sim-stat-box"><div className="sim-stat-lbl">Conflict rate</div><div className="sim-stat-val bad">High</div></div>
              </div>
              <div className="sim-stat-box" style={{background:'var(--risk-red-lt)',borderColor:'var(--risk-red-b)'}}>
                <div className="sim-stat-lbl">Context quality</div>
                <div className="sim-stat-val bad">Noisy — fragmented signals, duplicate entities</div>
              </div>
              <div className="sim-meter-wrap">
                <div className="sim-meter-row">
                  <span style={{fontWeight:600,color:'var(--ink-muted)'}}>Estimated token load</span>
                  <span className="sim-meter-val" style={{color:'var(--risk-red)'}}>847 tokens</span>
                </div>
                <div className="sim-meter-track"><div className="sim-meter-fill hot" id="sim-ml" /></div>
                <div className="sim-burn-label bad">▲ High token burn</div>
              </div>
              <div className="sim-pills">
                <span className="sim-pill bad">Latency: 18.4s</span>
                <span className="sim-pill bad">Confidence: Low</span>
                <span className="sim-pill warn">Grounding: Weak</span>
                <span className="sim-pill warn">Evidence: Scattered</span>
              </div>
            </div>
          </div>

          {/* AI RESPONSE — LEFT */}
          <div className="sim-sec-label">AI Response</div>
          <div className="sim-panel">
            <div className="sim-panel-head">
              <span className="sim-panel-title">AI Response</span>
              <span className="sim-panel-meta" style={{color:'var(--warn-amber)'}}>⚠ Hedged · Inconsistent ranking</span>
            </div>
            <div className="sim-panel-body">
              <div className="sim-ai-box weak">
                The accounts that may be most at risk this quarter include Acme Inc, Northstar Labs, and possibly VertexOps. Acme appears to show the strongest warning signals across usage, support activity, and customer conversations, although some source fields are inconsistent and additional review may be required. Northstar Labs may have moderate adoption risk, while VertexOps appears lower risk at this time.
              </div>
              <div className="sim-ai-annotation warn">Observation: hedged ranking, inconsistent entity resolution, low-confidence prioritization</div>
            </div>
          </div>

          {/* EVIDENCE — LEFT */}
          <div className="sim-sec-label">Why the Model Said This</div>
          <div className="sim-panel">
            <div className="sim-panel-head">
              <span className="sim-panel-title">Evidence Panel</span>
              <span className="sim-panel-meta">5 signals · ungrounded</span>
            </div>
            <div className="sim-chips">
              <span className="sim-chip vague">Usage down</span>
              <span className="sim-chip vague">Open tickets</span>
              <span className="sim-chip vague">Mixed sentiment</span>
              <span className="sim-chip vague">Contract active</span>
              <span className="sim-chip vague">Source conflict</span>
            </div>
          </div>

        </div>{/* /left pane */}


        {/* ═══ RIGHT PANE ═══ */}
        <div className="sim-pane right">
          <div className="sim-pane-header">
            <div className="sim-mode-badge norm"><span className="sim-mode-dot" />Normalized Intelligence Mode</div>
          </div>

          {/* RANKED ACCOUNTS */}
          <div className="sim-sec-label">
            Ranked Accounts at Risk
            <span className="sim-sec-badge">Prioritized from normalized context</span>
          </div>
          <div className="sim-panel strong-panel" style={{marginBottom:'10px'}}>
            <div className="sim-ranked-list">
              <div className="sim-rank-card selected">
                <div className="sim-rank-num r1">1</div>
                <div className="sim-rank-info">
                  <div className="sim-rank-name selected-name">Acme Corp</div>
                  <div className="sim-rank-driver">Usage down 37%, escalations up, invoice overdue 12d</div>
                </div>
                <div className="sim-rank-right">
                  <span className="sim-rank-badge high">High</span>
                  <div className="sim-rank-meta">Health 42 · Renewal 26d</div>
                  <div className="sim-selected-indicator">▶ Selected</div>
                </div>
              </div>
              <div className="sim-rank-card">
                <div className="sim-rank-num r2">2</div>
                <div className="sim-rank-info">
                  <div className="sim-rank-name">Northstar Labs</div>
                  <div className="sim-rank-driver">Low feature adoption, champion inactive</div>
                </div>
                <div className="sim-rank-right">
                  <span className="sim-rank-badge medium">Medium</span>
                  <div className="sim-rank-meta">Health 61 · Renewal 41d</div>
                </div>
              </div>
              <div className="sim-rank-card">
                <div className="sim-rank-num r3">3</div>
                <div className="sim-rank-info">
                  <div className="sim-rank-name">VertexOps</div>
                  <div className="sim-rank-driver">Mild engagement decline, no billing risk</div>
                </div>
                <div className="sim-rank-right">
                  <span className="sim-rank-badge low">Low</span>
                  <div className="sim-rank-meta">Health 78 · Renewal 63d</div>
                </div>
              </div>
            </div>
          </div>

          {/* SELECTED ACCOUNT */}
          <div className="sim-sec-label">Selected Account Intelligence</div>
          <div className="sim-acct-card">
            <div className="sim-acct-top">
              <span className="sim-acct-name">Acme Corp</span>
              <span className="sim-risk-badge">High Risk</span>
            </div>
            <div className="sim-acct-sub">Mid-market · Growth Annual · Owner: Sarah Chen</div>
            <div className="sim-kpi-row">
              <div className="sim-kpi"><div className="sim-kpi-lbl">ARR</div><div className="sim-kpi-val dim">$48,000</div></div>
              <div className="sim-kpi"><div className="sim-kpi-lbl">Renewal</div><div className="sim-kpi-val bad">26 days</div></div>
              <div className="sim-kpi"><div className="sim-kpi-lbl">Health score</div><div className="sim-kpi-val bad">42<span style={{fontSize:'10px',fontWeight:400,color:'var(--ink-faint)'}}>/100</span></div></div>
              <div className="sim-kpi hi-risk"><div className="sim-kpi-lbl">Risk tier</div><div className="sim-kpi-val bad">High</div></div>
            </div>
            <div className="sim-health-row">
              <span className="sim-health-lbl">Health</span>
              <div className="sim-health-track"><div className="sim-health-fill" id="sim-hbar" /></div>
              <span className="sim-health-score">42</span>
            </div>
          </div>

          {/* 2x2 SIGNAL GRID */}
          <div className="sim-signal-grid">
            <div className="sim-sig-card">
              <div className="sim-sig-title"><span className="sim-sig-dot" style={{background:'var(--risk-red)'}} />Usage</div>
              <div className="sim-sig-rows">
                <div className="sim-sig-row"><span className="sim-sig-key">Weekly active users</span><span className="sim-sig-val bad">14</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Prior week</span><span className="sim-sig-val muted">22</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">14-day trend</span><span className="sim-sig-val bad">−37%</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Modules active</span><span className="sim-sig-val warn">2 / 5</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Last admin login</span><span className="sim-sig-val warn">9 days ago</span></div>
              </div>
            </div>
            <div className="sim-sig-card">
              <div className="sim-sig-title"><span className="sim-sig-dot" style={{background:'var(--warn-amber)'}} />Support</div>
              <div className="sim-sig-rows">
                <div className="sim-sig-row"><span className="sim-sig-key">Open tickets</span><span className="sim-sig-val bad">4</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Escalations / 10d</span><span className="sim-sig-val bad">3</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Avg first response</span><span className="sim-sig-val warn">11h 24m</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">CSAT trend</span><span className="sim-sig-val bad">6.8 → 5.9</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Blockers</span><span className="sim-sig-val warn">2 unresolved</span></div>
              </div>
            </div>
            <div className="sim-sig-card">
              <div className="sim-sig-title"><span className="sim-sig-dot" style={{background:'var(--risk-red)'}} />Billing</div>
              <div className="sim-sig-rows">
                <div className="sim-sig-row"><span className="sim-sig-key">Invoice overdue</span><span className="sim-sig-val bad">12 days</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Contract</span><span className="sim-sig-val dim">Active, renewal pending</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Last payment</span><span className="sim-sig-val muted">Mar 31</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Expansion likelihood</span><span className="sim-sig-val bad">Low</span></div>
              </div>
            </div>
            <div className="sim-sig-card">
              <div className="sim-sig-title"><span className="sim-sig-dot" style={{background:'var(--warn-amber)'}} />Conversation</div>
              <div className="sim-sig-rows">
                <div className="sim-sig-row"><span className="sim-sig-key">Sentiment</span><span className="sim-sig-val bad">Negative trend</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Stakeholders active</span><span className="sim-sig-val warn">2 / 6</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Decision-maker</span><span className="sim-sig-val bad">Not reached</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Procurement risk</span><span className="sim-sig-val warn">Medium</span></div>
                <div className="sim-sig-row"><span className="sim-sig-key">Competitive mentions</span><span className="sim-sig-val warn">2 / 30 days</span></div>
              </div>
            </div>
          </div>

          {/* CONVERSATION SUMMARY */}
          <div className="sim-convo-box">
            Customer sees value in reporting visibility but is concerned that rollout has been slower than expected. Adoption remains concentrated within a small user group, two onboarding blockers are unresolved, leadership has not yet seen enough impact to commit confidently to renewal, and the team requested a tighter success plan before the next renewal conversation.
            <div className="sim-meta-row">
              <span className="sim-meta-tag"><span className="ck">✓</span> Entity resolution: Complete</span>
              <span className="sim-meta-tag"><span className="ck">✓</span> Source coverage: 5/5</span>
              <span className="sim-meta-tag"><span className="ck">✓</span> Schema confidence: High</span>
              <span className="sim-meta-tag">Last sync: 2m ago</span>
            </div>
          </div>

          {/* NORMALIZED CONTEXT PACK */}
          <div className="sim-sec-label">Normalized Context Pack</div>
          <div className="sim-panel strong-panel">
            <div className="sim-panel-head">
              <span className="sim-panel-title">Normalized Context Pack</span>
              <span className="sim-conf-badge high">● High confidence</span>
            </div>
            <div className="sim-panel-body">
              <div className="sim-pack-grid">
                <div className="sim-pack-item"><div className="sim-pack-num">3</div><div><div className="sim-pack-desc">Ranked accounts</div></div></div>
                <div className="sim-pack-item"><div className="sim-pack-num">1</div><div><div className="sim-pack-desc">Selected account object</div></div></div>
                <div className="sim-pack-item"><div className="sim-pack-num">8</div><div><div className="sim-pack-desc">Grouped signal clusters</div></div></div>
                <div className="sim-pack-item hi"><div className="sim-pack-num" style={{color:'var(--brand-600)'}}>✓</div><div><div className="sim-pack-desc">Entity resolution: Complete</div></div></div>
              </div>
              <div className="sim-meter-wrap">
                <div className="sim-meter-row">
                  <span style={{fontWeight:600,color:'var(--ink-muted)'}}>Estimated token load</span>
                  <span className="sim-meter-val" style={{color:'var(--brand-600)'}}>499 tokens</span>
                </div>
                <div className="sim-meter-track"><div className="sim-meter-fill cool" id="sim-mr" /></div>
                <div className="sim-burn-label good">▼ Low token burn</div>
              </div>
              <div className="sim-pills">
                <span className="sim-pill brand">Latency: 2.1s</span>
                <span className="sim-pill good">Confidence: High</span>
                <span className="sim-pill good">Grounding: Strong</span>
                <span className="sim-pill brand">Evidence: Clear</span>
              </div>
            </div>
          </div>

          {/* AI RESPONSE — RIGHT */}
          <div className="sim-sec-label">AI Response</div>
          <div className="sim-panel strong-panel">
            <div className="sim-panel-head">
              <span className="sim-panel-title">AI Response</span>
              <span className="sim-panel-meta" style={{color:'var(--ok-green)'}}>✓ Ranked · Precise · Actionable</span>
            </div>
            <div className="sim-panel-body">
              <div className="sim-ai-box strong">
                <div className="sim-ai-headline">The most at-risk accounts this quarter are Acme Corp, Northstar Labs, and VertexOps — with Acme Corp clearly at highest risk.</div>
                <div style={{fontSize:'9.5px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.7px',color:'var(--ink-faint)',marginBottom:'6px'}}>Why Acme ranks first</div>
                <ul className="sim-driver-list">
                  <li><span className="sim-li-num">1.</span> Usage fell 37% in the last 14 days and only 2 of 5 modules are active.</li>
                  <li><span className="sim-li-num">2.</span> Three escalations opened in 10 days and CSAT fell from 6.8 to 5.9.</li>
                  <li><span className="sim-li-num">3.</span> Renewal is in 26 days while the invoice is already 12 days overdue.</li>
                  <li><span className="sim-li-num">4.</span> Only 2 of 6 stakeholders are active, the decision-maker has not been re-engaged, and recent calls point to rollout delays.</li>
                </ul>
                <div className="sim-ai-cta"><strong>Recommended next action:</strong> Trigger a joint CSM + AE recovery plan for Acme within 48 hours, while monitoring Northstar Labs for adoption risk and VertexOps for early engagement slippage.</div>
              </div>
              <div className="sim-ai-annotation brand">Observation: precise, evidence-grounded, executive-ready</div>
            </div>
          </div>

          {/* EVIDENCE — RIGHT */}
          <div className="sim-sec-label">Why the Model Said This</div>
          <div className="sim-panel strong-panel">
            <div className="sim-panel-head">
              <span className="sim-panel-title">Evidence Panel</span>
              <span className="sim-panel-meta">6 signals · fully grounded</span>
            </div>
            <div className="sim-evidence-lbl">Grounded in normalized evidence</div>
            <div className="sim-chips">
              <span className="sim-chip risk">Usage −37% / 14d</span>
              <span className="sim-chip caution">3 escalations / 10d</span>
              <span className="sim-chip risk">Renewal in 26d</span>
              <span className="sim-chip risk">Invoice overdue 12d</span>
              <span className="sim-chip caution">2/6 stakeholders active</span>
              <span className="sim-chip caution">Rollout delays mentioned</span>
            </div>
          </div>

        </div>{/* /right pane */}
      </div>{/* /layout */}

      {/* BOTTOM BANNER */}
      <div className="sim-banner">
        <div className="sim-banner-text">
          <strong>More source access does not automatically mean better AI.</strong> Better context design produces sharper answers with lower token burn.
        </div>
      </div>

    </div>
  )
}

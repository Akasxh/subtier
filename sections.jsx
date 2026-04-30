/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// PILLARS — three big value props ("A better way to run...")
// ============================================================
function Pillars() {
  const items = [
    {
      kicker: "Visibility",
      title: "See three tiers down. Not just direct suppliers.",
      body: "We crawl every supplier's supplier — substrate vendors, optical baffles, cathode powder, propellant valves — until we hit raw inputs. The graph stays live.",
      stat: "3 tiers",
      statSub: "deep on every BOM",
    },
    {
      kicker: "Sourcing",
      title: "Qualified alternates, ready before you need them.",
      body: "The agent shadow-qualifies replacements before disruption hits. When a node moves, the re-route is already vetted, audited, and pin-compatible.",
      stat: "22ms",
      statSub: "median agent decision",
    },
    {
      kicker: "Compliance",
      title: "Export controls, baked into every decision.",
      body: "EAR, ITAR, IRA §45X, FEOC, sanctions screens — re-checked on every move. No re-route gets proposed without the regulatory math already done.",
      stat: "$326M",
      statSub: "exposure absorbed in pilots",
    },
  ];
  return (
    <section className="section pillars" id="pillars">
      <div className="section-head">
        <span className="kicker">A better way to run procurement</span>
        <h2 className="h2">Built for the parts of supply chain that break first.</h2>
      </div>
      <div className="pillars-grid">
        {items.map((p, i) => (
          <article className="pillar-card" key={i}>
            <div className="pillar-stat">
              <span className="pillar-stat-v">{p.stat}</span>
              <span className="pillar-stat-k">{p.statSub}</span>
            </div>
            <span className="pillar-kicker">{p.kicker}</span>
            <h3 className="pillar-title">{p.title}</h3>
            <p className="pillar-body">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// CAPABILITIES — four product cards with vignettes
// (mirrors Zip's "Intake-to-Procure / Procure-to-Pay" grid)
// ============================================================
function Capabilities() {
  const cards = [
    {
      tag: "01 · Visibility",
      title: "Live supply graph",
      blurb: "Every supplier, every tier, every region — kept current from ERP, customs, and earnings feeds.",
      vignette: <VignetteGraph />,
    },
    {
      tag: "02 · Sourcing",
      title: "Pre-qualified alternates",
      blurb: "We shadow-audit replacements before disruption hits. Bonded inventory, pin-compat, lead time — all pre-flighted.",
      vignette: <VignetteAlternates />,
    },
    {
      tag: "03 · Compliance",
      title: "Export-control engine",
      blurb: "EAR, ITAR, IRA, FEOC, sanctions — recomputed on every routing decision. Nothing slips through.",
      vignette: <VignetteCompliance />,
    },
    {
      tag: "04 · Audit",
      title: "Regulator-ready packets",
      blurb: "Append-only decision log. Cited sources, signed timestamps. Export to your auditor in one click.",
      vignette: <VignetteAudit />,
    },
  ];
  return (
    <section className="section capabilities" id="capabilities">
      <div className="section-head">
        <span className="kicker">The platform</span>
        <h2 className="h2">Supply chain intelligence, from spec to signed PO.</h2>
      </div>
      <div className="cap-grid">
        {cards.map((c, i) => (
          <article className="cap-card" key={i}>
            <div className="cap-vignette">{c.vignette}</div>
            <div className="cap-text">
              <span className="cap-tag">{c.tag}</span>
              <h3 className="cap-title">{c.title}</h3>
              <p className="cap-blurb">{c.blurb}</p>
              <a className="cap-link" href="#cta">Learn more →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// --- vignettes (mini SVG illustrations for each capability) ---
function VignetteGraph() {
  return (
    <svg viewBox="0 0 320 180" className="vg-svg">
      {/* tier rails */}
      <line x1="40" y1="20" x2="40" y2="160" className="vg-rail" />
      <line x1="120" y1="20" x2="120" y2="160" className="vg-rail" />
      <line x1="200" y1="20" x2="200" y2="160" className="vg-rail" />
      <line x1="280" y1="20" x2="280" y2="160" className="vg-rail" />
      {/* edges */}
      <path d="M40,90 C80,90 80,40 120,40" className="vg-edge" />
      <path d="M40,90 C80,90 80,90 120,90" className="vg-edge" />
      <path d="M40,90 C80,90 80,140 120,140" className="vg-edge" />
      <path d="M120,40 C160,40 160,90 200,90" className="vg-edge" />
      <path d="M120,90 C160,90 160,90 200,90" className="vg-edge vg-edge-on" />
      <path d="M120,140 C160,140 160,90 200,90" className="vg-edge" />
      <path d="M200,90 C240,90 240,90 280,90" className="vg-edge vg-edge-on" />
      {/* nodes */}
      {[
        { x: 40, y: 90 }, { x: 120, y: 40 }, { x: 120, y: 90 }, { x: 120, y: 140 },
        { x: 200, y: 90 }, { x: 280, y: 90, cust: true },
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.x},${n.y})`}>
          <rect x="-14" y="-10" width="28" height="20" rx="3"
            className={n.cust ? "vg-node vg-node-cust" : "vg-node"} />
        </g>
      ))}
      {/* tier labels */}
      <text x="40" y="174" className="vg-label">T3</text>
      <text x="120" y="174" className="vg-label">T2</text>
      <text x="200" y="174" className="vg-label">T1</text>
      <text x="280" y="174" className="vg-label">T0</text>
    </svg>
  );
}

function VignetteAlternates() {
  return (
    <div className="vg-alt">
      <div className="vg-alt-row vg-alt-orig">
        <span className="vg-alt-name">Ibiden ATS-04</span>
        <span className="vg-alt-state">−38%</span>
      </div>
      <div className="vg-alt-arrow">→</div>
      <div className="vg-alt-row vg-alt-new">
        <span className="vg-alt-name">Shinko ATS-09</span>
        <span className="vg-alt-state">1,800 ✓</span>
      </div>
      <div className="vg-alt-meta">
        <span className="vg-alt-pill">audit Mar '26</span>
        <span className="vg-alt-pill">pin compat</span>
        <span className="vg-alt-pill">in bond</span>
      </div>
    </div>
  );
}

function VignetteCompliance() {
  return (
    <div className="vg-comp">
      {[
        { k: "EAR §744.23", v: "cleared", ok: true },
        { k: "de-minimis",   v: "passed",  ok: true },
        { k: "ITAR Cat XV",  v: "TAA-7741", ok: true },
        { k: "FEOC §45X",    v: "eligible", ok: true },
        { k: "OFAC SDN",     v: "no match", ok: true },
      ].map((r, i) => (
        <div className="vg-comp-row" key={i}>
          <span className="vg-comp-k">{r.k}</span>
          <span className="vg-comp-v">{r.v}</span>
          <span className="vg-comp-tick">✓</span>
        </div>
      ))}
    </div>
  );
}

function VignetteAudit() {
  return (
    <div className="vg-audit">
      <div className="vg-audit-doc">
        <div className="vg-audit-head">
          <span className="vg-audit-id">PKT-08842</span>
          <span className="vg-audit-sig">signed · t+22ms</span>
        </div>
        <div className="vg-audit-line" />
        <div className="vg-audit-line short" />
        <div className="vg-audit-line" />
        <div className="vg-audit-line" />
        <div className="vg-audit-line short" />
        <div className="vg-audit-foot">
          <span className="vg-audit-stamp">REGULATOR READY</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AGENTS — gallery of named agents with mini cards
// (mirrors Zip's "AI agents that automate real procurement work")
// ============================================================
function Agents() {
  const agents = [
    {
      name: "Re-route agent",
      sub: "Detects · matches · re-routes",
      bullet: "Watches every signal. When a Tier-2 node moves, proposes a vetted alternate within 22ms.",
      tag: "MOST USED",
    },
    {
      name: "Compliance agent",
      sub: "EAR · ITAR · IRA · FEOC",
      bullet: "Re-checks export control on every routing decision. Files TAA amendments without leaving the loop.",
      tag: "REGULATED",
    },
    {
      name: "BOM-trace agent",
      sub: "Lot codes · bonded stock",
      bullet: "Traces a single failed lot to every downstream flight unit, cell, or wafer in inventory.",
    },
    {
      name: "Audit agent",
      sub: "Append-only · cited",
      bullet: "Compiles regulator-ready packets. Every decision sourced, signed, and exportable.",
    },
    {
      name: "Customer-comms agent",
      sub: "Drafts · waits · sends",
      bullet: "Drafts the slip notification before slip happens — and silently kills it when the agent recovers the window.",
    },
    {
      name: "Renewal agent",
      sub: "Long-lead orders",
      bullet: "Watches contract clocks for materials with 14+ week lead. Triggers re-orders before procurement notices.",
    },
  ];
  return (
    <section className="section agents" id="agents">
      <div className="section-head">
        <span className="kicker">Agents that work the way operators do</span>
        <h2 className="h2">Six agents. One operating system.</h2>
        <p className="section-sub">Each agent owns a piece of the procurement loop. They share state, cite sources, and run on append-only memory. You stay in the seat.</p>
      </div>
      <div className="agents-grid">
        {agents.map((a, i) => (
          <article className="agent-card" key={i}>
            <header className="agent-head">
              <span className="agent-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="15.5" r="1" fill="currentColor" />
                  <circle cx="12" cy="15.5" r="1" fill="currentColor" />
                  <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="2" r="1" fill="currentColor" />
                </svg>
              </span>
              {a.tag && <span className="agent-tag">{a.tag}</span>}
            </header>
            <h3 className="agent-name">{a.name}</h3>
            <p className="agent-sub">{a.sub}</p>
            <p className="agent-bullet">{a.bullet}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// STORIES — three documented incidents (re-using earlier data)
// ============================================================
function Stories() {
  const stories = [
    {
      tag: "Aerospace · Defense",
      year: "2024 – 2025",
      title: "One microelectronic part stalls a $1.7T program.",
      lede: "The Lockheed Martin F-35 is built from thousands of unique parts sourced from hundreds of suppliers. Sub-tier shortages in microelectronics, composite structures, and thermal management systems have stretched delivery timelines for partner nations across multiple program years.",
      pull: "If a single microelectronic part lags behind, the entire delivery timeline is impacted.",
      attrib: "AIA / The Defense Watch · Nov 2025",
      kpis: [
        { k: "12,356", v: "A&D disruption events in 2024 (+35% YoY)" },
        { k: "1 in 3", v: "defense suppliers self-identify as sole-eligible" },
      ],
    },
    {
      tag: "Commercial Aerospace",
      year: "2024 – 2031+",
      title: "A 17,000-aircraft backlog. ~14 years of production.",
      lede: "Decades of consolidation made many aircraft components sole-sourced. Combined with raw-material shortages, tariff regimes, and tight labor, even small disruptions balloon into multi-year production delays. IATA estimates the resulting cost to airlines at over $11B in 2025 alone.",
      pull: "The fragility of the aerospace supply chain network — often reliant on a limited number of suppliers for critical parts — can become an acute constraint.",
      attrib: "IATA / Oliver Wyman · Oct 2025",
      kpis: [
        { k: "$11B", v: "estimated 2025 cost to airlines" },
        { k: "5,300", v: "delivery shortfall, aircraft" },
      ],
    },
    {
      tag: "Energy · Batteries",
      year: "2024 – 2026",
      title: "China holds 85% of cathode supply — and is moving on the tech.",
      lede: "Global lithium-ion battery manufacturing is geographically concentrated upstream: China produces ~85% of cathode active material and 90%+ of anode material. In 2025, Beijing proposed export controls on LFP cathode production and lithium processing — directly threatening Western battery roadmaps.",
      pull: "Investments in LFP battery manufacturing in Europe might suffer as a result of the recent proposition from the Chinese government to limit exports of key battery technologies.",
      attrib: "IEA Global EV Outlook 2025",
      kpis: [
        { k: "~85%", v: "global cathode active material made in China" },
        { k: "80%", v: "global battery cell production, China, 2024" },
      ],
    },
  ];
  return (
    <section className="section stories" id="stories">
      <div className="section-head">
        <span className="kicker">Stories from the field</span>
        <h2 className="h2">This isn't theoretical. It's happening, right now.</h2>
        <p className="section-sub">Three documented incidents from the last 18 months — defense, commercial aerospace, and energy. Different industries. Same root cause: no live visibility past Tier 1.</p>
      </div>
      <div className="stories-stack">
        {stories.map((s, i) => (
          <article className="story-card" key={i}>
            <header className="story-head">
              <span className="story-idx">0{i + 1}</span>
              <div className="story-meta">
                <span className="story-tag">{s.tag}</span>
                <span className="story-year">{s.year}</span>
              </div>
            </header>
            <h3 className="story-title">{s.title}</h3>
            <p className="story-lede">{s.lede}</p>
            <blockquote className="story-pull">
              <span className="story-pull-mark">"</span>
              <p>{s.pull}</p>
              <cite>{s.attrib}</cite>
            </blockquote>
            <div className="story-kpis">
              {s.kpis.map((k, j) => (
                <div className="story-kpi" key={j}>
                  <div className="story-kpi-k">{k.k}</div>
                  <div className="story-kpi-v">{k.v}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// QUOTES — design-partner testimonials, rotating
// (mirrors Zip's customer-quote slider)
// ============================================================
function Quotes() {
  const quotes = [
    {
      body: "We were tracking 4,200 part numbers in a Google Sheet. Tier Zero replaced the sheet, the calls, and the firefighting. Margin held through three Q3 disruptions we never even saw.",
      who: "VP, Procurement",
      org: "Series-C semiconductor startup · NYC",
      stat: "$184M",
      statK: "exposure absorbed",
    },
    {
      body: "ITAR re-export amendments used to take us six weeks. The agent files them in the same loop as the re-route. We've stopped paying outside counsel for routine TAA work.",
      who: "Director, Supply Chain",
      org: "Aerospace integrator · Florida",
      stat: "6 wk → same day",
      statK: "ITAR cycle time",
    },
    {
      body: "The audit packets are the unlock. Our regulator asked for source data on three re-routes; we exported in one click. Used to be a two-week scramble.",
      who: "Head of Compliance",
      org: "Battery cell manufacturer · MI",
      stat: "1-click",
      statK: "regulator export",
    },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % quotes.length), 7000);
    return () => clearInterval(id);
  }, [quotes.length]);
  const q = quotes[i];
  return (
    <section className="section quotes" id="quotes">
      <div className="section-head">
        <span className="kicker">In their own words</span>
        <h2 className="h2">How operators are running supply with Tier Zero.</h2>
      </div>
      <article className="quote-card">
        <div className="quote-stat">
          <div className="quote-stat-v">{q.stat}</div>
          <div className="quote-stat-k">{q.statK}</div>
        </div>
        <div className="quote-body-wrap">
          <span className="quote-mark">"</span>
          <p className="quote-body">{q.body}</p>
          <div className="quote-attrib">
            <div className="quote-who">{q.who}</div>
            <div className="quote-org">{q.org}</div>
          </div>
        </div>
        <div className="quote-pips">
          {quotes.map((_, j) => (
            <button key={j}
              className={`quote-pip ${j === i ? "active" : ""}`}
              onClick={() => setI(j)}
              aria-label={`Quote ${j + 1}`} />
          ))}
        </div>
      </article>
    </section>
  );
}

// ============================================================
// LOGO STRIP — simple text logos for design partners
// ============================================================
function LogoStrip() {
  const logos = ["LOCKHEED", "REDWIRE", "ANDURIL", "RIVOS", "HELIOS", "ATLAS", "ORBITAL MESH", "FORGE", "TWELVE"];
  return (
    <section className="logos">
      <p className="logos-label">In conversation with operators at</p>
      <div className="logos-row">
        {logos.map(l => <span key={l} className="logo-text">{l}</span>)}
      </div>
    </section>
  );
}

// ============================================================
// RESOURCES — guides + research cards
// (mirrors Zip's resource cards)
// ============================================================
function Resources() {
  const items = [
    {
      kind: "Guide",
      title: "The deep-tech procurement playbook.",
      body: "Three-tier visibility, qualified alternates, and the export-control math behind every move. 24 pages.",
      meta: "PDF · 24 pp",
    },
    {
      kind: "Report",
      title: "State of A&D disruption: 2024 → 2025.",
      body: "12,356 disruption events parsed. The structural causes of a 35% YoY rise — and what to do about them.",
      meta: "Q4 '25",
    },
    {
      kind: "Brief",
      title: "ITAR Cat XV in the agent age.",
      body: "How re-export amendments compress from six weeks to same-day when compliance is part of the routing engine.",
      meta: "10 min read",
    },
  ];
  return (
    <section className="section resources" id="resources">
      <div className="section-head">
        <span className="kicker">Reading from the field</span>
        <h2 className="h2">What we've learned shipping with deep-tech operators.</h2>
      </div>
      <div className="resources-grid">
        {items.map((r, i) => (
          <article className="res-card" key={i}>
            <div className="res-thumb">
              <span className="res-thumb-tag">{r.kind}</span>
              <ResourceArt i={i} />
            </div>
            <div className="res-body">
              <span className="res-meta">{r.meta}</span>
              <h3 className="res-title">{r.title}</h3>
              <p className="res-blurb">{r.body}</p>
              <a className="res-link" href="#cta">Read →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResourceArt({ i }) {
  if (i === 0) return (
    <svg viewBox="0 0 200 120" className="res-art">
      <line x1="20" y1="60" x2="180" y2="60" className="res-line" />
      <line x1="20" y1="40" x2="180" y2="40" className="res-line" />
      <line x1="20" y1="80" x2="180" y2="80" className="res-line" />
      {[40, 80, 120, 160].map((x, j) => (
        <circle key={j} cx={x} cy={60} r="6" className={j === 2 ? "res-dot res-dot-on" : "res-dot"} />
      ))}
    </svg>
  );
  if (i === 1) return (
    <svg viewBox="0 0 200 120" className="res-art">
      {[20, 50, 80, 110, 140, 170].map((x, j) => {
        const h = [40, 60, 30, 80, 50, 90][j];
        return <rect key={j} x={x - 8} y={100 - h} width="16" height={h} className={j === 5 ? "res-bar res-bar-on" : "res-bar"} />;
      })}
    </svg>
  );
  return (
    <svg viewBox="0 0 200 120" className="res-art">
      <rect x="40" y="20" width="120" height="80" className="res-doc" />
      <line x1="55" y1="40" x2="145" y2="40" className="res-line" />
      <line x1="55" y1="55" x2="120" y2="55" className="res-line" />
      <line x1="55" y1="70" x2="145" y2="70" className="res-line" />
      <circle cx="155" cy="92" r="14" className="res-stamp" />
      <text x="155" y="96" className="res-stamp-t" textAnchor="middle">✓</text>
    </svg>
  );
}

// expose globals so app.jsx can use them
Object.assign(window, { Pillars, Capabilities, Agents, Stories, Quotes, LogoStrip, Resources });

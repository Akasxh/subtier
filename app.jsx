/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "steel",
  "scenario": "space",
  "companyName": "Subtier"
}/*EDITMODE-END*/;

const PALETTES = {
  steel: {
    // Colorhunt: E8EDF2 / 2C3947 / 547A95 / C2A56D
    // Cool stone paper, deep navy ink, steel-blue primary, warm gold accent.
    name: "Steel",
    primary: "#547A95",  primarySoft: "#6E94AE",
    accent: "#C2A56D",   accentSoft: "#D4BB8A",
    ink: "#2C3947",      paper: "#E8EDF2",        paper2: "#DDE3EA",
    panel: "#F4F6FA",    panelDeep: "#2C3947",
    surfaceAlt: "#D6DEE6",
    line: "#CDD6E0",     lineDark: "#3C4A5A",
    muted: "#5C6B7A",    mutedOnDark: "#9DA9B6",
    danger: "#B23A3A",   warn: "#C2A56D",         ok: "#3F7A5C",
  },
  ember: {
    // Colorhunt: FFEDCE / FFC193 / FF8383 / FF3737
    // Warm cream paper, peach, coral, deep red. Confident + warm.
    name: "Ember",
    primary: "#FF3737",  primarySoft: "#FF8383",
    accent: "#1A0E0A",   accentSoft: "#2A1812",   // near-black for dark surfaces
    ink: "#1A0E0A",      paper: "#FFEDCE",        paper2: "#FFE0B5",
    panel: "#FFF4DD",    panelDeep: "#1A0E0A",
    surfaceAlt: "#FFC193",
    line: "#E8D4B0",     lineDark: "#3A2418",
    muted: "#7A5C44",    mutedOnDark: "#C9A98A",
    danger: "#FF3737",   warn: "#C68B17",         ok: "#2F8C5A",
  },
  forest: {
    // Colorhunt: 1F6F5F / 2FA084 / 6FCF97 / EEEEEE
    name: "Forest",
    primary: "#1F6F5F",  primarySoft: "#2FA084",
    accent: "#0E2A24",   accentSoft: "#163A32",   // deep teal for dark surfaces
    ink: "#0E2A24",      paper: "#EEEEEE",        paper2: "#E2E2E2",
    panel: "#F5F5F5",    panelDeep: "#0E2A24",
    surfaceAlt: "#D9E8E2",
    line: "#CFD3D1",     lineDark: "#1A3D34",
    muted: "#5C6B66",    mutedOnDark: "#9BB8AE",
    danger: "#C44545",   warn: "#C68B17",         ok: "#6FCF97",
  },
  iris: {
    // Colorhunt: 6367FF / 8494FF / C9BEFF / FFDBFD
    name: "Iris",
    primary: "#6367FF",  primarySoft: "#8494FF",
    accent: "#1A1740",   accentSoft: "#272357",   // deep indigo for dark surfaces
    ink: "#1A1740",      paper: "#FFDBFD",        paper2: "#F5D0F1",
    panel: "#FFEAFE",    panelDeep: "#1A1740",
    surfaceAlt: "#C9BEFF",
    line: "#D9CCEE",     lineDark: "#2C2768",
    muted: "#5A5687",    mutedOnDark: "#A6A3D9",
    danger: "#D24545",   warn: "#C68B17",         ok: "#2F8C5A",
  },
  paper: {
    // Warm cream paper, deep ink, terracotta accent.
    // Dark notes on the contrast: panel-deep, ink, navy-card for the demo.
    name: "Paper",
    primary: "#B5410E",  primarySoft: "#D96A2E",
    accent: "#0F1B2D",   accentSoft: "#1B2A44",   // deep navy for dark surfaces
    ink: "#1A1209",      paper: "#F4ECDC",        paper2: "#EBE1CE",
    panel: "#FAF4E6",    panelDeep: "#0F1B2D",    // a deep complementary surface
    surfaceAlt: "#EFE5D0",
    line: "#D9CDB4",     lineDark: "#1F2D44",
    muted: "#6B5E4A",    mutedOnDark: "#A6B3C9",
    danger: "#B82F2A",   warn: "#C5860C",         ok: "#2F7A4E",
  },
  fog: {
    // Cool grey-stone neutral, navy ink, oxblood accent.
    name: "Fog",
    primary: "#9C2A2F",  primarySoft: "#C44045",
    accent: "#10182A",   accentSoft: "#1B2440",
    ink: "#0F1623",      paper: "#E8E6DF",        paper2: "#DCDAD2",
    panel: "#F1EEE6",    panelDeep: "#0F1623",
    surfaceAlt: "#DEDBD2",
    line: "#C8C4B8",     lineDark: "#1E2738",
    muted: "#5C6172",    mutedOnDark: "#9DA6BB",
    danger: "#B82F2A",   warn: "#A87A0F",         ok: "#246B45",
  },
  sage: {
    // Sage cream, forest accent.
    name: "Sage",
    primary: "#1F5238",  primarySoft: "#2F7A4E",
    accent: "#0E1F18",   accentSoft: "#162A20",
    ink: "#0E1814",      paper: "#EEEAD9",        paper2: "#E2DCC6",
    panel: "#F6F2E2",    panelDeep: "#0E1F18",
    surfaceAlt: "#E6DFC9",
    line: "#CFC9B0",     lineDark: "#1A2D24",
    muted: "#5B5B47",    mutedOnDark: "#9CB0A4",
    danger: "#B62E2A",   warn: "#B87212",         ok: "#1F5238",
  },
  midnight: {
    // Original dark fallback.
    name: "Midnight",
    primary: "#E8B04B",  primarySoft: "#F5C97A",
    accent: "#3A4566",   accentSoft: "#1F2740",
    ink: "#F4F4F7",      paper: "#0A0E1A",        paper2: "#0F1322",
    panel: "#141828",    panelDeep: "#0A0E1A",
    surfaceAlt: "#0F1322",
    line: "#222840",     lineDark: "#222840",
    muted: "#8A92A8",    mutedOnDark: "#8A92A8",
    danger: "#FF6B6B",   warn: "#F5A524",         ok: "#3DD68C",
  },
};

const SCENARIOS = {
  semiconductor: {
    label: "Semiconductors",
    headline: "HBM3e shortfall · Atlas Compute Q3 plan",
    sku: "HBM3e-24GB · Stack #A2",
    customer: "Atlas Compute",
    units: "12,000 stacks / Q3",
    impact: "$184M",
    saved: "$142M",
    scenes: [
      { t: "04:18:02", k: "SIGNAL", title: "Variance in supplier ERP", body: "Ibiden ATS-04 cut Q3 ABF substrate allocation by 38%. 4,560 stacks short of plan.", chips: ["T2 · JP", "ABF substrate", "−38% allocation"] },
      { t: "04:18:11", k: "AGENT",  title: "Cross-checked TSMC AP6 wafer-out", body: "Confirmed: shortfall hits CoWoS packaging in 14 weeks. Atlas exposure: $184M.", chips: ["TSMC AP6", "14w lead time", "exposure $184M"] },
      { t: "04:19:43", k: "AGENT",  title: "Found 3 qualified alternates", body: "Shinko ATS-09 cleared procurement audit in March. 1,800 stacks reservable now.", chips: ["Shinko ATS-09", "audit Mar '26", "1,800 stacks"] },
      { t: "04:20:18", k: "AGENT",  title: "Cleared export controls", body: "EAR §744.23 + de-minimis recheck passed for KR↔TW re-route. No license amendment.", chips: ["EAR §744.23", "de-minimis ok", "ECCN cleared"] },
      { t: "04:21:16", k: "RESOLVED", title: "Re-routed and notified", body: "Procurement re-issued PO. Slip recovered 22w → 16w. $142M of $184M exposure absorbed.", chips: ["PO re-issued", "slip 22w→16w", "$142M saved"] },
    ],
  },
  space: {
    label: "Aerospace",
    headline: "Star tracker FPGA fail · Orbital Mesh launch window",
    sku: "ST-400 Star Tracker · Rev C",
    customer: "Orbital Mesh",
    units: "84 units · launch window",
    impact: "$48M",
    saved: "$48M",
    scenes: [
      { t: "09:02:14", k: "SIGNAL", title: "SEU screen failure", body: "Microchip RTG4 lot #C-0427 failed single-event-upset test at 38 MeV. 26 of 84 trackers affected.", chips: ["RTG4 · lot C-0427", "26 / 84 units", "SEU @ 38 MeV"] },
      { t: "09:02:33", k: "AGENT",  title: "Pulled FPGA traceability", body: "Identified all 84 trackers' FPGA lot codes via Sodern bonded-stock manifest.", chips: ["Sodern bond stock", "84 / 84 traced"] },
      { t: "09:04:01", k: "AGENT",  title: "Located drop-in alternate", body: "BAE RAD750 has 32 units in bonded inventory. Pin-compatible with ST-400 Rev C harness.", chips: ["BAE RAD750", "32 units bond", "pin compatible"] },
      { t: "09:04:50", k: "AGENT",  title: "ITAR re-export check", body: "Cat XV amendment needed for FR↔US re-export. Filed; expected in 4 days under TAA-7741.", chips: ["ITAR Cat XV", "TAA-7741", "ETA 4 days"] },
      { t: "09:06:22", k: "RESOLVED", title: "Launch window holds", body: "Slip absorbed in integration float. Redwire J-ville notified. No customer-facing schedule change.", chips: ["slip 0 days", "Redwire notified", "window hold"] },
    ],
  },
  battery: {
    label: "Energy",
    headline: "Lithium hydroxide squeeze · Helios Grid Q4",
    sku: "NMC811 Cathode · 4680 cell",
    customer: "Helios Grid",
    units: "1.2 GWh / Q4",
    impact: "$96M",
    saved: "$94M",
    scenes: [
      { t: "11:14:08", k: "SIGNAL", title: "Spot price +41% in 6 hours", body: "Albemarle invoking force majeure on Kemerton expansion. 280 t shortfall vs Q4 plan.", chips: ["Albemarle Kemerton", "force majeure", "−280 tonnes"] },
      { t: "11:14:30", k: "AGENT",  title: "Modeled cell-cost impact", body: "Without re-route, $4.20/kWh hit on Helios Grid 4680 line. $96M margin exposure.", chips: ["+$4.20/kWh", "exposure $96M"] },
      { t: "11:16:11", k: "AGENT",  title: "Located IRA-compliant supply", body: "SQM Salar (Chile) has 180 t available. FEOC-free. 45V tax credit eligible.", chips: ["SQM Chile", "180 tonnes", "IRA §45X ok"] },
      { t: "11:17:04", k: "AGENT",  title: "Reserved POSCO secondary line", body: "Routed feedstock through POSCO Gwangyang Line 2. No qualification rerun needed.", chips: ["POSCO Line 2", "no requalification"] },
      { t: "11:18:39", k: "RESOLVED", title: "GWh plan held", body: "Margin impact contained to −$2.1M (absorbed in Q4 buffer). No customer notification needed.", chips: ["margin −$2.1M", "no slip", "audit logged"] },
    ],
  },
};

// ============================================================
// ROOT
// ============================================================
function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[tweaks.palette] || PALETTES.paper;
  const scenario = SCENARIOS[tweaks.scenario] || SCENARIOS.semiconductor;

  useEffect(() => {
    const r = document.documentElement.style;
    Object.entries({
      "--c-primary": palette.primary, "--c-primary-soft": palette.primarySoft,
      "--c-accent": palette.accent, "--c-accent-soft": palette.accentSoft,
      "--c-ink": palette.ink, "--c-paper": palette.paper,
      "--c-paper2": palette.paper2, "--c-panel": palette.panel,
      "--c-panel-deep": palette.panelDeep,
      "--c-surface-alt": palette.surfaceAlt,
      "--c-line": palette.line, "--c-line-dark": palette.lineDark,
      "--c-muted": palette.muted, "--c-muted-on-dark": palette.mutedOnDark,
      "--c-danger": palette.danger, "--c-warn": palette.warn, "--c-ok": palette.ok,
    }).forEach(([k, v]) => r.setProperty(k, v));
  }, [palette]);

  return (
    <div className="page">
      <Nav name={tweaks.companyName} />
      <HeroDemo scenario={scenario} scenarioKey={tweaks.scenario} setTweak={setTweak} />
      <LogoStrip />
      <Pillars />
      <Capabilities />
      <Agents />
      <Stories />
      <Quotes />
      <Numbers />
      <Resources />
      <CTA />
      <Footer name={tweaks.companyName} />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="currentColor"/>
      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.4"/>
      <rect x="13" y="13" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function Nav({ name }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top"><Logo /><span>{name}</span></a>
        <div className="nav-links">
          <a href="#demo">Platform</a>
        </div>
        <div className="nav-cta">
          <a className="btn-ghost" href="#cta">Sign in</a>
          <a className="btn-primary" href="#cta">Request a demo</a>
        </div>
      </div>
    </nav>
  );
}

// ============================================================
// HERO with mini stacked-cards demo
// ============================================================
// ============================================================
// HERO + DEMO — single-screen combined section
// ============================================================
const DEMO_VIEWS = [
  { k: "ops",     label: "Live ops" },
  { k: "graph",   label: "Supplier graph" },
  { k: "agent",   label: "Agent reasoning" },
];

function HeroDemo({ scenario, scenarioKey, setTweak }) {
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [view, setView] = useState("ops");

  useEffect(() => { setTick(0); setPlaying(true); }, [scenarioKey, view]);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [playing]);

  const feed = SIGNAL_FEED[scenarioKey] || SIGNAL_FEED.semiconductor;
  const reasoning = REASONING[scenarioKey] || REASONING.semiconductor;
  const visibleSignals = Math.min(Math.floor(tick / 9), feed.length);
  const visibleReasoning = Math.min(Math.floor(tick / 8), reasoning.length);
  const phase = Math.min(Math.floor(tick / 24), 4);

  return (
    <header className="hero-demo" id="top">
      <div className="hd-headline">
        <h1 className="h1 hero-h1">
          <span className="h1-accent">AI procurement</span> for deep tech.
        </h1>
        <div className="hero-cta">
          <a className="btn-primary lg" href="#cta">Request a demo</a>
          <a className="btn-ghost lg" href="#cta">Sign in</a>
        </div>
      </div>

      <div className="demo-wrap demo-wrap-hero" id="demo">
        <div className="demo-controls">
          <div className="view-tabs">
            {DEMO_VIEWS.map(v => (
              <button key={v.k}
                className={`view-tab ${view === v.k ? "active" : ""}`}
                onClick={() => setView(v.k)}>{v.label}</button>
            ))}
          </div>
          <div className="demo-status">
            <span className={`ds-led ${playing ? "live" : ""}`} />
            <span className="ds-text">{playing ? "LIVE" : "PAUSED"}</span>
            <span className="ds-meta">t+{Math.floor(tick / 12)}s</span>
          </div>
          <div className="demo-actions">
            <ScenarioPicker active={scenarioKey} onChange={(k) => setTweak("scenario", k)} compact />
            <button className="demo-replay" onClick={() => setPlaying(p => !p)}>{playing ? "❚❚" : "▶"}</button>
            <button className="demo-replay" onClick={() => { setTick(0); setPlaying(true); }}>↻</button>
          </div>
        </div>
        {view === "ops" && (
          <div className="demo-grid demo-grid-ops">
            <SignalFeed feed={feed} count={visibleSignals} />
            <LiveMetrics scenario={scenario} phase={phase} tick={tick} />
          </div>
        )}
        {view === "graph" && (
          <div className="demo-grid demo-grid-ops">
            <SupplierGraph scenario={scenario} scenarioKey={scenarioKey} phase={phase} tick={tick} />
            <SignalFeed feed={feed} count={visibleSignals} />
          </div>
        )}
        {view === "agent" && (
          <div className="demo-grid demo-grid-ops">
            <ReasoningStream lines={reasoning} count={visibleReasoning} tick={tick} />
            <LiveMetrics scenario={scenario} phase={phase} tick={tick} />
          </div>
        )}
      </div>
    </header>
  );
}

function Hero({ name }) {
  return (
    <header className="hero" id="top">
      <div className="hero-main hero-centered">
        <h1 className="h1 hero-h1">
          <span className="h1-accent">AI procurement</span> for deep tech.
        </h1>
        <div className="hero-cta">
          <a className="btn-primary lg" href="#cta">Request a demo</a>
          <a className="btn-ghost lg" href="#demo">See it work ↓</a>
        </div>
      </div>
    </header>
  );
}

// Stacked cards that fly in/out — small version for hero
function HeroMiniDemo() {
  const CARDS = [
    { tag: "AGENT 01 · INTAKE",     title: "Spec parsed · ST-400 Rev C",   body: "84 star trackers · launch window held.", color: "primary" },
    { tag: "AGENT 03 · SOURCING",   title: "BAE RAD750 located",            body: "32 units in bond. Pin-compatible.", color: "primary" },
    { tag: "AGENT 05 · COMPLIANCE", title: "ITAR Cat XV cleared",           body: "TAA-7741 amendment filed. ETA 4d.", color: "ok" },
    { tag: "AGENT 12 · AUDIT",      title: "Regulator-ready packet",        body: "Cited, signed, append-only. PO issued.", color: "primary" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % CARDS.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hero-stack">
      <div className="hs-frame-bar">
        <span className="hs-bar-dot" />
        <span className="hs-bar-k">live incident</span>
        <span className="hs-bar-v">ST-400 · Orbital Mesh</span>
        <span className="hs-bar-meta">{i + 1} / {CARDS.length}</span>
      </div>
      <div className="hs-stage">
        {CARDS.map((c, idx) => {
          const offset = (idx - i + CARDS.length) % CARDS.length;
          return (
            <div key={idx} className={`hs-card ofs-${offset} c-${c.color}`}>
              <div className="hs-card-tag">{c.tag}</div>
              <div className="hs-card-title">{c.title}</div>
              <div className="hs-card-body">{c.body}</div>
            </div>
          );
        })}
      </div>
      <div className="hs-stage-foot">
        {CARDS.map((_, idx) => (
          <span key={idx} className={`hs-pip ${idx === i ? "active" : ""}`} />
        ))}
        <span className="hs-foot-meta">→ full incident below</span>
      </div>
    </div>
  );
}

// ============================================================
// LOGOS — moved to sections.jsx
// ============================================================
// (LogoStrip lives in sections.jsx)

// ============================================================
// PROBLEM
// ============================================================
function Problem() {
  return (
    <section className="section problem" id="problem">
      <div className="section-head">
        <span className="kicker">01 · The problem</span>
        <h2 className="h2">Deep-tech procurement is run on spreadsheets, faxes, and faith.</h2>
        <p className="section-sub">A single advanced product crosses dozens of countries and hundreds of sub-tier suppliers — most of whom you've never spoken to. Disruption is the default state, and the tools to see it don't exist.</p>
      </div>
      <div className="problem-grid">
        <div className="prob-card">
          <div className="prob-num">12,356</div>
          <div className="prob-title">A&amp;D disruption events in 2024</div>
          <p>Up 35% YoY from 9,188 in 2023. Lead times stretched from weeks to months for defense-grade parts.<span className="prob-src">Altium / Defense Business Board, 2025</span></p>
        </div>
        <div className="prob-card">
          <div className="prob-num">17,000+</div>
          <div className="prob-title">aircraft backlog, ~14 yrs of production</div>
          <p>Sole-sourced Tier-3 components and one F-35 microelectronic delay can stall an entire assembly line.<span className="prob-src">IATA / Oliver Wyman, Oct 2025</span></p>
        </div>
        <div className="prob-card">
          <div className="prob-num">~85%</div>
          <div className="prob-title">cathode active material is China</div>
          <p>Plus 90%+ of anode material. China has proposed export controls on LFP cathode and lithium processing tech.<span className="prob-src">IEA Global EV Outlook 2025</span></p>
        </div>
        <div className="prob-card">
          <div className="prob-num">1 in 3</div>
          <div className="prob-title">defense suppliers are sole-eligible</div>
          <p>Each is a single point of failure. The annual count of new defense vendors fell 28% from 2018 to 2020.<span className="prob-src">NDIA Vital Signs, 2022</span></p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STORIES — moved to sections.jsx
// ============================================================
// (Stories lives in sections.jsx)
function _StoriesLegacy() {
  const stories = [
    {
      tag: "Aerospace · Defense",
      year: "2024 – 2025",
      title: "One microelectronic part stalls a $1.7T program.",
      lede: "The Lockheed Martin F-35 is built from thousands of unique parts sourced from hundreds of suppliers. Sub-tier shortages in microelectronics, composite structures, and thermal management systems have stretched delivery timelines for partner nations across multiple program years.",
      pull: "\"If a single microelectronic part lags behind, the entire delivery timeline is impacted.\"",
      attrib: "AIA / The Defense Watch · Nov 2025",
      kpis: [
        { k: "12,356", v: "A&D disruption events in 2024 (+35% YoY)" },
        { k: "1 in 3", v: "defense suppliers self-identify as sole-eligible" },
      ],
    },
    {
      tag: "Commercial Aerospace",
      year: "2024 – 2031+",
      title: "A 17,000-aircraft backlog. ~14 years of production at current rates.",
      lede: "Decades of consolidation made many aircraft components sole-sourced. Combined with raw-material shortages, tariff regimes, and tight labor, even small disruptions balloon into multi-year production delays. IATA estimates the resulting cost to airlines at over $11B in 2025 alone.",
      pull: "\"The fragility of the aerospace supply chain network — often reliant on a limited number of suppliers for critical parts — can become an acute constraint amid economic uncertainty.\"",
      attrib: "IATA / Oliver Wyman · Oct 2025",
      kpis: [
        { k: "$11B", v: "estimated 2025 cost to airlines" },
        { k: "5,300", v: "delivery shortfall, aircraft" },
      ],
    },
    {
      tag: "Energy · Batteries",
      year: "2024 – 2026",
      title: "China holds 85% of cathode supply — and is moving to control the tech.",
      lede: "Global lithium-ion battery manufacturing is geographically concentrated upstream: China produces ~85% of cathode active material and 90%+ of anode material. In 2025, Beijing proposed export controls on LFP cathode production and lithium processing — directly threatening Western battery roadmaps that depend on those technology transfers.",
      pull: "\"Investments in LFP battery manufacturing in Europe might suffer as a result of the recent proposition from the Chinese government to limit exports of key battery technologies.\"",
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
        <span className="kicker">02 · Stories from the field</span>
        <h2 className="h2">This isn't theoretical. It's happening, right now, across deep tech.</h2>
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
              <p>{s.pull.replace(/^"|"$/g, "")}</p>
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
// DEMO — Live ops dashboard
// Multiple panes animating in parallel: signals streaming,
// supplier graph pulsing, agent reasoning typing, metrics ticking
// ============================================================
const SIGNAL_FEED = {
  semiconductor: [
    { t: "04:17:58", src: "ERP", txt: "Ibiden ATS-04 · Q3 alloc −38%", level: "danger" },
    { t: "04:18:02", src: "ALERT", txt: "Variance threshold breached", level: "danger" },
    { t: "04:18:11", src: "AGENT", txt: "Cross-ref TSMC AP6 wafer-out", level: "info" },
    { t: "04:18:14", src: "AGENT", txt: "Confirmed: 4,560 stacks short", level: "info" },
    { t: "04:18:22", src: "AGENT", txt: "Atlas Compute exposure $184M", level: "warn" },
    { t: "04:19:01", src: "SCAN",  txt: "Querying qualified alternates", level: "info" },
    { t: "04:19:43", src: "MATCH", txt: "Shinko ATS-09 · 1,800 stacks", level: "ok" },
    { t: "04:20:11", src: "EAR",   txt: "Re-export rule §744.23 ok", level: "ok" },
    { t: "04:20:18", src: "AGENT", txt: "De-minimis recheck passed", level: "ok" },
    { t: "04:21:02", src: "PO",    txt: "Reserving 1,800 @ Shinko", level: "info" },
    { t: "04:21:16", src: "DONE",  txt: "Slip 22w → 16w · $142M saved", level: "ok" },
  ],
  space: [
    { t: "09:02:14", src: "QC",    txt: "RTG4 lot C-0427 · SEU fail", level: "danger" },
    { t: "09:02:21", src: "ALERT", txt: "26/84 trackers affected", level: "danger" },
    { t: "09:02:33", src: "AGENT", txt: "Pulling Sodern bond manifest", level: "info" },
    { t: "09:03:10", src: "TRACE", txt: "84/84 lot codes resolved", level: "info" },
    { t: "09:04:01", src: "MATCH", txt: "BAE RAD750 · 32 in bond", level: "ok" },
    { t: "09:04:20", src: "AGENT", txt: "Pin-compat verified Rev C", level: "ok" },
    { t: "09:04:50", src: "ITAR",  txt: "Cat XV TAA-7741 filed", level: "warn" },
    { t: "09:05:11", src: "AGENT", txt: "ETA 4 days · monitoring", level: "info" },
    { t: "09:06:22", src: "DONE",  txt: "Window holds · slip 0d", level: "ok" },
  ],
  battery: [
    { t: "11:14:08", src: "SPOT",  txt: "LiOH +41% · 6h window", level: "danger" },
    { t: "11:14:14", src: "FEED",  txt: "Albemarle force majeure", level: "danger" },
    { t: "11:14:30", src: "AGENT", txt: "Cell-cost +$4.20/kWh", level: "warn" },
    { t: "11:14:42", src: "AGENT", txt: "Helios Q4 exposure $96M", level: "warn" },
    { t: "11:15:30", src: "SCAN",  txt: "FEOC-free supply check", level: "info" },
    { t: "11:16:11", src: "MATCH", txt: "SQM Salar · 180 t free", level: "ok" },
    { t: "11:16:38", src: "IRA",   txt: "§45X eligibility ok", level: "ok" },
    { t: "11:17:04", src: "AGENT", txt: "POSCO Line 2 reserved", level: "ok" },
    { t: "11:17:55", src: "AGENT", txt: "No requalification needed", level: "ok" },
    { t: "11:18:39", src: "DONE",  txt: "Margin −$2.1M · absorbed", level: "ok" },
  ],
};

const REASONING = {
  semiconductor: [
    "ingest erp delta (Ibiden ATS-04 / Q3 alloc / -38%)",
    "join wafer-out forecast (TSMC AP6 / 14w lead)",
    "compute customer exposure → Atlas Compute · $184M",
    "query qualified alternates where audit_status = 'pass'",
    "  → Shinko ATS-09 (Mar '26 audit, 1,800 stacks free)",
    "  → AT&S Leoben (capacity tight — defer)",
    "check EAR §744.23 · KR ↔ TW re-route · de-minimis",
    "  ✓ no license amendment required",
    "draft PO amendment · reserve 1,800 @ Shinko",
    "estimate slip recovery: 22w → 16w · $142M absorbed",
    "notify procurement · log audit trail · close ticket",
  ],
  space: [
    "ingest qc fail (Microchip RTG4 · lot C-0427 · SEU @ 38 MeV)",
    "trace lot codes via Sodern bond-stock manifest",
    "  → 84 of 84 flight units mapped",
    "query rad-hard pin-compat alternates",
    "  → BAE RAD750 · 32 units in bonded inventory",
    "diff harness Rev C · pin compat ✓",
    "check ITAR Cat XV · FR ↔ US re-export",
    "  → file TAA-7741 amendment · ETA 4 days",
    "absorb slip in integration float",
    "notify Redwire J-ville · launch window holds",
  ],
  battery: [
    "ingest spot price delta (LiOH +41% · 6h)",
    "ingest feed (Albemarle Kemerton · force majeure)",
    "model cell-cost impact at Helios BOM resolution",
    "  → +$4.20/kWh · Q4 exposure $96M",
    "query FEOC-free, IRA §45X-eligible supply",
    "  → SQM Salar (Chile) · 180 t · ✓ §45X",
    "route via POSCO Gwangyang Line 2",
    "  → no second qualification cycle required",
    "absorb in Q4 buffer · margin −$2.1M",
  ],
};

function DemoSection({ scenario, scenarioKey, setTweak }) {
  const [tick, setTick] = useState(0); // monotonically increasing time
  const [playing, setPlaying] = useState(true);

  // Reset on scenario change
  useEffect(() => {
    setTick(0);
    setPlaying(true);
  }, [scenarioKey]);

  // Heartbeat: ~12 ticks per second when playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [playing]);

  const feed = SIGNAL_FEED[scenarioKey] || SIGNAL_FEED.semiconductor;
  const reasoning = REASONING[scenarioKey] || REASONING.semiconductor;

  // Each signal appears every ~12 ticks (~1s)
  const visibleSignals = Math.min(Math.floor(tick / 9), feed.length);
  // Reasoning lines come in every ~10 ticks
  const visibleReasoning = Math.min(Math.floor(tick / 8), reasoning.length);
  // Phase: 0=signal, 1=reasoning, 2=alt found, 3=compliance, 4=resolved
  const phase = Math.min(Math.floor(tick / 24), 4);

  return (
    <section className="section demo" id="demo">
      <div className="section-head section-head-tight">
        <h2 className="h2">A live operations console.</h2>
      </div>

      <div className="demo-wrap">
        <div className="demo-controls">
          <ScenarioPicker active={scenarioKey} onChange={(k) => setTweak("scenario", k)} />
          <div className="demo-status">
            <span className={`ds-led ${playing ? "live" : ""}`} />
            <span className="ds-text">{playing ? "LIVE" : "PAUSED"}</span>
            <span className="ds-meta">t+{Math.floor(tick / 12)}s · phase {phase + 1}/5</span>
          </div>
          <div className="demo-actions">
            <button className="demo-replay" onClick={() => setPlaying(p => !p)}>
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button className="demo-replay" onClick={() => { setTick(0); setPlaying(true); }}>
              ↻ Replay
            </button>
          </div>
        </div>

        <div className="demo-grid">
          {/* Top-left: live signal feed */}
          <SignalFeed feed={feed} count={visibleSignals} />

          {/* Top-right: supplier graph */}
          <SupplierGraph scenario={scenario} scenarioKey={scenarioKey} phase={phase} tick={tick} />

          {/* Bottom-left: agent reasoning stream */}
          <ReasoningStream lines={reasoning} count={visibleReasoning} tick={tick} />

          {/* Bottom-right: live metrics */}
          <LiveMetrics scenario={scenario} phase={phase} tick={tick} />
        </div>
      </div>
    </section>
  );
}

// ----- SIGNAL FEED -----
function SignalFeed({ feed, count }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [count]);
  const visible = feed.slice(0, count);
  return (
    <div className="pane pane-signals">
      <div className="pane-head">
        <span className="pane-title">Signal feed</span>
        <span className="pane-meta">
          <span className="pulse-dot" />
          {count} / {feed.length}
        </span>
      </div>
      <div className="signal-list" ref={listRef}>
        {visible.map((s, i) => (
          <div key={i} className={`signal-row lvl-${s.level} ${i === visible.length - 1 ? "newest" : ""}`}>
            <span className="sig-t">{s.t}</span>
            <span className={`sig-src src-${s.src.toLowerCase()}`}>{s.src}</span>
            <span className="sig-txt">{s.txt}</span>
          </div>
        ))}
        {count === 0 && <div className="signal-empty">awaiting signal…</div>}
      </div>
    </div>
  );
}

// ----- SUPPLIER GRAPH -----
function SupplierGraph({ scenario, scenarioKey, phase, tick }) {
  // Layout: T3 → T2 → T1 → T0, x-positions per tier, y-positions stacked
  const NODES = useMemo(() => {
    if (scenarioKey === "semiconductor") return [
      { id: "fab",  tier: 0, y: 0.5, name: "SK hynix",  region: "KR" },
      { id: "subs", tier: 1, y: 0.2, name: "Ibiden ATS-04", region: "JP", risk: true },
      { id: "alt",  tier: 1, y: 0.5, name: "Shinko ATS-09", region: "JP", alt: true },
      { id: "pkg",  tier: 1, y: 0.8, name: "TSMC AP6",  region: "TW" },
      { id: "test", tier: 2, y: 0.3, name: "ASE",       region: "TW" },
      { id: "mod",  tier: 2, y: 0.7, name: "NVIDIA pkg",region: "TW" },
      { id: "cust", tier: 3, y: 0.5, name: "Atlas Compute", region: "US", customer: true },
    ];
    if (scenarioKey === "space") return [
      { id: "wafer", tier: 0, y: 0.5, name: "X-Fab",    region: "DE" },
      { id: "fpga",  tier: 1, y: 0.2, name: "RTG4",     region: "US", risk: true },
      { id: "alt",   tier: 1, y: 0.5, name: "RAD750",   region: "US", alt: true },
      { id: "opt",   tier: 1, y: 0.8, name: "Jenoptik", region: "DE" },
      { id: "asm",   tier: 2, y: 0.3, name: "Sodern",   region: "FR" },
      { id: "qual",  tier: 2, y: 0.7, name: "Redwire",  region: "US" },
      { id: "cust",  tier: 3, y: 0.5, name: "Orbital Mesh", region: "US", customer: true },
    ];
    return [
      { id: "mine", tier: 0, y: 0.5, name: "KGHM",      region: "CD" },
      { id: "lith", tier: 1, y: 0.2, name: "Albemarle", region: "AU", risk: true },
      { id: "alt",  tier: 1, y: 0.5, name: "SQM Salar", region: "CL", alt: true },
      { id: "ref",  tier: 1, y: 0.8, name: "Umicore",   region: "FI" },
      { id: "cath", tier: 2, y: 0.3, name: "POSCO",     region: "KR" },
      { id: "cell", tier: 2, y: 0.7, name: "LGES",      region: "US" },
      { id: "cust", tier: 3, y: 0.5, name: "Helios Grid", region: "US", customer: true },
    ];
  }, [scenarioKey]);

  // Edges based on tier topology
  const EDGES = useMemo(() => {
    const byTier = [0, 1, 2, 3].map(t => NODES.filter(n => n.tier === t));
    const out = [];
    // T3 -> T2 (only Ibiden risk + Shinko alt + TSMC are downstream of fab)
    byTier[0].forEach(a => byTier[1].forEach(b => out.push({ from: a.id, to: b.id })));
    byTier[1].forEach(a => byTier[2].forEach(b => out.push({ from: a.id, to: b.id })));
    byTier[2].forEach(a => byTier[3].forEach(b => out.push({ from: a.id, to: b.id })));
    return out;
  }, [NODES]);

  const W = 560, H = 320;
  const tierX = [70, 200, 360, 510];
  const pos = (n) => ({ x: tierX[n.tier], y: 30 + n.y * (H - 60) });

  const showAlt = phase >= 2;
  const showCompliance = phase >= 3;
  const resolved = phase >= 4;

  const riskNode = NODES.find(n => n.risk);
  const altNode = NODES.find(n => n.alt);

  return (
    <div className="pane pane-graph">
      <div className="pane-head">
        <span className="pane-title">Supplier graph · 3 tiers down</span>
        <span className="pane-meta">{scenario.sku}</span>
      </div>
      <div className="graph-stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg">
          {/* tier columns */}
          {["T3","T2","T1","T0"].map((t, i) => (
            <g key={t}>
              <line x1={tierX[i]} y1={10} x2={tierX[i]} y2={H-10} className="tier-rail" />
              <text x={tierX[i]} y={20} textAnchor="middle" className="tier-label-t">{t}</text>
            </g>
          ))}
          {/* edges */}
          {EDGES.map((e, i) => {
            const a = NODES.find(n => n.id === e.from);
            const b = NODES.find(n => n.id === e.to);
            if (!a || !b) return null;
            const pa = pos(a), pb = pos(b);
            const isRiskPath = (a.risk || b.risk) && !showAlt;
            const isAltPath = (a.alt || b.alt) && showAlt;
            const isDead = (a.risk || b.risk) && showAlt;
            const cls = `graph-edge ${isRiskPath ? "edge-risk" : ""} ${isAltPath ? "edge-alt" : ""} ${isDead ? "edge-dead" : ""}`;
            const midX = (pa.x + pb.x) / 2;
            const d = `M${pa.x+22},${pa.y} C${midX},${pa.y} ${midX},${pb.y} ${pb.x-22},${pb.y}`;
            return <path key={i} d={d} className={cls} />;
          })}
          {/* flow particles on alt path */}
          {showAlt && altNode && (() => {
            const a = altNode;
            const downstream = NODES.filter(n => n.tier === a.tier + 1);
            return downstream.map((b, i) => {
              const pa = pos(a), pb = pos(b);
              const phase01 = ((tick + i * 7) % 30) / 30;
              const px = pa.x + 22 + (pb.x - 22 - pa.x - 22) * phase01;
              const py = pa.y + (pb.y - pa.y) * phase01;
              return <circle key={`flow-${i}`} cx={px} cy={py} r="3" className="flow-dot" />;
            });
          })()}
          {/* nodes */}
          {NODES.map(n => {
            const p = pos(n);
            const isRisk = n.risk;
            const isAlt = n.alt;
            const altLive = isAlt && showAlt;
            const altDim  = isAlt && !showAlt;
            const isDead  = isRisk && showAlt;
            return (
              <g key={n.id} transform={`translate(${p.x}, ${p.y})`}
                className={`graph-node
                  ${isRisk ? "node-risk" : ""}
                  ${altLive ? "node-alt-on" : ""}
                  ${altDim ? "node-alt-off" : ""}
                  ${isDead ? "node-dead" : ""}
                  ${n.customer ? "node-cust" : ""}
                `}>
                <rect x="-44" y="-14" width="88" height="28" rx="4" />
                <text className="gn-name" y="-1">{n.name}</text>
                <text className="gn-region" y="9">{n.region}</text>
                {isRisk && !isDead && <circle cx="38" cy="-12" r="5" className="gn-pulse" />}
                {altLive && <text x="0" y="24" className="gn-tag">REROUTED</text>}
                {isDead && <text x="0" y="24" className="gn-tag dead">BLOCKED</text>}
              </g>
            );
          })}
          {/* compliance overlay */}
          {showCompliance && (
            <g className="compliance-overlay">
              <rect x="225" y="180" width="120" height="36" rx="3" className="comp-pill"/>
              <text x="285" y="195" textAnchor="middle" className="comp-text">EAR §744.23</text>
              <text x="285" y="208" textAnchor="middle" className="comp-text-sm">{resolved ? "✓ cleared" : "checking…"}</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// ----- AGENT REASONING STREAM -----
function ReasoningStream({ lines, count, tick }) {
  const lastVisible = Math.min(count, lines.length);
  // Typing effect on the most-recent line
  const currentLine = lines[lastVisible - 1] || "";
  const charCount = Math.min(((tick % 8) + 1) * 6, currentLine.length);
  const cursor = tick % 8 < 4 ? "▌" : " ";

  return (
    <div className="pane pane-reasoning">
      <div className="pane-head">
        <span className="pane-title">Agent reasoning</span>
        <span className="pane-meta">claude · 22ms median</span>
      </div>
      <div className="reasoning-body">
        {lines.slice(0, Math.max(0, lastVisible - 1)).map((l, i) => (
          <div key={i} className="rs-line done">
            <span className="rs-pre">›</span>
            <span className="rs-txt">{l}</span>
          </div>
        ))}
        {lastVisible > 0 && (
          <div className="rs-line current">
            <span className="rs-pre">›</span>
            <span className="rs-txt">{currentLine.slice(0, charCount)}<span className="rs-cursor">{cursor}</span></span>
          </div>
        )}
        {lastVisible === lines.length && (
          <div className="rs-line ok">
            <span className="rs-pre">✓</span>
            <span className="rs-txt">decision committed · audit logged</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ----- LIVE METRICS -----
function LiveMetrics({ scenario, phase, tick }) {
  // Animate numbers up
  const exposureTarget = parseFloat((scenario.impact || "0").replace(/[^\d.]/g, ""));
  const savedTarget = parseFloat((scenario.saved || "0").replace(/[^\d.]/g, ""));

  // Exposure rises during phase 0-1, then stays
  const expProgress = Math.min(1, tick / 30);
  const exposureNow = (exposureTarget * expProgress).toFixed(0);

  // Saved rises during phase 2-4
  const savedRaw = phase < 2 ? 0 : Math.min(1, (tick - 60) / 30);
  const savedProgress = Math.max(0, savedRaw);
  const savedNow = (savedTarget * savedProgress).toFixed(0);

  // Decision count
  const decisions = Math.min(127, tick * 2);
  const status = phase >= 4 ? "RESOLVED" : phase >= 2 ? "RE-ROUTING" : phase >= 1 ? "ANALYZING" : "DETECTING";
  const statusTone = phase >= 4 ? "ok" : phase >= 2 ? "primary" : "danger";

  return (
    <div className="pane pane-metrics">
      <div className="pane-head">
        <span className="pane-title">Live metrics</span>
        <span className="pane-meta">{scenario.customer}</span>
      </div>
      <div className="metrics-grid">
        <div className={`metric-cell metric-status tone-${statusTone}`}>
          <span className="m-k">Status</span>
          <span className="m-v">{status}</span>
          <span className="m-bar"><span className="m-bar-fill" style={{ width: `${(phase + 1) * 20}%` }} /></span>
        </div>
        <div className="metric-cell">
          <span className="m-k">Exposure</span>
          <span className="m-v danger">${exposureNow}M</span>
          <span className="m-sub">{scenario.units}</span>
        </div>
        <div className="metric-cell">
          <span className="m-k">Auto-recovered</span>
          <span className="m-v ok">${savedNow}M</span>
          <span className="m-sub">{phase >= 4 ? `${Math.round(savedTarget/exposureTarget*100)}% absorbed` : "calculating…"}</span>
        </div>
        <div className="metric-cell">
          <span className="m-k">Agent decisions</span>
          <span className="m-v">{decisions}</span>
          <span className="m-sub">since incident open</span>
        </div>
        <div className="metric-cell wide">
          <span className="m-k">Compliance</span>
          <div className="comp-pills">
            <span className={`comp-pill-mini ${phase >= 3 ? "on" : ""}`}>EAR §744.23</span>
            <span className={`comp-pill-mini ${phase >= 3 ? "on" : ""}`}>de-minimis</span>
            <span className={`comp-pill-mini ${phase >= 3 ? "on" : ""}`}>ECCN map</span>
            <span className={`comp-pill-mini ${phase >= 4 ? "on" : ""}`}>audit trail</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioPicker({ active, onChange }) {
  const opts = [
    { k: "semiconductor", l: "Semiconductors" },
    { k: "space",         l: "Aerospace" },
    { k: "battery",       l: "Energy" },
  ];
  return (
    <div className="scenario-picker">
      <span className="sp-label">Scenario</span>
      {opts.map(o => (
        <button key={o.k}
          className={`sp-btn ${active === o.k ? "active" : ""}`}
          onClick={() => onChange(o.k)}>{o.l}</button>
      ))}
    </div>
  );
}

// Persistent left console — supply graph + customer info (LEGACY, unused)
function _LegacyConsoleFrame({ scenario, step }) {
  const NODES = useMemo(() => {
    if (scenario.label === "Semiconductors") return [
      { id: "fab",  tier: "T3", name: "SK hynix Icheon", region: "KR" },
      { id: "pkg",  tier: "T2", name: "TSMC AP6",        region: "TW" },
      { id: "subs", tier: "T2", name: "Ibiden ATS-04",   region: "JP", risk: true },
      { id: "alt",  tier: "T2", name: "Shinko ATS-09",   region: "JP", alt: true },
      { id: "test", tier: "T1", name: "ASE Kaohsiung",   region: "TW" },
      { id: "mod",  tier: "T1", name: "NVIDIA Hsinchu",  region: "TW" },
      { id: "cust", tier: "T0", name: "Atlas Compute",   region: "US", customer: true },
    ];
    if (scenario.label === "Aerospace") return [
      { id: "wafer", tier: "T3", name: "X-Fab Itzehoe",   region: "DE" },
      { id: "fpga",  tier: "T2", name: "Microchip RTG4",  region: "US", risk: true },
      { id: "alt",   tier: "T2", name: "BAE RAD750",      region: "US", alt: true },
      { id: "opt",   tier: "T2", name: "Jenoptik Jena",   region: "DE" },
      { id: "asm",   tier: "T1", name: "Sodern Paris",    region: "FR" },
      { id: "qual",  tier: "T1", name: "Redwire J-ville", region: "US" },
      { id: "cust",  tier: "T0", name: "Orbital Mesh",    region: "US", customer: true },
    ];
    return [
      { id: "mine", tier: "T3", name: "KGHM Kongolo",      region: "CD" },
      { id: "lith", tier: "T2", name: "Albemarle Kemerton",region: "AU", risk: true },
      { id: "alt",  tier: "T2", name: "SQM Salar",         region: "CL", alt: true },
      { id: "ref",  tier: "T2", name: "Umicore Kokkola",   region: "FI" },
      { id: "cath", tier: "T1", name: "POSCO Gwangyang",   region: "KR" },
      { id: "cell", tier: "T1", name: "LGES Holland",      region: "US" },
      { id: "cust", tier: "T0", name: "Helios Grid",       region: "US", customer: true },
    ];
  }, [scenario]);

  return (
    <div className="console-frame">
      <div className="cf-chrome">
        <span className="cf-dot" /><span className="cf-dot" /><span className="cf-dot" />
        <span className="cf-title">Operations Console · {scenario.headline}</span>
      </div>
      <div className="cf-bom">
        <div className="cf-bom-row"><span className="cf-k">BOM</span><span className="cf-v">{scenario.sku}</span></div>
        <div className="cf-bom-row"><span className="cf-k">Customer</span><span className="cf-v">{scenario.customer}</span></div>
        <div className="cf-bom-row"><span className="cf-k">Volume</span><span className="cf-v">{scenario.units}</span></div>
      </div>
      <div className="cf-graph">
        <div className="cf-graph-head">Supplier graph · 3 tiers</div>
        <div className="cf-graph-body">
          {["T3","T2","T1","T0"].map(tier => {
            const items = NODES.filter(n => n.tier === tier);
            return (
              <div className="cf-tier" key={tier}>
                <span className="cf-tier-label">{tier}</span>
                <div className="cf-tier-nodes">
                  {items.map(n => {
                    const showAlt = n.alt && step >= 2;
                    const riskLive = n.risk && step >= 0;
                    const cls = `cf-node ${riskLive ? "risk" : ""} ${showAlt ? "alt-on" : (n.alt ? "alt-off" : "")} ${n.customer ? "customer" : ""}`;
                    return (
                      <div key={n.id} className={cls}>
                        <span className="cfn-name">{n.name}</span>
                        <span className="cfn-region">{n.region}</span>
                        {n.risk && <span className="cfn-badge">!</span>}
                        {n.alt && showAlt && <span className="cfn-rerouted">REROUTED</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cf-foot">
        <div className="cff-cell">
          <span className="cff-k">Exposure</span>
          <span className="cff-v danger">{scenario.impact}</span>
        </div>
        <div className="cff-cell">
          <span className="cff-k">Auto-recovered</span>
          <span className="cff-v ok">{step >= 4 ? scenario.saved : "—"}</span>
        </div>
        <div className="cff-cell">
          <span className="cff-k">Status</span>
          <span className={`cff-v ${step >= 4 ? "ok" : "warn"}`}>{step >= 4 ? "Resolved" : "Active"}</span>
        </div>
      </div>
    </div>
  );
}

// Right side — scene card stack (LEGACY, unused)
function _LegacySceneCards({ scenario, step, current }) {
  return (
    <div className="scene-stack">
      <div className="ss-stage">
        {scenario.scenes.map((s, i) => {
          const offset = i - step;
          let cls = "ss-card";
          if (offset === 0) cls += " ss-active";
          else if (offset < 0) cls += " ss-past";
          else cls += " ss-future";
          // limit how many are visible behind
          if (Math.abs(offset) > 2) cls += " ss-hidden";
          return (
            <div key={i} className={cls} style={{ "--ofs": offset }}>
              <div className="ss-card-head">
                <span className={`ss-tag tag-${s.k.toLowerCase()}`}>{s.k}</span>
                <span className="ss-time">{s.t}</span>
              </div>
              <h3 className="ss-title">{s.title}</h3>
              <p className="ss-body">{s.body}</p>
              <div className="ss-chips">
                {s.chips.map((c, j) => <span key={j} className="ss-chip">{c}</span>)}
              </div>
              <div className="ss-card-footnote">
                Scene {i + 1} of {scenario.scenes.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Narrative ribbon (LEGACY, unused)
function _LegacyNarrativeRibbon({ scenario, step }) {
  const NARRATIVES = {
    semiconductor: [
      "An ERP feed twitches at 4 in the morning. Most teams find out at standup, three days later.",
      "The agent has already cross-referenced TSMC's wafer-out forecast and figured out who's actually impacted — your customer, your line, your quarter.",
      "Knowing an alternate exists isn't enough. The agent verified Shinko passed your March audit and has free capacity right now.",
      "Re-routes that look obvious on paper get killed by export controls. The agent re-checks EAR every quarter — a re-route legal in March may not be in May.",
      "Procurement gets a one-click PO amendment. Your customer never sees the firefight. Audit trail is exported automatically.",
    ],
    space: [
      "An SEU screen failure is an ITAR-controlled event. Most teams open a Jira ticket. The agent opens a re-route plan.",
      "Trace forward from a single failed lot to every flight unit affected — across bonded inventory and three integrators.",
      "RAD750 isn't a clone of RTG4, but the agent already mapped pin-compatibility and harness implications.",
      "Defense supply chains live or die on Cat XV. The agent files the TAA amendment in the same loop.",
      "Launch windows are the only thing that matters. Slip absorbed, integration float held.",
    ],
    battery: [
      "Spot price moves at 2pm on a Tuesday. Your CFO sees it next earnings call.",
      "Within 30 seconds the agent has a cell-cost delta that's accurate to your specific BOM.",
      "IRA §45X eligibility is the difference between a $96M margin hit and absorbing it. The agent checks it for you.",
      "POSCO already qualified your cathode. No second qualification cycle, no requalification cost.",
      "The customer never knows. Your buffer holds. Margin impact $-2.1M.",
    ],
  };

  const lines = NARRATIVES[Object.keys(SCENARIOS).find(k => SCENARIOS[k] === scenario)] || NARRATIVES.semiconductor;
  const quote = lines[step] || lines[0];

  return (
    <div className="narrative">
      <div className="nr-bar" />
      <div className="nr-content">
        <span className="nr-label">Why it matters</span>
        <p className="nr-text">{quote}</p>
      </div>
    </div>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
function HowItWorks() {
  const steps = [
    { n: "01", t: "Ingest your BOM", d: "Drop in your bill of materials, ERP feeds, contracts. We normalize part numbers down to wafer lots and substrate codes." },
    { n: "02", t: "Map three tiers down", d: "We crawl every supplier's supplier — substrate vendors, optical baffles, cathode powder, propellant valves — until we hit raw inputs." },
    { n: "03", t: "Watch every signal", d: "Customs filings, satellite imagery of fab parking lots, ERP allocation feeds, supplier earnings calls, sanctions lists. Live." },
    { n: "04", t: "Reason and re-route", d: "When a node moves, the agent identifies qualified alternates, checks export controls, and proposes a re-route with a full audit trail." },
  ];
  return (
    <section className="section how" id="how">
      <div className="section-head">
        <span className="kicker">04 · How it works</span>
        <h2 className="h2">From spec to signed PO in four moves.</h2>
      </div>
      <div className="how-grid">
        {steps.map(s => (
          <div className="how-card" key={s.n}>
            <span className="how-n">{s.n}</span>
            <h3 className="how-t">{s.t}</h3>
            <p className="how-d">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// VERTICALS
// ============================================================
function Verticals() {
  const v = [
    { name: "Semiconductors", ex: "HBM, CoWoS, ABF substrate, rad-hard FPGAs" },
    { name: "Aerospace",      ex: "Star trackers, propellant valves, rad-hard CPUs" },
    { name: "Defense",        ex: "ITAR Cat XV, Cat IV, dual-use components" },
    { name: "Robotics",       ex: "Harmonic drives, lidar, custom silicon" },
    { name: "Energy",         ex: "Cathode/anode, separator film, BMS chips" },
    { name: "Biotech hardware", ex: "Cryo-EM, sequencer optics, microfluidics" },
  ];
  return (
    <section className="section verticals" id="verticals">
      <div className="section-head">
        <span className="kicker">05 · Verticals</span>
        <h2 className="h2">Built for the hard ones.</h2>
        <p className="section-sub">Deep-tech supply chains share a structure: long lead times, single-source nodes, export-controlled inputs. We built for that shape.</p>
      </div>
      <div className="vertical-grid">
        {v.map((x, i) => (
          <div className="vertical-card" key={x.name}>
            <span className="vertical-num">0{i + 1}</span>
            <h3 className="vertical-name">{x.name}</h3>
            <p className="vertical-ex">{x.ex}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// NUMBERS
// ============================================================
function Numbers() {
  return (
    <section className="section numbers">
      <div className="numbers-grid">
        <div className="num-card"><div className="num-v">22ms</div><div className="num-k">median agent decision</div></div>
        <div className="num-card"><div className="num-v">14,000+</div><div className="num-k">parts indexed across deep-tech BOMs</div></div>
        <div className="num-card"><div className="num-v">3 tiers</div><div className="num-k">deep — not just direct suppliers</div></div>
        <div className="num-card"><div className="num-v">SOC 2 + ITAR</div><div className="num-k">in progress, audit Q3</div></div>
      </div>
    </section>
  );
}

// ============================================================
// CTA
// ============================================================
function CTA() {
  return (
    <section className="section cta-section" id="cta">
      <div className="cta-card">
        <span className="kicker dark">Get in touch</span>
        <h2 className="h2 cta-h">If you're building hardware that matters, we'd like to plug in.</h2>
        <p className="cta-sub">We're working with a small set of design partners across semiconductors, space, and energy. Roll-out takes about two weeks.</p>
        <form className="cta-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks — we'll be in touch."); }}>
          <input type="email" placeholder="you@company.com" required />
          <input type="text" placeholder="Company" required />
          <button type="submit" className="btn-primary lg">Request access →</button>
        </form>
        <div className="cta-meta">
          <span>SOC 2 Type II · Q3 '26</span><span>·</span>
          <span>ITAR registered</span><span>·</span>
          <span>Backed by deep-tech operators</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="footer-row">
        <div className="footer-brand"><Logo /><span>{name}</span></div>
        <div className="footer-links">
          <a href="#">Platform</a><a href="#">Security</a><a href="#">Compliance</a><a href="#">Contact</a>
        </div>
        <div className="footer-fine">© 2026 {name}, Inc. · Made for hard hardware.</div>
      </div>
    </footer>
  );
}

// ============================================================
// TWEAKS
// ============================================================
function TweaksUI({ tweaks, setTweak }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakText } = window;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Brand">
        <TweakText label="Company name" value={tweaks.companyName} onChange={(v) => setTweak("companyName", v)} />
      </TweakSection>
      <TweakSection title="Color palette">
        <TweakRadio
          value={tweaks.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "paper",    label: "Paper" },
            { value: "fog",      label: "Fog" },
            { value: "sage",     label: "Sage" },
            { value: "midnight", label: "Midnight" },
          ]}
        />
      </TweakSection>
      <TweakSection title="Demo scenario">
        <TweakRadio
          value={tweaks.scenario}
          onChange={(v) => setTweak("scenario", v)}
          options={[
            { value: "semiconductor", label: "Chips" },
            { value: "space",         label: "Space" },
            { value: "battery",       label: "Energy" },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

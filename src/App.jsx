import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

const CRISES = ["COVID-19", "Ukraine-Russia", "Hormuz/Iran"];
const C = {
  "COVID-19": { primary: "#d94f00", light: "#ff8a4c", bg: "#fff5f0" },
  "Ukraine-Russia": { primary: "#1a6dd4", light: "#6aadff", bg: "#f0f5ff" },
  "Hormuz/Iran": { primary: "#7b2d8e", light: "#c578d9", bg: "#f8f0ff" },
};
const REL = "#0f766e";
const NR = "#94a3b8";
const HARM = "#dc2626";
const LIB = "#16a34a";

const intensity = [
  { Crisis: "COVID-19", Total: 409, Relevant: 346, NonRelevant: 63, Ratio: 0.846 },
  { Crisis: "Ukraine-Russia", Total: 473, Relevant: 242, NonRelevant: 231, Ratio: 0.5116 },
  { Crisis: "Hormuz/Iran", Total: 640, Relevant: 117, NonRelevant: 523, Ratio: 0.1828 },
];

const instrumentRel = {
  "COVID-19": [
    { t: "Import tariff", n: 66 }, { t: "Export ban", n: 66 }, { t: "Export licensing", n: 43 },
    { t: "State loan", n: 27 }, { t: "Internal tax imports", n: 24 }, { t: "Tax/social relief", n: 22 },
    { t: "Financial grant", n: 19 }, { t: "Loan guarantee", n: 12 },
  ],
  "Ukraine-Russia": [
    { t: "Capital controls", n: 86 }, { t: "Export ban", n: 44 }, { t: "Import ban", n: 20 },
    { t: "Export licensing", n: 10 }, { t: "Financial grant", n: 9 }, { t: "Import tariff", n: 8 },
    { t: "State loan", n: 5 }, { t: "Anti-dumping", n: 4 },
  ],
  "Hormuz/Iran": [
    { t: "Tax/social relief", n: 14 }, { t: "Capital controls", n: 13 }, { t: "Export ban", n: 11 },
    { t: "Financial grant", n: 10 }, { t: "Production subsidy", n: 8 }, { t: "State loan", n: 7 },
    { t: "Export tax", n: 7 }, { t: "Import tariff", n: 4 },
  ],
};

const sectoral = [
  { Crisis: "COVID-19", Group: "Relevant", Sectoral: 0.841, Horizontal: 0.159 },
  { Crisis: "COVID-19", Group: "Non-relevant", Sectoral: 0.952, Horizontal: 0.048 },
  { Crisis: "Ukraine-Russia", Group: "Relevant", Sectoral: 0.851, Horizontal: 0.149 },
  { Crisis: "Ukraine-Russia", Group: "Non-relevant", Sectoral: 0.944, Horizontal: 0.056 },
  { Crisis: "Hormuz/Iran", Group: "Relevant", Sectoral: 0.940, Horizontal: 0.060 },
  { Crisis: "Hormuz/Iran", Group: "Non-relevant", Sectoral: 0.941, Horizontal: 0.059 },
];

const hhi = [
  { name: "COVID-19", Relevant: 0.0184, "Non-relevant": 0.0073 },
  { name: "Ukraine-Russia", Relevant: 0.0049, "Non-relevant": 0.0066 },
  { name: "Hormuz/Iran", Relevant: 0.0082, "Non-relevant": 0.0051 },
];

const topSectors = {
  "COVID-19": [
    { code: "352", label: "Pharmaceuticals", n: 110 },
    { code: "271", label: "Pulp & paper", n: 106 },
    { code: "481", label: "Motor vehicles", n: 97 },
    { code: "282", label: "Knitted fabrics", n: 96 },
    { code: "362", label: "Optical instr.", n: 91 },
  ],
  "Ukraine-Russia": [
    { code: "447", label: "Coke & ref. petrol.", n: 65 },
    { code: "472", label: "Iron & steel", n: 58 },
    { code: "482", label: "Vehicle parts", n: 58 },
    { code: "491", label: "Ships & boats", n: 57 },
    { code: "493", label: "Aircraft", n: 56 },
  ],
  "Hormuz/Iran": [
    { code: "333", label: "Petroleum & gas", n: 43 },
    { code: "120", label: "Live animals", n: 22 },
    { code: "652", label: "Telecom services", n: 16 },
    { code: "675", label: "Transport support", n: 14 },
    { code: "671", label: "Cargo handling", n: 14 },
  ],
};

const topHS = {
  "COVID-19": [
    { hs: "630790", label: "Textile articles", n: 96 }, { hs: "380894", label: "Disinfectants", n: 73 },
    { hs: "401512", label: "Surgical gloves", n: 71 }, { hs: "401519", label: "Rubber gloves", n: 71 },
    { hs: "300490", label: "Medicaments", n: 65 }, { hs: "621010", label: "Nonwoven garments", n: 65 },
    { hs: "392620", label: "Plastic apparel", n: 63 }, { hs: "900490", label: "Goggles", n: 62 },
    { hs: "300460", label: "Antimalarials", n: 61 }, { hs: "902000", label: "Breathing app.", n: 61 },
  ],
  "Ukraine-Russia": [
    { hs: "271020", label: "Petroleum oils", n: 51 }, { hs: "271019", label: "Other petrol. oils", n: 50 },
    { hs: "271012", label: "Light oils", n: 49 }, { hs: "271111", label: "LNG", n: 44 },
    { hs: "270900", label: "Crude petroleum", n: 39 }, { hs: "271112", label: "Propane", n: 39 },
    { hs: "271113", label: "Butane", n: 39 }, { hs: "271114", label: "Ethylene/propylene", n: 39 },
    { hs: "271119", label: "Other petrol. gases", n: 39 }, { hs: "271129", label: "Petrol. gases (o.)", n: 39 },
  ],
  "Hormuz/Iran": [
    { hs: "271019", label: "Other petrol. oils", n: 38 }, { hs: "271012", label: "Light oils", n: 35 },
    { hs: "271020", label: "Petroleum oils", n: 21 }, { hs: "270900", label: "Crude petroleum", n: 16 },
    { hs: "271112", label: "Propane", n: 12 }, { hs: "271113", label: "Butane", n: 12 },
    { hs: "271111", label: "LNG", n: 11 }, { hs: "271119", label: "Other petrol. gases", n: 11 },
    { hs: "271091", label: "Waste oils", n: 11 }, { hs: "271099", label: "Other waste oils", n: 10 },
  ],
};

const evaluation = [
  { Crisis: "COVID-19", Group: "Relevant", Harmful: 0.673, Lib: 0.327, hN: 233, lN: 113 },
  { Crisis: "COVID-19", Group: "Non-relevant", Harmful: 0.556, Lib: 0.444, hN: 35, lN: 28 },
  { Crisis: "Ukraine-Russia", Group: "Relevant", Harmful: 0.946, Lib: 0.054, hN: 229, lN: 13 },
  { Crisis: "Ukraine-Russia", Group: "Non-relevant", Harmful: 0.801, Lib: 0.199, hN: 185, lN: 46 },
  { Crisis: "Hormuz/Iran", Group: "Relevant", Harmful: 0.709, Lib: 0.291, hN: 83, lN: 34 },
  { Crisis: "Hormuz/Iran", Group: "Non-relevant", Harmful: 0.795, Lib: 0.205, hN: 416, lN: 107 },
];

const jurisdictionSummary = [
  { Crisis: "COVID-19", unique: 95, total: 428 },
  { Crisis: "Ukraine-Russia", unique: 91, total: 1066 },
  { Crisis: "Hormuz/Iran", unique: 34, total: 117 },
];

const pace = {
  "COVID-19": [
    { w: 1, n: 39 }, { w: 2, n: 86 }, { w: 3, n: 83 }, { w: 4, n: 75 },
    { w: 5, n: 28 }, { w: 6, n: 12 }, { w: 7, n: 13 }, { w: 8, n: 9 }, { w: 9, n: 1 },
  ],
  "Ukraine-Russia": [
    { w: 1, n: 68 }, { w: 2, n: 43 }, { w: 3, n: 32 }, { w: 4, n: 22 },
    { w: 5, n: 23 }, { w: 6, n: 21 }, { w: 7, n: 21 }, { w: 8, n: 11 }, { w: 9, n: 1 },
  ],
  "Hormuz/Iran": [
    { w: 1, n: 15 }, { w: 2, n: 12 }, { w: 3, n: 24 }, { w: 4, n: 18 },
    { w: 5, n: 16 }, { w: 6, n: 14 }, { w: 7, n: 18 },
  ],
};

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12, lineHeight: 1.6, boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i}><span style={{ color: p.color }}>{p.name}</span>: {typeof p.value === "number" && p.value < 1 && p.value > 0 ? (p.value * 100).toFixed(2) + "%" : p.value}</div>
      ))}
    </div>
  );
};

const Section = ({ num, title, subtitle, children }) => (
  <div style={{ marginBottom: 40, background: "#fff", borderRadius: 14, border: "1px solid #e8ecf1", padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: "#1e293b", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{num}</span>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a", fontFamily: "'Instrument Serif', Georgia, serif" }}>{title}</h2>
    </div>
    {subtitle && <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 40px" }}>{subtitle}</p>}
    <div style={{ marginTop: 20 }}>{children}</div>
  </div>
);

const CTag = ({ c }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: C[c].bg, color: C[c].primary, border: `1px solid ${C[c].light}40` }}>{c}</span>
);

const HBar = ({ crisis, data, dataKey, max, labelKey }) => (
  <div style={{ flex: 1, minWidth: 260 }}>
    <div style={{ marginBottom: 10 }}><CTag c={crisis} /></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b", width: 110, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flexShrink: 0 }}>{d[labelKey]}</span>
          <div style={{ flex: 1, height: 22, borderRadius: 5, background: `${C[crisis].primary}12` }}>
            <div style={{
              height: "100%", borderRadius: 5, background: C[crisis].primary,
              width: `${Math.max((d[dataKey] / max) * 100, 4)}%`,
              display: "flex", alignItems: "center", paddingLeft: 8,
              color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 28,
            }}>{d[dataKey]}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StackBar = ({ label, val1, val2, c1, c2, l1, l2, n }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 3 }}>{label}{n ? ` (n=${n})` : ""}</div>
    <div style={{ display: "flex", height: 22, borderRadius: 5, overflow: "hidden" }}>
      <div style={{ width: `${val1 * 100}%`, background: c1, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{(val1 * 100).toFixed(1)}%</div>
      <div style={{ width: `${val2 * 100}%`, background: c2, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>{(val2 * 100).toFixed(1)}%</div>
    </div>
  </div>
);

export default function Dashboard() {
  const paceData = [];
  for (let w = 1; w <= 9; w++) {
    const row = { week: `W${w}` };
    CRISES.forEach(c => { const found = pace[c].find(p => p.w === w); row[c] = found ? found.n : null; });
    paceData.push(row);
  }

  const maxInstr = Math.max(...Object.values(instrumentRel).flat().map(d => d.n));
  const maxSector = Math.max(...Object.values(topSectors).flat().map(d => d.n));
  const maxHS = Math.max(...Object.values(topHS).flat().map(d => d.n));

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", maxWidth: 1040, margin: "0 auto", padding: "36px 24px", color: "#0f172a", background: "#f7f9fb", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Serif&display=swap" rel="stylesheet" />

      <header style={{ marginBottom: 44, textAlign: "center" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Instrument Serif', Georgia, serif", letterSpacing: "-0.02em" }}>Crisis Trade Policy Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Comparative analysis across three crisis windows — GTA data</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {CRISES.map(c => <CTag key={c} c={c} />)}
          <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginLeft: 8 }}>All panels show all 3 crises simultaneously</span>
        </div>
      </header>

      {/* 1 */}
      <Section num={1} title="Crisis Response Intensity Ratio" subtitle="Relevant crisis interventions ÷ total interventions in window">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {intensity.map(d => (
            <div key={d.Crisis} style={{ flex: 1, minWidth: 220, padding: 18, borderRadius: 10, background: C[d.Crisis].bg, border: `1px solid ${C[d.Crisis].light}30` }}>
              <CTag c={d.Crisis} />
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: C[d.Crisis].primary, fontFamily: "'DM Mono', monospace" }}>{(d.Ratio * 100).toFixed(1)}%</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{d.Relevant} relevant / {d.Total} total</div>
                </div>
                <div style={{ width: 56, height: 56 }}>
                  <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={C[d.Crisis].primary} strokeWidth="3.5" strokeDasharray={`${d.Ratio * 100} ${100 - d.Ratio * 100}`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2 */}
      <Section num={2} title="Instrument-Type Composition" subtitle="Top 8 instrument types — relevant crisis interventions per window">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {CRISES.map(c => <HBar key={c} crisis={c} data={instrumentRel[c]} dataKey="n" max={maxInstr} labelKey="t" />)}
        </div>
      </Section>

      {/* 3 */}
      <Section num={3} title="Sectoral vs. Horizontal Interventions" subtitle="Share of sector-targeted vs. horizontal (no CPC) measures">
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 11, color: "#64748b", marginBottom: 8, gap: 16 }}>
          <span><span style={{ color: REL }}>■</span> Sectoral</span><span><span style={{ color: NR }}>■</span> Horizontal</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {CRISES.map(c => {
            const r = sectoral.find(s => s.Crisis === c && s.Group === "Relevant");
            const nr = sectoral.find(s => s.Crisis === c && s.Group === "Non-relevant");
            return (
              <div key={c} style={{ padding: 16, borderRadius: 10, border: "1px solid #e8ecf1" }}>
                <CTag c={c} />
                <div style={{ marginTop: 10 }}>
                  <StackBar label="Relevant" val1={r.Sectoral} val2={r.Horizontal} c1={REL} c2={NR} />
                  <StackBar label="Non-relevant" val1={nr.Sectoral} val2={nr.Horizontal} c1={REL} c2={NR} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 4 */}
      <Section num={4} title="Sectoral Concentration Index (HHI)" subtitle="Lower HHI = more diversified across CPC sectors (excl. horizontal)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={hhi} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v.toFixed(3)} />
            <Tooltip content={<TT />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Relevant" fill={REL} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Non-relevant" fill={NR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* 5 */}
      <Section num={5} title="Top 5 Affected CPC Sectors" subtitle="Relevant crisis interventions only — all three windows">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {CRISES.map(c => (
            <HBar key={c} crisis={c} data={topSectors[c].map(d => ({ ...d, display: `${d.code} ${d.label}` }))} dataKey="n" max={maxSector} labelKey="display" />
          ))}
        </div>
      </Section>

      {/* 6 */}
      <Section num={6} title="Top 10 Affected HS Codes" subtitle="Relevant crisis interventions only — all three windows">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {CRISES.map(c => (
            <HBar key={c} crisis={c} data={topHS[c].map(d => ({ ...d, display: `${d.hs} ${d.label}` }))} dataKey="n" max={maxHS} labelKey="display" />
          ))}
        </div>
      </Section>

      {/* 7 */}
      <Section num={7} title="Evaluation Split: Harmful vs. Liberalising" subtitle="Red/Amber = harmful · Green = liberalising">
        <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 11, color: "#64748b", marginBottom: 8, gap: 16 }}>
          <span><span style={{ color: HARM }}>■</span> Harmful</span><span><span style={{ color: LIB }}>■</span> Liberalising</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {CRISES.map(c => {
            const r = evaluation.find(e => e.Crisis === c && e.Group === "Relevant");
            const nr = evaluation.find(e => e.Crisis === c && e.Group === "Non-relevant");
            return (
              <div key={c} style={{ padding: 16, borderRadius: 10, border: "1px solid #e8ecf1" }}>
                <CTag c={c} />
                <div style={{ marginTop: 10 }}>
                  <StackBar label="Relevant" val1={r.Harmful} val2={r.Lib} c1={HARM} c2={LIB} n={r.hN + r.lN} />
                  <StackBar label="Non-relevant" val1={nr.Harmful} val2={nr.Lib} c1={HARM} c2={LIB} n={nr.hN + nr.lN} />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title="Implementing Jurisdiction Concentration" subtitle="Unique countries with relevant crisis interventions">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {jurisdictionSummary.map(d => (
            <div key={d.Crisis} style={{ flex: 1, minWidth: 220, padding: 18, borderRadius: 10, background: C[d.Crisis].bg, border: `1px solid ${C[d.Crisis].light}30`, textAlign: "center" }}>
              <CTag c={d.Crisis} />
              <div style={{ fontSize: 38, fontWeight: 800, color: C[d.Crisis].primary, fontFamily: "'DM Mono', monospace", marginTop: 10 }}>{d.unique}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>unique countries</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{d.total} country-interventions</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="Temporal Pace of Response" subtitle="Relevant crisis interventions by week within each 2-month window (all 3 overlaid)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={paceData} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<TT />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {CRISES.map(c => (
              <Line key={c} dataKey={c} stroke={C[c].primary} strokeWidth={2.5} dot={{ r: 4, fill: C[c].primary }} activeDot={{ r: 6 }} connectNulls={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <footer style={{ textAlign: "center", padding: "16px 0 40px", fontSize: 12, color: "#94a3b8" }}>
        Data: Global Trade Alert · COVID-19 (11 Mar–11 May 2020) · Ukraine-Russia (24 Feb–24 Apr 2022) · Hormuz/Iran (28 Feb–28 Apr 2026)
      </footer>
    </div>
  );
}

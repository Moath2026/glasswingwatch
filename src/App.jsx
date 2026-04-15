import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CVE_DATA = [
  { id: "CVE-2026-4747", software: "FreeBSD NFS", age: "17 years", severity: "CRITICAL", status: "Unpatched", desc: "Unauthenticated RCE → root access on NFS servers", category: "OS" },
  { id: "CVE-2026-3891", software: "OpenBSD", age: "27 years", severity: "HIGH", status: "In Progress", desc: "Firewall bypass via malformed packet sequence", category: "OS" },
  { id: "CVE-2026-4102", software: "FFmpeg", age: "16 years", severity: "HIGH", status: "Patched", desc: "Memory corruption in video decode pipeline", category: "Media" },
  { id: "CVE-2026-4298", software: "Chrome V8", age: "4 years", severity: "CRITICAL", status: "Unpatched", desc: "Sandbox escape via JIT compiler bug", category: "Browser" },
  { id: "CVE-2026-3744", software: "Linux Kernel", age: "11 years", severity: "CRITICAL", status: "Unpatched", desc: "Local privilege escalation via eBPF verifier", category: "OS" },
  { id: "CVE-2026-4501", software: "OpenSSL", age: "8 years", severity: "HIGH", status: "In Progress", desc: "TLS session hijack via timing side-channel", category: "Crypto" },
  { id: "CVE-2026-4612", software: "Windows NTFS", age: "14 years", severity: "CRITICAL", status: "Unpatched", desc: "Local privilege escalation via NTFS junction", category: "OS" },
  { id: "CVE-2026-4189", software: "Safari WebKit", age: "3 years", severity: "HIGH", status: "Patched", desc: "Universal XSS via malformed CSS parser", category: "Browser" },
  { id: "CVE-2026-4823", software: "Apache httpd", age: "9 years", severity: "HIGH", status: "Unpatched", desc: "Remote code execution via mod_lua buffer overflow", category: "Server" },
  { id: "CVE-2026-3999", software: "glibc", age: "12 years", severity: "CRITICAL", status: "In Progress", desc: "Heap overflow in DNS resolver affecting all Linux distros", category: "OS" },
  { id: "CVE-2026-4330", software: "OpenSSH", age: "6 years", severity: "HIGH", status: "Patched", desc: "Authentication bypass via race condition", category: "Crypto" },
  { id: "CVE-2026-4455", software: "Firefox SpiderMonkey", age: "5 years", severity: "CRITICAL", status: "Unpatched", desc: "Type confusion vulnerability allowing arbitrary code execution", category: "Browser" },
  { id: "CVE-2026-4690", software: "curl/libcurl", age: "10 years", severity: "HIGH", status: "Patched", desc: "HTTP/2 header injection enabling SSRF", category: "Server" },
  { id: "CVE-2026-4771", software: "systemd", age: "7 years", severity: "HIGH", status: "Unpatched", desc: "Privilege escalation via unit file parsing", category: "OS" },
  { id: "CVE-2026-4900", software: "macOS XPC", age: "5 years", severity: "CRITICAL", status: "In Progress", desc: "IPC privilege escalation bypassing SIP protection", category: "OS" },
];

const SEVERITY_COLORS = { CRITICAL: "#ef4444", HIGH: "#FF6B35", MEDIUM: "#eab308" };
const STATUS_COLORS = { Patched: "#22c55e", Unpatched: "#ef4444", "In Progress": "#eab308" };

const STATS = [
  { label: "Total CVEs Found", value: "4,847", color: "#FF6B35", icon: "🔍" },
  { label: "Patched", value: "142", sub: "2.9%", color: "#22c55e", icon: "✅" },
  { label: "Unpatched", value: "4,705", sub: "97.1%", color: "#ef4444", icon: "🚨" },
  { label: "Critical Severity", value: "891", color: "#ef4444", icon: "💀" },
];

const CHART_DATA = [
  { name: "Patched", value: 142, color: "#22c55e" },
  { name: "In Progress", value: 312, color: "#eab308" },
  { name: "Unpatched", value: 4393, color: "#ef4444" },
];

const CATEGORIES = ["All", "OS", "Browser", "Crypto", "Server", "Media"];
const SEVERITIES = ["All", "CRITICAL", "HIGH", "MEDIUM"];
const STATUSES = ["All", "Unpatched", "In Progress", "Patched"];

export default function App() {
  const [catFilter, setCatFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = CVE_DATA.filter(c =>
    (catFilter === "All" || c.category === catFilter) &&
    (sevFilter === "All" || c.severity === sevFilter) &&
    (statusFilter === "All" || c.status === statusFilter) &&
    (search === "" || c.id.toLowerCase().includes(search.toLowerCase()) || c.software.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const c = { bg: "#121212", card: "#1E1E1E", sidebar: "#2D2D2D", border: "#333", accent: "#FF6B35", text: "#fff", sub: "#9ca3af" };

  const FilterBtn = ({ val, cur, set }) => (
    <button onClick={() => set(val)} style={{ background: cur === val ? c.accent : c.sidebar, color: cur === val ? "#fff" : c.sub, border: `1px solid ${cur === val ? c.accent : c.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{val}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: c.accent }}>🦋 GlasswingWatch</div>
          <div style={{ background: "#22c55e22", border: "1px solid #22c55e", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            LIVE TRACKING
          </div>
        </div>
        <div style={{ fontSize: 13, color: c.sub, textAlign: "right" }}>
          <div>Project Glasswing — Anthropic × CVE Tracker</div>
          <div style={{ fontSize: 11, marginTop: 2 }}>⚠️ Simulated data for demonstration purposes</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: c.card, borderRadius: 12, padding: 20, border: `1px solid ${c.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: c.sub, marginTop: 4 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: 11, color: s.color, marginTop: 2, fontWeight: 600 }}>{s.sub} of total</div>}
            </div>
          ))}
        </div>

        {/* Chart + Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16, marginBottom: 32 }}>
          {/* Donut */}
          <div style={{ background: c.card, borderRadius: 12, padding: 24, border: `1px solid ${c.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Patch Progress</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={CHART_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {CHART_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} CVEs`, n]} contentStyle={{ background: c.sidebar, border: `1px solid ${c.border}`, borderRadius: 8, color: c.text }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
              {CHART_DATA.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                  <span style={{ color: c.sub }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glasswing Info */}
          <div style={{ background: c.card, borderRadius: 12, padding: 24, border: `1px solid ${c.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🔬 What is Project Glasswing?</div>
            <p style={{ fontSize: 13, color: c.sub, lineHeight: 1.7, marginBottom: 12 }}>
              On April 7, 2026, Anthropic unveiled <strong style={{ color: c.text }}>Claude Mythos Preview</strong> — their most powerful AI model ever built. Before any public release, they used it to autonomously scan critical software worldwide.
            </p>
            <p style={{ fontSize: 13, color: c.sub, lineHeight: 1.7, marginBottom: 16 }}>
              The model discovered <strong style={{ color: "#ef4444" }}>thousands of previously unknown zero-day vulnerabilities</strong> — some over 27 years old — across every major OS, browser, and infrastructure stack. Anthropic deemed Mythos <strong style={{ color: c.text }}>too dangerous to release publicly</strong>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { k: "Initiative Budget", v: "$100M" },
                { k: "Partners", v: "Apple, Google, Microsoft+" },
                { k: "Model Used", v: "Claude Mythos Preview" },
                { k: "Public Access", v: "❌ Restricted" },
              ].map(item => (
                <div key={item.k} style={{ background: "#2D2D2D", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: c.sub }}>{item.k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: c.card, borderRadius: 12, padding: 16, border: `1px solid ${c.border}`, marginBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search CVE ID, software, description..." style={{ flex: 1, minWidth: 200, background: c.sidebar, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 12px", color: c.text, fontSize: 13, outline: "none" }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map(v => <FilterBtn key={v} val={v} cur={catFilter} set={setCatFilter} />)}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SEVERITIES.map(v => <FilterBtn key={v} val={v} cur={sevFilter} set={setSevFilter} />)}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUSES.map(v => <FilterBtn key={v} val={v} cur={statusFilter} set={setStatusFilter} />)}
            </div>
          </div>
        </div>

        {/* CVE Table */}
        <div style={{ background: c.card, borderRadius: 12, border: `1px solid ${c.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${c.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>🛡️ CVE Disclosure Feed</div>
            <div style={{ fontSize: 12, color: c.sub }}>Showing {filtered.length} of {CVE_DATA.length} entries</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#2D2D2D" }}>
                  {["CVE ID", "Software", "Bug Age", "Severity", "Status", "Description"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: c.sub, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cve, i) => (
                  <tr key={cve.id} style={{ borderBottom: `1px solid ${c.border}`, background: i % 2 === 0 ? "transparent" : "#1A1A1A", transition: "background 0.15s", cursor: "default" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#2D2D2D"}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "#1A1A1A"}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: c.accent, whiteSpace: "nowrap" }}>{cve.id}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{cve.software}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#eab308", whiteSpace: "nowrap" }}>{cve.age}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: `${SEVERITY_COLORS[cve.severity]}22`, color: SEVERITY_COLORS[cve.severity], borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>{cve.severity}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: `${STATUS_COLORS[cve.status]}22`, color: STATUS_COLORS[cve.status], borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{cve.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: c.sub, maxWidth: 300 }}>{cve.desc}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: c.sub }}>No CVEs match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0", color: c.sub, fontSize: 12 }}>
          GlasswingWatch • Built for the AI Security Community • Data is simulated for demonstration • April 2026
        </div>
      </div>
    </div>
  );
}

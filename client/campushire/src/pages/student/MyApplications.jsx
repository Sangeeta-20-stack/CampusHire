import { useEffect, useState } from "react";
import {
  getMyApplications,
  applyJob,
  updateRound,
  scheduleInterview,
} from "../../api/application";

import {
  FiBriefcase, FiRefreshCw, FiCheckCircle, FiCalendar,
  FiAlertCircle, FiInbox, FiChevronRight, FiClock,
  FiLoader,
} from "react-icons/fi";

/* ── Tokens ───────────────────────────────────────────────────── */
const T = {
  bg:          "#f5f8f5",
  surface:     "#ffffff",
  primary:     "#4a7c59",
  primaryDark: "#2f5c3d",
  accent:      "#e8f4ec",
  border:      "#ddeae0",
  muted:       "#718f79",
  text:        "#1c2e22",
  subtle:      "#f0f6f1",
  font:        "'Outfit', 'DM Sans', 'Segoe UI', sans-serif",
};

const STATUS = {
  Applied:      { bg: "#f1f5f9", color: "#475569", label: "Applied" },
  "In Progress":{ bg: "#eff6ff", color: "#2563eb", label: "In Progress" },
  Selected:     { bg: "#f0fdf4", color: "#16a34a", label: "Selected" },
  Rejected:     { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
};

/* ── Skeleton ─────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .sk{background:linear-gradient(90deg,#ddeae0 25%,#f0f6f1 50%,#ddeae0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:7px}
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div className="sk" style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
              <div className="sk" style={{ height: 13, width: "35%" }} />
              <div className="sk" style={{ height: 11, width: "20%" }} />
            </div>
            <div className="sk" style={{ height: 24, width: 80, borderRadius: 99 }} />
            <div className="sk" style={{ height: 24, width: 60, borderRadius: 6 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {[72, 80, 72].map((w, j) => <div key={j} className="sk" style={{ height: 30, width: w, borderRadius: 8 }} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Status badge ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS["Applied"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 700, padding: "4px 10px",
      borderRadius: 99, background: s.bg, color: s.color,
      letterSpacing: ".03em", whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: s.color, flexShrink: 0,
      }} />
      {s.label}
    </span>
  );
}

/* ── Round pill ───────────────────────────────────────────────── */
function RoundPill({ round }) {
  if (!round && round !== 0) return <span style={{ fontSize: 12, color: T.muted }}>—</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600, padding: "4px 10px",
      borderRadius: 99, background: T.accent, color: T.primaryDark,
    }}>
      <FiChevronRight size={10} strokeWidth={3} />
      Round {round}
    </span>
  );
}

/* ── Action button ────────────────────────────────────────────── */
function ActionBtn({ onClick, Icon, label, variant = "outline", loading: busy }) {
  const [hov, setHov] = useState(false);

  const styles = {
    solid: {
      background: hov ? T.primaryDark : T.primary,
      color: "#fff", border: "none",
    },
    outline: {
      background: hov ? T.accent : "transparent",
      color: T.primary,
      border: `1.5px solid ${T.border}`,
    },
    blue: {
      background: hov ? "#eff6ff" : "transparent",
      color: "#2563eb",
      border: "1.5px solid #bfdbfe",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 12, fontWeight: 600, padding: "7px 12px",
        borderRadius: 8, cursor: busy ? "not-allowed" : "pointer",
        transition: "background .15s, border-color .15s",
        fontFamily: T.font, whiteSpace: "nowrap",
        opacity: busy ? .55 : 1,
        ...styles[variant],
      }}
    >
      {busy
        ? <FiLoader size={12} style={{ animation: "spin 1s linear infinite" }} />
        : <Icon size={12} strokeWidth={2.2} />
      }
      {label}
    </button>
  );
}

/* ── Row ──────────────────────────────────────────────────────── */
function AppRow({ app, onReapply, onPassRound, onSchedule }) {
  const [busyReapply,  setBusyReapply]  = useState(false);
  const [busyPass,     setBusyPass]     = useState(false);
  const [busySched,    setBusySched]    = useState(false);
  const [hov, setHov] = useState(false);

  const wrap = (setB, fn) => async () => {
    setB(true);
    try { await fn(); } finally { setB(false); }
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2fr 130px 100px auto",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        background: hov ? T.subtle : T.surface,
        borderBottom: `1px solid ${T.border}`,
        transition: "background .15s",
      }}
    >
      {/* Company */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9, flexShrink: 0,
          background: T.accent, border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: T.primary,
        }}>
          <FiBriefcase size={16} strokeWidth={1.8} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {app.jobId?.companyName || "—"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {app.jobId?.jobTitle || "—"}
          </p>
        </div>
      </div>

      {/* Role — visible on wider screens via grid */}
      <p style={{ margin: 0, fontSize: 13, color: T.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {app.jobId?.jobTitle || "—"}
      </p>

      {/* Status */}
      <div><StatusBadge status={app.status} /></div>

      {/* Round */}
      <div><RoundPill round={app.currentRound} /></div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <ActionBtn
          Icon={FiRefreshCw}  label="Re-apply"
          variant="solid"     loading={busyReapply}
          onClick={wrap(setBusyReapply, onReapply)}
        />
        <ActionBtn
          Icon={FiCheckCircle} label="Pass Round"
          variant="outline"    loading={busyPass}
          onClick={wrap(setBusyPass, onPassRound)}
        />
        <ActionBtn
          Icon={FiCalendar}  label="Schedule"
          variant="blue"     loading={busySched}
          onClick={wrap(setBusySched, onSchedule)}
        />
      </div>
    </div>
  );
}

/* ══ Main ════════════════════════════════════════════════════════ */
export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => { fetchApps(); }, []);

  async function fetchApps() {
    setLoading(true);
    try {
      const res = await getMyApplications();
      setApplications(res.data);
      setError(null);
    } catch {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  const handleReapply      = (jobId)  => applyJob(jobId).then(fetchApps);
  const handlePassRound    = (appId)  => updateRound(appId, { status: "Passed" }).then(fetchApps);
  const handleSchedule     = (appId)  => scheduleInterview(appId, {
    interviewDate: new Date(),
    interviewMode: "Online",
    meetingLink:   "https://meet.google.com/test",
  }).then(fetchApps);

  /* summary counts */
  const total      = applications.length;
  const inProgress = applications.filter(a => a.status === "In Progress").length;
  const selected   = applications.filter(a => a.status === "Selected").length;
  const rejected   = applications.filter(a => a.status === "Rejected").length;

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", padding: "28px 20px", color: T.text }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-.025em" }}>My Applications</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted }}>
              Track and manage your job applications
            </p>
          </div>
          <button
            onClick={fetchApps}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              fontSize: 13, fontWeight: 600, padding: "9px 16px",
              borderRadius: 10, cursor: "pointer",
              background: T.accent, color: T.primaryDark,
              border: `1px solid ${T.border}`, fontFamily: T.font,
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.border}
            onMouseLeave={e => e.currentTarget.style.background = T.accent}
          >
            <FiRefreshCw size={13} strokeWidth={2.2} /> Refresh
          </button>
        </div>

        {/* ── Summary strip ── */}
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
            {[
              { label: "Total",       value: total,      color: T.text,    bg: T.subtle  },
              { label: "In Progress", value: inProgress, color: "#2563eb", bg: "#eff6ff" },
              { label: "Selected",    value: selected,   color: "#16a34a", bg: "#f0fdf4" },
              { label: "Rejected",    value: rejected,   color: "#dc2626", bg: "#fef2f2" },
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg, borderRadius: 12,
                padding: "14px 18px",
                border: `1px solid ${T.border}`,
              }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <Skeleton />}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 12 }}>
            <FiAlertCircle size={38} color="#ef4444" strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: "#b91c1c", fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && applications.length === 0 && (
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "64px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            color: T.muted,
          }}>
            <FiInbox size={40} strokeWidth={1.3} />
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>No applications yet</p>
            <p style={{ margin: 0, fontSize: 13 }}>Browse jobs and start applying to see them here.</p>
          </div>
        )}

        {/* ── Table ── */}
        {!loading && !error && applications.length > 0 && (
          <div style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(40,80,50,.06)",
          }}>
            {/* Table head */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 130px 100px auto",
              gap: 16,
              padding: "11px 20px",
              background: T.subtle,
              borderBottom: `1px solid ${T.border}`,
            }}>
              {["Company", "Role", "Status", "Round", "Actions"].map(h => (
                <p key={h} style={{
                  margin: 0, fontSize: 10, fontWeight: 700,
                  color: T.muted, textTransform: "uppercase", letterSpacing: ".06em",
                  ...(h === "Actions" ? { textAlign: "right" } : {}),
                }}>
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            {applications.map(app => (
              <AppRow
                key={app._id}
                app={app}
                onReapply={()   => handleReapply(app.jobId._id)}
                onPassRound={() => handlePassRound(app._id)}
                onSchedule={()  => handleSchedule(app._id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

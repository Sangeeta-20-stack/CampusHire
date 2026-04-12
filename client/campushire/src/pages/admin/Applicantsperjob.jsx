import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationsByJob, updateRound, scheduleInterview } from "../../api/application";
import { getJobById } from "../../api/job";
import {
  Users, ChevronLeft, ChevronRight, Search,
  FileText, Calendar, Layers, ChevronDown,
  RefreshCw, XCircle, AlertCircle, Award,
  CheckCircle,
} from "lucide-react";
import {
  T, card, font, PageHeader,
  GhostBtn, Badge, Spinner, Empty,
  STATUS_META,
} from "./shared";

/* ── Constants ─────────────────────────────────────────────────── */
const ALL_STATUSES = ["All", "Applied", "In Progress", "Selected", "Rejected"];

const STATUS_OPTIONS = ["Applied", "In Progress", "Selected", "Rejected"];

const ROUND_OPTIONS = [
  "Resume Screening",
  "Aptitude Test",
  "Technical Round 1",
  "Technical Round 2",
  "HR Interview",
  "Final Round",
  "Offer",
];

/* ── Schedule Interview Modal ──────────────────────────────────── */
function ScheduleModal({ app, onClose, onSave }) {
  const [date,   setDate]   = useState(app.interviewDate?.slice(0, 10) || "");
  const [time,   setTime]   = useState(app.interviewTime || "");
  const [link,   setLink]   = useState(app.interviewLink || "");
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState(null);

  const name = app.studentId?.fullName || "Applicant";

  async function handleSave() {
    if (!date || !time) { setErr("Date and time are required."); return; }
    setSaving(true); setErr(null);
    try {
      await scheduleInterview(app._id, {
        interviewDate: date,
        interviewTime: time,
        interviewLink: link,
      });
      onSave({ ...app, interviewDate: date, interviewTime: time, interviewLink: link });
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to schedule. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: `0.5px solid ${T.border}`, background: T.surfaceAlt,
    fontSize: 13, color: T.text, fontFamily: font,
    outline: "none", boxSizing: "border-box",
  };
  const lbl = {
    fontSize: 11, fontWeight: 600, color: T.muted,
    textTransform: "uppercase", letterSpacing: ".04em",
    marginBottom: 5, display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(10,20,12,.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: T.surface, borderRadius: 16, padding: "28px 28px 24px",
        width: "100%", maxWidth: 420,
        border: `0.5px solid ${T.border}`,
        boxShadow: "0 20px 60px rgba(10,20,12,.18)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: T.navyBg, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Calendar size={16} color={T.navy} strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>Schedule Interview</p>
            <p style={{ margin: 0, fontSize: 11, color: T.muted }}>{name}</p>
          </div>
          <button
            onClick={onClose}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.faint, padding: 4 }}
          >
            <XCircle size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>Interview Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Interview Time *</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Meeting Link (optional)</label>
            <input
              type="url" value={link} placeholder="https://meet.google.com/…"
              onChange={e => setLink(e.target.value)} style={inp}
            />
          </div>
        </div>

        {err && (
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "#b91c1c", display: "flex", gap: 5, alignItems: "center" }}>
            <AlertCircle size={12} /> {err}
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 9,
              border: `0.5px solid ${T.border}`, background: T.surfaceAlt,
              fontSize: 13, fontWeight: 600, color: T.muted, cursor: "pointer", fontFamily: font,
            }}
          >Cancel</button>
          <button
            onClick={handleSave} disabled={saving}
            style={{
              flex: 2, padding: "9px 0", borderRadius: 9,
              border: "none", background: T.navy, color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
              fontFamily: font, opacity: saving ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            {saving
              ? <><RefreshCw size={13} style={{ animation: "spin .7s linear infinite" }} /> Saving…</>
              : "Confirm Schedule"
            }
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Inline dropdown (shared by Round + Status) ────────────────── */
function InlineDropdown({ trigger, options, selected, onSelect, loading }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        disabled={loading}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 9px", borderRadius: 8,
          border: `0.5px solid ${T.border}`,
          background: open ? T.navyBg : T.surfaceAlt,
          color: open ? T.navy : T.muted,
          fontSize: 11, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: font, transition: "all .15s",
          opacity: loading ? 0.6 : 1, whiteSpace: "nowrap",
        }}
      >
        {loading
          ? <RefreshCw size={10} style={{ animation: "spin .7s linear infinite" }} />
          : trigger
        }
        {!loading && (
          <ChevronDown size={10} strokeWidth={2.5} style={{
            transform: open ? "rotate(180deg)" : "none", transition: "transform .15s",
          }} />
        )}
      </button>

      {open && (
        <>
          <div onClick={e => { e.stopPropagation(); setOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 5px)", left: 0, zIndex: 20,
            background: T.surface, border: `0.5px solid ${T.border}`,
            borderRadius: 10, padding: "5px 0", minWidth: 170,
            boxShadow: "0 8px 24px rgba(10,20,12,.1)",
          }}>
            {options.map(opt => (
              <button
                key={opt}
                onClick={e => { e.stopPropagation(); onSelect(opt); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "7px 14px", border: "none",
                  background: opt === selected ? T.navyBg : "transparent",
                  color: opt === selected ? T.navy : T.text,
                  fontSize: 12, fontWeight: opt === selected ? 700 : 500,
                  cursor: "pointer", fontFamily: font, textAlign: "left",
                  transition: "background .12s",
                }}
                onMouseEnter={e => { if (opt !== selected) e.currentTarget.style.background = T.surfaceAlt; }}
                onMouseLeave={e => { if (opt !== selected) e.currentTarget.style.background = "transparent"; }}
              >
                {opt === selected && <CheckCircle size={10} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                {opt !== selected && <span style={{ width: 10, flexShrink: 0 }} />}
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Applicant Row ─────────────────────────────────────────────── */
function ApplicantRow({ app, onView, onUpdate, onSchedule, isLast }) {
  const [hov,           setHov]           = useState(false);
  const [roundLoading,  setRoundLoading]  = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const meta     = STATUS_META[app.status] || STATUS_META["Applied"];
  const name     = app.studentId?.fullName || "Unknown Student";
  const email    = app.studentId?.email    || "—";
  const cgpa     = app.studentId?.cgpa     || "—";
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const completedRounds = app.rounds?.filter(r =>
    r.status === "Completed" || r.status === "Passed" || r.status === "Failed"
  ).length || 0;
  const totalRounds = app.rounds?.length || 0;

  async function handleRoundChange(round) {
    if (round === app.currentRound) return;
    setRoundLoading(true);
    try {
      await updateRound(app._id, { currentRound: round });
      onUpdate({ ...app, currentRound: round });
    } catch (e) { console.error("Round update failed", e); }
    finally { setRoundLoading(false); }
  }

  async function handleStatusChange(status) {
    if (status === app.status) return;
    setStatusLoading(true);
    try {
      await updateRound(app._id, { status });
      onUpdate({ ...app, status });
    } catch (e) { console.error("Status update failed", e); }
    finally { setStatusLoading(false); }
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 22px",
        borderBottom: isLast ? "none" : `0.5px solid ${T.border}`,
        background: hov ? T.greenBg + "44" : "transparent",
        transition: "background .13s",
        cursor: "pointer",
      }}
      onClick={() => onView(app._id)}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: T.greenBg, border: `0.5px solid ${T.borderHov}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 600, color: T.green,
      }}>
        {initials}
      </div>

      {/* Name + email */}
      <div style={{ flex: "0 0 200px", minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {email}
        </p>
      </div>

      {/* CGPA */}
      <div style={{ flex: "0 0 70px", textAlign: "center" }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: T.navy,
          padding: "3px 9px", borderRadius: 8, background: T.navyBg,
        }}>
          {cgpa}
        </span>
      </div>

      {/* Round progress bar */}
      <div style={{ flex: 1, minWidth: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 99, background: T.border, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: totalRounds > 0 ? `${(completedRounds / totalRounds) * 100}%` : "0%",
              background: T.greenMid, transition: "width .3s ease",
            }} />
          </div>
          <span style={{ fontSize: 11, color: T.muted, whiteSpace: "nowrap" }}>
            {completedRounds}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Round dropdown */}
      <div style={{ flex: "0 0 150px" }} onClick={e => e.stopPropagation()}>
        <InlineDropdown
          trigger={
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Layers size={10} strokeWidth={2} />
              {app.currentRound || "Set Round"}
            </span>
          }
          options={ROUND_OPTIONS}
          selected={app.currentRound}
          onSelect={handleRoundChange}
          loading={roundLoading}
        />
      </div>

      {/* Status dropdown */}
      <div style={{ flex: "0 0 120px" }} onClick={e => e.stopPropagation()}>
        <InlineDropdown
          trigger={
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: meta.color, display: "inline-block",
              }} />
              {app.status || "Applied"}
            </span>
          }
          options={STATUS_OPTIONS}
          selected={app.status}
          onSelect={handleStatusChange}
          loading={statusLoading}
        />
      </div>

      {/* Schedule button */}
      <div style={{ flex: "0 0 100px" }} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onSchedule(app)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 8,
            border: `0.5px solid ${app.interviewDate ? T.borderHov : T.border}`,
            background: app.interviewDate ? T.navyBg : T.surfaceAlt,
            color: app.interviewDate ? T.navy : T.muted,
            fontSize: 11, fontWeight: 600, cursor: "pointer",
            fontFamily: font, transition: "all .15s", whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.navyBg; e.currentTarget.style.color = T.navy; e.currentTarget.style.borderColor = T.borderHov; }}
          onMouseLeave={e => {
            e.currentTarget.style.background = app.interviewDate ? T.navyBg : T.surfaceAlt;
            e.currentTarget.style.color = app.interviewDate ? T.navy : T.muted;
            e.currentTarget.style.borderColor = app.interviewDate ? T.borderHov : T.border;
          }}
        >
          <Calendar size={10} strokeWidth={2} />
          {app.interviewDate ? "Reschedule" : "Schedule"}
        </button>
      </div>

      {/* Resume */}
      <div style={{ flex: "0 0 50px", display: "flex", justifyContent: "center" }}>
        {app.studentId?.resume ? (
          <a
            href={app.studentId.resume}
            target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: T.blue, fontWeight: 600, textDecoration: "none" }}
          >
            <FileText size={12} /> CV
          </a>
        ) : (
          <span style={{ fontSize: 11, color: T.faint }}>—</span>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight size={14} color={hov ? T.green : T.faint} strokeWidth={2} style={{ flexShrink: 0 }} />
    </div>
  );
}

/* ── Stats strip ───────────────────────────────────────────────── */
function StatsStrip({ apps }) {
  const stats = [
    { label: "Total",       value: apps.length,                                      color: T.navy,    bg: T.navyBg },
    { label: "In Progress", value: apps.filter(a => a.status === "In Progress").length, color: "#92600a", bg: "#fef9ec" },
    { label: "Selected",    value: apps.filter(a => a.status === "Selected").length,  color: "#065f46", bg: "#ecfdf5" },
    { label: "Rejected",    value: apps.filter(a => a.status === "Rejected").length,  color: "#991b1b", bg: "#fef2f2" },
    { label: "Scheduled",   value: apps.filter(a => a.interviewDate).length,          color: "#5b21b6", bg: "#f5f3ff" },
  ];
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "9px 16px", borderRadius: 10,
          background: s.bg, border: `0.5px solid ${T.border}`,
          flex: "1 1 90px",
        }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
          <p style={{ margin: 0, fontSize: 11, color: T.muted, fontWeight: 500 }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ══ Main page ═══════════════════════════════════════════════════ */
export default function ApplicantsPerJob() {
  const { jobId } = useParams();
  const nav       = useNavigate();

  const [job,     setJob]     = useState(null);
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState(null);

 useEffect(() => {
  if (!jobId) return; // ✅ prevent undefined API call

  async function load() {
    try {
      const [jobRes, appRes] = await Promise.all([
        getJobById(jobId),
        getApplicationsByJob(jobId),
      ]);

      setJob(jobRes.data);
      setApps(appRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  load();
}, [jobId]);

  function handleUpdate(updated) {
    setApps(prev => prev.map(a => a._id === updated._id ? updated : a));
  }

  const filtered = apps.filter(a => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const q = query.toLowerCase();
    const matchQuery = !query
      || a.studentId?.fullName?.toLowerCase().includes(q)
      || a.studentId?.email?.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  const statusCounts = ALL_STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: font }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <PageHeader
        title={job ? `Applicants — ${job.jobTitle}` : "Applicants"}
        subtitle={job
          ? `${job.companyName} · ${apps.length} total applicant${apps.length !== 1 ? "s" : ""}`
          : "Loading…"}
        action={
          <GhostBtn onClick={() => nav("/admin/jobs")}>
            <ChevronLeft size={13} /> All jobs
          </GhostBtn>
        }
      />

      {loading ? <Spinner /> : (
        <>
          {/* Stats */}
          <StatsStrip apps={apps} />

          {/* Status filter strip */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {ALL_STATUSES.map(s => {
              const active = statusFilter === s;
              const count  = s === "All" ? apps.length : (statusCounts[s] || 0);
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                    background: active ? T.navy : T.surface,
                    color: active ? "#fff" : T.muted,
                    border: `0.5px solid ${active ? T.navy : T.border}`,
                    fontSize: 12, fontWeight: 600,
                    transition: "all .15s",
                  }}
                >
                  {s}
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 20,
                    background: active ? "rgba(255,255,255,.15)" : T.slateBg,
                    color: active ? "#fff" : T.slate,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "0 14px", height: 38, borderRadius: 10,
              background: focused ? T.surface : T.surfaceAlt,
              border: `0.5px solid ${focused ? T.greenLight : T.border}`,
              width: 280, transition: "all .15s",
            }}>
              <Search size={13} color={T.faint} strokeWidth={2} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search by name or email…"
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, color: T.text, width: "100%", fontFamily: font,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            {/* Column headers */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "10px 22px",
              borderBottom: `0.5px solid ${T.border}`,
              background: T.surfaceAlt,
            }}>
              {[
                { label: "Student",   w: 36 + 14 + 200 },
                { label: "CGPA",      w: 70,  align: "center" },
                { label: "Progress",  flex: 1 },
                { label: "Round",     w: 150 },
                { label: "Status",    w: 120 },
                { label: "Interview", w: 100 },
                { label: "Resume",    w: 50,  align: "center" },
                { label: "",          w: 14 },
              ].map(({ label, w, flex, align }) => (
                <div key={label} style={{
                  ...(flex ? { flex } : { flex: `0 0 ${w}px` }),
                  fontSize: 11, fontWeight: 600, color: T.faint,
                  letterSpacing: ".05em", textTransform: "uppercase",
                  textAlign: align || "left",
                }}>
                  {label}
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <Empty icon={Users} message="No applicants match your filters" />
            ) : (
              filtered.map((app, i) => (
                <ApplicantRow
                  key={app._id}
                  app={app}
                  onView={id => nav(`/admin/applications/${id}`)}
                  onUpdate={handleUpdate}
                  onSchedule={setScheduleTarget}
                  isLast={i === filtered.length - 1}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Schedule modal */}
      {scheduleTarget && (
        <ScheduleModal
          app={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onSave={updated => { handleUpdate(updated); setScheduleTarget(null); }}
        />
      )}
    </div>
  );
}
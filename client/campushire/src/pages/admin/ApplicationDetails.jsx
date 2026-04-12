import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateRound,
  scheduleInterview,
  getApplicationById,
} from "../../api/application";
import {
  ChevronLeft, CheckCircle, XCircle, Clock,
  Calendar, Mic, User, FileText, Link,
  ChevronDown, ChevronUp, Save, RefreshCw,
  AlertCircle, Edit3, Mail, Award, MapPin,
  Phone, ExternalLink, Briefcase,
} from "lucide-react";
import {
  T, card, font, SectionLabel, PageHeader,
  PrimaryBtn, GhostBtn, Badge, Spinner,
  ROUND_STATUS_META, inputStyle,
} from "./shared";

/* ── Toast ─────────────────────────────────────────────────────── */
function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 18px", borderRadius: 12,
      background: type === "success" ? T.greenBg : "#fef2f2",
      border: `0.5px solid ${type === "success" ? T.borderHov : "#fecaca"}`,
      color: type === "success" ? T.green : "#b91c1c",
      fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(10,20,12,.12)",
      animation: "slideUp .25s ease",
    }}>
      {type === "success"
        ? <CheckCircle size={15} strokeWidth={2.5} />
        : <AlertCircle size={15} strokeWidth={2.5} />}
      {message}
    </div>
  );
}

/* ── Timeline dot ───────────────────────────────────────────────── */
function TimelineDot({ status }) {
  const meta = ROUND_STATUS_META[status] || ROUND_STATUS_META["Pending"];
  const Icon = status === "Passed" || status === "Completed" ? CheckCircle
    : status === "Failed"    ? XCircle
    : status === "Scheduled" ? Calendar
    : Clock;
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: meta.bg, border: `1.5px solid ${meta.color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={14} color={meta.color} strokeWidth={2} />
    </div>
  );
}

/* ── Round card ─────────────────────────────────────────────────── */
function RoundCard({ round, appId, onUpdate, onToast, isCurrentRound }) {
  const [open,      setOpen]      = useState(false);
  const [saving,    setSaving]    = useState(false);

  // Schedule fields — matches backend: roundName, interviewDate, interviewMode, meetingLink
  const [schedDate, setSchedDate] = useState(
    round.interviewDate ? new Date(round.interviewDate).toISOString().slice(0, 16) : ""
  );
  const [interviewMode, setInterviewMode] = useState(round.interviewMode || "Online");
  const [meetingLink,   setMeetingLink]   = useState(round.meetingLink   || "");

  // Outcome fields — matches backend: roundName, status, feedback
  const [status,   setStatus]   = useState(round.status   || "Pending");
  const [feedback, setFeedback] = useState(round.feedback || "");

  const meta      = ROUND_STATUS_META[round.status] || ROUND_STATUS_META["Pending"];
  const hasSchedule = !!round.interviewDate;

  async function saveSchedule() {
    if (!schedDate) { onToast("Please set a date & time.", "error"); return; }
    setSaving(true);
    try {
      // ✅ Backend expects: roundName, interviewDate, interviewMode, meetingLink
      await scheduleInterview(appId, {
        roundName:     round.roundName,
        interviewDate: schedDate,
        interviewMode: interviewMode,
        meetingLink:   meetingLink,
      });
      onToast("Interview scheduled & email sent!");
      onUpdate();
    } catch (e) {
      onToast(e?.response?.data?.message || "Failed to schedule.", "error");
    } finally { setSaving(false); }
  }

  async function saveOutcome() {
    if (!isCurrentRound) {
      onToast(`Only the current round can be updated.`, "error");
      return;
    }
    setSaving(true);
    try {
      // ✅ Backend expects: roundName, status, feedback
      await updateRound(appId, {
        roundName: round.roundName,
        status,
        feedback,
      });
      onToast("Round updated!");
      onUpdate();
    } catch (e) {
      onToast(e?.response?.data?.message || "Failed to update.", "error");
    } finally { setSaving(false); }
  }

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Timeline spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        <TimelineDot status={round.status} />
        <div style={{ flex: 1, width: 1.5, background: T.border, marginTop: 4, minHeight: 20 }} />
      </div>

      {/* Card */}
      <div style={{
        flex: 1, background: T.surface,
        border: `0.5px solid ${open ? T.borderHov : isCurrentRound ? T.greenLight : T.border}`,
        borderRadius: 12, overflow: "hidden", marginBottom: 12,
        transition: "border-color .15s",
        ...(isCurrentRound ? { boxShadow: `0 0 0 2px ${T.greenLight}44` } : {}),
      }}>
        {/* Header */}
        <div
          onClick={() => setOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", cursor: "pointer",
            background: open ? T.greenBg + "55" : "transparent",
            transition: "background .15s",
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: isCurrentRound ? T.greenMid : T.navyBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            color: isCurrentRound ? "#fff" : T.navy,
          }}>
            {isCurrentRound ? "→" : ""}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>
                {round.roundName}
              </p>
              {isCurrentRound && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 7px",
                  borderRadius: 20, background: T.greenMid, color: "#fff",
                }}>Current</span>
              )}
            </div>
            {hasSchedule && (
              <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted }}>
                <Calendar size={10} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {new Date(round.interviewDate).toLocaleString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
                {round.meetingLink && (
                  <a
                    href={round.meetingLink} target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ marginLeft: 8, color: T.blue, fontWeight: 600 }}
                  >
                    Join <ExternalLink size={9} style={{ verticalAlign: "middle" }} />
                  </a>
                )}
              </p>
            )}
          </div>
          <Badge label={round.status || "Pending"} color={meta.color} bg={meta.bg} />
          {open ? <ChevronUp size={14} color={T.faint} /> : <ChevronDown size={14} color={T.faint} />}
        </div>

        {/* Expanded */}
        {open && (
          <div style={{
            padding: "18px 16px", borderTop: `0.5px solid ${T.border}`,
            display: "flex", flexDirection: "column", gap: 20,
          }}>

            {/* ── Schedule ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <Calendar size={13} color={T.navy} strokeWidth={2} />
                <SectionLabel style={{ margin: 0 }}>Schedule Interview</SectionLabel>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>Date &amp; Time *</label>
                  <input
                    type="datetime-local" value={schedDate}
                    onChange={e => setSchedDate(e.target.value)}
                    style={{ ...inputStyle, fontSize: 12 }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>Mode</label>
                  <select
                    value={interviewMode}
                    onChange={e => setInterviewMode(e.target.value)}
                    style={{ ...inputStyle, fontSize: 12 }}
                  >
                    {["Online", "Offline", "Phone"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>
                  Meeting Link {interviewMode === "Offline" ? "(optional)" : ""}
                </label>
                <input
                  type="url" value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/…"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                <GhostBtn onClick={saveSchedule} disabled={saving}>
                  {saving
                    ? <><RefreshCw size={11} style={{ animation: "spin .7s linear infinite" }} /> Saving…</>
                    : <><Calendar size={11} /> {hasSchedule ? "Update Schedule" : "Set Schedule"}</>
                  }
                </GhostBtn>
              </div>
            </div>

            <div style={{ height: 1, background: T.border }} />

            {/* ── Outcome ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <CheckCircle size={13} color={T.navy} strokeWidth={2} />
                <SectionLabel style={{ margin: 0 }}>Round Outcome</SectionLabel>
                {!isCurrentRound && (
                  <span style={{
                    fontSize: 10, color: "#92600a", background: "#fef9ec",
                    border: "0.5px solid #fde68a", borderRadius: 20,
                    padding: "2px 8px", fontWeight: 600,
                  }}>
                    Not current round — updates blocked by server
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>Round Status</label>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["Pending", "Scheduled", "Completed", "Passed", "Failed"].map(s => {
                      const m = ROUND_STATUS_META[s] || ROUND_STATUS_META["Pending"];
                      const active = status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(s)}
                          style={{
                            padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                            border: `0.5px solid ${active ? m.color : T.border}`,
                            background: active ? m.bg : T.surfaceAlt,
                            color: active ? m.color : T.muted,
                            cursor: "pointer", fontFamily: font, transition: "all .15s",
                          }}
                        >{s}</button>
                      );
                    })}
                  </div>
                  {/* Outcome explanation */}
                  {(status === "Passed" || status === "Failed") && (
                    <div style={{
                      fontSize: 11, color: status === "Passed" ? "#065f46" : "#991b1b",
                      background: status === "Passed" ? "#ecfdf5" : "#fef2f2",
                      border: `0.5px solid ${status === "Passed" ? "#a7f3d0" : "#fecaca"}`,
                      borderRadius: 8, padding: "7px 12px", marginTop: 4,
                    }}>
                      {status === "Passed"
                        ? round.roundName === "HR"
                          ? "✓ Marking Passed will set overall status to Selected and send congratulations email."
                          : `✓ Marking Passed will advance to the next round and notify the student.`
                        : "✗ Marking Failed will set overall status to Rejected and notify the student."
                      }
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>Interviewer Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Summarise the candidate's performance…"
                    style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <PrimaryBtn onClick={saveOutcome} disabled={saving || !isCurrentRound}>
                    {saving
                      ? <><RefreshCw size={12} style={{ animation: "spin .7s linear infinite" }} /> Saving…</>
                      : <><Save size={12} /> Save Outcome</>
                    }
                  </PrimaryBtn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Info row ───────────────────────────────────────────────────── */
function InfoRow({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 10px", borderRadius: 8, background: T.surfaceAlt,
    }}>
      <Icon size={13} color={T.faint} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: T.muted, flex: "0 0 88px" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{value}</span>
    </div>
  );
}

/* ══ Main page ═══════════════════════════════════════════════════ */
export default function ApplicationDetails() {
  const { appId } = useParams();
  const nav       = useNavigate();

  const [app,     setApp]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  async function load() {
    try {
      const { data } = await getApplicationById(appId);
      setApp(data);
    } catch (e) {
      console.error("getApplicationById failed:", e?.response?.status, e?.response?.data);
      setApp(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [appId]);

  if (loading) return <div style={{ fontFamily: font }}><Spinner /></div>;

  if (!app) return (
    <div style={{ fontFamily: font, textAlign: "center", padding: "64px 0", color: T.faint }}>
      <AlertCircle size={36} strokeWidth={1.2} style={{ opacity: .4, display: "block", margin: "0 auto 12px" }} />
      <p style={{ fontSize: 15, margin: "0 0 16px" }}>Application not found.</p>
      <GhostBtn onClick={() => nav(-1)}>
        <ChevronLeft size={13} /> Go back
      </GhostBtn>
    </div>
  );

  const student = app.studentId || {};
  const job     = app.jobId     || {};
  const rounds  = app.rounds    || [];
  const initials = (student.fullName || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const passedRounds   = rounds.filter(r => r.status === "Passed" || r.status === "Completed").length;
  const failedRounds   = rounds.filter(r => r.status === "Failed").length;
  const pendingRounds  = rounds.filter(r => !r.status || r.status === "Pending").length;
  const scheduledCount = rounds.filter(r => r.interviewDate).length;

  const OVERALL_STATUS_STYLES = {
    Applied:      { color: "#92600a", bg: "#fef9ec", border: "#fde68a" },
    "In Progress":{ color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
    Selected:     { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
    Rejected:     { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  };
  const overallStyle = OVERALL_STATUS_STYLES[app.status] || OVERALL_STATUS_STYLES["Applied"];

  return (
    <div style={{ fontFamily: font }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <PageHeader
        title="Application Details"
        subtitle={`${student.fullName || "Unknown"} · ${job.jobTitle || "Unknown role"}`}
        action={
          <GhostBtn onClick={() => nav(-1)}>
            <ChevronLeft size={13} /> Back
          </GhostBtn>
        }
      />

      {/* ── Progress bar ── */}
      {rounds.length > 0 && (
        <div style={{
          ...card, padding: "14px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>Round Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{passedRounds}/{rounds.length}</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: T.border, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99, background: T.greenMid,
                width: `${rounds.length > 0 ? (passedRounds / rounds.length) * 100 : 0}%`,
                transition: "width .4s ease",
              }} />
            </div>
          </div>
          {[
            { label: "Passed",    value: passedRounds,   color: "#065f46", bg: "#ecfdf5" },
            { label: "Failed",    value: failedRounds,   color: "#991b1b", bg: "#fef2f2" },
            { label: "Pending",   value: pendingRounds,  color: T.muted,   bg: T.surfaceAlt },
            { label: "Scheduled", value: scheduledCount, color: T.navy,    bg: T.navyBg },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 8,
              background: s.bg, border: `0.5px solid ${T.border}`,
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 11, color: T.muted }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

        {/* ══ LEFT ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Overall status — READ ONLY (driven by backend flow logic) */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Edit3 size={14} color={T.navy} strokeWidth={2} />
                <SectionLabel style={{ margin: 0 }}>Overall Status</SectionLabel>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700,
                padding: "5px 14px", borderRadius: 20,
                background: overallStyle.bg,
                color: overallStyle.color,
                border: `0.5px solid ${overallStyle.border}`,
              }}>
                {app.status}
              </span>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
              Overall status is automatically managed by the server based on round outcomes.
              Mark a round as <b>Passed</b> or <b>Failed</b> below to advance the application.
            </p>
            <div style={{
              marginTop: 10, padding: "10px 14px", borderRadius: 8,
              background: T.surfaceAlt, border: `0.5px solid ${T.border}`,
              fontSize: 12, color: T.muted,
            }}>
              <span style={{ fontWeight: 600, color: T.text }}>Current Round: </span>
              <span style={{
                fontWeight: 700, color: T.greenMid,
                padding: "1px 8px", background: T.greenBg,
                borderRadius: 20, marginLeft: 4,
              }}>
                {app.currentRound}
              </span>
            </div>
          </div>

          {/* Rounds timeline */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Mic size={14} color={T.navy} strokeWidth={2} />
              <SectionLabel style={{ margin: 0 }}>Interview Rounds ({rounds.length})</SectionLabel>
            </div>

            {rounds.length === 0 ? (
              <div style={{
                border: `1px dashed ${T.border}`, borderRadius: 10,
                padding: "32px 0", textAlign: "center", color: T.faint,
              }}>
                <Mic size={24} strokeWidth={1.2} style={{ opacity: .35, display: "block", margin: "0 auto 10px" }} />
                <p style={{ margin: 0, fontSize: 13 }}>No interview rounds defined.</p>
              </div>
            ) : (
              rounds.map((r, i) => (
                <RoundCard
                  key={i}
                  round={r}
                  appId={app._id}
                  onUpdate={load}
                  onToast={showToast}
                  isCurrentRound={app.currentRound === r.roundName}
                />
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT sidebar ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Student */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <User size={13} color={T.navy} strokeWidth={2} />
              <SectionLabel style={{ margin: 0 }}>Student Profile</SectionLabel>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: T.greenBg, border: `1px solid ${T.borderHov}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: T.green,
              }}>{initials}</div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
                  {student.fullName || "—"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted }}>
                  {student.email || "—"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <InfoRow Icon={Award}  label="CGPA"       value={student.cgpa} />
              <InfoRow Icon={User}   label="Department" value={student.department} />
              <InfoRow Icon={MapPin} label="Location"   value={student.location} />
              <InfoRow Icon={Phone}  label="Phone"      value={student.phone} />
            </div>
            {student.email && (
              <a href={`mailto:${student.email}`} style={{
                display: "flex", alignItems: "center", gap: 8, marginTop: 12,
                padding: "8px 13px", borderRadius: 9,
                background: T.surfaceAlt, border: `0.5px solid ${T.border}`,
                textDecoration: "none", color: T.muted, fontSize: 12, fontWeight: 600,
              }}>
                <Mail size={13} /> Email Student
              </a>
            )}
            {student.technicalSkills?.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 10, color: T.faint, margin: "0 0 7px",
                  letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 700 }}>Skills</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {student.technicalSkills.map(s => (
                    <span key={s} style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 9px",
                      borderRadius: 20, background: T.greenBg, color: T.green,
                      border: `0.5px solid ${T.borderHov}`,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 12 }}>
              {student.resume && (
                <a href={student.resume} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 13px", borderRadius: 9,
                  background: T.blueBg, border: `0.5px solid ${T.border}`,
                  textDecoration: "none", color: T.blue, fontSize: 12, fontWeight: 600,
                }}>
                  <FileText size={13} /> View Resume
                </a>
              )}
              {student.portfolioLink && (
                <a href={student.portfolioLink} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 13px", borderRadius: 9,
                  background: T.navyBg, border: `0.5px solid ${T.border}`,
                  textDecoration: "none", color: T.navy, fontSize: 12, fontWeight: 600,
                }}>
                  <Link size={13} /> Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Job */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Briefcase size={13} color={T.navy} strokeWidth={2} />
              <SectionLabel style={{ margin: 0 }}>Job Listing</SectionLabel>
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text }}>{job.jobTitle || "—"}</p>
            <p style={{ margin: "3px 0 10px", fontSize: 12, color: T.muted }}>{job.companyName || "—"}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <InfoRow Icon={MapPin} label="Location" value={job.location} />
              <InfoRow Icon={Clock}  label="Type"     value={job.jobType} />
            </div>
          </div>

          {/* Round summary */}
          <div style={{ ...card, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <CheckCircle size={13} color={T.navy} strokeWidth={2} />
              <SectionLabel style={{ margin: 0 }}>Round Summary</SectionLabel>
            </div>
            {rounds.length === 0
              ? <p style={{ fontSize: 12, color: T.faint, margin: 0 }}>No rounds yet.</p>
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {rounds.map((r, i) => {
                    const meta = ROUND_STATUS_META[r.status] || ROUND_STATUS_META["Pending"];
                    const isCurrent = app.currentRound === r.roundName;
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "7px 10px", borderRadius: 8,
                        background: isCurrent ? T.greenBg : T.surfaceAlt,
                        border: `0.5px solid ${isCurrent ? T.borderHov : T.border}`,
                      }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          background: isCurrent ? T.greenMid : T.navyBg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700,
                          color: isCurrent ? "#fff" : T.navy,
                        }}>{i + 1}</span>
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: T.text,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.roundName}
                        </span>
                        {r.interviewDate && (
                          <Calendar size={10} color={T.navy} strokeWidth={2} style={{ flexShrink: 0 }} />
                        )}
                        <Badge label={r.status || "Pending"} color={meta.color} bg={meta.bg} />
                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
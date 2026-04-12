import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/job";
import { applyJob } from "../../api/application"; 
import { getMyApplications } from "../../api/application";

import {
  FiBriefcase, FiMapPin, FiCalendar, FiDollarSign,
  FiMail, FiUser, FiAlertCircle, FiCheckCircle,
  FiChevronRight, FiExternalLink, FiClock, FiAward,
  FiCode, FiUsers, FiLayers, FiTrendingUp,
  FiXCircle, FiBook, FiInfo, FiSend,
} from "react-icons/fi";

/* ── Design tokens ─────────────────────────────────────────────── */
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

const card = {
  background:   T.surface,
  border:       `1px solid ${T.border}`,
  borderRadius: 14,
  boxShadow:    "0 1px 3px rgba(40,80,50,.06), 0 4px 16px rgba(40,80,50,.04)",
};

/* ── Shimmer skeleton ───────────────────────────────────────────── */
function Skeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position:-200% 0 }
        }
        .sk {
          background: linear-gradient(90deg,#ddeae0 25%,#f0f6f1 50%,#ddeae0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 10px;
        }
      `}</style>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="sk" style={{ height: 130 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {[80,80,80,80].map((h,i) => <div key={i} className="sk" style={{ height: h }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[160,200,140].map((h,i) => <div key={i} className="sk" style={{ height: h }} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[120,80,80].map((h,i) => <div key={i} className="sk" style={{ height: h }} />)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Badge ──────────────────────────────────────────────────────── */
function Badge({ children, variant = "default" }) {
  const styles = {
    default: { bg: T.accent,              color: T.primaryDark },
    skill:   { bg: T.primaryDark + "14",  color: T.primaryDark },
    danger:  { bg: "#fef2f2",             color: "#b91c1c" },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 600, padding: "4px 10px",
      borderRadius: 99, background: s.bg, color: s.color,
      letterSpacing: ".03em",
    }}>
      {children}
    </span>
  );
}

/* ── Section heading ────────────────────────────────────────────── */
function SectionHead({ Icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: T.accent, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.primary,
      }}>
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: ".01em" }}>
        {title}
      </h3>
    </div>
  );
}

/* ── Bullet list ────────────────────────────────────────────────── */
function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#374840", lineHeight: 1.6 }}>
          <FiChevronRight size={14} color={T.primary} style={{ marginTop: 3, flexShrink: 0 }} strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Stepper ────────────────────────────────────────────────────── */
function Stepper({ stages }) {
  if (!stages?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {stages.map((stage, i) => (
        <div key={i} style={{ display: "flex", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: T.primary, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800,
            }}>{i + 1}</div>
            {i < stages.length - 1 && (
              <div style={{ width: 2, flex: 1, background: T.border, margin: "4px 0", minHeight: 20 }} />
            )}
          </div>
          <div style={{ paddingBottom: i < stages.length - 1 ? 18 : 0, paddingTop: 5 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{stage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Sidebar info row ───────────────────────────────────────────── */
function InfoRow({ Icon, label, value, valueColor }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 11,
      padding: "10px 0", borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: T.subtle, display: "flex", alignItems: "center",
        justifyContent: "center", color: T.muted,
      }}>
        <Icon size={13} strokeWidth={2.2} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: valueColor || T.text }}>{value || "—"}</p>
      </div>
    </div>
  );
}

/* ── Apply Button ───────────────────────────────────────────────── */
function ApplyButton({ jobId, applied, setApplied }) {
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);

  async function handleApply() {
  if (applied || applying) return;

  setApplying(true);
  setApplyError(null);

  try {
    const res = await applyJob(jobId);

    setApplied(true);
  } catch (err) {
  const data = err?.response?.data;

const msg =
  typeof data === "string"
    ? data
    : data?.message || "Failed to apply";

setApplyError(msg);

    // store reasons separately
    if (data?.reasons) {
     setApplyError(
  data?.reasons?.length
    ? `${data.message}: ${data.reasons.join(", ")}`
    : data?.message || "Failed to apply"
);
    } else {
      setApplyError({ message: msg });
    }
  } finally {
    setApplying(false);
  }
}

  if (applied) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "11px 22px", borderRadius: 11,
        background: T.accent, border: `1.5px solid ${T.border}`,
        fontSize: 13, fontWeight: 700, color: T.primaryDark,
      }}>
        <FiCheckCircle size={15} strokeWidth={2.5} />
        Applied Successfully
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <button
        onClick={handleApply}
        disabled={applying}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: applying
            ? T.muted
            : `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
          color: "#fff", border: "none", cursor: applying ? "not-allowed" : "pointer",
          padding: "11px 22px", borderRadius: 11,
          fontSize: 13, fontWeight: 700,
          boxShadow: applying ? "none" : "0 4px 14px rgba(40,80,50,.22)",
          transition: "opacity .15s, transform .15s",
          opacity: applying ? 0.75 : 1,
        }}
        onMouseEnter={e => { if (!applying) { e.currentTarget.style.opacity=".88"; e.currentTarget.style.transform="translateY(-1px)"; }}}
        onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform=""; }}
      >
        {applying ? (
          <>
            <span style={{
              width: 13, height: 13, border: "2px solid rgba(255,255,255,.4)",
              borderTopColor: "#fff", borderRadius: "50%",
              display: "inline-block",
              animation: "spin .7s linear infinite",
            }} />
            Applying…
          </>
        ) : (
          <><FiSend size={13} /> Apply Now</>
        )}
      </button>
      {applyError && (
        <p style={{ margin: 0, fontSize: 11, color: "#b91c1c", fontWeight: 500, maxWidth: 200, textAlign: "right" }}>
          {applyError}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══ Main component ══════════════════════════════════════════════ */
export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    }

    async function checkApplication() {
      try {
        const res = await getMyApplications();
        const alreadyApplied = res.data?.some(
          (app) => app.jobId === id || app.job === id
        );
        setApplied(alreadyApplied);
      } catch (err) {
        console.log("Application check failed", err);
      }
    }

    fetchJob();
    checkApplication();
  }, [id]);

  if (loading) return <Skeleton />;

  if (error || !job) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", gap: 12, fontFamily: T.font,
    }}>
      <FiAlertCircle size={44} color="#ef4444" strokeWidth={1.5} />
      <p style={{ fontSize: 15, color: "#b91c1c", fontWeight: 600, margin: 0 }}>
        {error || "Job not found"}
      </p>
    </div>
  );

  const deadline    = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
  const daysLeft    = deadline ? Math.ceil((deadline - Date.now()) / 86_400_000) : null;
  const isUrgent    = daysLeft !== null && daysLeft <= 3;
  const deadlineStr = deadline
    ? deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  const isPastDeadline = daysLeft !== null && daysLeft <= 0;

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", padding: "28px 20px", color: T.text }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <div style={{ ...card, padding: "26px 30px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-start" }}>

            {/* Logo + title */}
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flex: 1, minWidth: 260 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                background: T.accent, border: `1.5px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                {job.companyLogo
                  ? <img src={job.companyLogo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <FiBriefcase size={24} color={T.primary} strokeWidth={1.5} />
                }
              </div>

              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.25 }}>
                  {job.jobTitle}
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 16px", margin: "7px 0 12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: T.muted, fontWeight: 500 }}>
                    <FiBriefcase size={12} strokeWidth={2} /> {job.companyName}
                  </span>
                  {job.location && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: T.muted }}>
                      <FiMapPin size={12} /> {job.location}
                    </span>
                  )}
                  {job.jobType && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: T.muted }}>
                      <FiClock size={12} /> {job.jobType}
                    </span>
                  )}
                </div>
                {job.jobTags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {job.jobTags.map((tag, i) => <Badge key={i}>{tag}</Badge>)}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
              {/* Show Apply button if no external link, OR show both */}
              {!isPastDeadline && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <ApplyButton jobId={id} applied={applied} setApplied={setApplied} />
                  {job.applicationLink && (
  <a
    href={job.applicationLink}
    target="_blank"
    rel="noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: T.subtle,
      color: T.primaryDark,
      textDecoration: "none",
      border: `1.5px solid ${T.border}`,
      padding: "10px 18px",
      borderRadius: 11,
      fontSize: 13,
      fontWeight: 600,
      transition: "opacity .15s, transform .15s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.opacity = ".8";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.transform = "";
    }}
  >
    External Link <FiExternalLink size={12} />
  </a>
)}
                </div>
              )}

              {isPastDeadline && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "11px 22px", borderRadius: 11,
                  background: "#fef2f2", border: "1.5px solid #fecaca",
                  fontSize: 13, fontWeight: 700, color: "#b91c1c",
                }}>
                  <FiXCircle size={15} /> Applications Closed
                </div>
              )}

              {deadline && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  padding: "6px 12px", borderRadius: 8,
                  background: isUrgent ? "#fef2f2" : T.subtle,
                  color:      isUrgent ? "#b91c1c" : T.muted,
                  border:     `1px solid ${isUrgent ? "#fecaca" : T.border}`,
                }}>
                  {isUrgent ? <FiAlertCircle size={12} /> : <FiCalendar size={12} />}
                  {isUrgent
                    ? daysLeft > 0
                      ? `Closes in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
                      : "Deadline passed"
                    : `Deadline: ${deadlineStr}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ META STRIP ════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { Icon: FiDollarSign, label: "Salary",   value: job.salaryRange || "Not disclosed" },
            { Icon: FiAward,      label: "Min CGPA",  value: job.eligibility?.minCgpa ? `${job.eligibility.minCgpa} / 10` : "N/A" },
            { Icon: FiCalendar,   label: "Deadline",  value: deadlineStr },
            {
              Icon: job.eligibility?.noActiveBacklogs ? FiXCircle : FiCheckCircle,
              label: "Backlogs",
              value: job.eligibility?.noActiveBacklogs ? "Not Allowed" : "Allowed",
              valueColor: job.eligibility?.noActiveBacklogs ? "#b91c1c" : T.primaryDark,
            },
          ].map(({ Icon, label, value, valueColor }) => (
            <div key={label} style={{ ...card, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: T.accent, display: "flex", alignItems: "center",
                justifyContent: "center", color: T.primary,
              }}>
                <Icon size={16} strokeWidth={2} color={valueColor || T.primary} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 600 }}>{label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700, color: valueColor || T.text }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ══ BODY GRID ════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 282px", gap: 18, alignItems: "start" }}>

          {/* ── LEFT: main content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {job.keyResponsibilities?.length > 0 && (
              <div style={{ ...card, padding: "22px 24px" }}>
                <SectionHead Icon={FiBook} title="Key Responsibilities" />
                <BulletList items={job.keyResponsibilities} />
              </div>
            )}

            {job.technicalRequirements?.length > 0 && (
              <div style={{ ...card, padding: "22px 24px" }}>
                <SectionHead Icon={FiCode} title="Technical Requirements" />
                <BulletList items={job.technicalRequirements} />
              </div>
            )}

            {job.softSkillsRequirements?.length > 0 && (
              <div style={{ ...card, padding: "22px 24px" }}>
                <SectionHead Icon={FiUsers} title="Soft Skills" />
                <BulletList items={job.softSkillsRequirements} />
              </div>
            )}

            {job.selectionProcess?.stages?.length > 0 && (
              <div style={{ ...card, padding: "22px 24px" }}>
                <SectionHead Icon={FiTrendingUp} title="Selection Process" />
                <Stepper stages={job.selectionProcess.stages} />
              </div>
            )}

            {!job.keyResponsibilities?.length &&
             !job.technicalRequirements?.length &&
             !job.softSkillsRequirements?.length &&
             !job.selectionProcess?.stages?.length && (
              <div style={{ ...card, padding: "48px 24px", textAlign: "center", color: T.muted }}>
                <FiInfo size={30} style={{ margin: "0 auto 10px", display: "block" }} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: 14 }}>No additional details provided.</p>
              </div>
            )}
          </div>

          {/* ── RIGHT: sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Quick Apply Card in sidebar */}
            {!isPastDeadline && (
              <div style={{
                ...card, padding: "20px 22px",
                background: applied ? T.accent : `linear-gradient(135deg, ${T.primaryDark}08, ${T.accent})`,
                border: `1.5px solid ${applied ? T.border : T.primary + "40"}`,
              }}>
                <SectionHead Icon={FiSend} title={applied ? "Application Status" : "Quick Apply"} />
                {applied ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      background: T.primary, display: "flex", alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <FiCheckCircle size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.primaryDark }}>
                        You've applied!
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted }}>
                        Application submitted successfully.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ margin: "0 0 14px", fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                      Apply directly through the portal with a single click.
                    </p>
                    <ApplyButton jobId={id} applied={applied} setApplied={setApplied} />
                  </>
                )}
              </div>
            )}

            {/* Eligibility */}
            <div style={{ ...card, padding: "20px 22px" }}>
              <SectionHead Icon={FiAward} title="Eligibility" />
              <InfoRow Icon={FiTrendingUp} label="Min CGPA"
                value={job.eligibility?.minCgpa ? `${job.eligibility.minCgpa} / 10` : "Open to all"} />
              <InfoRow Icon={FiLayers} label="Branches"
                value={job.eligibility?.allowedBranches?.join(", ") || "All Branches"} />
              <InfoRow
                Icon={job.eligibility?.noActiveBacklogs ? FiXCircle : FiCheckCircle}
                label="Backlogs"
                value={job.eligibility?.noActiveBacklogs ? "Not Allowed" : "Allowed"}
                valueColor={job.eligibility?.noActiveBacklogs ? "#b91c1c" : T.primaryDark}
              />
              {job.eligibility?.requiredSkills?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 600 }}>
                    Required Skills
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {job.eligibility.requiredSkills.map((s, i) => <Badge key={i} variant="skill">{s}</Badge>)}
                  </div>
                </div>
              )}
            </div>

            {/* Compensation */}
            <div style={{ ...card, padding: "20px 22px" }}>
              <SectionHead Icon={FiDollarSign} title="Compensation" />
              <div style={{
                background: T.accent, borderRadius: 10,
                padding: "12px 16px", borderLeft: `3px solid ${T.primary}`,
              }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.primaryDark }}>
                  {job.salaryRange || "Not disclosed"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: T.muted }}>Per annum (CTC)</p>
              </div>
            </div>

            {/* Deadline */}
            <div style={{
              ...card, padding: "20px 22px",
              ...(isUrgent ? { background: "#fff8f8", border: "1px solid #fecaca" } : {}),
            }}>
              <SectionHead Icon={FiCalendar} title="Application Deadline" />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: isUrgent ? "#fee2e2" : T.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isUrgent ? "#b91c1c" : T.primary,
                }}>
                  <FiCalendar size={18} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: isUrgent ? "#b91c1c" : T.text }}>
                    {deadlineStr}
                  </p>
                  {daysLeft !== null && (
                    <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 600, color: isUrgent ? "#ef4444" : T.muted }}>
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
                        : "Deadline passed"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            {(job.contactPerson || job.contactEmail) && (
              <div style={{ ...card, padding: "20px 22px" }}>
                <SectionHead Icon={FiMail} title="Contact" />
                {job.contactPerson && (
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: T.subtle, display: "flex", alignItems: "center",
                      justifyContent: "center", color: T.muted,
                    }}>
                      <FiUser size={13} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{job.contactPerson}</p>
                  </div>
                )}
                {job.contactEmail && (
                  <a
                    href={`mailto:${job.contactEmail}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 12, color: T.primary, textDecoration: "none",
                      fontWeight: 500, wordBreak: "break-all",
                    }}
                  >
                    <FiMail size={12} /> {job.contactEmail}
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
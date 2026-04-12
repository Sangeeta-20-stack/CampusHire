import { useEffect, useState, useRef } from "react";
import { getMyApplications } from "../../api/application";
import { getJobs, getProfile, updateProfile } from "../../api/student";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiCalendar,
  FiAward,
  FiClock,
  FiFileText,
  FiUploadCloud,
  FiExternalLink,
  FiAlertCircle,
  FiCheckCircle,
  FiSearch,
  FiEdit2,
  FiMic,
  FiArrowRight,
  FiUser,
  FiPercent,
  FiCode,
  FiLink,
  FiX,
  FiCheck,
} from "react-icons/fi";

/* ── tokens ─────────────────────────────────────────── */
const C = {
  bg:        "#F8FAF8",
  surface:   "#FFFFFF",
  border:    "#E3EBE5",
  borderHov: "#C4D4C8",
  text:      "#1B2D1E",
  muted:     "#6A7D6D",
  faint:     "#9DB09F",
  green:     "#3B6D11",
  greenBg:   "#EAF3DE",
  greenMid:  "#639922",
  blue:      "#185FA5",
  blueBg:    "#E6F1FB",
  amber:     "#BA7517",
  amberBg:   "#FAEEDA",
  red:       "#A32D2D",
  redBg:     "#FCEBEB",
  slate:     "#444441",
  slateBg:   "#F1EFE8",
};

const STATUS_META = {
  Applied:      { color: C.slate,  bg: C.slateBg  },
  "In Progress":{ color: C.blue,   bg: C.blueBg   },
  Selected:     { color: C.green,  bg: C.greenBg  },
  Rejected:     { color: C.red,    bg: C.redBg    },
};

/* ── Avatar ──────────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = (name || "S")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: C.greenBg, border: `1.5px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: C.green, fontWeight: 600, fontSize: 15, flexShrink: 0,
      letterSpacing: ".02em",
    }}>
      {initials}
    </div>
  );
};

/* ── Stat Card ───────────────────────────────────────── */
function StatCard({ label, value, Icon, accent, accentBg }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        border: `0.5px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex", alignItems: "center", gap: 14,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 4px 16px rgba(30,60,35,.07)" : "none",
        transition: "all .18s ease",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: accentBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={18} color={accent} />
      </div>
      <div>
        <p style={{ fontSize: 11, color: C.muted, margin: 0, letterSpacing: ".04em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 600, margin: "2px 0 0", lineHeight: 1, color: C.text }}>{value}</p>
      </div>
    </div>
  );
}

/* ── Resume Section ──────────────────────────────────── */
function ResumeSection({ profile, onProfileUpdate }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [hovBtn, setHovBtn] = useState(false);

  const resumeUrl  = profile?.resume || null;
  const resumeName = resumeUrl
    ? decodeURIComponent(resumeUrl.split("/").pop().split("?")[0])
    : null;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setMsg({ text: "Only PDF files accepted.", ok: false }); return; }
    if (file.size > 5 * 1024 * 1024)    { setMsg({ text: "Max file size is 5 MB.",   ok: false }); return; }

    setUploading(true); setMsg(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await updateProfile(formData);
      onProfileUpdate(res.data);
      setMsg({ text: "Resume uploaded successfully.", ok: true });
    } catch {
      setMsg({ text: "Upload failed — please try again.", ok: false });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div style={{
      background: C.surface, border: `0.5px solid ${C.border}`,
      borderRadius: 14, padding: "18px 20px",
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, margin: "0 0 12px",
        letterSpacing: ".06em", textTransform: "uppercase" }}>Resume</p>

      {resumeUrl ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: C.greenBg, border: `0.5px solid #C0DD97`,
          borderRadius: 10, padding: "10px 13px", marginBottom: 12,
        }}>
          <FiCheckCircle size={15} color={C.greenMid} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.green,
            flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {resumeName || "resume.pdf"}
          </p>
          <a href={resumeUrl} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 4,
              fontSize: 11, color: C.green, fontWeight: 600, textDecoration: "none" }}>
            View <FiExternalLink size={11} />
          </a>
        </div>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          background: C.amberBg, border: `0.5px solid #FAC775`,
          borderRadius: 10, padding: "10px 13px", marginBottom: 12,
        }}>
          <FiAlertCircle size={15} color={C.amber} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12, color: C.amber }}>No resume uploaded yet</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />

      <button
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        onMouseEnter={() => setHovBtn(true)}
        onMouseLeave={() => setHovBtn(false)}
        style={{
          width: "100%", padding: "9px 0",
          borderRadius: 10, border: `0.5px solid ${hovBtn ? C.borderHov : C.border}`,
          background: hovBtn ? C.greenBg : C.surface,
          color: C.green, fontSize: 12, fontWeight: 600,
          cursor: uploading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          transition: "background .15s, border-color .15s",
          opacity: uploading ? .5 : 1,
        }}
      >
        <FiUploadCloud size={14} />
        {uploading ? "Uploading…" : resumeUrl ? "Replace resume" : "Upload resume (PDF)"}
      </button>

      {msg && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
          {msg.ok
            ? <FiCheck size={12} color={C.green} />
            : <FiX    size={12} color={C.red}   />}
          <p style={{ margin: 0, fontSize: 11, color: msg.ok ? C.green : C.red }}>{msg.text}</p>
        </div>
      )}
    </div>
  );
}

/* ── Section Header ──────────────────────────────────── */
function SectionHeader({ title }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, margin: "0 0 14px",
      letterSpacing: ".06em", textTransform: "uppercase" }}>{title}</p>
  );
}

/* ── Card shell ──────────────────────────────────────── */
const cardStyle = {
  background: C.surface,
  border: `0.5px solid ${C.border}`,
  borderRadius: 14,
  padding: "20px 22px",
};

/* ── Main Dashboard ──────────────────────────────────── */
export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs]                 = useState([]);
  const [profile, setProfile]           = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [appRes, jobRes, profileRes] = await Promise.all([
        getMyApplications(), getJobs(), getProfile(),
      ]);
      setApplications(appRes.data);
      setJobs(jobRes.data);
      setProfile(profileRes.data);
    }
    fetchData();
  }, []);

  const total      = applications.length;
  const inProgress = applications.filter(a => a.status === "In Progress").length;
  const offers     = applications.filter(a => a.status === "Selected").length;
  const interviews = applications.flatMap(
    app => app.rounds?.filter(r => r.status === "Scheduled") || []
  );

  const fields = [
    profile?.fullName, profile?.cgpa,
    profile?.technicalSkills?.length, profile?.resume, profile?.portfolioLink,
  ];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  const recommended = jobs.slice(0, 3);

  const profileFields = [
    { label: "Full name",  done: !!profile?.fullName,                    Icon: FiUser      },
    { label: "CGPA",       done: !!profile?.cgpa,                        Icon: FiPercent   },
    { label: "Skills",     done: !!(profile?.technicalSkills?.length),   Icon: FiCode      },
    { label: "Resume",     done: !!profile?.resume,                      Icon: FiFileText  },
    { label: "Portfolio",  done: !!profile?.portfolioLink,               Icon: FiLink      },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: C.bg, minHeight: "100vh",
      padding: "32px 28px", color: C.text,
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Avatar name={profile?.fullName} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-.02em" }}>
            Welcome back, {profile?.fullName?.split(" ")[0] || "Student"}
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: 14, marginBottom: 22,
      }}>
        <StatCard label="Applications"        value={total}            Icon={FiBriefcase} accent={C.green}  accentBg={C.greenBg} />
        <StatCard label="Interviews"          value={interviews.length} Icon={FiCalendar}  accent={C.blue}   accentBg={C.blueBg}  />
        <StatCard label="Offers"              value={offers}           Icon={FiAward}     accent={C.greenMid} accentBg={C.greenBg} />
        <StatCard label="In Progress"         value={inProgress}       Icon={FiClock}     accent={C.amber}  accentBg={C.amberBg} />
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, alignItems: "start" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Recent Applications */}
          <div style={cardStyle}>
            <SectionHeader title="Recent applications" />

            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.faint }}>
                <FiBriefcase size={32} style={{ opacity: .35 }} />
                <p style={{ margin: "10px 0 0", fontSize: 13 }}>No applications yet</p>
              </div>
            ) : (
              <div>
                {applications.slice(0, 5).map((app, idx) => {
                  const meta = STATUS_META[app.status] || STATUS_META["Applied"];
                  const isLast = idx >= Math.min(applications.length, 5) - 1;
                  return (
                    <div key={app._id} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", padding: "13px 0",
                      borderBottom: isLast ? "none" : `0.5px solid ${C.border}`,
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{app.jobId?.jobTitle}</p>
                        <p style={{ margin: "3px 0 10px", fontSize: 12, color: C.muted }}>{app.jobId?.companyName}</p>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {["Aptitude", "Technical", "HR"].map(r => (
                            <span key={r} style={{
                              fontSize: 10, fontWeight: 600, padding: "2px 9px",
                              borderRadius: 20, background: C.greenBg, color: C.green,
                              letterSpacing: ".03em",
                            }}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 11px",
                        borderRadius: 20, background: meta.bg, color: meta.color,
                        whiteSpace: "nowrap", marginTop: 2,
                      }}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div style={cardStyle}>
            <SectionHeader title="Recommended jobs" />
            {recommended.length === 0 ? (
              <p style={{ color: C.faint, fontSize: 13 }}>No job listings available</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                {recommended.map(job => {
                  const [hov, setHov] = [false, () => {}];
                  return (
                    <JobCard key={job._id} job={job} />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Profile Strength */}
          <div style={cardStyle}>
            <SectionHeader title="Profile strength" />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.muted }}>Completion</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{completion}%</span>
            </div>

            <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden", marginBottom: 16 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                width: `${completion}%`,
                background: completion >= 80 ? C.greenMid : completion >= 50 ? C.amber : C.red,
                transition: "width .5s ease",
              }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {profileFields.map(f => (
                <div key={f.label} style={{
                  display: "flex", alignItems: "center", gap: 9, fontSize: 12,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: f.done ? C.greenBg : C.slateBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <f.Icon size={11} color={f.done ? C.greenMid : C.faint} />
                  </div>
                  <span style={{ color: f.done ? C.text : C.faint, fontWeight: f.done ? 500 : 400 }}>
                    {f.label}
                  </span>
                  {f.done && <FiCheck size={11} color={C.greenMid} style={{ marginLeft: "auto" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <ResumeSection profile={profile} onProfileUpdate={setProfile} />

          {/* Upcoming Interviews */}
          <div style={cardStyle}>
            <SectionHeader title="Upcoming interviews" />
            {interviews.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.faint }}>
                <FiCalendar size={14} />
                <p style={{ margin: 0, fontSize: 12 }}>No interviews scheduled</p>
              </div>
            ) : (
              interviews.slice(0, 3).map((r, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "10px 0",
                  borderBottom: i < Math.min(interviews.length, 3) - 1 ? `0.5px solid ${C.border}` : "none",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: C.blueBg, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <FiMic size={14} color={C.blue} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{r.roundName}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>
                      {new Date(r.interviewDate).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Job Card ────────────────────────────────────────── */
function JobCard({ job }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `0.5px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 12, padding: 16,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 4px 14px rgba(30,60,35,.07)" : "none",
        transition: "all .18s ease", cursor: "pointer",
        background: C.surface,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: C.greenBg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
      }}>
        <FiBriefcase size={14} color={C.greenMid} />
      </div>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: C.text }}>{job.jobTitle}</p>
      <p style={{ margin: "3px 0 12px", fontSize: 11, color: C.muted }}>{job.companyName}</p>
      <button
  onClick={() => navigate(`/jobs/${job._id}`)}
  style={{
    background: C.green,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "5px 12px",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
  }}
>
  View <FiArrowRight size={11} />
</button>
    </div>
  );
}

/* ── Quick Action Button ─────────────────────────────── */
function QuickBtn({ label, Icon, primary, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "9px 0",
        borderRadius: 10,
        border: primary ? "none" : `0.5px solid ${hov ? C.borderHov : C.border}`,
        background: primary
          ? (hov ? C.green : "#3B6D11")
          : (hov ? C.greenBg : C.surface),
        color: primary ? "#fff" : C.green,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        transition: "all .15s ease",
      }}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

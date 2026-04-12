import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../../api/job";

import {
  FiBriefcase, FiMapPin, FiDollarSign, FiCalendar,
  FiSearch, FiAlertCircle, FiArrowRight, FiFilter,
  FiClock, FiX,
} from "react-icons/fi";

/* ── Tokens ──────────────────────────────────────────────────── */
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

/* ── Shimmer skeleton ─────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .sk{background:linear-gradient(90deg,#ddeae0 25%,#f0f6f1 50%,#ddeae0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px}
      `}</style>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        gap: 16,
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            background: T.surface, borderRadius: 14,
            border: `1px solid ${T.border}`, padding: "20px 22px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="sk" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="sk" style={{ height: 14, width: "70%" }} />
                <div className="sk" style={{ height: 11, width: "45%" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[60, 80, 55].map((w, j) => <div key={j} className="sk" style={{ height: 22, width: w, borderRadius: 99 }} />)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="sk" style={{ height: 11, width: "55%" }} />
              <div className="sk" style={{ height: 11, width: "40%" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Badge ────────────────────────────────────────────────────── */
function Badge({ children }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 99, background: T.accent, color: T.primaryDark,
      letterSpacing: ".02em", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ── Meta pill ────────────────────────────────────────────────── */
function MetaPill({ Icon, text }) {
  if (!text) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, color: T.muted, fontWeight: 500,
    }}>
      <Icon size={11} strokeWidth={2.2} style={{ flexShrink: 0 }} />
      {text}
    </span>
  );
}

/* ── Job Card ─────────────────────────────────────────────────── */
function JobCard({ job, onClick }) {
  const [hovered, setHovered] = useState(false);

  const deadline   = job.applicationDeadline ? new Date(job.applicationDeadline) : null;
  const daysLeft   = deadline ? Math.ceil((deadline - Date.now()) / 86_400_000) : null;
  const isUrgent   = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  const isPast     = daysLeft !== null && daysLeft < 0;
  const deadlineStr = deadline
    ? deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hovered ? T.primary + "55" : T.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "border-color .18s, box-shadow .18s, transform .18s",
        boxShadow: hovered
          ? "0 8px 28px rgba(40,80,50,.13)"
          : "0 1px 3px rgba(40,80,50,.06)",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      {/* ── Top: logo + title ── */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 46, height: 46, borderRadius: 11, flexShrink: 0,
          background: T.accent, border: `1.5px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {job.companyLogo
            ? <img src={job.companyLogo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <FiBriefcase size={18} color={T.primary} strokeWidth={1.5} />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: 14, fontWeight: 700, color: T.text,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {job.jobTitle}
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: T.muted, fontWeight: 500 }}>
            {job.companyName}
          </p>
        </div>
      </div>

      {/* ── Tags ── */}
      {job.jobTags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
          {job.jobTags.slice(0, 4).map((tag, i) => <Badge key={i}>{tag}</Badge>)}
          {job.jobTags.length > 4 && (
            <Badge>+{job.jobTags.length - 4}</Badge>
          )}
        </div>
      )}

      {/* ── Meta: location + salary ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14 }}>
        <MetaPill Icon={FiMapPin}     text={job.location   || "Location not specified"} />
        <MetaPill Icon={FiDollarSign} text={job.salaryRange || "Salary not disclosed"} />
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: T.border, margin: "14px 0" }} />

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {isPast ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 600,
              padding: "3px 8px", borderRadius: 6,
              background: "#fef2f2", color: "#b91c1c",
            }}>
              <FiX size={10} /> Closed
            </span>
          ) : isUrgent ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 600,
              padding: "3px 8px", borderRadius: 6,
              background: "#fffbeb", color: "#92400e",
            }}>
              <FiClock size={10} /> {daysLeft}d left
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, color: T.muted,
            }}>
              <FiCalendar size={11} strokeWidth={2} /> {deadlineStr}
            </span>
          )}
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 12, fontWeight: 700, color: T.primary,
          transition: "gap .15s",
          gap: hovered ? 6 : 4,
        }}>
          View <FiArrowRight size={13} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function BrowseJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [focused, setFocused]   = useState(false);
  const navigate                = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await getAllJobs();
        setJobs(res.data);
      } catch {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (
      j.jobTitle?.toLowerCase().includes(q) ||
      j.companyName?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.jobTags?.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", padding: "28px 20px", color: T.text }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-.025em" }}>Browse Jobs</h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: T.muted }}>
              {loading ? "Loading opportunities…" : `${jobs.length} opportunit${jobs.length !== 1 ? "ies" : "y"} available`}
            </p>
          </div>

          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: T.surface, border: `1.5px solid ${focused ? T.primary : T.border}`,
            borderRadius: 11, padding: "9px 14px", minWidth: 260,
            transition: "border-color .15s, box-shadow .15s",
            boxShadow: focused ? `0 0 0 3px ${T.primary}18` : "none",
          }}>
            <FiSearch size={14} color={focused ? T.primary : T.muted} strokeWidth={2.2} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search by title, company, tag…"
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: 13, color: T.text, width: "100%",
                fontFamily: T.font,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: T.muted }}
              >
                <FiX size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── States ── */}
        {loading && <SkeletonGrid />}

        {error && !loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 12 }}>
            <FiAlertCircle size={38} color="#ef4444" strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: "#b91c1c", fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "60px 0", gap: 12, color: T.muted,
          }}>
            <FiFilter size={36} strokeWidth={1.5} />
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
              {search ? `No jobs match "${search}"` : "No jobs available right now"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  marginTop: 4, fontSize: 13, color: T.primary, fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
                  fontFamily: T.font,
                }}
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 16,
          }}>
            {filtered.map(job => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => navigate(`/jobs/${job._id}`)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

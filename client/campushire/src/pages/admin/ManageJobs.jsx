import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../../api/job";
import { getApplicationsByJob } from "../../api/application";
import {
  Briefcase, Plus, Users, MapPin, Clock,
  Search, ChevronRight, DollarSign,
} from "lucide-react";
import {
  T, card, font, SectionLabel, PageHeader,
  PrimaryBtn, GhostBtn, Spinner, Empty,
} from "./shared";

function JobCard({ job, count, onViewApplicants }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `0.5px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 14,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 4px 18px rgba(27,45,30,.07)" : "none",
        transition: "all .18s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: T.navyBg, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Briefcase size={18} color={T.navy} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {job.jobTitle}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: T.muted }}>{job.companyName}</p>
        </div>
        {/* Applicant badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "4px 10px", borderRadius: 20,
          background: count > 0 ? T.greenBg : T.slateBg,
          border: `0.5px solid ${count > 0 ? T.borderHov : T.border}`,
        }}>
          <Users size={11} color={count > 0 ? T.greenMid : T.faint} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 600, color: count > 0 ? T.green : T.faint }}>
            {count}
          </span>
        </div>
      </div>

      {/* Meta chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {job.location && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: T.muted, padding: "3px 9px",
            background: T.surfaceAlt, border: `0.5px solid ${T.border}`,
            borderRadius: 20,
          }}>
            <MapPin size={10} strokeWidth={2} /> {job.location}
          </span>
        )}
        {job.jobType && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: T.muted, padding: "3px 9px",
            background: T.surfaceAlt, border: `0.5px solid ${T.border}`,
            borderRadius: 20,
          }}>
            <Clock size={10} strokeWidth={2} /> {job.jobType}
          </span>
        )}
        {job.salary && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: T.muted, padding: "3px 9px",
            background: T.surfaceAlt, border: `0.5px solid ${T.border}`,
            borderRadius: 20,
          }}>
            <DollarSign size={10} strokeWidth={2} /> {job.salary}
          </span>
        )}
        {job.rounds?.length > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, color: T.blue, padding: "3px 9px",
            background: T.blueBg, border: `0.5px solid ${T.border}`,
            borderRadius: 20,
          }}>
            {job.rounds.length} round{job.rounds.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Description preview */}
      {job.description && (
        <p style={{
          margin: 0, fontSize: 12, color: T.muted, lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        paddingTop: 12, borderTop: `0.5px solid ${T.border}`,
        display: "flex", justifyContent: "flex-end",
      }}>
        <button
          onClick={() => onViewApplicants(job._id)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 9,
            background: T.navy, color: "#fff",
            border: "none", fontSize: 12, fontWeight: 600,
            cursor: "pointer", transition: "opacity .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          View applicants <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function ManageJobs() {
  const nav = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllJobs();
        setJobs(data);
        const entries = await Promise.all(
          data.map(async j => {
            try {
              const r = await getApplicationsByJob(j._id);
              return [j._id, r.data.length];
            } catch { return [j._id, 0]; }
          })
        );
        setCounts(Object.fromEntries(entries));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = jobs.filter(j =>
    !query || j.jobTitle.toLowerCase().includes(query.toLowerCase())
    || j.companyName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ fontFamily: font }}>
      <PageHeader
        title="Manage jobs"
        subtitle={`${jobs.length} listing${jobs.length !== 1 ? "s" : ""} posted`}
        action={
          <PrimaryBtn onClick={() => nav("/admin/jobs/create")}>
            <Plus size={14} strokeWidth={2.5} /> Post new job
          </PrimaryBtn>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "0 14px", height: 40, borderRadius: 10,
          background: focused ? T.surface : T.surfaceAlt,
          border: `0.5px solid ${focused ? T.greenLight : T.border}`,
          maxWidth: 340, transition: "border-color .15s, background .15s",
        }}>
          <Search size={14} color={focused ? T.greenMid : T.faint} strokeWidth={2} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search jobs or companies…"
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, color: T.text, width: "100%", fontFamily: font,
            }}
          />
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <Empty icon={Briefcase} message={query ? "No jobs match your search" : "No jobs posted yet"} />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {filtered.map(job => (
            <JobCard
              key={job._id}
              job={job}
              count={counts[job._id] ?? 0}
              onViewApplicants={id => nav(`/admin/jobs/${id}/applicants`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

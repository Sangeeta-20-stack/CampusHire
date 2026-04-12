import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../../api/job";
import { getApplicationsByJob } from "../../api/application";
import {
  Briefcase, Users, CheckCircle, Clock,
  TrendingUp, ArrowRight, Plus, Eye,
} from "lucide-react";

import {
  T, card, font, SectionLabel, PageHeader,
  PrimaryBtn, GhostBtn, Badge, Spinner, STATUS_META,
} from "./shared.jsx";

/* KPI */
function KpiCard({ label, value, Icon, accent, accentBg, delta }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card,
        display: "flex",
        alignItems: "center",
        gap: 16,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 4px 18px rgba(27,45,30,.07)" : "none",
        transition: "all .18s ease",
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 11,
        background: accentBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon size={20} color={accent} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, color: T.faint }}>{label}</p>
        <p style={{ margin: "3px 0 0", fontSize: 26, fontWeight: 700 }}>
          {value}
        </p>
      </div>

      {delta != null && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.greenMid }}>
          <TrendingUp size={12} />
          {delta}
        </div>
      )}
    </div>
  );
}

/* Job Row */
function JobRow({ job, applicantCount, onView, isLast }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 22px",
      borderBottom: isLast ? "none" : `0.5px solid ${T.border}`,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        background: T.navyBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Briefcase size={16} color={T.navy} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
          {job.jobTitle}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: T.muted }}>
          {job.companyName}
        </p>
      </div>

      <div style={{
        padding: "4px 10px",
        borderRadius: 20,
        background: T.greenBg,
        fontSize: 11,
        fontWeight: 600,
      }}>
        {applicantCount} applicants
      </div>

      <GhostBtn onClick={() => onView(job._id)}>
        <Eye size={12} /> View
      </GhostBtn>
    </div>
  );
}

/* MAIN */
export default function AdminDashboard() {
  const nav = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllJobs();
        setJobs(data || []);

        const entries = await Promise.all(
          (data || []).map(async (j) => {
            try {
              const r = await getApplicationsByJob(j._id);
              return [j._id, r.data.length];
            } catch {
              return [j._id, 0];
            }
          })
        );

        setCounts(Object.fromEntries(entries));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalApplicants = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: font }}>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of jobs and applications"
        action={
          <PrimaryBtn onClick={() => nav("/admin/jobs/create")}>
            <Plus size={14} /> Post Job
          </PrimaryBtn>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* KPIs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}>
            <KpiCard label="Active Jobs" value={jobs.length} Icon={Briefcase} accent={T.navy} accentBg={T.navyBg} />
            <KpiCard label="Applicants" value={totalApplicants} Icon={Users} accent={T.blue} accentBg={T.blueBg} />
          </div>

          {/* Jobs */}
          <div style={card}>
            <SectionLabel>Jobs</SectionLabel>

            {jobs.length === 0 ? (
              <p style={{ color: T.faint }}>No jobs yet</p>
            ) : (
              jobs.map((job, i) => (
                <JobRow
                  key={job._id}
                  job={job}
                  applicantCount={counts[job._id] || 0}
                  onView={(id) => nav(`/admin/jobs/${id}/applicants`)}
                  isLast={i === jobs.length - 1}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
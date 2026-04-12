import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../api/job";
import { Plus, X, ChevronLeft } from "lucide-react";
import {
  T, card, font, SectionLabel, PageHeader,
  PrimaryBtn, GhostBtn, Field, inputStyle,
} from "./shared";

/* ───────── constants ───────── */
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const ROUND_TYPES = ["Aptitude", "Technical", "HR", "Group Discussion", "Assignment", "Coding"];

const EMPTY_FORM = {
  jobTitle: "",
  companyName: "",
  location: "",
  jobType: "Full-time",
  salary: "",
  description: "",
  requirements: "",
  skills: [],
  rounds: [],
  applicationDeadline: "",   // ✅ FIX ADDED
};

/* ───────── Tag Input ───────── */
function TagInput({ tags = [], onAdd, onRemove, placeholder, suggestions = [] }) {
  const [val, setVal] = useState("");

  function add() {
    const t = val.trim();
    if (t && !tags.includes(t)) onAdd(t);
    setVal("");
  }

  return (
    <div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "8px 10px",
        borderRadius: 9,
        border: `0.5px solid ${T.border}`,
        background: "#F8FAF8",
        minHeight: 42,
      }}>
        {tags.map(t => (
          <span key={t} style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 20,
            background: T.greenBg,
            color: T.green,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {t}
            <button type="button" onClick={() => onRemove(t)} style={{ border: "none", background: "transparent" }}>
              <X size={10} color={T.greenMid} />
            </button>
          </span>
        ))}

        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: 13,
            background: "transparent",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
        {suggestions
          .filter((s) => !tags.includes(s))
          .map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onAdd(s)}
              style={{
                fontSize: 11,
                border: `0.5px solid ${T.border}`,
                background: "transparent",
                padding: "2px 8px",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              + {s}
            </button>
          ))}
      </div>
    </div>
  );
}

/* ───────── Round Row ───────── */
function RoundRow({ round = {}, index, onRemove, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 10,
      padding: "10px 14px",
      border: `0.5px solid ${T.border}`,
      borderRadius: 10,
      background: T.surfaceAlt,
      alignItems: "center",
    }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: T.navyBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
      }}>
        {index + 1}
      </div>

      <select
        value={round.roundName || "Technical"}
        onChange={(e) => onChange(index, "roundName", e.target.value)}
        style={{ ...inputStyle, flex: 1 }}
      >
        {ROUND_TYPES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <input
        value={round.description || ""}
        onChange={(e) => onChange(index, "description", e.target.value)}
        placeholder="Description"
        style={{ ...inputStyle, flex: 2 }}
      />

      <button type="button" onClick={() => onRemove(index)}>
        <X size={13} color={T.red} />
      </button>
    </div>
  );
}

/* ───────── Main ───────── */
export default function CreateJob() {
  const nav = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function addRound() {
    setForm((f) => ({
      ...f,
      rounds: [...f.rounds, { roundName: "Technical", description: "" }],
    }));
  }

  function removeRound(i) {
    setForm((f) => ({
      ...f,
      rounds: f.rounds.filter((_, idx) => idx !== i),
    }));
  }

  function editRound(i, key, val) {
    setForm((f) => ({
      ...f,
      rounds: f.rounds.map((r, idx) =>
        idx === i ? { ...r, [key]: val } : r
      ),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.jobTitle.trim() || !form.companyName.trim()) {
      setError("Required fields missing");
      return;
    }

    setSubmitting(true);
    try {
      await createJob({
        ...form,
        skills: form.skills || [],
        rounds: form.rounds || [],
      });

      nav("/admin/jobs");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: font, maxWidth: 820, margin: "0 auto" }}>
      <PageHeader
        title="Post Job"
        subtitle="Create a new job listing"
        action={
          <GhostBtn onClick={() => nav("/admin/jobs")}>
            <ChevronLeft size={13} /> Back
          </GhostBtn>
        }
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          <div style={card}>
            <SectionLabel>Basic Info</SectionLabel>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Job Title" required>
                <input
                  style={inputStyle}
                  value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)}
                />
              </Field>

              <Field label="Company" required>
                <input
                  style={inputStyle}
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* ✅ FIX: Added deadline field */}
          <div style={card}>
            <SectionLabel>Deadline</SectionLabel>

            <Field label="Application Deadline" required>
              <input
                type="date"
                style={inputStyle}
                value={form.applicationDeadline}
                onChange={(e) => set("applicationDeadline", e.target.value)}
              />
            </Field>
          </div>

          <div style={card}>
            <SectionLabel>Rounds</SectionLabel>

            {form.rounds.map((r, i) => (
              <RoundRow
                key={i}
                round={r}
                index={i}
                onRemove={removeRound}
                onChange={editRound}
              />
            ))}

            <GhostBtn type="button" onClick={addRound}>
              <Plus size={12} /> Add Round
            </GhostBtn>
          </div>

          {error && (
            <div style={{ color: T.red, background: T.redBg, padding: 10 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <PrimaryBtn type="submit" disabled={submitting}>
              <Plus size={14} />
              {submitting ? "Posting..." : "Publish"}
            </PrimaryBtn>
          </div>

        </div>
      </form>
    </div>
  );
}
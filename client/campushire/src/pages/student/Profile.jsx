// pages/student/Profile.jsx
import { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile, uploadResume } from "../../api/student";

import {
  FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiBriefcase,
  FiAward, FiLink, FiLinkedin, FiFileText, FiEdit2, FiCheck,
  FiX, FiPlus, FiUpload, FiExternalLink, FiGlobe, FiHome,
  FiCalendar, FiTrendingUp, FiLayers, FiMessageSquare,
} from "react-icons/fi";

/* ── Tokens ─────────────────────────────────────────────────── */
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
  borderRadius: 16,
  boxShadow:    "0 1px 4px rgba(40,80,50,.06)",
};

/* ── Progress ring ──────────────────────────────────────────── */
function ProgressRing({ pct }) {
  const r  = 32;
  const c  = 2 * Math.PI * r;
  const offset = c - (c * pct) / 100;
  const color = pct >= 80 ? T.primary : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={40} cy={40} r={r} stroke={T.border} strokeWidth={7} fill="none" />
        <circle
          cx={40} cy={40} r={r}
          stroke={color} strokeWidth={7} fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: T.text, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 9, color: T.muted, fontWeight: 600, letterSpacing: ".04em" }}>DONE</span>
      </div>
    </div>
  );
}

/* ── Section card ───────────────────────────────────────────── */
function SectionCard({ Icon, title, children }) {
  return (
    <div style={{ ...card, padding: "22px 24px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: T.accent, display: "flex",
          alignItems: "center", justifyContent: "center", color: T.primary, flexShrink: 0,
        }}>
          <Icon size={15} strokeWidth={2.2} />
        </div>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Field row ──────────────────────────────────────────────── */
function Field({ Icon, label, name, value, edit, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{
        fontSize: 10, fontWeight: 700, color: T.muted,
        textTransform: "uppercase", letterSpacing: ".06em",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {Icon && <Icon size={10} strokeWidth={2.5} />} {label}
      </label>
      {edit ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          type={type}
          style={{
            border: `1.5px solid ${T.border}`,
            borderRadius: 9, padding: "9px 12px",
            fontSize: 13, color: T.text,
            background: T.subtle, outline: "none",
            fontFamily: T.font, width: "100%", boxSizing: "border-box",
            transition: "border-color .15s",
          }}
          onFocus={e => e.target.style.borderColor = T.primary}
          onBlur={e  => e.target.style.borderColor = T.border}
        />
      ) : (
        <p style={{
          margin: 0, fontSize: 13, color: value ? T.text : T.muted,
          fontWeight: value ? 500 : 400, padding: "2px 0",
        }}>
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}

/* ── Skill chips ────────────────────────────────────────────── */
function SkillChips({ type, skills = [], edit, onAdd, onRemove }) {
  const [val, setVal] = useState("");
  const inputRef = useRef();

  const submit = () => {
    const trimmed = val.trim();
    if (!trimmed) return;
    onAdd(type, trimmed);
    setVal("");
    inputRef.current?.focus();
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: edit ? 12 : 0 }}>
        {skills.length === 0 && !edit && (
          <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>No skills added yet</p>
        )}
        {skills.map((skill, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, padding: "5px 11px",
            borderRadius: 99, background: T.accent, color: T.primaryDark,
          }}>
            {skill}
            {edit && (
              <button
                onClick={() => onRemove(type, i)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, display: "flex", alignItems: "center",
                  color: T.muted, lineHeight: 1,
                }}
              >
                <FiX size={11} strokeWidth={2.5} />
              </button>
            )}
          </span>
        ))}
      </div>

      {edit && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Type a skill and press Enter…"
            style={{
              flex: 1, border: `1.5px solid ${T.border}`,
              borderRadius: 9, padding: "8px 12px",
              fontSize: 12, fontFamily: T.font, color: T.text,
              background: T.subtle, outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = T.primary}
            onBlur={e  => e.target.style.borderColor = T.border}
          />
          <button
            onClick={submit}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: T.primary, color: "#fff", border: "none",
              borderRadius: 9, padding: "8px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font,
            }}
          >
            <FiPlus size={13} strokeWidth={2.5} /> Add
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Resume block ───────────────────────────────────────────── */
function ResumeBlock({ resume, edit, onUpload }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onUpload(e); } finally { setUploading(false); }
  };

  const fileName = resume
    ? decodeURIComponent(resume.split("/").pop().split("?")[0])
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {resume ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 10, padding: "12px 14px",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: "#dcfce7", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#16a34a", flexShrink: 0,
          }}>
            <FiFileText size={16} strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#166534",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fileName || "resume.pdf"}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#4ade80" }}>Uploaded</p>
          </div>
          <a
            href={resume} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 700, color: "#16a34a", textDecoration: "none",
            }}
          >
            View <FiExternalLink size={11} />
          </a>
        </div>
      ) : (
        <div style={{
          background: "#fff7ed", border: "1px dashed #fed7aa",
          borderRadius: 10, padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <FiFileText size={16} color="#f97316" />
          <p style={{ margin: 0, fontSize: 12, color: "#9a3412" }}>No resume uploaded yet</p>
        </div>
      )}

      {edit && (
        <>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              border: `1.5px solid ${T.border}`, borderRadius: 9,
              padding: "9px 14px", fontSize: 12, fontWeight: 600,
              background: "transparent", color: T.primaryDark,
              cursor: uploading ? "not-allowed" : "pointer",
              fontFamily: T.font, opacity: uploading ? .6 : 1,
              transition: "background .15s",
            }}
            onMouseEnter={e => !uploading && (e.currentTarget.style.background = T.accent)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <FiUpload size={13} strokeWidth={2.2} />
            {uploading ? "Uploading…" : resume ? "Replace Resume" : "Upload PDF"}
          </button>
        </>
      )}
    </div>
  );
}

/* ═══ Main ══════════════════════════════════════════════════════ */
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({});
  const [edit, setEdit]       = useState(false);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    getProfile().then(res => {
      setProfile(res.data);
      setForm(res.data);
    });
  }, []);

  /* completion */
  const fields = [
    form.fullName, form.email, form.phoneNumber, form.address, form.gender,
    form.university, form.department, form.year, form.semester, form.cgpa,
    form.technicalSkills?.length, form.softSkills?.length,
    form.certifications?.length, form.languagesKnown?.length,
    form.portfolioLink, form.linkedInLink, form.resume,
    form.academicTranscripts, form.preferredLocation,
  ];
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setProfile(res.data);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEdit(false);
  };

  const handleResumeUpload = async (e) => {
    const fd = new FormData();
    fd.append("resume", e.target.files[0]);
    const res = await uploadResume(fd);
    setForm(f  => ({ ...f,  resume: res.data.resume }));
    setProfile(p => ({ ...p, resume: res.data.resume }));
  };

  const addSkill    = (type, val) => setForm(f => ({ ...f, [type]: [...(f[type] || []), val] }));
  const removeSkill = (type, i)  => setForm(f => {
    const arr = [...(f[type] || [])];
    arr.splice(i, 1);
    return { ...f, [type]: arr };
  });

  if (!profile) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "60vh", fontFamily: T.font, color: T.muted,
      gap: 10, fontSize: 14,
    }}>
      <FiUser size={20} strokeWidth={1.5} /> Loading profile…
    </div>
  );

  const initials = (form.fullName || "S")
    .split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", padding: "28px 20px", color: T.text }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Hero header ── */}
        <div style={{ ...card, padding: "24px 28px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>

            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 22, fontWeight: 800,
              }}>
                {initials}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>
                  {form.fullName || "Your Name"}
                </h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: 5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.muted }}>
                    <FiMail size={11} /> {form.email || "—"}
                  </span>
                  {form.department && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.muted }}>
                      <FiBook size={11} /> {form.department}
                    </span>
                  )}
                  {form.university && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.muted }}>
                      <FiHome size={11} /> {form.university}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: ring + edit btn */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <ProgressRing pct={completion} />

              {edit ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDark})`,
                      color: "#fff", border: "none", borderRadius: 10,
                      padding: "10px 18px", fontSize: 13, fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer", fontFamily: T.font,
                      opacity: saving ? .7 : 1,
                    }}
                  >
                    <FiCheck size={14} /> {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "transparent", color: T.muted,
                      border: `1.5px solid ${T.border}`, borderRadius: 10,
                      padding: "10px 16px", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: T.font,
                    }}
                  >
                    <FiX size={14} /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    background: T.accent, color: T.primaryDark,
                    border: `1.5px solid ${T.border}`, borderRadius: 10,
                    padding: "10px 18px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: T.font,
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.border}
                  onMouseLeave={e => e.currentTarget.style.background = T.accent}
                >
                  <FiEdit2 size={13} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Completion checklist strip ── */}
        <div style={{
          ...card, padding: "14px 22px",
          display: "flex", flexWrap: "wrap", gap: "8px 20px", alignItems: "center",
        }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em", flexShrink: 0 }}>
            Profile completeness
          </p>
          {[
            { label: "Name",      done: !!form.fullName },
            { label: "Phone",     done: !!form.phoneNumber },
            { label: "CGPA",      done: !!form.cgpa },
            { label: "Skills",    done: !!(form.technicalSkills?.length) },
            { label: "Resume",    done: !!form.resume },
            { label: "Portfolio", done: !!form.portfolioLink },
            { label: "LinkedIn",  done: !!form.linkedInLink },
          ].map(f => (
            <span key={f.label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 600,
              color: f.done ? T.primary : T.muted,
            }}>
              {f.done
                ? <FiCheck size={11} strokeWidth={3} color={T.primary} />
                : <FiX size={11} strokeWidth={3} color={T.muted} />
              }
              {f.label}
            </span>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Personal Info */}
            <SectionCard Icon={FiUser} title="Personal Information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                <Field Icon={FiUser}    label="Full Name"    name="fullName"    value={form.fullName}    edit={edit} onChange={handleChange} />
                <Field Icon={FiPhone}   label="Phone"        name="phoneNumber" value={form.phoneNumber} edit={edit} onChange={handleChange} />
                <Field Icon={FiMapPin}  label="Address"      name="address"     value={form.address}     edit={edit} onChange={handleChange} />
                <Field Icon={FiGlobe}   label="Preferred Location" name="preferredLocation" value={form.preferredLocation} edit={edit} onChange={handleChange} />
              </div>
            </SectionCard>

            {/* Academic Info */}
            <SectionCard Icon={FiBook} title="Academic Information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                <Field Icon={FiHome}       label="University"  name="university"  value={form.university}  edit={edit} onChange={handleChange} />
                <Field Icon={FiLayers}     label="Department"  name="department"  value={form.department}  edit={edit} onChange={handleChange} />
                <Field Icon={FiCalendar}   label="Year"        name="year"        value={form.year}        edit={edit} onChange={handleChange} />
                <Field Icon={FiCalendar}   label="Semester"    name="semester"    value={form.semester}    edit={edit} onChange={handleChange} />
                <Field Icon={FiTrendingUp} label="CGPA"        name="cgpa"        value={form.cgpa}        edit={edit} onChange={handleChange} type="number" />
              </div>
            </SectionCard>

            {/* Technical Skills */}
            <SectionCard Icon={FiLayers} title="Technical Skills">
              <SkillChips
                type="technicalSkills"
                skills={form.technicalSkills}
                edit={edit}
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            </SectionCard>

            {/* Soft Skills */}
            <SectionCard Icon={FiMessageSquare} title="Soft Skills">
              <SkillChips
                type="softSkills"
                skills={form.softSkills}
                edit={edit}
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            </SectionCard>

            {/* Certifications */}
            <SectionCard Icon={FiAward} title="Certifications">
              <SkillChips
                type="certifications"
                skills={form.certifications}
                edit={edit}
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            </SectionCard>

          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Resume */}
            <SectionCard Icon={FiFileText} title="Resume">
              <ResumeBlock
                resume={form.resume}
                edit={edit}
                onUpload={handleResumeUpload}
              />
            </SectionCard>

            {/* Links */}
            <SectionCard Icon={FiLink} title="Links">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field Icon={FiGlobe}    label="Portfolio"  name="portfolioLink" value={form.portfolioLink} edit={edit} onChange={handleChange} />
                <Field Icon={FiLinkedin} label="LinkedIn"   name="linkedInLink"  value={form.linkedInLink}  edit={edit} onChange={handleChange} />
                {!edit && form.portfolioLink && (
                  <a href={form.portfolioLink} target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 12, color: T.primary, textDecoration: "none", fontWeight: 600,
                  }}>
                    <FiExternalLink size={12} /> Visit Portfolio
                  </a>
                )}
              </div>
            </SectionCard>

            {/* Languages */}
            <SectionCard Icon={FiGlobe} title="Languages Known">
              <SkillChips
                type="languagesKnown"
                skills={form.languagesKnown}
                edit={edit}
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            </SectionCard>

            {/* Quick stats */}
            <div style={{ ...card, padding: "18px 22px" }}>
              <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>
                At a glance
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { Icon: FiLayers,  label: "Technical Skills", value: form.technicalSkills?.length || 0 },
                  { Icon: FiAward,   label: "Certifications",   value: form.certifications?.length  || 0 },
                  { Icon: FiGlobe,   label: "Languages",        value: form.languagesKnown?.length  || 0 },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: T.muted }}>
                      <s.Icon size={12} strokeWidth={2.2} /> {s.label}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 800, color: T.primaryDark,
                      background: T.accent, padding: "2px 10px", borderRadius: 99,
                    }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

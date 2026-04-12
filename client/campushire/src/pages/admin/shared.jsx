import { Briefcase } from "lucide-react";

/* ───────── Theme ───────── */
export const font = "'DM Sans', 'Segoe UI', sans-serif";

export const T = {
  text: "#1B2D1E",
  muted: "#6A7D6D",
  faint: "#9DB09F",

  border: "#D8E8DA",
  borderHov: "#CFE3D1",

  surface: "#FAFDF8",
  surfaceAlt: "#F3F9F3",

  green: "#3B6D11",
  greenMid: "#4F8A1F",
  greenBg: "#EAF3DE",

  navy: "#1B263B",
  navyBg: "#E8EEF7",

  red: "#A32D2D",
  redBg: "#FCEBEB",

  amberMid: "#B7791F",
};

/* ───────── UI blocks ───────── */
export const card = {
  background: "#FFFFFF",
  border: `0.5px solid ${T.border}`,
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

export const inputStyle = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 9,
  border: `0.5px solid ${T.border}`,
  outline: "none",
  fontSize: 13,
  fontFamily: font,
  color: T.text,
  background: "#F8FAF8",
};

/* ───────── Buttons ───────── */
export function PrimaryBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "9px 14px",
        borderRadius: 10,
        border: "none",
        background: T.navy,
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: `0.5px solid ${T.border}`,
        background: "transparent",
        color: T.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

/* ───────── Field (FIXED ERROR) ───────── */
export function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>
        {label} {required && <span style={{ color: T.red }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ───────── Header ───────── */
export function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontSize: 12,
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: T.faint,
      margin: 0,
    }}>
      {children}
    </h3>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          {title}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.muted }}>
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Badge({ label, color = "#3B6D11", bg = "#EAF3DE" }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 20,
        background: bg,
        color: color,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}
    </span>
  );
}
export const STATUS_META = {
  Applied: {
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
  Shortlisted: {
    color: "#1B263B",
    bg: "#E8EEF7",
  },
  Interviewing: {
    color: "#B7791F",
    bg: "#FFF4E5",
  },
  Selected: {
    color: "#1B6B3A",
    bg: "#DFF5E5",
  },
  Rejected: {
    color: "#A32D2D",
    bg: "#FCEBEB",
  },
  Pending: {
    color: "#6A7D6D",
    bg: "#F3F9F3",
  },
};
export function Spinner() {
  return (
    <div style={{
      width: "100%",
      padding: "40px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        border: "3px solid #EAF3DE",
        borderTop: "3px solid #3B6D11",
        animation: "spin 0.8s linear infinite",
      }} />

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
export function Empty({ icon: Icon = null, message = "No data" }) {
  return (
    <div style={{
      textAlign: "center",
      padding: 40,
      color: "#6b7280",
    }}>
      {Icon && <Icon size={28} style={{ marginBottom: 8 }} />}
      <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
    </div>
  );
}

export const ROUND_STATUS_META = {
  PENDING: {
    label: "Pending",
    color: "#6b7280",
    bg: "#f3f4f6",
  },
  SCHEDULED: {
    label: "Scheduled",
    color: "#2563eb",
    bg: "#dbeafe",
  },
  COMPLETED: {
    label: "Completed",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  REJECTED: {
    label: "Rejected",
    color: "#dc2626",
    bg: "#fee2e2",
  },
};
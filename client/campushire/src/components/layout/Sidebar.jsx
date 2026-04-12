import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Layers,
} from "lucide-react";

const navItems = [
  { to: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard, badge: null },
  { to: "/jobs",         label: "Jobs",         icon: Briefcase,       badge: 12   },
  { to: "/applications", label: "Applications", icon: FileText,        badge: 3    },
  { to: "/profile",      label: "Profile",      icon: User,            badge: null },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 232,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#FAFDF8",
        borderRight: "0.5px solid #D8E8DA",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* TOP */}
      <div style={{ padding: "20px 16px", flex: 1 }}>

        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "0 4px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "#1B263B",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Layers size={16} color="#fff" strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1B2D1E", letterSpacing: "-.01em" }}>
              CampusHire
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "#9DB09F", letterSpacing: ".04em", textTransform: "uppercase" }}>
              Placement portal
            </p>
          </div>
        </div>

        {/* SECTION LABEL */}
        <p style={{
          margin: "0 0 6px", padding: "0 12px",
          fontSize: 10, fontWeight: 600, color: "#9DB09F",
          letterSpacing: ".08em", textTransform: "uppercase",
        }}>
          Menu
        </p>

        {/* NAV */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                  background: isActive ? "#1B263B" : "transparent",
                  transition: "background .15s",
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#EAF3DE"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Icon badge */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: isActive ? "rgba(255,255,255,.12)" : "#EAF3DE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "background .15s",
                  }}>
                    <Icon size={15} color={isActive ? "#fff" : "#3B6D11"} strokeWidth={1.8} />
                  </div>

                  <span style={{
                    flex: 1,
                    fontSize: 13, fontWeight: 500,
                    color: isActive ? "#fff" : "#1B2D1E",
                  }}>
                    {label}
                  </span>

                  {badge != null && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      padding: "2px 7px", borderRadius: 20,
                      background: isActive ? "rgba(255,255,255,.15)" : "#EAF3DE",
                      color: isActive ? "rgba(255,255,255,.9)" : "#3B6D11",
                    }}>
                      {badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div style={{ padding: "14px 16px", borderTop: "0.5px solid #D8E8DA" }}>

        {/* USER CARD */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10,
          background: "#fff", border: "0.5px solid #D8E8DA",
          marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#EAF3DE",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "#3B6D11",
            flexShrink: 0, letterSpacing: ".02em",
          }}>
            S
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1B2D1E" }}>Sangeeta</p>
            <p style={{
              margin: "1px 0 0", fontSize: 11, color: "#6A7D6D",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              student@gmail.com
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 10,
            background: "transparent", border: "none", cursor: "pointer",
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#FCEBEB"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <LogOut size={15} color="#A32D2D" strokeWidth={1.8} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#A32D2D" }}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F8FAF8",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#1B2D1E",
    }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        width: 232,
        flexShrink: 0,
        display: "none",
      }}
        className="md-sidebar"
      >
        <Sidebar />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(27,38,59,.35)",
            zIndex: 40,
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: 232,
        zIndex: 50,
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .22s ease",
      }}>
        <Sidebar />
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* TOP NAVBAR */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "#F8FAF8",
          borderBottom: "0.5px solid #D8E8DA",
          padding: "0 24px",
          height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16,
        }}>

          {/* LEFT — mobile hamburger + search */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              style={{
                display: "none",
                width: 34, height: 34, borderRadius: 8,
                background: "transparent", border: "0.5px solid #D8E8DA",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={16} color="#3B6D11" /> : <Menu size={16} color="#3B6D11" />}
            </button>

            {/* Search */}
            <SearchBar />
          </div>

          {/* RIGHT ACTIONS */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            <NotifButton />

            {/* Avatar dropdown */}
            <AvatarButton />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{
          flex: 1,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 24px",
        }}>
          <Outlet />
        </main>

      </div>

      {/* Responsive overrides via a minimal style tag */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar { display: block !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Search Bar ────────────────────────────────────────── */
function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: focused ? "#fff" : "#F0F7F1",
      border: `0.5px solid ${focused ? "#97C459" : "#D8E8DA"}`,
      borderRadius: 10,
      padding: "0 12px",
      height: 36,
      width: "100%", maxWidth: 280,
      transition: "border-color .15s, background .15s",
    }}>
      <Search size={14} color={focused ? "#3B6D11" : "#9DB09F"} strokeWidth={2} style={{ flexShrink: 0 }} />
      <input
        placeholder="Search jobs, companies…"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "transparent", border: "none", outline: "none",
          fontSize: 13, color: "#1B2D1E", width: "100%",
        }}
      />
    </div>
  );
}

/* ── Notification Button ───────────────────────────────── */
function NotifButton() {
  const [hov, setHov] = useState(false);

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        width: 36, height: 36, borderRadius: 9,
        background: hov ? "#EAF3DE" : "#F0F7F1",
        border: "0.5px solid #D8E8DA",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "background .15s",
        flexShrink: 0,
      }}
    >
      <Bell size={15} color="#3B6D11" strokeWidth={1.8} />
      {/* Dot */}
      <span style={{
        position: "absolute", top: 7, right: 7,
        width: 6, height: 6, borderRadius: "50%",
        background: "#E24B4A",
        border: "1.5px solid #F8FAF8",
      }} />
    </button>
  );
}

/* ── Avatar Button ─────────────────────────────────────── */
function AvatarButton() {
  const [hov, setHov] = useState(false);

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "4px 10px 4px 4px",
        borderRadius: 10,
        background: hov ? "#EAF3DE" : "transparent",
        border: `0.5px solid ${hov ? "#C0DD97" : "#D8E8DA"}`,
        cursor: "pointer", transition: "all .15s",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: "#1B263B",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 600, color: "#fff",
        letterSpacing: ".02em", flexShrink: 0,
      }}>
        S
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#1B2D1E" }}>Sangeeta</span>
      <ChevronDown size={13} color="#9DB09F" strokeWidth={2} />
    </button>
  );
}
